export interface Crypto {
  id: number
  name: string
  symbol: string
  website_slug: string
  rank: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  quotes: {
    USD: {
      price: number
      volume_24h: number
      market_cap: number
      percentage_change_1h: number
      percentage_change_24h: number
      percentage_change_7d: number
      percent_change_1h: number
      percent_change_24h: number
      percent_change_7d: number
    }
  }
  last_updated: number
}

export interface CryptoList {
  data: { [key: string]: Crypto }
}
