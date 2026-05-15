import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Agent, DocumentAnnotationThreadWithComments, IssueDocument } from "@paperclipai/shared";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { documentAnnotationsApi } from "@/api/document-annotations";
import { queryKeys } from "@/lib/queryKeys";
import { parseDocumentAnnotationHash } from "@/lib/document-annotation-hash";
import { DocumentAnnotationLayer, type PendingAnchor } from "./DocumentAnnotationLayer";
import { DocumentAnnotationPanel } from "./DocumentAnnotationPanel";
import type { CompanyUserProfile } from "@/lib/company-members";

export interface IssueDocumentAnnotationsProps {
  issueId: string;
  doc: IssueDocument;
  /** The body that is being rendered/edited (current or historical revision). */
  bodyMarkdown: string;
  /** True when a draft has unsaved changes or is currently saving. */
  draftDirty: boolean;
  /** True when there is a remote conflict that requires user resolution. */
  draftConflicted: boolean;
  /** True when the document is being viewed in historical revision preview. */
  historicalPreview: boolean;
  /** Render the document body (rendered MarkdownBody or MarkdownEditor) inside the wrapper. */
  children: ReactNode;
  /** Current location hash so we can resolve deep-link targets. */
  locationHash: string;
  /** Controlled panel state. Caller owns this so the count chip can live in the doc header. */
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  agentMap?: ReadonlyMap<string, Pick<Agent, "id" | "name">>;
  userProfileMap?: ReadonlyMap<string, CompanyUserProfile>;
  /** Seed which thread is focused on mount. Used by Storybook/screenshot harness. */
  defaultFocusedThreadId?: string;
}

export function IssueDocumentAnnotations({
  issueId,
  doc,
  bodyMarkdown,
  draftDirty,
  draftConflicted,
  historicalPreview,
  children,
  locationHash,
  panelOpen,
  onPanelOpenChange,
  agentMap,
  userProfileMap,
  defaultFocusedThreadId,
}: IssueDocumentAnnotationsProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(defaultFocusedThreadId ?? null);
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<PendingAnchor | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hashHandledRef = useRef<string | null>(null);
  // Bus token to ask the body layer to capture the current selection into a pendingAnchor.
  const [captureSelectionRequestId, setCaptureSelectionRequestId] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handler = () => setIsMobile(mediaQuery.matches);
    handler();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    return undefined;
  }, []);

  const annotationsQuery = useQuery({
    queryKey: queryKeys.issues.documentAnnotations(issueId, doc.key, "all"),
    queryFn: () => documentAnnotationsApi.list(issueId, doc.key, { status: "all", includeComments: true }),
    staleTime: 30_000,
  });
  const allThreads = annotationsQuery.data ?? [];

  // Resolve deep link `#document-<key>&thread=...&comment=...` once per change.
  useEffect(() => {
    if (!locationHash) return;
    if (hashHandledRef.current === locationHash) return;
    const target = parseDocumentAnnotationHash(locationHash);
    if (!target || target.documentKey !== doc.key) return;
    if (!target.threadId) return;
    hashHandledRef.current = locationHash;
    onPanelOpenChange(true);
    setFocusedThreadId(target.threadId);
    setFocusedCommentId(target.commentId);
  }, [doc.key, locationHash, onPanelOpenChange]);

  const newCommentDisabled = draftDirty || draftConflicted || historicalPreview || !doc.latestRevisionId;
  const newCommentDisabledReason = historicalPreview
    ? "New comments are disabled while previewing a historical revision."
    : draftConflicted
      ? "Resolve the document conflict before adding new comments."
      : draftDirty
        ? "Save the draft to anchor new comments."
        : !doc.latestRevisionId
          ? "Document has no saved revision yet."
          : null;

  const handleRequestComment = useCallback((anchor: PendingAnchor) => {
    if (newCommentDisabled) return;
    setPendingAnchor(anchor);
    onPanelOpenChange(true);
  }, [newCommentDisabled, onPanelOpenChange]);

  const handleThreadFocus = useCallback((threadId: string | null) => {
    setFocusedThreadId(threadId);
    if (threadId) {
      onPanelOpenChange(true);
      setFocusedCommentId(null);
    }
  }, [onPanelOpenChange]);

  const handleRequestCommentFromSelection = useCallback(() => {
    if (newCommentDisabled) return;
    // Trigger the layer to re-read the current selection and emit a pendingAnchor.
    setCaptureSelectionRequestId((current) => current + 1);
  }, [newCommentDisabled]);

  // ⌘⇧M / Ctrl+Shift+M global shortcut while the panel is open.
  useEffect(() => {
    if (!panelOpen) return;
    if (typeof window === "undefined") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const isMeta = event.metaKey || event.ctrlKey;
      if (!isMeta || !event.shiftKey) return;
      if (event.key.toLowerCase() !== "m") return;
      event.preventDefault();
      handleRequestCommentFromSelection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen, handleRequestCommentFromSelection]);

  const focusedThread = useMemo(() => {
    if (!focusedThreadId) return null;
    return allThreads.find((thread) => thread.id === focusedThreadId) ?? null;
  }, [allThreads, focusedThreadId]);

  const overlayThreads = useMemo(
    () => allThreads.map((thread) => ({
      id: thread.id,
      selectedText: thread.selectedText,
      status: thread.status,
      anchorState: thread.anchorState,
    })),
    [allThreads],
  );

  return (
    <div className="paperclip-doc-annotation-host flex flex-col gap-3 lg:flex-row lg:items-start">
      <div className="relative min-w-0 flex-1">
        <section
          ref={(element) => {
            containerRef.current = element;
          }}
          className="relative"
          data-testid={`document-annotation-body-${doc.key}`}
        >
          {children}
          {!historicalPreview && doc.latestRevisionId ? (
            <DocumentAnnotationLayer
              containerRef={containerRef}
              markdown={bodyMarkdown}
              threads={overlayThreads}
              focusedThreadId={focusedThread?.id ?? null}
              onThreadFocus={handleThreadFocus}
              pendingAnchor={pendingAnchor}
              onPendingAnchorChange={(anchor) => setPendingAnchor(anchor)}
              onRequestComment={handleRequestComment}
              newCommentDisabled={newCommentDisabled}
              newCommentDisabledReason={newCommentDisabledReason}
              hideResolved
              captureSelectionRequestId={captureSelectionRequestId}
            />
          ) : null}
        </section>
      </div>
      {panelOpen ? (
        <DocumentAnnotationPanel
          open={panelOpen}
          onOpenChange={(open) => {
            onPanelOpenChange(open);
            if (!open) {
              setPendingAnchor(null);
              setFocusedThreadId(null);
              setFocusedCommentId(null);
            }
          }}
          issueId={issueId}
          documentKey={doc.key}
          documentRevisionNumber={doc.latestRevisionNumber}
          baseRevisionId={doc.latestRevisionId}
          baseRevisionNumber={doc.latestRevisionNumber}
          threads={allThreads as DocumentAnnotationThreadWithComments[]}
          focusedThreadId={focusedThreadId}
          focusedCommentId={focusedCommentId}
          onFocusThread={(id) => {
            setFocusedThreadId(id);
            if (!id) setFocusedCommentId(null);
          }}
          pendingAnchor={pendingAnchor}
          onClearPendingAnchor={() => setPendingAnchor(null)}
          onRequestCommentFromSelection={handleRequestCommentFromSelection}
          newCommentDisabled={newCommentDisabled}
          newCommentDisabledReason={newCommentDisabledReason}
          isMobile={isMobile}
          className={isMobile ? undefined : "lg:w-[360px] lg:max-w-[360px]"}
          agentMap={agentMap}
          userProfileMap={userProfileMap}
        />
      ) : null}
    </div>
  );
}

