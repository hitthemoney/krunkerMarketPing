// this is the code which will be injected into a given page...

(function () {

	var aHolder = document.getElementById("aHolder");
	var pingHolder = document.createElement("div")

	pingHolder.textContent = `loading`;
	pingHolder.style = "color: #fff; position: absolute; bottom: 20px; font-size: 50px; left: 25px"
	pingHolder.id = "pingHolder"

	aHolder.appendChild(pingHolder)

	document.head.appendChild(document.createElement("script")).src = "https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js";

	function hook() {
		function displayPing(value) {
			document.getElementById("pingHolder").textContent = `Ping: ${value}ms`;
		}

		var hasRan = false;
		const send = WebSocket.prototype.send;
		window.WebSocket.prototype.send = function () {
			send.apply(this, arguments);

			if (!hasRan) {
				hasRan = true;
				this.addEventListener("message", (event) => {
					const packet = msgpack.decode(new Uint8Array(event.data));
					console.log(packet)
					switch(packet[0]) {
						case "pir": 
							displayPing(packet[1])
							break;
					}
				})
			}
		}
	}

	document.head.appendChild(document.createElement("script")).text = `(${hook.toString()})();`
})();