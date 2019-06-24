import WKBridge from '@cqlinkoff/wk-bridge'
import ethUtil from 'ethereumjs-util'

const bridge = new WKBridge({
  namespace: 'ethUtils'
})

export const padWithZeroes = (number, length) => {
  var myString = '' + number
  while (myString.length < length) {
    myString = '0' + myString
  }
  return myString
}

export const concatSig = (v, r, s) => {
  const rSig = ethUtil.fromSigned(r)
  const sSig = ethUtil.fromSigned(s)
  const vSig = ethUtil.bufferToInt(v)
  const rStr = padWithZeroes(ethUtil.toUnsigned(rSig).toString('hex'), 64)
  const sStr = padWithZeroes(ethUtil.toUnsigned(sSig).toString('hex'), 64)
  const vStr = ethUtil.stripHexPrefix(ethUtil.intToHex(vSig))
  return ethUtil.addHexPrefix(rStr.concat(sStr, vStr)).toString('hex')
}

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
  const serialized = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s))
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
