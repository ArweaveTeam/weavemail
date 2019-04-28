function compose_mail () {
    switch_to_page('compose_page')
}

function send_mail () {
    (async () => {
        var compose_address = document.getElementById('compose_address')
        var address = compose_address.value
        var compose_content = document.getElementById('compose_content')
        var content = compose_content.value
        var compose_tokens = document.getElementById('compose_tokens')
        var tokens = compose_tokens.value
        var mailTagUnixTime = Math.round((new Date()).getTime() / 1000)

        if (tokens == '') {
            tokens = '0'
        }
        tokens = arweave.ar.arToWinston(tokens)

        var pub_key = await get_public_key(address)

        if (pub_key == undefined) {
            alert('Recipient has to send a transaction to the network, first!')
            return
        }

        content = await encrypt_mail(content, pub_key)
        console.log(content)

        var tx =
			await arweave.createTransaction(
			    {
			        target: address,
			        data: arweave.utils.concatBuffers([content]),
			        quantity: tokens
			    },
			    wallet
			)

        tx.addTag('App-Name', 'permamail')
        tx.addTag('App-Version', '0.0.2')
        tx.addTag('Unix-Time', mailTagUnixTime)
        await arweave.transactions.sign(tx, wallet)
        console.log(tx.id)
        await arweave.transactions.post(tx)
        alert('Mail dispatched!')

        switch_to_page('inbox_page')
    })()
}
