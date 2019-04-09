function refresh_inbox(wallet) {
	(async () => {
		var address = await arweave.wallets.jwkToAddress(wallet);

		let query = 
			{
				op: "and",
				expr1:
					{
					  op: "equals",
					  expr1: "to",
					  expr2: address
					},
				expr2:
					{
					  op: "equals",
					  expr1: "App-Name",
					  expr2: "permamail"
					}
			};

    	const res = await this.arweave.api.post(`arql`, query);
		if(res.data == "") {
			var mail_ids = [];
		}
		else {
			var mail_ids = res.data;
		}

		console.log(mail_ids);

		var mail_address = document.getElementById("mail_address");
		mail_address.innerHTML = address;

		var inbox_pane = document.getElementById("inbox_pane");

		while (inbox_pane.firstChild) {
			inbox_pane.removeChild(inbox_pane.firstChild);
		}

		mail_ids.forEach(async function(id) {
			var tr = document.createElement("tr");
			var td_name = document.createElement("td");
			var td_from = document.createElement("td");
			var td_fee = document.createElement("td");
			var td_qty = document.createElement("td");
			var link = document.createElement("a");
			tr.appendChild(td_from);
			tr.appendChild(td_name);
			tr.appendChild(td_fee);
			tr.appendChild(td_qty);
			td_name.appendChild(link);

			var tx = await this.arweave.transactions.get(id);
			var tx_status = await this.arweave.transactions.getStatus(id);
			td_from.innerHTML = await arweave.wallets.ownerToAddress(tx.owner);
			td_fee.innerHTML = arweave.ar.winstonToAr(tx.reward);
			td_qty.innerHTML = arweave.ar.winstonToAr(tx.quantity);

			link.innerHTML = id;
			link.onclick = function() { show_mail(id) };

			inbox_pane.appendChild(tr);
		});

	})();
}


