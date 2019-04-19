function show_mail(txid) {
	(async () => {
		switch_to_page("view_page");

		var mail_id = document.getElementById("view_title");
		var view_contents = document.getElementById("view_contents");
		var reply = document.getElementById("reply");
		var previousSender= document.getElementById('previousSender');
		var previousMsg= document.getElementById('previousMsg');
		var previousDateMsg= document.getElementById('previousDateMsg');
		var unixTime="0";

		mail_id.textContent = txid;

		var tx = await arweave.transactions.get(txid);

		tx.get('tags').forEach(tag => {
		let key = tag.get('name', {decode: true, string: true});
		let value = tag.get('value', {decode: true, string: true});
		if(key==="UnixTime") unixTime=value;

		});

		var key = await wallet_to_key(wallet);

		reply.onclick = async function() {
			var recipient = document.getElementById("compose_address");
			recipient.value = await arweave.wallets.ownerToAddress(tx.owner);

			previousSender.innerHTML=recipient.value;
			previousDateMsg.innerHTML= timeConverter(unixTime);
			previousMsg.innerHTML=mail;

			switch_to_page("compose_page");
		};

		var mail =
			arweave.utils.bufferToString(
				await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key));

		mail = mail.replace(/(?:\r\n|\r|\n)/g, '<br>');

		view_contents.innerHTML = mail;


		function timeConverter(UNIX_timestamp){
  	var a = new Date(UNIX_timestamp * 1000);
  	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  	var year = a.getFullYear();
  	var month = months[a.getMonth()];
  	var date = a.getDate();
  	var hour = a.getHours();
  	var min = a.getMinutes();
  	var sec = a.getSeconds();
  	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  	return time;
		}
		
	})();
}
