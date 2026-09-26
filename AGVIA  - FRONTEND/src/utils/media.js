const apiOrigin = new URL(
    import.meta.env.VITE_API_URL || '/api',
    window.location.origin
).origin

export const FALLBACK_PRODUCT_IMAGE = '/images/classic_silk_saree.jpg'

export function resolveImageUrl(image) {
    if (!image) return FALLBACK_PRODUCT_IMAGE
    if (/^(https?:|data:|blob:)/i.test(image)) return image
    if (image.startsWith('/images/')) return image
    if (image.startsWith('/')) return `${apiOrigin}${image}`
    return `${apiOrigin}/${image}`
}