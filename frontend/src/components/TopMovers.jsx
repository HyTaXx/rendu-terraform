function formatPercent(v) {
  if (typeof v !== 'number') v = Number(v)
  return `${v.toFixed(2)}%`
}

export default function TopMovers({ data = [] }) {
  if (!data.length) return null
  const sorted = [...data].sort((a, b) => Number(b.price_change_percentage ?? 0) - Number(a.price_change_percentage ?? 0))
  const gainer = sorted[0]
  const loser = sorted[sorted.length - 1]
  const gChange = Number(gainer?.price_change_percentage ?? 0)
  const lChange = Number(loser?.price_change_percentage ?? 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <div className="text-sm text-gray-500">Top gagnant</div>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="text-lg font-semibold">{gainer?.name} {gainer?.symbol ? <span className="text-gray-500">({gainer.symbol})</span> : null}</div>
          <div className="font-medium text-emerald-600">{formatPercent(gChange)} 🚀</div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <div className="text-sm text-gray-500">Top perdant</div>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="text-lg font-semibold">{loser?.name} {loser?.symbol ? <span className="text-gray-500">({loser.symbol})</span> : null}</div>
          <div className="font-medium text-rose-600">{formatPercent(lChange)} 📉</div>
        </div>
      </div>
    </div>
  )
}
