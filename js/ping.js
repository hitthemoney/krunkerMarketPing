this.socket = new WebSocket('wss://krunker_social.krunker.io/ws');

var pingEncoded = msgpack.serialize(["po", []]).buffer;

this.socket.onopen = () => {
    console.log('connected');
    pong();
}

this.socket.onmessage = async function (event) {
    var blob = event.data;
    var arrayBuffer = null;

    arrayBuffer = await new Response(blob).arrayBuffer();

    var data = msgpack.deserialize(arrayBuffer);

    if (data[0] == "pi") {
        pong();
    } else if (data[0] == "pir") {
        const ping = data[1][0]
        displayPing(ping);
    }
};

function pong() {
    this.socket.send(pingEncoded);
}

function displayPing(value) {
    document.getElementById("ping").textContent = `${value}ms`;
}