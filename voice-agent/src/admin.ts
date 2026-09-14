import { config } from "./config.js";

const GH = "https://api.github.com";

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${config.githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "DonVoiceAgent/1.0",
  };
}

function adminEnabled(): boolean {
  return config.githubToken !== "";
}

interface RepoPair {
  owner: string;
  repo: string;
}

function parseRepo(input: string): RepoPair {
  const clean = input.trim().replace(/^https?:\/\/(www\.)?github\.com\//, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  return { owner: config.githubUser || "patriotnewsactivism", repo: parts[0] };
}

async function ghGet(path: string): Promise<unknown> {
  const res = await fetch(`${GH}${path}`, { headers: authHeaders(), signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

async function ghPost(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${GH}${path}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

export async function adminListRepos(): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const data = (await ghGet("/user/repos?sort=updated&per_page=50")) as Array<{
    name: string;
    full_name: string;
    private: boolean;
    default_branch: string;
  }>;
  return data
    .map((r) => `${r.full_name}${r.private ? " (private)" : ""} [default: ${r.default_branch}]`)
    .join("\n");
}

export async function adminRepoStatus(repoArg: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const { owner, repo } = parseRepo(repoArg);
  const info = (await ghGet(`/repos/${owner}/${repo}`)) as { default_branch: string; open_issues_count: number; description: string | null };
  const commits = (await ghGet(`/repos/${owner}/${repo}/commits?per_page=5`)) as Array<{ sha: string; commit: { message: string; author: { date: string } } }>;
  const pulls = (await ghGet(`/repos/${owner}/${repo}/pulls?state=open&per_page=10`)) as Array<{ number: number; title: string; user: { login: string } }>;
  const runs = (await ghGet(`/repos/${owner}/${repo}/actions/runs?per_page=3`)) as { workflow_runs: Array<{ status: string; conclusion: string | null; head_sha: string; created_at: string }> };
  const lines: string[] = [
    `${owner}/${repo} — ${info.description ?? "no description"}`,
    `default branch: ${info.default_branch}, open issues: ${info.open_issues_count}`,
  ];
  lines.push("recent commits:");
  for (const c of commits) {
    lines.push(`  ${c.sha.slice(0, 7)} ${new Date(c.commit.author.date).toISOString().slice(0, 10)} ${c.commit.message.split("\n")[0].slice(0, 100)}`);
  }
  lines.push(`open PRs: ${pulls.length > 0 ? pulls.map((p) => `#${p.number} ${p.title} (${p.user.login})`).join("; ") : "none"}`);
  lines.push("recent CI runs:");
  for (const r of runs.workflow_runs) {
    lines.push(`  ${r.head_sha.slice(0, 7)} ${r.status}${r.conclusion ? `/${r.conclusion}` : ""} ${r.created_at.slice(0, 10)}`);
  }
  return lines.join("\n");
}

export async function adminReadRepoFile(repoArg: string, path: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  if (/\.\./.test(path) || path.startsWith("/")) {
    throw new Error("Invalid file path.");
  }
  const { owner, repo } = parseRepo(repoArg);
  const data = (await ghGet(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`)) as {
    type: string;
    content?: string;
    size: number;
  };
  if (data.type !== "file") {
    return `Path is not a file: ${data.type}`;
  }
  if (data.size > 200_000) {
    return `File too large to read over the phone (${data.size} bytes).`;
  }
  const text = Buffer.from(data.content ?? "", "base64").toString("utf8");
  return text.slice(0, 4000);
}

export async function adminOpenIssue(repoArg: string, title: string, body: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const { owner, repo } = parseRepo(repoArg);
  const data = (await ghPost(`/repos/${owner}/${repo}/issues`, { title, body })) as { html_url: string; number: number };
  return `Issue #${data.number} opened: ${data.html_url}`;
}

export async function adminCommentPr(repoArg: string, numberText: string, body: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const { owner, repo } = parseRepo(repoArg);
  const number = Number(numberText);
  if (!Number.isInteger(number) || number <= 0) throw new Error("Invalid PR/issue number.");
  const data = (await ghPost(`/repos/${owner}/${repo}/issues/${number}/comments`, { body })) as { html_url: string };
  return `Comment posted: ${data.html_url}`;
}

export async function adminListWorkflows(repoArg: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const { owner, repo } = parseRepo(repoArg);
  const data = (await ghGet(`/repos/${owner}/${repo}/actions/workflows`)) as { workflows: Array<{ id: number; name: string; path: string }> };
  return data.workflows.map((w) => `id ${w.id}: ${w.name} (${w.path})`).join("\n") || "No workflows found.";
}

export async function adminTriggerDeploy(repoArg: string): Promise<string> {
  return adminRunWorkflow(repoArg, "");
}

export async function adminRunWorkflow(repoArg: string, workflowIdOrName: string): Promise<string> {
  if (!adminEnabled()) return "Admin tooling is not configured (missing GITHUB_TOKEN).";
  const { owner, repo } = parseRepo(repoArg);
  const workflows = (await ghGet(`/repos/${owner}/${repo}/actions/workflows`)) as { workflows: Array<{ id: number; name: string; path: string }> };
  let workflow = workflows.workflows.find((w) => String(w.id) === workflowIdOrName || w.name === workflowIdOrName);
  if (!workflow) {
    const deploy = workflows.workflows.find((w) => /deploy/i.test(w.name) || /deploy/i.test(w.path));
    if (!deploy) {
      throw new Error(`No workflow matches "${workflowIdOrName}" and no deploy workflow exists.`);
    }
    workflow = deploy;
  }
  const info = (await ghGet(`/repos/${owner}/${repo}`)) as { default_branch: string };
  await ghPost(`/repos/${owner}/${repo}/actions/workflows/${workflow.id}/dispatches`, {
    ref: info.default_branch,
  });
  return `Triggered workflow "${workflow.name}" on ${owner}/${repo} @ ${info.default_branch}.`;
}