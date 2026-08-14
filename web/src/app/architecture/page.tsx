import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            System Architecture
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Engineering Delivery Hub Architecture
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            A serverless full-stack architecture using Next.js, Amazon Cognito,
            API Gateway, AWS Lambda, DynamoDB, and Amazon Bedrock with Anthropic
            Claude for AI-powered delivery insights.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="space-y-6 text-center">
            <ArchitectureNode
              title="User"
              description="Authenticated application user"
            />

            <Arrow />

            <ArchitectureNode
              title="Next.js + TypeScript"
              description="Frontend, Server Components, Client Components, and BFF API routes"
            />

            <Arrow />

            <ArchitectureNode
              title="Amazon Cognito"
              description="OAuth 2.0 / OpenID Connect authentication"
            />

            <Arrow />

            <ArchitectureNode
              title="API Gateway"
              description="JWT-protected HTTP API"
            />

            <Arrow />

            <ArchitectureNode
              title="AWS Lambda"
              description="Serverless backend business logic"
            />

            <Arrow />

            <div className="grid gap-6 md:grid-cols-2">
              <ArchitectureNode
                title="Amazon DynamoDB"
                description="Project data persistence"
              />

              <ArchitectureNode
                title="Amazon Bedrock"
                description="Claude Sonnet 4.6 model inference"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type ArchitectureNodeProps = {
  title: string;
  description: string;
};

function ArchitectureNode({ title, description }: ArchitectureNodeProps) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-700 bg-slate-950 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div aria-hidden="true" className="text-2xl text-cyan-400">
      ↓
    </div>
  );
}
