import WKBridge from '@cqlinkoff/wk-bridge'
import ethUtil from 'ethereumjs-util'

const bridge = new WKBridge({
  namespace: 'ethUtils'
})

export const recoverPublicKey = (hash, sig) => {
  const signature = ethUtil.toBuffer(sig)
  const sigParams = ethUtil.fromRpcSig(signature)
  return ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
}

export const getPublicKeyFor = msgParams => {
  const message = ethUtil.toBuffer(msgParams.data)
  const msgHash = ethUtil.hashPersonalMessage(message)
  return recoverPublicKey(msgHash, msgParams.sig)
}

export const personalSign = (privateKey, msg) => {
  const message = ethUtil.toBuffer(msg)
  const msgHash = ethUtil.hashPersonalMessage(message)
  const sig = ethUtil.ecsign(msgHash, privateKey)
  const serialized = ethUtil.bufferToHex(this.concatSig(sig.v, sig.r, sig.s))
  bridge.postMessage('setPersonalSignResult', serialized)
  return serialized
}

export const recoverPersonalSignature = msgParams => {
  const publicKey = getPublicKeyFor(msgParams)
  const sender = ethUtil.publicToAddress(publicKey)
  const senderHex = ethUtil.bufferToHex(sender)
  return senderHex
}

window.personalSign = personalSign
