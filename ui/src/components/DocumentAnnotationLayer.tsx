import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, MessageSquarePlus } from "lucide-react";
import type {
  DocumentAnnotationAnchorState,
  DocumentAnnotationThreadStatus,
} from "@paperclipai/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildAnchorFromContainerSelection,
  getContainerTextOffset,
  rangesForNormalizedSpan,
} from "@/lib/document-annotation-selection";
import type { DocumentAnnotationAnchorSelector } from "@paperclipai/shared";

export interface AnnotationOverlayThread {
  id: string;
  selectedText: string;
  status: DocumentAnnotationThreadStatus;
  anchorState: DocumentAnnotationAnchorState;
  unreadCount?: number;
}

export interface PendingAnchor {
  selector: DocumentAnnotationAnchorSelector;
  selectedText: string;
}

export interface AnnotationLayerProps {
  containerRef: React.RefObject<HTMLElement | null>;
  markdown: string;
  threads: AnnotationOverlayThread[];
  focusedThreadId: string | null;
  onThreadFocus: (threadId: string) => void;
  /** Tracks the most recently captured pending selection. */
  pendingAnchor: PendingAnchor | null;
  onPendingAnchorChange: (anchor: PendingAnchor | null) => void;
  onRequestComment: (anchor: PendingAnchor) => void;
  /** Disables the "add comment" affordance when set. */
  newCommentDisabled?: boolean;
  newCommentDisabledReason?: string | null;
  /** Hide resolved highlights even when included in the threads list. */
  hideResolved?: boolean;
  /** Test-only: override window object for layout calculations. */
  testWindow?: { innerWidth: number; innerHeight: number };
  /**
   * When this number changes, re-read the current document selection and emit a
   * pending anchor (used by the panel's "+ New comment on selection" / ⌘⇧M CTA).
   */
  captureSelectionRequestId?: number;
}

