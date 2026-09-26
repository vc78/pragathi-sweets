import React from 'react'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#B8860B]/10 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm animate-pulse select-none">
      {/* Photo skeleton */}
      <div className="aspect-[4/3] w-full bg-gradient-to-r from-[#F5E6C8]/40 via-[#FFFDF8]/70 to-[#F5E6C8]/40 relative" />

      {/* Content skeleton */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="w-16 h-2.5 bg-[#B8860B]/15 rounded-full" />
          <div className="w-3/4 h-4 bg-[#8B0000]/15 rounded-lg" />
          <div className="flex items-center gap-2 pt-1">
            <div className="w-3 h-3 bg-[#B8860B]/20 rounded-full" />
            <div className="w-20 h-2 bg-[#3A2D23]/10 rounded-full" />
          </div>
          <div className="w-full h-2.5 bg-[#3A2D23]/10 rounded-full mt-2" />
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#B8860B]/10">
          <div className="w-16 h-5 bg-[#8B0000]/15 rounded-lg" />
          <div className="w-20 h-7 bg-[#B8860B]/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-r from-[#F5E6C8]/40 via-[#FFFDF8]/70 to-[#F5E6C8]/40 border border-[#B8860B]/15" />
          <div className="flex gap-4">
            <div className="w-24 h-16 rounded-2xl bg-[#F5E6C8]/40" />
            <div className="w-24 h-16 rounded-2xl bg-[#F5E6C8]/40" />
          </div>
        </div>

        {/* Right Column Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="w-28 h-3 bg-[#B8860B]/20 rounded-full" />
          <div className="w-3/4 h-8 bg-[#8B0000]/15 rounded-xl" />
          <div className="w-32 h-4 bg-[#B8860B]/15 rounded-md" />
          <div className="w-24 h-7 bg-[#8B0000]/20 rounded-lg" />
          <div className="space-y-2 py-4 border-y border-[#B8860B]/10">
            <div className="w-full h-3 bg-[#3A2D23]/10 rounded-full" />
            <div className="w-5/6 h-3 bg-[#3A2D23]/10 rounded-full" />
            <div className="w-2/3 h-3 bg-[#3A2D23]/10 rounded-full" />
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-12 bg-[#F5E6C8]/50 rounded-full" />
            <div className="flex-1 h-12 bg-[#8B0000]/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gold/10 overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-[#F5E6C8]/30 border-b border-gold/10 flex items-center px-6 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-[#B8860B]/20 rounded-full flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gold/5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-14 flex items-center px-6 gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-3.5 bg-gray-200/80 rounded-full flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
