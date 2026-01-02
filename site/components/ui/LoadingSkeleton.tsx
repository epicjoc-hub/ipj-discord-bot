export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card p-6 space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-3 w-full rounded-full bg-white/10"
          style={{ width: `${80 - idx * 8}%` }}
        />
      ))}
    </div>
  );
}