export interface DocumentAnnotationsCountChipProps {
  issueId: string;
  docKey: string;
  panelOpen: boolean;
  onToggle: () => void;
}

/**
 * Renders the unresolved-count chip for a document. Lives in the document header row
 * (next to `rev N ▾`) so it stays visible when the document is folded.
 */
export function DocumentAnnotationsCountChip({
  issueId,
  docKey,
  panelOpen,
  onToggle,
}: DocumentAnnotationsCountChipProps) {
  const annotationsQuery = useQuery({
    queryKey: queryKeys.issues.documentAnnotations(issueId, docKey, "all"),
    queryFn: () => documentAnnotationsApi.list(issueId, docKey, { status: "all", includeComments: true }),
    staleTime: 30_000,
  });
  const threads = annotationsQuery.data ?? [];
  const openCount = useMemo(
    () => threads.filter((thread) => thread.status === "open" && thread.anchorState !== "orphaned").length,
    [threads],
  );

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      data-state={panelOpen ? "open" : "closed"}
      className={cn(
        "h-auto gap-1 rounded-md px-1.5 py-0 text-[11px] font-normal text-muted-foreground hover:text-foreground",
        panelOpen && "bg-muted text-foreground",
        openCount > 0 && "text-foreground",
      )}
      onClick={onToggle}
      data-testid={`document-annotation-count-${docKey}`}
      aria-label={openCount === 0
        ? `Open comments on ${docKey}`
        : `Open ${openCount} unresolved comments on ${docKey}`}
      aria-expanded={panelOpen}
    >
      <MessageSquare className="h-3 w-3" aria-hidden="true" />
      <span className="tabular-nums">{openCount}</span>
      <span className="hidden sm:inline">
        {openCount === 1 ? "comment" : "comments"}
      </span>
    </Button>
  );
}
