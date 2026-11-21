"use client";

interface ChartPoint {
  label: string;
  revenue: number;
  count: number;
}

interface RevenueChartProps {
  points: ChartPoint[];
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

/**
 * Lightweight SVG chart with two series: revenue and booking count.
 * All values come from the admin transaction/appointment APIs — there is
 * no generated or placeholder data here.
 */
export function RevenueChart({ points }: RevenueChartProps) {
  if (points.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-ink-muted">
        No verified payments yet to chart.
      </div>
    );
  }

  const width = 400;
  const height = 170;
  const top = 12;
  const bottom = 140;
  const left = 12;
  const right = width - 12;

  const maxRevenue = Math.max(1, ...points.map((point) => point.revenue));
  const maxCount = Math.max(1, ...points.map((point) => point.count));

  const revenuePoints = points.map((point, index) => ({
    x: left + (index * (right - left)) / Math.max(1, points.length - 1),
    y: bottom - (point.revenue / maxRevenue) * (bottom - top),
  }));
  const countPoints = points.map((point, index) => ({
    x: left + (index * (right - left)) / Math.max(1, points.length - 1),
    y: bottom - (point.count / maxCount) * (bottom - top),
  }));

  const revenuePath = smoothPath(revenuePoints);
  const countPath = smoothPath(countPoints);
  const areaPath = `${revenuePath} L ${right} ${bottom} L ${left} ${bottom} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full"
        role="img"
        aria-label="Revenue and booking activity over time"
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((row) => {
          const y = top + (row * (bottom - top)) / 3;
          return (
            <line
              key={row}
              x1={left}
              x2={right}
              y1={y}
              y2={y}
              stroke="var(--line-soft)"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#revenue-fill)" />
        <path d={revenuePath} fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" />
        <path d={countPath} fill="none" stroke="var(--ink)" strokeWidth="2" />

        {revenuePoints.map((point, index) => (
          <circle key={`r-${index}`} cx={point.x} cy={point.y} r="3" fill="var(--accent-gold)" />
        ))}
        {countPoints.map((point, index) => (
          <circle key={`c-${index}`} cx={point.x} cy={point.y} r="2.5" fill="var(--ink)" />
        ))}
      </svg>

      <div className="mt-1 flex justify-between px-2 text-[0.6rem] text-ink-faint">
        {points.map((point, index) => (
          <span key={`${point.label}-${index}`}>{point.label}</span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[0.62rem] text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink" /> Bookings
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent-gold" /> Revenue
        </span>
      </div>
    </div>
  );
}
