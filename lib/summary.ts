// Project summary generation. v1 default is rule-based (no key required);
// if OPENAI_API_KEY is present we upgrade to a GPT-4o summary. Either way we
// write ai_summary + source + confidence + review_status on the project.

export interface ProjectStats {
  projectName: string;
  projectStatus: string;
  openTasks: number;
  overdueTasks: number;
  openRisks: number;
  topRiskTitle: string | null;
  topRiskScore: number | null;
  openIssues: number;
  totalTasks: number;
  doneTasks: number;
}

export interface SummaryResult {
  text: string;
  source: string;
  confidence: number;
}

// Deterministic, plain-language 2-3 sentence status. Always available.
export function ruleBasedSummary(s: ProjectStats): SummaryResult {
  const parts: string[] = [];

  const progress =
    s.totalTasks > 0 ? Math.round((s.doneTasks / s.totalTasks) * 100) : 0;

  if (s.overdueTasks > 0) {
    parts.push(
      `${s.projectName} has ${s.overdueTasks} overdue ${plural(
        s.overdueTasks,
        "item",
      )} needing attention, with ${s.openTasks} open ${plural(
        s.openTasks,
        "task",
      )} in flight (${progress}% complete).`,
    );
  } else {
    parts.push(
      `${s.projectName} is tracking with ${s.openTasks} open ${plural(
        s.openTasks,
        "task",
      )} and no overdue items (${progress}% complete).`,
    );
  }

  if (s.openRisks > 0 && s.topRiskTitle) {
    parts.push(
      `The top risk is "${s.topRiskTitle}"${
        s.topRiskScore != null ? ` (score ${s.topRiskScore})` : ""
      } among ${s.openRisks} open ${plural(s.openRisks, "risk")}${
        s.openIssues > 0
          ? `, and ${s.openIssues} ${plural(s.openIssues, "issue")} ${
              s.openIssues === 1 ? "remains" : "remain"
            } open`
          : ""
      }.`,
    );
  } else if (s.openIssues > 0) {
    parts.push(
      `No open risks, but ${s.openIssues} ${plural(
        s.openIssues,
        "issue",
      )} still need resolution.`,
    );
  } else {
    parts.push(`No open risks or issues — the project is in good health.`);
  }

  return { text: parts.join(" "), source: "rule-based", confidence: 0.8 };
}

export async function summarizeProject(s: ProjectStats): Promise<SummaryResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return ruleBasedSummary(s);

  try {
    const prompt = `You are a project management assistant. In exactly two concise sentences, summarize the health of this project for an executive. Do not use markdown.
Project: ${s.projectName} (status: ${s.projectStatus})
Open tasks: ${s.openTasks}, Overdue: ${s.overdueTasks}, Done: ${s.doneTasks}/${s.totalTasks}
Open risks: ${s.openRisks}${s.topRiskTitle ? `, top risk: "${s.topRiskTitle}" (score ${s.topRiskScore})` : ""}
Open issues: ${s.openIssues}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 160,
      }),
    });

    if (!res.ok) return ruleBasedSummary(s);
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!text) return ruleBasedSummary(s);
    return { text, source: "gpt-4o", confidence: 0.9 };
  } catch {
    // Any failure falls back to the deterministic summary.
    return ruleBasedSummary(s);
  }
}

function plural(n: number, word: string): string {
  return n === 1 ? word : `${word}s`;
}
