
const express = require('express')
const app = express()
const solana = require('@solana/web3.js')
const serum = require('@project-serum/common')

const rpcUrl = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com'
const connection = new solana.Connection(rpcUrl)
const provider = new serum.Provider(connection)

const mangoMint = new solana.PublicKey('MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac')
const treasuryTokens1 = new solana.PublicKey('Guiwem4qBivtkSFrxZAEfuthBz6YuWyCwS4G3fjBYu5Z')
const treasuryTokens2 = new solana.PublicKey('4apXu6Vg5Wx9vxrfZoXN8svCGgb45sho2FTEbjqytFbZ')
const treasuryTokens3 = new solana.PublicKey('3LtPNF23wLdSsrG9VMYRmXBfgfvtvywzsNtafC4T7sbn')

app.get('/total', async function (req, res) {
  const mintInfo = await serum.getMintInfo(provider, mangoMint)
  const totalSupply = parseInt(mintInfo.supply.toString()) / Math.pow(10, mintInfo.decimals)
  res.send(totalSupply.toString())
})

app.get('/circulating', async function (req, res) {
  const mintInfo = await serum.getMintInfo(provider, mangoMint)
  const totalSupply = parseInt(mintInfo.supply.toString()) / Math.pow(10, mintInfo.decimals)
  const treasuryInfo1 = await serum.getTokenAccount(provider, treasuryTokens1)
  const treasuryInfo2 = await serum.getTokenAccount(provider, treasuryTokens2)
  const treasuryInfo3 = await serum.getTokenAccount(provider, treasuryTokens3)
  const lockedSupply = (parseInt(treasuryInfo1.amount.toString()) + parseInt(treasuryInfo2.amount.toString()) + parseInt(treasuryInfo3.amount.toString())) / Math.pow(10, mintInfo.decimals)
  const circulatingSupply = totalSupply - lockedSupply
  res.send(circulatingSupply.toString())
})

app.listen(process.env.PORT || 3000)
