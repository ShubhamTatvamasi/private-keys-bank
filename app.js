const Web3 = require('web3')
const contract = require('./contract')
const EthereumTx = require('ethereumjs-tx')
const EthereumUtil = require('ethereumjs-util')
const EthereumWallet = require('ethereumjs-wallet')
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"))
const myContract = new web3.eth.Contract(contract.abi, contract.address)

const PublicKey = "0xbe862AD9AbFe6f22BCb087716c7D89a26051f74C"
const PrivateKey = "0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109"

web3.eth.getTransactionCount(PublicKey, (error, result) => {

  var nonce = result
  setInterval(() => {

    const wallet = EthereumWallet.generate()
    const walletPrivateKeyBuff = wallet.privKey
    const publicKeyBuff = EthereumUtil.privateToAddress(walletPrivateKeyBuff)
    const publicKey = EthereumUtil.bufferToHex(publicKeyBuff)
    
    const privateKey = EthereumUtil.bufferToHex(walletPrivateKeyBuff)
    const publicKeyCheckSum = EthereumUtil.toChecksumAddress(publicKey)
    
    const data = myContract.methods.newKey(publicKeyCheckSum, privateKey).encodeABI()
    
    const formatedPrivateKey = PrivateKey.substring(2);
    const privateKeyBuff = Buffer.from(formatedPrivateKey, 'hex')

    const txParams = {
      nonce: nonce,
      gasPrice: 1e9,
      gasLimit: 1e6,
      to: contract.address,
      value: 0,
      data: data
    }

    const tx = new EthereumTx(txParams)
    tx.sign(privateKeyBuff)
    const signedTX = "0x" + tx.serialize().toString('hex')
    
    web3.eth.sendSignedTransaction(signedTX, (error, result) => {
      console.log(result)
    })

    nonce++

  }, 1000)

})
