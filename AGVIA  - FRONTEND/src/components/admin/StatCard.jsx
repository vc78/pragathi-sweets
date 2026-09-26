export default function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="bg-white border border-gold/15 rounded-3xl p-6 flex items-center gap-5 shadow-sm hover:shadow-luxury hover:border-gold/30 transition-all duration-300 select-none">
      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold border border-gold/10 flex items-center justify-center shrink-0">
        {Icon && <Icon size={20} />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gold tracking-widest uppercase font-body">{label}</p>
        <p className="text-2xl font-display font-semibold text-maroon-dark mt-1 truncate">{value}</p>
        {trend && (
          <span className="inline-block text-[9px] bg-cardamom/10 text-cardamom px-2 py-0.5 rounded-full font-body font-semibold mt-1.5">
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
