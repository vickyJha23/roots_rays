export type Tone = 'sage' | 'berry' | 'olive' | 'charcoal' | 'plum' | 'citrus'

export type Product = {
  slug: string
  name: string
  kind: string
  weight: string
  image: string
  tone: Tone
  price: number
  note: string
  pairsWith: string
}

// Prices are placeholders in INR until the real price list is in.
export const products: Product[] = [
  {
    slug: 'moringa',
    name: 'Moringa Powder',
    kind: 'Daily greens',
    weight: '200 g',
    image: '/gallery/moringa.jpeg',
    tone: 'sage',
    price: 249,
    note: 'A simple green ritual, made from cultivated organic moringa.',
    pairsWith: 'Smoothies, scrambled eggs, a glass of water in the morning.',
  },
  {
    slug: 'beetroot',
    name: 'Beetroot Powder',
    kind: 'Rooted goodness',
    weight: '200 g',
    image: '/gallery/beetroot.jpeg',
    tone: 'berry',
    price: 299,
    note: 'Earthy beetroot, gently dried and ready for your everyday recipes.',
    pairsWith: 'Lattes, pancake batter, anything that wants a little colour.',
  },
  {
    slug: 'amla-powder',
    name: 'Amla Powder',
    kind: 'The vitamin C classic',
    weight: '200 g',
    image: '/gallery/amla-powder.jpeg',
    tone: 'olive',
    price: 199,
    note: 'A bright, tangy pantry staple made with pure amla.',
    pairsWith: 'Warm water with honey, chutneys, hair and skin rituals.',
  },
  {
    slug: 'ashwagandha',
    name: 'Ashwagandha Powder',
    kind: 'A slower evening',
    weight: '200 g',
    image: '/gallery/ashwagandha.jpeg',
    tone: 'charcoal',
    price: 349,
    note: 'A time-honoured root, thoughtfully brought into your daily routine.',
    pairsWith: 'Warm milk before bed, golden milk, evening tea.',
  },
  {
    slug: 'shatavari',
    name: 'Shatavari Powder',
    kind: 'Herbal tradition',
    weight: '200 g',
    image: '/gallery/shatavari.jpeg',
    tone: 'plum',
    price: 349,
    note: 'A fine, earthy powder made for warm drinks and mindful moments.',
    pairsWith: 'Warm milk, herbal infusions, a quiet half hour.',
  },
  {
    slug: 'amla-candy',
    name: 'Amla Candy',
    kind: 'A little something sweet',
    weight: '250 g',
    image: '/gallery/amla-candy.jpeg',
    tone: 'citrus',
    price: 229,
    note: 'Sweet and tangy amla bites for a bright little pause.',
    pairsWith: 'The afternoon lull, long drives, the jar on the counter.',
  },
]