interface HighlightRect {
  threadId: string;
  status: DocumentAnnotationThreadStatus;
  anchorState: DocumentAnnotationAnchorState;
  top: number;
  left: number;
  width: number;
  height: number;
  /** True for the last rect of this thread (used to anchor a glyph at the run end). */
  isTail: boolean;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

export function DocumentAnnotationLayer({
  containerRef,
  markdown,
  threads,
  focusedThreadId,
  onThreadFocus,
  pendingAnchor,
  onPendingAnchorChange,
  onRequestComment,
  newCommentDisabled = false,
  newCommentDisabledReason = null,
  hideResolved = true,
  captureSelectionRequestId,
}: AnnotationLayerProps) {
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([]);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const layerContainerRef = useRef<HTMLDivElement | null>(null);
  const lastCaptureSelectionRequestIdRef = useRef<number>(0);

  const visibleThreads = useMemo(() => {
    if (!hideResolved) return threads;
    return threads.filter((thread) => thread.status !== "resolved" || thread.anchorState === "orphaned" || thread.id === focusedThreadId);
  }, [threads, hideResolved, focusedThreadId]);

  const computeHighlightRects = useCallback(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) {
      setHighlightRects([]);
      return;
    }
    const overlayRect = overlay.getBoundingClientRect();
    const next: HighlightRect[] = [];
    for (const thread of visibleThreads) {
      if (thread.anchorState === "orphaned") continue;
      const ranges = rangesForNormalizedSpan({
        container,
        selectedText: thread.selectedText,
      });
      const startIndex = next.length;
      for (const range of ranges) {
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.width === 0 || rect.height === 0) continue;
          next.push({
            threadId: thread.id,
            status: thread.status,
            anchorState: thread.anchorState,
            top: rect.top - overlayRect.top,
            left: rect.left - overlayRect.left,
            width: rect.width,
            height: rect.height,
            isTail: false,
          });
        }
      }
      if (next.length > startIndex) {
        next[next.length - 1].isTail = true;
      }
    }
    setHighlightRects(next);
  }, [containerRef, visibleThreads]);

  useLayoutEffect(() => {
    computeHighlightRects();
  }, [computeHighlightRects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    let cancelled = false;
    let frame: number | null = null;

    const schedule = () => {
      if (cancelled || frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        if (!cancelled) computeHighlightRects();
      });
    };

    const handleResizeOrScroll = () => schedule();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    const resizeObserver = typeof window.ResizeObserver === "function"
      ? new window.ResizeObserver(schedule)
      : null;
    if (resizeObserver && container) resizeObserver.observe(container);
    if (resizeObserver && overlay) resizeObserver.observe(overlay);

    const mutationObserver = typeof window.MutationObserver === "function" && container
      ? new window.MutationObserver((mutations) => {
        const layer = layerContainerRef.current;
        const onlyLayerMutations = layer
          ? mutations.every((mutation) => layer.contains(mutation.target))
          : false;
        if (!onlyLayerMutations) schedule();
      })
      : null;
    if (mutationObserver && container) {
      mutationObserver.observe(container, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "data-state", "open", "hidden", "aria-expanded"],
      });
    }

    schedule();

    return () => {
      cancelled = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [computeHighlightRects, containerRef]);

  const captureSelection = useCallback((): PendingAnchor | null => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return null;
    const containerOffset = getContainerTextOffset(container, range);
    if (!containerOffset) return null;
    const anchor = buildAnchorFromContainerSelection({ markdown, containerOffset });
    if (!anchor) return null;
    const overlayRect = overlay.getBoundingClientRect();
    const rect = range.getBoundingClientRect();
    const top = Math.max(0, rect.top - overlayRect.top - 36);
    const left = Math.max(0, rect.left - overlayRect.left + rect.width / 2 - 80);
    setToolbarPosition({ top, left });
    return {
      selector: anchor.selector,
      selectedText: containerOffset.selectedText,
    };
  }, [containerRef, markdown]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleSelectionChange = () => {
      const anchor = captureSelection();
      if (!anchor) {
        onPendingAnchorChange(null);
        setToolbarPosition(null);
        return;
      }
      onPendingAnchorChange(anchor);
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [captureSelection, onPendingAnchorChange]);

  useEffect(() => {
    if (captureSelectionRequestId === undefined) return;
    if (captureSelectionRequestId === 0) return;
    if (lastCaptureSelectionRequestIdRef.current === captureSelectionRequestId) return;
    lastCaptureSelectionRequestIdRef.current = captureSelectionRequestId;
    const anchor = captureSelection();
    if (anchor) {
      onPendingAnchorChange(anchor);
      onRequestComment(anchor);
    }
  }, [captureSelectionRequestId, captureSelection, onPendingAnchorChange, onRequestComment]);

  const handleAddComment = () => {
    if (pendingAnchor) onRequestComment(pendingAnchor);
  };

  return (
    <div
      ref={layerContainerRef}
      className="paperclip-doc-annotation-layer pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <div ref={overlayRef} className="relative h-full w-full">
        {highlightRects.map((rect, index) => {
          const isFocused = rect.threadId === focusedThreadId;
          const isStale = rect.anchorState === "stale";
          const isResolved = rect.status === "resolved";
          return (
            <button
              key={`${rect.threadId}-${index}`}
              type="button"
              data-thread-id={rect.threadId}
              data-anchor-state={rect.anchorState}
              data-status={rect.status}
              data-focused={isFocused || undefined}
              aria-label="Open annotation thread"
              className={cn(
                "paperclip-doc-annotation-highlight pointer-events-auto absolute cursor-pointer rounded-sm transition-colors",
                // base box treatment (replaces the previous baseline border)
                isResolved
                  ? "bg-muted-foreground/8 outline outline-1 outline-dashed outline-offset-0 outline-muted-foreground/45 hover:bg-muted-foreground/15"
                  : isStale
                    ? "bg-amber-500/12 outline outline-2 outline-dashed outline-offset-0 outline-amber-500/70 hover:bg-amber-500/20 dark:bg-amber-500/18 dark:outline-amber-400/80"
                    : isFocused
                      ? "bg-primary/20 outline outline-2 outline-offset-0 outline-primary/90 shadow-[0_0_0_1px_var(--color-primary-foreground)] dark:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-background)_60%,transparent)]"
                      : "bg-muted-foreground/15 hover:bg-muted-foreground/25",
              )}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
              onMouseDown={(event) => {
                event.preventDefault();
                onThreadFocus(rect.threadId);
              }}
            />
          );
        })}
        {highlightRects.map((rect, index) =>
          rect.isTail && rect.anchorState === "stale" ? (
            <span
              key={`tail-${rect.threadId}-${index}`}
              aria-hidden="true"
              data-thread-id={rect.threadId}
              className="paperclip-doc-annotation-tail pointer-events-none absolute inline-flex items-center justify-center rounded-sm bg-amber-500/95 text-amber-50 shadow-sm dark:bg-amber-500/90 dark:text-amber-50"
              style={{
                top: rect.top + Math.max(0, rect.height / 2 - 8),
                left: rect.left + rect.width + 2,
                width: 16,
                height: 16,
              }}
              title="Anchor moved — needs review"
            >
              <AlertTriangle className="h-3 w-3" />
            </span>
          ) : null,
        )}
        {pendingAnchor && toolbarPosition ? (
          <div
            data-testid="document-annotation-selection-toolbar"
            role="toolbar"
            aria-label="Selection actions"
            className="paperclip-doc-annotation-selection-toolbar pointer-events-auto absolute z-10 flex items-center gap-1 rounded-md border border-border bg-popover px-1 py-1 shadow-md"
            style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-xs"
              onClick={handleAddComment}
              disabled={newCommentDisabled}
              title={newCommentDisabled
                ? newCommentDisabledReason ?? undefined
                : "Add comment on selection (⌘⇧M)"}
            >
              <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Comment
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
