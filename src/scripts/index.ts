import "../style/main.scss"
import { onResize } from "./utils"
import { Cursor } from "./utils/Cursor"
import { ethers } from "ethers"
import User from "./User"

const provider = new ethers.providers.Web3Provider(window.ethereum)

class App {
  constructor() {
    window.addEventListener("resize", onResize)
    onResize()
    window.addEventListener("load", () => {
      new Cursor()
    })
    document
      .querySelector("form")!
      .addEventListener("submit", async (e: SubmitEvent) => {
        e.preventDefault()
        const address = document.querySelector("input")!.value
        if (provider) {
          const userMetaMask = new User(provider, address)
          await userMetaMask.getWallet()
          await userMetaMask.getTransactions()
        } else {
          console.log("Please install MetaMask!")
        }
      })
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new App()
})
