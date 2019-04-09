function show_mail(txid) {
	(async () => {
		switch_to_page("view_page");

		var mail_id = document.getElementById("view_title");
		var view_contents = document.getElementById("view_contents");
		var reply = document.getElementById("reply");

		mail_id.textContent = txid;

		var tx = await arweave.transactions.get(txid);

		var key = await wallet_to_key(wallet);

		reply.onclick = async function() {
			var recipient = document.getElementById("compose_address");
			recipient.value = await arweave.wallets.ownerToAddress(tx.owner);
			switch_to_page("compose_page");
		};

		var mail =
			arweave.utils.bufferToString(
				await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key));

		mail = mail.replace(/(?:\r\n|\r|\n)/g, '<br>');

		view_contents.innerHTML = mail;
	})();
}
