import { PatternCard } from "@/components/patterns/PatternCard";
import { PatternDetails } from "@/components/patterns/PatternDetails";
import { getPatterns } from "@/lib/api";

export default async function PatternsPage() {
  const patterns = await getPatterns();

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-white">Emerging Behavioural Patterns</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {patterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
          <PatternDetails pattern={patterns[0]} />
        </div>
      </div>
    </div>
  );
}
