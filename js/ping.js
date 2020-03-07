var ctx = document.getElementById('myChart').getContext('2d');

var chart = new Chart(ctx, {
	type: 'line',

	data: {
		labels: [ 'Ping', 'Ping', 'Ping', 'Ping', 'Ping', 'Ping' ], //ignore that lmao
		datasets: [
			{
				backgroundColor: 'rgb(25, 25, 25)',
				borderColor: 'rgb(241, 241, 241)',
				data: [ 0, 0, 0, 0, 0, 0 ]
			}
		]
	},

	options: {
		layout: {
			padding: {
				top: 15
			}
		},
		legend: { display: false },
		scales: {
			xAxes: [
				{
					display: false
				}
			],
			yAxes: [
				{
					ticks: {
						fontFamily: 'gamefont',
						fontSize: 10,
						beginAtZero: true
					}
				}
			]
		}
	}
});

this.socket = new WebSocket('wss://krunker_social.krunker.io/ws');

var pingEncoded = msgpack.serialize([ 'po', [] ]).buffer;

this.socket.onopen = () => {
	console.log('connected');
	pong();
};

this.socket.onmessage = async function(event) {
	var blob = event.data;
	var arrayBuffer = null;

	arrayBuffer = await new Response(blob).arrayBuffer();

	var data = msgpack.deserialize(arrayBuffer);

	if (data[0] == 'pi') {
		pong();
	} else if (data[0] == 'pir') {
		const ping = data[1][0];
		displayPing(ping);
	}
};

function pong() {
	this.socket.send(pingEncoded);
}

function displayPing(value) {
	document.getElementById('ping').textContent = `${value}ms`;
	add(value);
}

function add(data) {
	chart.data.datasets.forEach((dataset) => {
		dataset.data.shift();
		dataset.data.push(data);
	});
	chart.update();
}
