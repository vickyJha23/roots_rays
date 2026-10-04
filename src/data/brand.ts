/**
 * Brand contact details. Replace the placeholders before going live.
 *  - instagram: the handle without the @
 *  - whatsapp:  the business number in international format, digits only (no +, spaces or dashes)
 */
export const brand = {
  name: 'Roots & Rays Organic',
  instagram: 'rootsandraysorganic',
  whatsapp: '919999999999',
}

export const instagramUrl = `https://www.instagram.com/${brand.instagram}/`

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${brand.whatsapp}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export function formatPrice(amount: number): string {
  return rupees.format(amount)
}
