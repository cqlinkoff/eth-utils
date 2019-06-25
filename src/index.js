import WKBridge from '@cqlinkoff/wk-bridge'
import {
  fromSigned,
  bufferToInt,
  toUnsigned,
  stripHexPrefix,
  intToHex,
  addHexPrefix,
  toBuffer,
  fromRpcSig,
  ecrecover,
  hashPersonalMessage,
  ecsign,
  bufferToHex,
  publicToAddress
} from 'ethereumjs-util'

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
  const rSig = fromSigned(r)
  const sSig = fromSigned(s)
  const vSig = bufferToInt(v)
  const rStr = padWithZeroes(toUnsigned(rSig).toString('hex'), 64)
  const sStr = padWithZeroes(toUnsigned(sSig).toString('hex'), 64)
  const vStr = stripHexPrefix(intToHex(vSig))
  return addHexPrefix(rStr.concat(sStr, vStr)).toString('hex')
}

export const recoverPublicKey = (hash, sig) => {
  const signature = toBuffer(sig)
  const sigParams = fromRpcSig(signature)
  return ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
}

export const getPublicKeyFor = msgParams => {
  const message = toBuffer(msgParams.data)
  const msgHash = hashPersonalMessage(message)
  return recoverPublicKey(msgHash, msgParams.sig)
}

export const personalSign = (privateKey, msg) => {
  const message = toBuffer(msg)
  const msgHash = hashPersonalMessage(message)
  const sig = ecsign(msgHash, Buffer.from(privateKey, 'hex'))
  const serialized = bufferToHex(concatSig(sig.v, sig.r, sig.s))
  if (typeof bridge.postMessage === 'function') {
    bridge.postMessage('setPersonalSignResult', serialized)
  }
  return serialized
}

export const recoverPersonalSignature = msgParams => {
  const publicKey = getPublicKeyFor(msgParams)
  const sender = publicToAddress(publicKey)
  const senderHex = bufferToHex(sender)
  return senderHex
}

window.personalSign = personalSign
