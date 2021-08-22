function show_mail (txid) {
    (async () => {
        switch_to_page('view_page')

        var mail_id = document.getElementById('view_title')
        var view_contents = document.getElementById('view_contents')
        var view_subject = document.getElementById('view_subject')
        var reply = document.getElementById('reply')
        var previousSender = document.getElementById('previousSender')
        var previousMsg = document.getElementById('previousMsg')
        var previousDateMsg = document.getElementById('previousDateMsg')
        var previousDateTag = document.getElementById('previousDateTag')
        var previousSubject = document.getElementById('previousSubject')
        var previous_page = document.getElementById('previous_page')
        var unixTime = '0'

        var tx = await arweave.transactions.get(txid)

        tx.get('tags').forEach(tag => {
            let key = tag.get('name', { decode: true, string: true })
            let value = tag.get('value', { decode: true, string: true })
            if (key === 'Unix-Time') unixTime = value
        })

        var key = await wallet_to_key(wallet)

        reply.onclick = async function () {
            var recipient = document.getElementById('compose_address')
            recipient.value = await arweave.wallets.ownerToAddress(tx.owner)

            previousDateMsg.textContent = timeConverter(unixTime)
            previousSender.textContent = recipient.value
            previousMsg.textContent = mail.body
            previousSubject.textContent = mail.subject

            ;(unixTime === '0') ? previousDateTag.style.display = 'none' : previousDateTag.style.display = 'block'

            switch_to_page('compose_page')
            previous_page.style.display = 'block'
        }

        var mail = {};

        switch (tx.format) {
            case 1:
                mail = arweave.utils.bufferToString(
                    await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key))
                break;
            case 2:
                var data = await arweave.transactions.getData(txid)
                mail = await arweave.utils.bufferToString(
                    await decrypt_mail(arweave.utils.b64UrlToBuffer(data), key)
                )
                break;
            default:
                throw new Error(`Unexpected transaction format: ${tx.format}`);
        }

        try {
            mail = JSON.parse(mail);
        } catch (e) {} 

        // Upgrade old format.
        if (typeof mail === 'string') {
            mail = { 
                body: mail,
                subject: txid, 
            }
        }

        // Validate 
        if (typeof mail !== 'object' || typeof mail.body !== 'string' || typeof mail.subject !== 'string') {
            console.error(mail);
            throw new Error(`Unexpected mail format: ${mail}`);
        }
          
        view_contents.textContent = mail.body
        view_subject.textContent = mail.subject

        function timeConverter (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000)
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            var year = a.getFullYear()
            var month = months[a.getMonth()]
            var date = a.getDate()
            var hour = a.getHours()
            var min = a.getMinutes()
            var sec = a.getSeconds()
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
            return time
        }

    })()
}
