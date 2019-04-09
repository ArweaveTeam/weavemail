# Weavemail


## What is it?
Weavemail is a prototype decentralised email replacement, it runs on the [Arweave network](https://arweave.org) so your messages and the app itself are permanent and will always be available.

The Arweave Team built this as part of our internal hackathon -- check out our [Medium post](https://medium.com/arweave-updates/hackathon-showcase-part-2-9d792872935a) to see some of other cool things we built in a day or less.

You can try it out over at [weavemail.app](https://weavemail.app), you can also pick up a wallet and some free tokens at [tokens.arweave.org](http://tokens.arweave.org). Our weavemail address is `vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw`.

## How did we make it?

This project demonstrates usage of the [Arweave HTTP API](https://docs.arweave.org/developers/server/http-api) 💡, was built using [Arweave JS](https://github.com/ArweaveTeam/arweave-js) 🛠️, and published with [Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy) 🚀.


## How does it work?

Sending

1. Messages are encrypted with the recipients public key using [RSA-OAEP](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding). [crypto.js](https://github.com/ArweaveTeam/weavemail/blob/master/crypto.js)

2. After encrypting the message contents for the recipient, messages are packaged into an Arweave transaction, tagged, and submitted to the network. [compose.js](https://github.com/ArweaveTeam/weavemail/blob/master/compose.js)

Receiving

1. Arql is used to get your messages from the network. The query is asking for transactions that are a) addressed to you and b) tagged with `App-Name:permamail`. [inbox.js](https://github.com/ArweaveTeam/weavemail/blob/master/inbox.js)

2. When you click on a message to view it, the full transaction is pulled from the network and the contents is decrypted using your private key. [view.js](https://github.com/ArweaveTeam/weavemail/blob/master/view.js)

## Let us know what you think

You can chat with the team on our [Discord server](https://discord.gg/DjAFMJc), drop us an email at [team@arweave.org](mailto:team@arweave.org), or send us a weavemail! Our weavemail address is `vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw`.
