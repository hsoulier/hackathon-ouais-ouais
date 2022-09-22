export const onResize = () => {
  document.body.style.setProperty(
    "--vh",
    `${document.documentElement.clientHeight / 100}px`
  )
}

export const cleanUrlCryptoIcon = (slug: string): string => {
  if (slug === "binancecoin") return "binance-coin"
  if (slug === "polkadot") return "polkadot-new"
  return slug
}

export const getUrlCryptoIcon = (slug: string): string => {
  return `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/${cleanUrlCryptoIcon(
    slug
  )}.png`
}
