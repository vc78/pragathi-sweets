import { useState } from 'react'
import { FALLBACK_PRODUCT_IMAGE } from '../../utils/media'

export default function ReliableImage({
  src,
  alt = 'AGVIA Luxury Fashion',
  className = '',
  aspectRatio,
  loading = 'lazy',
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Primary source or fallback if error or empty
  const imageSource = (!src || error) ? FALLBACK_PRODUCT_IMAGE : src

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5E6C8]/40 via-[#FFFDF8]/70 to-[#F5E6C8]/40 animate-pulse" />
      )}

      <img
        src={imageSource}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true)
            setLoaded(true)
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  )
}
