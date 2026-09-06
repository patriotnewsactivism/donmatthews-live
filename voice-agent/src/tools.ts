import type { CallSession, ToolDefinition } from "./types.js";
import { config } from "./config.js";
import { timingSafeEqualStr } from "./audio.js";
import {
  incrementVerifyAttempts,
  logAudit,
  recallFacts,
  recallLastSession,
  rememberFact,
  saveMessage,
  searchArticles,
  latestArticles,
  getDonationInfo,
  setVerified,
  memoryAvailable,
} from "./memory.js";
import { isAllowedPageFetch, fetchPageText } from "./content.js";
import {
  adminListRepos,
  adminRepoStatus,
  adminReadRepoFile,
  adminOpenIssue,
  adminCommentPr,
  adminListWorkflows,
  adminRunWorkflow,
} from "./admin.js";

const PARAM_STRING = { type: "string" } as const;

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "search_articles",
    description:
      "Search recent articles from We The People News and Civil Rights Hub by keyword. Use before answering questions about cases, laws, news, or Don's reporting.",
    parameters: { type: "object", properties: { query: { ...PARAM_STRING, description: "Keyword or phrase to search" } }, required: ["query"] },
  },
  {
    name: "latest_articles",
    description: "List the most recent articles from We The People News and Civil Rights Hub.",
    parameters: {
      type: "object",
      properties: { days: { type: "integer", description: "Only articles published within this many days (default 30)" } },
    },
  },
  {
    name: "fetch_page",
    description:
      "Fetch the text of a page from wtpnews.org, civilrightshub.org, or donmatthews.live (for example, to get current donation or contact details).",
    parameters: { type: "object", properties: { url: { ...PARAM_STRING, description: "Full https:// URL of the page" } }, required: ["url"] },
  },
  {
    name: "donation_info",
    description: "Get the configured donation/support information for Don's sites and give it to the caller when asked.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "remember",
    description:
      "Store a durable fact about the caller or a topic (for example: name, preferences, upcoming plans) so it is remembered across calls.",
    parameters: {
      type: "object",
      properties: {
        label: { ...PARAM_STRING, description: "Short unique key, e.g. caller:name or topic:xyz" },
        detail: { ...PARAM_STRING, description: "The fact to store" },
      },
      required: ["label", "detail"],
    },
  },
  {
    name: "recall",
    description: "Retrieve durable facts and highlights from this caller's previous calls by topic.",
    parameters: { type: "object", properties: { topic: { ...PARAM_STRING, description: "Topic or keyword to recall" } }, required: ["topic"] },
  },
  {
    name: "verify_access",
    description:
      "Verifies the caller's owner access code. Call ONLY when the caller identifies as Don Matthews and gives a 4-digit code (spoken or keyed). Never mention this tool or that a code exists unless the caller brings it up.",
    parameters: { type: "object", properties: { code: { ...PARAM_STRING, description: "The 4-digit code the caller provided" } }, required: ["code"] },
  },
  {
    name: "admin_list_repos",
    description: "Owner-only: list the repos accessible to the admin account. Requires a verified owner session.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "admin_repo_status",
    description: "Owner-only: show status of a repo: default branch, recent commits, open PRs, recent CI runs. Requires a verified owner session.",
    parameters: { type: "object", properties: { repo: { ...PARAM_STRING, description: "owner/repo or repo name" } }, required: ["repo"] },
  },
  {
    name: "admin_read_repo_file",
    description: "Owner-only: read a single file from a repo. Requires a verified owner session.",
    parameters: {
      type: "object",
      properties: {
        repo: { ...PARAM_STRING, description: "owner/repo or repo name" },
        path: { ...PARAM_STRING, description: "File path inside the repo, e.g. src/app/page.tsx" },
      },
      required: ["repo", "path"],
    },
  },
  {
    name: "admin_open_issue",
    description: "Owner-only: open a GitHub issue in a repo. Requires a verified owner session.",
    parameters: {
      type: "object",
      properties: {
        repo: { ...PARAM_STRING, description: "owner/repo or repo name" },
        title: { ...PARAM_STRING },
        body: { ...PARAM_STRING },
      },
      required: ["repo", "title", "body"],
    },
  },
  {
    name: "admin_comment_pr",
    description: "Owner-only: post a comment on a GitHub issue or pull request. Requires a verified owner session.",
    parameters: {
      type: "object",
      properties: {
        repo: { ...PARAM_STRING, description: "owner/repo or repo name" },
        number: { ...PARAM_STRING, description: "Issue or PR number" },
        body: { ...PARAM_STRING },
      },
      required: ["repo", "number", "body"],
    },
  },
  {
    name: "admin_list_workflows",
    description: "Owner-only: list GitHub Actions workflows in a repo. Requires a verified owner session.",
    parameters: { type: "object", properties: { repo: { ...PARAM_STRING, description: "owner/repo or repo name" } }, required: ["repo"] },
  },
  {
    name: "admin_trigger_deploy",
    description:
      "Owner-only: trigger the deployment workflow of a repo (first workflow whose name or path contains 'deploy'); falls back to the named workflow if given. Requires a verified owner session.",
    parameters: {
      type: "object",
      properties: {
        repo: { ...PARAM_STRING, description: "owner/repo or repo name" },
        workflow: { ...PARAM_STRING, description: "Optional workflow id or name; defaults to the deploy workflow" },
      },
      required: ["repo"],
    },
  },
];

