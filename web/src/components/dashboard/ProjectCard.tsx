type ProjectCardProps = {
  name: string;
  status: "On Track" | "At Risk" | "Blocked";
  owner: string;
  progress: number;
};

export default function ProjectCard({
  name,
  status,
  owner,
  progress,
}: ProjectCardProps) {
  const statusStyles = {
    "On Track": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "At Risk": "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Blocked: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          <p className="mt-1 text-sm text-slate-400">Owner: {owner}</p>
        </div>

        <span
          className={`rounded-full border border-slate-700 px-3 py-1 text-xs ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </article>
  );
}
