import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Starter',
    price: 0,
    credits: 3,
    priceId: null,
  },
  PRO: {
    name: 'Pro',
    price: 49,
    credits: 50,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  AGENCY: {
    name: 'Agency',
    price: 149,
    credits: -1,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
  },
} as const
