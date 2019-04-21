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
		var tx_rows = [];
		if(res.data == "") {
			tx_rows = [];
		}
		else {
		    tx_rows = await Promise.all(res.data.map(async function(id,i) {

				let tx_row={};
				var tx = await this.arweave.transactions.get(id);
				tx_row['unixTime']="0";
				tx.get('tags').forEach(tag => {
				let key = tag.get('name', {decode: true, string: true});
				let value = tag.get('value', {decode: true, string: true});
				if(key==="Unix-Time") tx_row['unixTime']=value;

			});

			tx_row['id']=id;
			tx_row['tx_status'] = await this.arweave.transactions.getStatus(id);
			tx_row['from'] = await arweave.wallets.ownerToAddress(tx.owner);
			tx_row['td_fee'] = arweave.ar.winstonToAr(tx.reward);
			tx_row['td_qty'] = arweave.ar.winstonToAr(tx.quantity);

			return tx_row;
		}));

		}

		var mail_address = document.getElementById("mail_address");
		mail_address.innerHTML = address;

		var inbox_pane = document.getElementById("inbox_pane");
		while (inbox_pane.firstChild) {
			inbox_pane.removeChild(inbox_pane.firstChild);
		}

		tx_rows.sort((a,b)=>(Number(b.unixTime) - Number(a.unixTime)));

        inbox_pane.innerHTML="";
        tx_rows.forEach( function(item) {
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

            var tx_status = item.tx_status;
            td_from.innerHTML = item.from;
            td_fee.innerHTML = item.td_fee;
            td_qty.innerHTML = item.td_qty;

            link.innerHTML = item.id;
            link.onclick = function() { show_mail(item.id) };

            inbox_pane.appendChild(tr);
        });

	})();
}