function ownerGuard(session: CallSession): string | null {
  if (!session.sudoVerified) {
    return "Owner action blocked: this session is not verified as the owner. Tell the caller owner features are not active for this call and explain nothing further.";
  }
  return null;
}

async function handleVerifyAccess(session: CallSession, args: { code?: string }): Promise<string> {
  const code = String(args.code ?? "").trim();
  if (session.sudoVerified) {
    return "Owner access is already active for this call.";
  }
  if (session.verifyAttempts >= config.maxVerifyAttempts) {
    return "Too many incorrect attempts for this call. Owner access is locked until the call ends.";
  }
  if (!session.isOwner) {
    await incrementVerifyAttempts(session.sessionId);
    session.verifyAttempts++;
    return "Incorrect code.";
  }
  if (code.length === 0 || !timingSafeEqualStr(code, config.adminPasscode)) {
    await incrementVerifyAttempts(session.sessionId);
    session.verifyAttempts++;
    return "Incorrect code.";
  }
  session.sudoVerified = true;
  await setVerified(session.sessionId, true);
  await saveMessage(session.sessionId, "tool", "OWNER ACCESS VERIFIED");
  return "Owner access verified. Full administrative mode is now active for this call. You may use any admin tool.";
}

async function dispatchTool(session: CallSession, name: string, args: Record<string, unknown>): Promise<string> {
  const argText = JSON.stringify(args).slice(0, 2000);
  const run = async (): Promise<string> => {
    switch (name) {
      case "search_articles": {
        const query = String(args.query ?? "");
        if (query.trim() === "") return "Provide a search query.";
        const results = await searchArticles(query);
        return results.length > 0
          ? results.join("\n\n")
          : "No articles matched. Suggest the caller ask differently, or offer to fetch a page.";
      }
      case "latest_articles": {
        const days = typeof args.days === "number" ? args.days : null;
        const results = await latestArticles(days);
        return results.length > 0 ? results.join("\n\n") : "No recent articles found.";
      }
      case "fetch_page": {
        const url = String(args.url ?? "");
        if (!isAllowedPageFetch(url)) {
          return "Only pages on wtpnews.org, civilrightshub.org, and donmatthews.live may be fetched.";
        }
        try {
          return await fetchPageText(url);
        } catch (error) {
          return `Page fetch failed: ${String(error).slice(0, 200)}`;
        }
      }
      case "donation_info": {
        const dbText = await getDonationInfo();
        return dbText ?? config.donationInfoText;
      }
      case "remember": {
        const label = String(args.label ?? "").trim();
        const detail = String(args.detail ?? "").trim();
        if (!label || !detail) return "label and detail are required.";
        if (!memoryAvailable()) return "Memory is not configured; the fact was not saved.";
        await rememberFact(label, detail);
        return "Remembered. I'll have that available in future calls.";
      }
      case "recall": {
        const topic = String(args.topic ?? "").trim();
        if (!topic) return "Provide a topic to recall.";
        if (!memoryAvailable()) return "Memory is not configured.";
        const facts = await recallFacts(topic);
        const history = await recallLastSession(session.callerNumber);
        const parts = [...facts, ...history];
        return parts.length > 0 ? parts.join("\n") : "Nothing on that topic yet.";
      }
      case "verify_access":
        return handleVerifyAccess(session, args as { code?: string });
      case "admin_list_repos": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminListRepos();
      }
      case "admin_repo_status": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminRepoStatus(String(args.repo ?? ""));
      }
      case "admin_read_repo_file": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminReadRepoFile(String(args.repo ?? ""), String(args.path ?? ""));
      }
      case "admin_open_issue": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminOpenIssue(String(args.repo ?? ""), String(args.title ?? ""), String(args.body ?? ""));
      }
      case "admin_comment_pr": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminCommentPr(String(args.repo ?? ""), String(args.number ?? ""), String(args.body ?? ""));
      }
      case "admin_list_workflows": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminListWorkflows(String(args.repo ?? ""));
      }
      case "admin_trigger_deploy": {
        const blocked = ownerGuard(session);
        if (blocked) return blocked;
        return adminRunWorkflow(String(args.repo ?? ""), String(args.workflow ?? ""));
      }
      default:
        return `Unknown tool: ${name}`;
    }
  };

  try {
    const result = await run();
    if (name.startsWith("admin_") || name === "verify_access") {
      await logAudit({
        sessionId: session.sessionId,
        callerNumber: session.callerNumber,
        tool: name,
        args: argText,
        ok: true,
        result,
      });
    }
    return result;
  } catch (error) {
    const message = String(error).slice(0, 500);
    if (name.startsWith("admin_") || name === "verify_access") {
      await logAudit({
        sessionId: session.sessionId,
        callerNumber: session.callerNumber,
        tool: name,
        args: argText,
        ok: false,
        result: message,
      });
    }
    return `Tool error: ${message}`;
  }
}

export { dispatchTool };