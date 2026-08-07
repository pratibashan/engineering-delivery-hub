import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Full-Stack Portfolio Project
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Build, organize, and summarize team work with AI.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A production-style application built with Next.js, React Native,
          TypeScript, AWS serverless services, and generative AI.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Explore Dashboard
          </Link>

          <button className="rounded-lg border border-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-900">
            View Architecture
          </button>
        </div>
      </section>
    </main>
  );
}
