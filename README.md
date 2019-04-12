# Weavemail


## What is it?

Weavemail is a prototype decentralised email replacement. It runs on the [Arweave network](https://arweave.org), so its messages and the web app itself are _permanent_ and _always_ available on the permaweb.

The Arweave Team built this prototype implementation as part of a hackathon.

You can try it out over at [weavemail.app](https://weavemail.app). The domain proxies to an Arweave node, which can serve you the app. You can also pick up a wallet and some free tokens at [tokens.arweave.org](http://tokens.arweave.org). Our weavemail address is `vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw`.

## How is it built?

Weavemail uses the [Arweave HTTP API](https://docs.arweave.org/developers/server/http-api), [Arweave JS](https://github.com/ArweaveTeam/arweave-js) 🛠️, and published with [Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy).

You can launch a copy by installing [Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy) and running `arweave deploy permamail.html --key-file [PATH_TO_KEY] --package`. Once the transaction is mined into the block, you will be able to access it at the given TXID, at any Arweave HTTPS gateway.

## How does it work?

*Sending messages*

1. Messages are encrypted with the recipients public key using [RSA-OAEP](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding) and . [crypto.js](https://github.com/ArweaveTeam/weavemail/blob/master/crypto.js)

2. After encrypting the message contents for the recipient, messages are packaged into an Arweave transaction, tagged, and submitted to the network. [compose.js](https://github.com/ArweaveTeam/weavemail/blob/master/compose.js)

*Receiving messages*

1. ArQL is used to get your messages from the network. The query is asking for transactions that are a) addressed to you and b) tagged with `App-Name:permamail`. [inbox.js](https://github.com/ArweaveTeam/weavemail/blob/master/inbox.js)

2. When you click on a message to view it, the full transaction is pulled from the network and the contents is decrypted using your private key. [view.js](https://github.com/ArweaveTeam/weavemail/blob/master/view.js)

## Let us know what you think

You can chat with the team on our [Discord server](https://discord.gg/DjAFMJc), drop us an weavemail at `vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw` or an email to [team@arweave.org](mailto:team@arweave.org).
