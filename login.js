function login (files) {
    var fr = new FileReader()
    fr.onload = function (ev) {
        try {
            wallet = JSON.parse(ev.target.result)

            refresh_inbox(wallet)
            switch_to_page('inbox_page')

            setInterval(function () { refresh_inbox(wallet) }, 30000)
        } catch (err) {
            alert('Error logging in: ' + err)
        }
    }
    fr.readAsText(files[0])
}
