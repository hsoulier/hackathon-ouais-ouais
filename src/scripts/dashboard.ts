import { ethers } from "ethers"
import { Crypto, CryptoList } from "../types"
import { getUrlCryptoIcon } from "./utils"

// import jsonAccount from "../../assets/json/myAccount.json"
import binanceAccount from "../../assets/json/binance.json"
import User from "./User"

let userMetaMask: User
const provider = new ethers.providers.Web3Provider(window.ethereum)

// HTMLElements
const $dashboardContent = document.querySelector("#dashboard [data-content]")!
const $tabLinks = document.querySelectorAll(".menu-item")!
const $templateCardCrypto =
  document.querySelector<HTMLTemplateElement>("#card-crypto")!
const $templateFormWallet =
  document.querySelector<HTMLTemplateElement>("#form-wallet")!

const url = "https://api.alternative.me/v2/ticker/"

const getCryptoStock = async (): Promise<Crypto[]> => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(response.statusText)
    const data = (await response.json()) as CryptoList
    return Object.values(data.data)
      .sort((a, b) => (a.rank > b.rank ? 1 : -1))
      .slice(0, 9)
  } catch (error) {
    console.error(error)
    return []
  }
}
const displayCryptoStock = (data: Crypto[]) => {
  const $container = document.createElement("div")

  const $title = document.createElement("h1")
  $title.textContent = "Stock Crypto Market"
  $container.appendChild($title)
  $container.dataset.container = "crypto-stock"
  data.map((crypto) => {
    const clone = document.importNode($templateCardCrypto.content, true)
    clone.querySelector("h2")!.textContent = crypto.name
    // https://github.com/ErikThiart/cryptocurrency-icons
    clone.querySelector<HTMLImageElement>(".card__global-infos img")!.src =
      getUrlCryptoIcon(crypto.website_slug)
    if (crypto.symbol)
      clone.querySelector(".card__name span")!.textContent = crypto.symbol
    clone.querySelector(".card__price")!.textContent =
      "$ " + crypto.quotes.USD.price.toString()
    clone.querySelector(".card__variation p")!.textContent =
      crypto.quotes.USD.percent_change_24h.toFixed(2) + "%"
    $container.appendChild(clone)
  })
  $dashboardContent.appendChild($container)
}

const getPersonnalWallet = async () => {
  const value = await userMetaMask.getWallet()
  const history = await userMetaMask.getTransactions()
  const { balances } = binanceAccount

  return { value, history, balances }
}

const displayPersonnalWallet = () => {
  const $container = document.createElement("div")
  const $title = document.createElement("h1")
  $title.textContent = "Personal Wallet"
  $container.appendChild($title)
  $container.dataset.container = "personal-wallet"
  const clone = document.importNode($templateFormWallet.content, true)
  $container.appendChild(clone)
  $dashboardContent.appendChild($container)
  document
    .querySelector("form")!
    .addEventListener("submit", async (e: SubmitEvent) => {
      e.preventDefault()
      const address = document.querySelector("input")!.value
      if (provider) {
        userMetaMask = new User(provider, address)
        getPersonnalWallet()
      } else {
        console.log("Please install MetaMask!")
      }
    })
}

$tabLinks.forEach(($link, index) => {
  $link.addEventListener("click", () => {
    $tabLinks.forEach(($inactiveLink, indexToKeep) => {
      indexToKeep !== index && $inactiveLink.classList.remove("active")
    })
    $link.classList.add("active")
    const $elementToRemove = $dashboardContent.children[0]
    $elementToRemove && $dashboardContent.removeChild($elementToRemove)
    switch (index) {
      case 0:
        setTimeout(() => {
          getCryptoStock().then((cryptoData) => displayCryptoStock(cryptoData))
        }, 300)
        break
      case 1:
        // getPersonnalWallet().then(() =>
        displayPersonnalWallet()
        break
      default:
        break
    }
    if (index === 0) {
    }
  })
})

const App = async () => {
  const cryptoData = await getCryptoStock()
  displayCryptoStock(cryptoData)
}

App()
