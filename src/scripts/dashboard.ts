import { ethers } from "ethers"
import binanceAccount from "../../assets/json/binance.json"
import { Crypto, CryptoList } from "../types"
import { getUrlCryptoIcon } from "./utils"
import { drawGraphs } from "./graph"
import User from "./User"
import "../style/main.scss"

let userMetaMask: User
const provider = new ethers.providers.Web3Provider(window.ethereum)

// HTMLElements
const $dashboardContent = document.querySelector("#dashboard [data-content]")!
const $tabLinks = document.querySelectorAll(".menu-item")!
const $templateCardCrypto =
  document.querySelector<HTMLTemplateElement>("#card-crypto")!
const $templateFormWallet =
  document.querySelector<HTMLTemplateElement>("#form-wallet")!
const $templateWallet =
  document.querySelector<HTMLTemplateElement>("#personal-wallet")!

const $templateBank =
  document.querySelector<HTMLTemplateElement>("#bank-infos")!

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

// TODO: Button to create a transaction (Look Ethers doc (IN TEST MODE))
// ? Inspi -> https://dribbble.com/shots/19195227-Cybersecurity-platform-dashboard
const getPersonnalWallet = async () => {
  const value = await userMetaMask.getWallet()
  const history = await userMetaMask.getTransactions()
  const { balances } = binanceAccount

  document
    .querySelector("[data-container]")!
    .removeChild(document.querySelector("form")!)
  const $container = document.querySelector("[data-container=personal-wallet]")!
  const clone = document.importNode($templateWallet.content, true)

  console.log(clone.querySelector(".wallet__value"))
  clone.querySelector("h2")!.textContent = value + " ETH"
  const $transactionsElement = clone.querySelector(".wallet__transactions")!
  history.forEach(({ from, to, value, timestamp }) => {
    $transactionsElement.insertAdjacentHTML(
      "beforeend",
      `<tr>
    <td class="pt-3 px-2"><span>${from}</span></td>
    <td class="pt-3 px-2"><span>${to}</span></td>
    <td class="pt-3 px-2 text-center">${ethers.utils.formatEther(
      value
    )} ETH</td>
    <td class="pt-3 px-2">${new Date(
      (timestamp as number) * 1000
    ).toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}</td>
    </tr>`
    )
  })
  $container.appendChild(clone)
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

const displayBankInfos = () => {
  const $container = document.createElement("div")
  const $title = document.createElement("h1")
  $title.textContent = "Bank infos"
  $container.appendChild($title)
  $container.dataset.container = "bank-infos"
  const clone = document.importNode($templateBank.content, true)
  $container.appendChild(clone)
  $dashboardContent.appendChild($container)
  drawGraphs()
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
      case 2:
        // getPersonnalWallet().then(() =>
        displayBankInfos()
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
