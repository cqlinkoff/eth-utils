# eth-utils

utils for native ETH wallet

## Install

```bash
npm i @cqlinkoff/eth-utils
```

## API

- `personalSign`

  - `params`:

    - `msg`: 待签名消息

  - `return`

    - `sig`: 签名

* `recoverPersonalSignature`

  - `params`:

    - `msg`: 消息
    - `sig`: 签名

  - `return`

    - `addr`: 签名地址
