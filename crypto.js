async function encrypt_mail (content,subject, pub_key) {
    var content_encoder = new TextEncoder()
    var newFormat=JSON.stringify({"subject":subject,"body":content})
    var mail_buf = content_encoder.encode(newFormat)
    var key_buf = await generate_random_bytes(256)

    // Encrypt data segments
    var encrypted_mail =
		await arweave.crypto.encrypt(mail_buf, key_buf)
    var encrypted_key =
		await window.crypto.subtle.encrypt(
		    {
		        name: 'RSA-OAEP'
		    },
		    pub_key,
		    key_buf
		)

    // Concatenate and return them
    return arweave.utils.concatBuffers([encrypted_key, encrypted_mail])
}

async function decrypt_mail (enc_data, key) {
    var enc_key = new Uint8Array(enc_data.slice(0, 512))
    var enc_mail = new Uint8Array(enc_data.slice(512))

    var symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, enc_key)

    return arweave.crypto.decrypt(enc_mail, symmetric_key)
}

async function wallet_to_key (wallet) {
    var w = Object.create(wallet)
    w.alg = 'RSA-OAEP-256'
    w.ext = true

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

    return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
}

async function get_public_key (address) {
    var txid = await arweave.wallets.getLastTransactionID(address)

    if (txid == '') {
        return undefined
    }

    var tx = await arweave.transactions.get(txid)

    if (tx == undefined) {
        return undefined
    }

    var pub_key = arweave.utils.b64UrlToBuffer(tx.owner)

    var keyData = {
        kty: 'RSA',
        e: 'AQAB',
        n: tx.owner,
        alg: 'RSA-OAEP-256',
        ext: true
    }

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

    return await crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt'])
}

async function generate_random_bytes (length) {
    var array = new Uint8Array(length)
    window.crypto.getRandomValues(array)

    return array
}
