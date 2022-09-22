import "../style/main.scss"
import { ethers } from "ethers"
import User from "./User"

const provider = new ethers.providers.Web3Provider(window.ethereum)

export const fetchWallet = async () => {
  document
    .querySelector("form")!
    .addEventListener("submit", async (e: SubmitEvent) => {
      e.preventDefault()
      const address = document.querySelector("input")!.value
      if (provider) {
        const userMetaMask = new User(provider, address)
        const value = await userMetaMask.getWallet()
        const history = await userMetaMask.getTransactions()
        return { history, value }
      } else {
        console.log("Please install MetaMask!")
        return {}
      }
    })
}
