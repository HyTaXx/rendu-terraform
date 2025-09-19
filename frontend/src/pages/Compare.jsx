import { useEffect, useState } from 'react'
import { getTopCryptos, getHistory } from '../api/client'
import PriceChart from '../components/PriceChart'

export default function Compare() {
  const [list, setList] = useState([])
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [histA, setHistA] = useState([])
  const [histB, setHistB] = useState([])

  useEffect(() => {
    getTopCryptos().then((data) => {
      const arr = Array.isArray(data) ? data : data?.data || []
      setList(arr)
      if (arr[0]) setA(arr[0].id)
      if (arr[1]) setB(arr[1].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!a) return
    getHistory(a).then((data) => setHistA(Array.isArray(data) ? data : data?.data || [])).catch(() => {})
  }, [a])

  useEffect(() => {
    if (!b) return
    getHistory(b).then((data) => setHistB(Array.isArray(data) ? data : data?.data || [])).catch(() => {})
  }, [b])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comparer deux cryptos</h1>
          <p className="text-sm text-gray-500">Sélectionnez deux cryptos pour comparer leurs prix.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-500">Crypto A</label>
            <select value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-900">
              {list.map((c) => {
                const val = c.id
                const label = `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`
                return <option key={val} value={val}>{label}</option>
              })}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-500">Crypto B</label>
            <select value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-900">
              {list.map((c) => {
                const val = c.id
                const label = `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`
                return <option key={val} value={val}>{label}</option>
              })}
            </select>
          </div>
        </div>
      </div>

      <PriceChart
        title="Comparaison des prix (7 jours)"
        series={histA}
        seriesB={histB}
        labelA={a || 'A'}
        labelB={b || 'B'}
      />
    </div>
  )
}
