type StatCardProps = {
  label: string;
  value: number;
  description: string;
};

export default function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-400">{label}</p>

      <p className="mt-3 text-4xl font-bold text-white">{value}</p>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </article>
  );
}