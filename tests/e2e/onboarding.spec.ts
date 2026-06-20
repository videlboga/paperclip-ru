import { test, expect } from "@playwright/test";

/**
 * E2E: Onboarding wizard flow (skip_llm mode).
 *
 * Walks through the 4-step OnboardingWizard:
 *   Step 1 — Name your company
 *   Step 2 — Create your first agent (adapter selection + config)
 *   Step 3 — Give it something to do (task creation)
 *   Step 4 — Ready to launch (summary + open issue)
 *
 * By default this runs in skip_llm mode: we do NOT assert that an LLM
 * heartbeat fires. Set PAPERCLIP_E2E_SKIP_LLM=false to enable LLM-dependent
 * assertions (requires a valid ANTHROPIC_API_KEY).
 */

const SKIP_LLM = process.env.PAPERCLIP_E2E_SKIP_LLM !== "false";

const COMPANY_NAME = `E2E-Test-${Date.now()}`;
const AGENT_NAME = "CEO";
const TASK_TITLE = "E2E test task";

test.describe("Onboarding wizard", () => {
  test("completes full wizard flow", async ({ page }) => {
    await page.goto("/onboarding");

    // On /onboarding the OnboardingWizard is opened automatically by the route.
    // Only click the fallback button if the wizard did not open on its own.
    const startButton = page.getByRole("button", { name: "Start Onboarding" });
    const wizardHeading = page.getByTestId("onboarding-step-heading");
    if (!(await wizardHeading.isVisible())) {
      await startButton.click();
    }

    await expect(wizardHeading).toBeVisible({ timeout: 5_000 });

    const companyNameInput = page.getByTestId("onboarding-company-name-input");
    await companyNameInput.fill(COMPANY_NAME);

    await page.getByTestId("onboarding-next-button").click();

    await expect(page.getByTestId("onboarding-step-heading")).toBeVisible({ timeout: 30_000 });

    const agentNameInput = page.getByTestId("onboarding-agent-name-input");
    await expect(agentNameInput).toHaveValue(AGENT_NAME);

    await expect(
      page.locator("button", { hasText: "Claude Code" }).locator("..")
    ).toBeVisible();

    await page.getByRole("button", { name: "More Agent Adapter Types" }).click();
    await expect(page.getByRole("button", { name: "Process" })).toHaveCount(0);

    await page.getByTestId("onboarding-next-button").click();

    await expect(page.getByTestId("onboarding-step-heading")).toBeVisible({ timeout: 30_000 });

    const baseUrl = page.url().split("/").slice(0, 3).join("/");
    if (SKIP_LLM) {
      const companiesAfterAgentRes = await page.request.get(`${baseUrl}/api/companies`);
      expect(companiesAfterAgentRes.ok()).toBe(true);
      const companiesAfterAgent = await companiesAfterAgentRes.json();
      const companyAfterAgent = companiesAfterAgent.find(
        (c: { name: string }) => c.name === COMPANY_NAME
      );
      expect(companyAfterAgent).toBeTruthy();

      const agentsAfterCreateRes = await page.request.get(
        `${baseUrl}/api/companies/${companyAfterAgent.id}/agents`
      );
      expect(agentsAfterCreateRes.ok()).toBe(true);
      const agentsAfterCreate = await agentsAfterCreateRes.json();
      const ceoAgentAfterCreate = agentsAfterCreate.find(
        (a: { name: string }) => a.name === AGENT_NAME
      );
      expect(ceoAgentAfterCreate).toBeTruthy();

      const disableWakeRes = await page.request.patch(
        `${baseUrl}/api/agents/${ceoAgentAfterCreate.id}?companyId=${encodeURIComponent(companyAfterAgent.id)}`,
        {
          data: {
            runtimeConfig: {
              heartbeat: {
                enabled: false,
                intervalSec: 300,
                wakeOnDemand: false,
                cooldownSec: 10,
                maxConcurrentRuns: 5,
              },
            },
          },
        }
      );
      expect(disableWakeRes.ok()).toBe(true);
    }

    const taskTitleInput = page.getByTestId("onboarding-task-title-input");
    await taskTitleInput.clear();
    await taskTitleInput.fill(TASK_TITLE);

    await page.getByTestId("onboarding-next-button").click();

    await expect(page.getByTestId("onboarding-step-heading")).toBeVisible({ timeout: 30_000 });

    await expect(page.locator("text=" + COMPANY_NAME)).toBeVisible();
    await expect(page.locator("text=" + AGENT_NAME)).toBeVisible();
    await expect(page.locator("text=" + TASK_TITLE)).toBeVisible();

    await page.getByTestId("onboarding-create-open-button").click();

    await expect(page).toHaveURL(/\/issues\//, { timeout: 30_000 });

    const companiesRes = await page.request.get(`${baseUrl}/api/companies`);
    expect(companiesRes.ok()).toBe(true);
    const companies = await companiesRes.json();
    const company = companies.find(
      (c: { name: string }) => c.name === COMPANY_NAME
    );
    expect(company).toBeTruthy();

    const agentsRes = await page.request.get(
      `${baseUrl}/api/companies/${company.id}/agents`
    );
    expect(agentsRes.ok()).toBe(true);
    const agents = await agentsRes.json();
    const ceoAgent = agents.find(
      (a: { name: string }) => a.name === AGENT_NAME
    );
    expect(ceoAgent).toBeTruthy();
    expect(ceoAgent.role).toBe("ceo");
    expect(ceoAgent.adapterType).not.toBe("process");

    const instructionsBundleRes = await page.request.get(
      `${baseUrl}/api/agents/${ceoAgent.id}/instructions-bundle?companyId=${company.id}`
    );
    expect(instructionsBundleRes.ok()).toBe(true);
    const instructionsBundle = await instructionsBundleRes.json();
    expect(
      instructionsBundle.files.map((file: { path: string }) => file.path).sort()
    ).toEqual(["AGENTS.md", "HEARTBEAT.md", "SOUL.md", "TOOLS.md"]);

    const issuesRes = await page.request.get(
      `${baseUrl}/api/companies/${company.id}/issues`
    );
    expect(issuesRes.ok()).toBe(true);
    const issues = await issuesRes.json();
    const task = issues.find(
      (i: { title: string }) => i.title === TASK_TITLE
    );
    expect(task).toBeTruthy();
    expect(task.assigneeAgentId).toBe(ceoAgent.id);
    expect(task.description).toContain(
      "You are the CEO. You set the direction for the company."
    );
    expect(task.description).not.toContain("github.com/paperclipai/companies");

    if (!SKIP_LLM) {
      await expect(async () => {
        const res = await page.request.get(
          `${baseUrl}/api/issues/${task.id}`
        );
        const issue = await res.json();
        expect(["in_progress", "done"]).toContain(issue.status);
      }).toPass({ timeout: 120_000, intervals: [5_000] });
    } else {
      await expect
        .poll(async () => {
          const runsRes = await page.request.get(
            `${baseUrl}/api/companies/${company.id}/heartbeat-runs?agentId=${ceoAgent.id}`
          );
          expect(runsRes.ok()).toBe(true);
          const runs = await runsRes.json();
          return Array.isArray(runs) ? runs.length : -1;
        }, { timeout: 10_000, intervals: [500, 1_000, 2_000] })
        .toBe(0);
    }
  });
});
