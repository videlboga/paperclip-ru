// @vitest-environment jsdom

import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type {
  DocumentAnnotationThreadWithComments,
  IssueDocument,
} from "@paperclipai/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DocumentAnnotationsCountChip,
  IssueDocumentAnnotations,
} from "./IssueDocumentAnnotations";

const mockAnnotationsApi = vi.hoisted(() => ({
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  addComment: vi.fn(),
  updateStatus: vi.fn(),
}));

vi.mock("@/api/document-annotations", () => ({
  documentAnnotationsApi: mockAnnotationsApi,
}));

vi.mock("./MarkdownBody", () => ({
  MarkdownBody: ({ children }: { children: string }) => <div>{children}</div>,
}));

vi.mock("./DocumentAnnotationLayer", () => ({
  DocumentAnnotationLayer: () => null,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function makeDoc(overrides: Partial<IssueDocument> = {}): IssueDocument {
  return {
    id: "doc-1",
    companyId: "co-1",
    issueId: "issue-1",
    key: "plan",
    title: "Plan",
    format: "markdown",
    body: "# Plan\n\nWe should keep the editor.",
    latestRevisionId: "rev-4",
    latestRevisionNumber: 4,
    createdByAgentId: null,
    createdByUserId: "user-1",
    updatedByAgentId: null,
    updatedByUserId: "user-1",
    createdAt: new Date("2026-04-01T00:00:00Z"),
    updatedAt: new Date("2026-04-01T00:01:00Z"),
    ...overrides,
  };
}

function makeThread(
  overrides: Partial<DocumentAnnotationThreadWithComments> = {},
): DocumentAnnotationThreadWithComments {
  const id = overrides.id ?? "thread-1";
  return {
    id,
    companyId: "co-1",
    issueId: "issue-1",
    documentId: "doc-1",
    documentKey: "plan",
    status: "open",
    anchorState: "active",
    anchorConfidence: "exact",
    originalRevisionId: "rev-4",
    originalRevisionNumber: 4,
    currentRevisionId: "rev-4",
    currentRevisionNumber: 4,
    selectedText: "should keep the editor",
    prefixText: "We ",
    suffixText: ".",
    normalizedStart: 0,
    normalizedEnd: 22,
    markdownStart: 0,
    markdownEnd: 22,
    anchorSelector: {
      quote: { exact: "should keep the editor", prefix: "We ", suffix: "." },
      position: { normalizedStart: 0, normalizedEnd: 22, markdownStart: 0, markdownEnd: 22 },
    },
    createdByAgentId: null,
    createdByUserId: "user-1",
    resolvedByAgentId: null,
    resolvedByUserId: null,
    resolvedAt: null,
    createdAt: new Date("2026-04-01T00:01:00Z"),
    updatedAt: new Date("2026-04-01T00:02:00Z"),
    comments: [
      {
        id: "comment-1",
        companyId: "co-1",
        threadId: id,
        issueId: "issue-1",
        documentId: "doc-1",
        body: "Please clarify this assumption.",
        authorType: "user",
        authorAgentId: null,
        authorUserId: "user-1",
        createdByRunId: null,
        createdAt: new Date("2026-04-01T00:01:00Z"),
        updatedAt: new Date("2026-04-01T00:01:00Z"),
      },
    ],
    ...overrides,
  };
}

function Harness({
  doc,
  draftDirty = false,
  draftConflicted = false,
  historicalPreview = false,
  locationHash = "",
  initialPanelOpen = false,
}: {
  doc: IssueDocument;
  draftDirty?: boolean;
  draftConflicted?: boolean;
  historicalPreview?: boolean;
  locationHash?: string;
  initialPanelOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialPanelOpen);
  return (
    <>
      <DocumentAnnotationsCountChip
        issueId="issue-1"
        docKey={doc.key}
        panelOpen={open}
        onToggle={() => setOpen((current) => !current)}
      />
      <IssueDocumentAnnotations
        issueId="issue-1"
        doc={doc}
        bodyMarkdown={doc.body}
        draftDirty={draftDirty}
        draftConflicted={draftConflicted}
        historicalPreview={historicalPreview}
        locationHash={locationHash}
        panelOpen={open}
        onPanelOpenChange={setOpen}
      >
        <p>Body content</p>
      </IssueDocumentAnnotations>
    </>
  );
}

describe("IssueDocumentAnnotations", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    container.remove();
  });

  it("renders the open count chip and opens the panel on click", async () => {
    mockAnnotationsApi.list.mockResolvedValue([makeThread()]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness doc={doc} />
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    const chip = container.querySelector('[data-testid="document-annotation-count-plan"]');
    expect(chip).not.toBeNull();
    expect(chip!.textContent).toContain("1");

    await act(async () => {
      (chip as HTMLButtonElement).click();
    });
    await flush();
    const panel = container.querySelector('[data-testid="document-annotation-panel"]');
    expect(panel).not.toBeNull();
  });

  it("auto-opens the panel and focuses the thread when deep-linked", async () => {
    mockAnnotationsApi.list.mockResolvedValue([makeThread({ id: "thread-99" })]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness doc={doc} locationHash="#document-plan&thread=thread-99" />
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    const panel = container.querySelector('[data-testid="document-annotation-panel"]');
    expect(panel).not.toBeNull();
    const focusedThread = container.querySelector('[data-thread-id="thread-99"][data-focused]');
    expect(focusedThread).not.toBeNull();
  });

  it("shows a disabled reason in the panel when the draft is dirty", async () => {
    mockAnnotationsApi.list.mockResolvedValue([makeThread()]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness doc={doc} draftDirty initialPanelOpen />
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    const reason = container.querySelector(
      '[data-testid="document-annotation-disabled-reason"]',
    );
    expect(reason).not.toBeNull();
    expect(reason!.textContent).toMatch(/draft/i);
  });

  it("filters resolved threads behind their tab", async () => {
    mockAnnotationsApi.list.mockResolvedValue([
      makeThread({ id: "open-1" }),
      makeThread({ id: "resolved-1", status: "resolved" }),
    ]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness doc={doc} initialPanelOpen />
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    // Open filter shows only open
    expect(container.querySelector('[data-thread-id="open-1"]')).not.toBeNull();
    expect(container.querySelector('[data-thread-id="resolved-1"]')).toBeNull();

    // Switch to Resolved
    const resolvedTab = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.startsWith("Resolved"),
    );
    expect(resolvedTab).not.toBeUndefined();
    await act(async () => resolvedTab!.click());
    await flush();

    expect(container.querySelector('[data-thread-id="resolved-1"]')).not.toBeNull();
  });

  it("renders author name + role from agent and user maps", async () => {
    mockAnnotationsApi.list.mockResolvedValue([
      makeThread({
        id: "open-1",
        comments: [
          {
            id: "comment-board",
            companyId: "co-1",
            threadId: "open-1",
            issueId: "issue-1",
            documentId: "doc-1",
            body: "From the board.",
            authorType: "user",
            authorAgentId: null,
            authorUserId: "user-1",
            createdByRunId: null,
            createdAt: new Date("2026-04-01T00:01:00Z"),
            updatedAt: new Date("2026-04-01T00:01:00Z"),
          },
          {
            id: "comment-agent",
            companyId: "co-1",
            threadId: "open-1",
            issueId: "issue-1",
            documentId: "doc-1",
            body: "From the agent.",
            authorType: "agent",
            authorAgentId: "agent-uxdesigner",
            authorUserId: null,
            createdByRunId: "run-1",
            createdAt: new Date("2026-04-01T00:02:00Z"),
            updatedAt: new Date("2026-04-01T00:02:00Z"),
          },
        ],
      }),
    ]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    const agentMap = new Map([["agent-uxdesigner", { id: "agent-uxdesigner", name: "UXDesigner" }]]);
    const userProfileMap = new Map([["user-1", { label: "Dotta", image: null }]]);

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <DocumentAnnotationsCountChip
            issueId="issue-1"
            docKey={doc.key}
            panelOpen
            onToggle={() => {}}
          />
          <IssueDocumentAnnotations
            issueId="issue-1"
            doc={doc}
            bodyMarkdown={doc.body}
            draftDirty={false}
            draftConflicted={false}
            historicalPreview={false}
            locationHash=""
            panelOpen
            onPanelOpenChange={() => {}}
            agentMap={agentMap}
            userProfileMap={userProfileMap}
          >
            <p>Body</p>
          </IssueDocumentAnnotations>
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    // Click the open thread to expand it.
    const threadCard = container.querySelector('[data-thread-id="open-1"]') as HTMLElement | null;
    expect(threadCard).not.toBeNull();
    await act(async () => threadCard!.click());
    await flush();

    const expandedText = container.querySelector('[data-thread-id="open-1"]')?.textContent ?? "";
    expect(expandedText).toContain("Dotta");
    expect(expandedText).toContain("· board");
    expect(expandedText).toContain("UXDesigner");
    expect(expandedText).toContain("· agent");
  });

  it("exposes a persistent + New comment on selection CTA when panel is open", async () => {
    mockAnnotationsApi.list.mockResolvedValue([]);
    const root = createRoot(container);
    const queryClient = makeQueryClient();
    const doc = makeDoc();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness doc={doc} initialPanelOpen />
        </QueryClientProvider>,
      );
    });
    await flush();
    await flush();

    const cta = container.querySelector('[data-testid="document-annotation-new-comment-cta"]');
    expect(cta).not.toBeNull();
    expect(cta!.textContent).toMatch(/New comment on selection/i);
    expect(cta!.textContent).toMatch(/⌘⇧M/);
  });
});
