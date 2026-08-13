"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { generateProjectSummary, type ProjectSummary } from "@/lib/projects";

type GenerateProjectInsightProps = {
  projectId: string;
};

export default function GenerateProjectInsight({
  projectId,
}: GenerateProjectInsightProps) {
  const [result, setResult] = useState<ProjectSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);

    try {
      const response = await generateProjectSummary(projectId);
      setResult(response);
    } catch (error) {
      console.error(error);
      setError("Unable to generate AI insight.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            AI Delivery Insight
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Analyze project risks, blockers, and recommended next actions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating
            ? "Generating..."
            : result
              ? "Regenerate Insight"
              : "Generate AI Insight"}
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-6 border-t border-slate-800 pt-6">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="mb-4 text-xl font-semibold text-white">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-6 text-base font-semibold text-white">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-7 text-slate-300">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-300">
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              hr: () => <hr className="my-6 border-slate-800" />,
            }}
          >
            {result.summary}
          </ReactMarkdown>
        </div>
      )}
    </section>
  );
}
