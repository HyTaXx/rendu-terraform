import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function normalize(series = []) {
  return series.map((p) => {
    const t = p.ts || p.date || p.time || p.timestamp || p.t || p[0]
    const price = Number(p.price ?? p.close ?? p.value ?? p[1])
    const d = typeof t === 'number' ? new Date(t) : new Date(String(t))
    return { date: d, price }
  })
}

function pctChange(prev, next) {
  if (!prev) return 0
  return ((next - prev) / prev) * 100
}

function formatDate(d) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(d))
}

export default function VariationChart({ title = 'Variation quotidienne (7 jours)', series = [] }) {
  const points = normalize(series)
  const data = points.map((p, i) => ({
    date: p.date,
    change: i === 0 ? 0 : pctChange(points[i - 1].price, p.price),
  }))

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={20} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <Tooltip labelFormatter={(v) => formatDate(v)} formatter={(val) => [`${Number(val).toFixed(2)}%`, 'Variation']} />
            <Legend />
            <Bar dataKey="change" name="Variation" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
