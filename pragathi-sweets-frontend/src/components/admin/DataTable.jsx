export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="bg-white border border-gold/15 rounded-3xl shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-beige/40 border-b border-gold/15">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 font-display text-xs tracking-wider font-semibold text-maroon uppercase whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center font-body text-xs text-charcoal/40 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr 
                  key={row.id ?? i} 
                  className="hover:bg-beige/10 transition-colors duration-250"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap font-body text-xs text-charcoal/80">
                      {col.render ? col.render(row) : (
                        col.key === 'status' ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            row[col.key] === 'Delivered' || row[col.key] === 'Paid'
                              ? 'bg-cardamom/10 text-cardamom border-cardamom/20'
                              : row[col.key] === 'Processing' || row[col.key] === 'Shipped'
                                ? 'bg-gold/10 text-gold-dark border-gold/20'
                                : row[col.key] === 'Cancelled' || row[col.key] === 'Refunded'
                                  ? 'bg-red-50 text-red-700 border-red-100'
                                  : 'bg-gold/10 text-gold border-gold/20'
                          }`}>
                            {row[col.key]}
                          </span>
                        ) : row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
