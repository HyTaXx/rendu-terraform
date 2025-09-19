import { useEffect, useMemo, useState } from 'react'
import { getHistory, getTopCryptos } from '../api/client'
import CryptoTable from '../components/CryptoTable'
import PriceChart from '../components/PriceChart'
import TopMovers from '../components/TopMovers'
import VariationChart from '../components/VariationChart'

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getTopCryptos()
      .then((data) => {
        if (!mounted) return
        setCryptos(Array.isArray(data) ? data : data?.data || [])
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!selected) return
    let mounted = true
    setHistory([])
    getHistory(selected.symbol || selected.id || selected.name)
      .then((data) => {
        if (!mounted) return
        const series = Array.isArray(data) ? data : data?.data || []
        setHistory(series)
      })
      .catch((e) => mounted && setError(e.message))
    return () => { mounted = false }
  }, [selected])

  const title = useMemo(
    () => (selected
      ? `Historique: ${selected.name}${selected.symbol ? ` (${selected.symbol})` : ''}`
      : "Historique (sélectionnez une crypto)"
    ),
    [selected]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Crypto</h1>
          <p className="text-sm text-gray-500">Top 10, graphiques dynamiques, recherche et comparaisons.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200">
          Erreur: {error}
        </div>
      )}

      <TopMovers data={cryptos} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <PriceChart title={title} series={history} />
          <VariationChart title="Variation quotidienne" series={history} />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
            <div className="mb-3 text-sm text-gray-500">Sélectionner pour afficher l'historique</div>
            {loading ? (
              <div className="text-sm text-gray-500">Chargement…</div>
            ) : (
              <CryptoTable data={cryptos} onSelect={setSelected} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
