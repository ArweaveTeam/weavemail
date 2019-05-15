function login (files) {
    var fr = new FileReader()
    fr.onload = function (ev) {
        try {
            wallet = JSON.parse(ev.target.result)

            var params = new URLSearchParams(window.location.search);

            if(!params.has('to')) {
                refresh_inbox(wallet)
                switch_to_page('inbox_page')
            }
            else {
                var compose_address = document.getElementById('compose_address')
                compose_address.value = params.get('to')
                compose_mail()
            }

            setInterval(function () { refresh_inbox(wallet) }, 30000)
        } catch (err) {
            alert('Error logging in: ' + err)
        }
    }
    fr.readAsText(files[0])
}
