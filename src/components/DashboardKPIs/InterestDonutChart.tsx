import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { INTEREST_LABELS } from '../../lib/dashboard-queries'
import './InterestDonutChart.css'

interface Props {
  byInterest: Record<string, number>
  onSliceClick?: (interestKey: string) => void
}

const COLORS: Record<string, string> = {
  'sin-afan': '#3b82f6',
  urgente: '#ef4444',
  cambiar: '#10b981',
  legal: '#a855f7',
}

const FALLBACK_COLOR = '#9ca3af'

export function InterestDonutChart({ byInterest, onSliceClick }: Props) {
  const data = useMemo(() => {
    return Object.entries(INTEREST_LABELS)
      .map(([key, label]) => ({
        key,
        name: label,
        value: byInterest[key] ?? 0,
        color: COLORS[key] ?? FALLBACK_COLOR,
      }))
      .filter((d) => d.value > 0)
  }, [byInterest])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div className="interest-donut interest-donut--empty">
        <span>Aún no hay datos de interés de venta</span>
      </div>
    )
  }

  return (
    <div className="interest-donut">
      <div className="interest-donut__chart">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
              onClick={(_, index) => {
                if (!onSliceClick) return
                const entry = data[index]
                if (entry) onSliceClick(entry.key)
              }}
              style={{ cursor: onSliceClick ? 'pointer' : 'default', outline: 'none' }}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const num = Number(value) || 0
                return [`${num} (${Math.round((num / total) * 100)}%)`, String(name)]
              }}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="interest-donut__center">
          <span className="interest-donut__center-value">{total}</span>
          <span className="interest-donut__center-label">leads con interés</span>
        </div>
      </div>
    </div>
  )
}
