import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalesChart({ data = [], dataKey = 'sales', title = 'Sales Trend' }) {
  return (
    <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-sm select-none">
      <h3 className="font-display text-lg text-maroon font-semibold mb-6 uppercase tracking-wider">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E1E1E" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6E1E1E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#C79A3B22" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#2B2B2B" 
            opacity={0.4}
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            dy={10}
            className="font-body uppercase tracking-wider"
          />
          <YAxis 
            stroke="#2B2B2B" 
            opacity={0.4}
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            dx={-10}
            className="font-body"
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#FFF8F1', 
              border: '1px solid #C79A3B', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px -10px rgba(110, 30, 30, 0.08)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px'
            }} 
            labelClassName="font-display font-bold text-maroon-dark"
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#6E1E1E" 
            strokeWidth={2} 
            fill="url(#salesFill)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
