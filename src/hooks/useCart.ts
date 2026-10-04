import { useEffect, useReducer } from 'react'
import { products, type Product } from '../data/products'

export type CartLine = { product: Product; qty: number }

type State = Record<string, number> // slug -> quantity
type Action = { type: 'add'; slug: string; qty: number } | { type: 'set'; slug: string; qty: number } | { type: 'remove'; slug: string } | { type: 'clear' }

const STORAGE_KEY = 'rr-bag-v1'

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const clean: State = {}
    for (const [slug, qty] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof qty === 'number' && qty > 0 && products.some((p) => p.slug === slug)) clean[slug] = Math.min(99, Math.floor(qty))
    }
    return clean
  } catch {
    return {}
  }
}

function without(state: State, slug: string): State {
  return Object.fromEntries(Object.entries(state).filter(([key]) => key !== slug))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { ...state, [action.slug]: Math.min(99, (state[action.slug] ?? 0) + action.qty) }
    case 'set':
      return action.qty <= 0 ? without(state, action.slug) : { ...state, [action.slug]: Math.min(99, action.qty) }
    case 'remove':
      return without(state, action.slug)
    case 'clear':
      return {}
  }
}

/** The bag. Persists to localStorage so it survives a refresh. */
export function useCart() {
  const [state, dispatch] = useReducer(reducer, null, () => load())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable; the bag still works for this visit */
    }
  }, [state])

  const lines: CartLine[] = Object.entries(state).flatMap(([slug, qty]) => {
    const product = products.find((p) => p.slug === slug)
    return product ? [{ product, qty }] : []
  })
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)

  return {
    lines,
    count,
    subtotal,
    add: (product: Product, qty = 1) => dispatch({ type: 'add', slug: product.slug, qty }),
    setQty: (product: Product, qty: number) => dispatch({ type: 'set', slug: product.slug, qty }),
    remove: (product: Product) => dispatch({ type: 'remove', slug: product.slug }),
    clear: () => dispatch({ type: 'clear' }),
  }
}
