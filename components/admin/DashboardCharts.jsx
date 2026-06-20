"use client";

/* ──────────────── Line Chart (Performance Overview) ──────────────── */
export function LineChart({ data = [] }) {
  // data: [{ label: "Jan", clicks: 123, views: 456 }, ...]
  const values = data.map((d) => d.clicks);
  const labels = data.map((d) => d.label);

  const max = Math.max(...values, 1);
  const min = 0;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const w = 700;
  const h = 260;
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = values.map((v, i) => ({
    x: pad.left + (values.length > 1 ? (i / (values.length - 1)) * chartW : chartW / 2),
    y: pad.top + chartH - ((v - min) / (max - min || 1)) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? pad.left} ${pad.top + chartH} L ${points[0]?.x ?? pad.left} ${pad.top + chartH} Z`;

  // Dynamic Y-axis ticks
  const yTicks = [];
  const step = max <= 10 ? 1 : max <= 100 ? Math.ceil(max / 5 / 10) * 10 : Math.ceil(max / 5 / 1000) * 1000;
  for (let i = 0; i <= max; i += step || 1) {
    yTicks.push(i);
    if (yTicks.length > 6) break;
  }
  if (yTicks[yTicks.length - 1] < max) yTicks.push(max);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = pad.top + chartH - ((tick - min) / (max - min || 1)) * chartH;
        return (
          <g key={tick}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-gray-400" fontSize="11">
              {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}k` : tick}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {labels.map((label, i) => {
        const x = pad.left + (labels.length > 1 ? (i / (labels.length - 1)) * chartW : chartW / 2);
        return (
          <text key={`${label}-${i}`} x={x} y={h - 8} textAnchor="middle" className="fill-gray-400" fontSize="11">
            {label}
          </text>
        );
      })}

      {/* Area fill */}
      {points.length > 0 && <path d={areaPath} fill="url(#areaGrad)" />}

      {/* Line */}
      {points.length > 0 && (
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1.5">
          <title>{`${labels[i]}: ${values[i]} clicks`}</title>
        </circle>
      ))}
    </svg>
  );
}

/* ──────────────── Donut Chart (Discount Campaign) ──────────────── */
export function DonutChart({ percentage = 0 }) {
  const size = 180;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e7ff"
          strokeWidth={stroke}
        />
        {/* Filled arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#donutGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500">Engagement</span>
      </div>
    </div>
  );
}