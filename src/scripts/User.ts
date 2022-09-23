import { ethers } from "ethers"

export default class {
  provider: ethers.providers.BaseProvider
  address: string
  constructor(provider: ethers.providers.BaseProvider, address: string) {
    this.provider = provider
    this.address = address
  }

  async getWallet() {
    try {
      const balance = await this.provider.getBalance(this.address)
      const balanceInEth = ethers.utils.formatEther(balance)
      return balanceInEth
    } catch (error) {
      console.error(error)
      return "0"
    }
  }

  async getTransactions() {
    try {
      let provider = new ethers.providers.EtherscanProvider()
      let history = await provider.getHistory(this.address)
      history.forEach(({ from, to, value }) => {
        console.log(
          `from: ${from}, to: ${to}, value: ${ethers.utils.formatEther(
            value
          )} ETH`
        )
      })
      return history
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
