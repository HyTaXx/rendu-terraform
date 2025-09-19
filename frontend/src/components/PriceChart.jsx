import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

function normalizeHistory(series = []) {
  return series.map((p) => {
    const t = p.ts || p.date || p.time || p.timestamp || p.t || p[0]
    const price = p.price ?? p.close ?? p.value ?? p[1]
    const d = typeof t === 'number' ? new Date(t) : new Date(String(t))
    return { date: d, price: Number(price) }
  })
}

function formatDate(d) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(d))
}

export default function PriceChart({ title = 'Prix (7 jours)', series = [], seriesB, labelA, labelB }) {
  const dataA = normalizeHistory(series)
  const overlay = seriesB ? normalizeHistory(seriesB) : null

  const merged = overlay
    ? dataA.map((a, i) => ({ ...a, priceB: overlay[i]?.price }))
    : dataA

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={20} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <Tooltip labelFormatter={(v) => formatDate(v)} formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Prix']} />
            <Legend />
            <Line type="monotone" dataKey="price" name={labelA || 'Crypto A'} stroke="#3b82f6" strokeWidth={2} dot={false} />
            {overlay && (
              <Line type="monotone" dataKey="priceB" name={labelB || 'Crypto B'} stroke="#10b981" strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
