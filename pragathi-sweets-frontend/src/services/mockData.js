// Local fallback data so the storefront is fully browsable even before the
// Spring Boot backend (pragathi-sweets-backend) is running. Every service
// function tries the real API first and falls back to this data on failure.

export const CATEGORIES = ['Milk Sweets', 'Dry Fruit Sweets', 'Bengali Sweets', 'Savouries', 'Festival Hampers']

export const PRODUCTS = [
  { id: 1, name: 'Kaju Katli', category: 'Dry Fruit Sweets', price: 620, unit: 'kg', rating: 4.8, stock: 42, bestseller: true, image: '/images/pexels-divigraphy-8624624.jpg', description: 'Diamond-cut cashew fudge finished with a whisper of silver varq.' },
  { id: 2, name: 'Motichoor Ladoo', category: 'Milk Sweets', price: 380, unit: 'kg', rating: 4.6, stock: 30, bestseller: true, image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg', description: 'Tiny gram-flour pearls simmered in saffron syrup and shaped by hand.' },
  { id: 3, name: 'Rasgulla', category: 'Bengali Sweets', price: 340, unit: 'kg', rating: 4.7, stock: 25, bestseller: false, image: '/images/pexels-gaurav-kumar-1281378-18488310.jpg', description: 'Spongy chhena balls soaked in a light cardamom sugar syrup.' },
  { id: 4, name: 'Gulab Jamun', category: 'Milk Sweets', price: 320, unit: 'kg', rating: 4.9, stock: 50, bestseller: true, image: '/images/pexels-divigraphy-14467844.jpg', description: 'Milk-solid dumplings fried golden and soaked in rose-scented syrup.' },
  { id: 5, name: 'Mysore Pak', category: 'Dry Fruit Sweets', price: 480, unit: 'kg', rating: 4.5, stock: 18, bestseller: false, image: '/images/pexels-kailashkumarphotography-11887844.jpg', description: 'Ghee-rich gram flour fudge, melt-in-the-mouth and lightly porous.' },
  { id: 6, name: 'Sandesh', category: 'Bengali Sweets', price: 400, unit: 'kg', rating: 4.4, stock: 20, bestseller: false, image: '/images/pexels-gaurav-kumar-1281378-18488316.jpg', description: 'Delicate chhena sweet, lightly sweetened and cardamom scented.' },
  { id: 7, name: 'Mixture', category: 'Savouries', price: 260, unit: 'kg', rating: 4.3, stock: 60, bestseller: false, image: '/images/pexels-masuma-rahaman-437541976-34153206.jpg', description: 'A crunchy, spiced blend of sev, peanuts, and lentils.' },
  { id: 8, name: 'Diwali Hamper — Royale', category: 'Festival Hampers', price: 1450, unit: 'box', rating: 5.0, stock: 12, bestseller: true, image: '/images/pexels-towfiqu-barbhuiya-3440682-11484120.jpg', description: 'An assortment of six festive sweets in a keepsake box.' },
]

export const ORDERS = [
  { id: 'PS-10231', customer: 'Ananya Rao', date: '2026-07-10', items: 3, total: 1240, status: 'Delivered', payment: 'Paid' },
  { id: 'PS-10232', customer: 'Rahul Mehta', date: '2026-07-12', items: 1, total: 620, status: 'Processing', payment: 'Paid' },
  { id: 'PS-10233', customer: 'Sneha Iyer', date: '2026-07-13', items: 5, total: 2100, status: 'Shipped', payment: 'Paid' },
  { id: 'PS-10234', customer: 'Vikram Singh', date: '2026-07-14', items: 2, total: 760, status: 'Pending', payment: 'Unpaid' },
  { id: 'PS-10235', customer: 'Divya Nair', date: '2026-07-15', items: 4, total: 1580, status: 'Cancelled', payment: 'Refunded' },
]

export const CUSTOMERS = [
  { id: 1, name: 'Ananya Rao', email: 'ananya@example.com', orders: 12, spent: 14300, joined: '2025-02-11' },
  { id: 2, name: 'Rahul Mehta', email: 'rahul@example.com', orders: 4, spent: 3200, joined: '2025-06-04' },
  { id: 3, name: 'Sneha Iyer', email: 'sneha@example.com', orders: 21, spent: 28900, joined: '2024-11-19' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', orders: 2, spent: 1500, joined: '2026-01-22' },
]

export const REVIEWS = [
  { id: 1, product: 'Kaju Katli', customer: 'Ananya Rao', rating: 5, comment: 'Best kaju katli I have had outside Jaipur!', date: '2026-07-11', approved: true },
  { id: 2, product: 'Gulab Jamun', customer: 'Sneha Iyer', rating: 5, comment: 'Soft, warm, and not overly sweet. Perfect.', date: '2026-07-13', approved: true },
  { id: 3, product: 'Mysore Pak', customer: 'Vikram Singh', rating: 3, comment: 'Good but a bit too ghee-heavy for my taste.', date: '2026-07-14', approved: false },
]

export const SALES_TREND = [
  { month: 'Feb', sales: 82000 }, { month: 'Mar', sales: 95000 }, { month: 'Apr', sales: 88000 },
  { month: 'May', sales: 110000 }, { month: 'Jun', sales: 132000 }, { month: 'Jul', sales: 148000 },
]

export const OFFERS = [
  { id: 1, title: 'Independence Day Special', code: 'AZADI15', discount: '15%', active: true, expires: '2026-08-15' },
  { id: 2, title: 'Rakhi Combo Offer', code: 'RAKHI200', discount: '₹200 off', active: true, expires: '2026-08-30' },
  { id: 3, title: 'Diwali Mega Sale', code: 'DIWALI2025', discount: '25%', active: false, expires: '2025-11-05' },
]
