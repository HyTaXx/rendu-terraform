import { useMemo, useState } from 'react'

function formatCurrency(v) {
  if (typeof v !== 'number') v = Number(v)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v)
}

function formatPercent(v) {
  if (typeof v !== 'number') v = Number(v)
  return `${v.toFixed(2)}%`
}

export default function CryptoTable({ data = [], onSelect }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((c) =>
      String(c.name || '').toLowerCase().includes(q) ||
      String(c.symbol || '').toLowerCase().includes(q) ||
      String(c.id || '').toLowerCase().includes(q)
    )
  }, [data, query])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <input
          placeholder="Rechercher une crypto…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50/80 dark:bg-gray-800/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Nom</th>
              <th className="px-3 py-2 text-right font-medium">Prix</th>
              <th className="px-3 py-2 text-right font-medium">24h</th>
              <th className="px-3 py-2 text-right font-medium">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const change = Number(c.price_change_percentage ?? 0)
              const trend = c.trend || (change >= 0 ? 'Hausse' : 'Baisse')
              return (
                <tr key={c.id || c.symbol || c.name} className="border-t">
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onSelect && onSelect(c)}
                      className="text-left font-medium text-blue-600 hover:underline"
                    >
                      <span className="inline-flex items-center gap-2">
                        {c.image ? (
                          <img src={c.image} alt="" className="h-5 w-5 rounded-full" />
                        ) : null}
                        <span>
                          {c.name} {c.symbol ? <span className="text-gray-500">({c.symbol})</span> : null}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(c.price)}</td>
                  <td className={`px-3 py-2 text-right tabular-nums ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatPercent(change)}
                  </td>
                  <td className="px-3 py-2 text-right">{trend} {trend === 'Hausse' ? '🚀' : '📉'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
