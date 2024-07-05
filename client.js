const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
	socket.on('message', (message) => {
		const msg = JSON.parse(message);
		if (msg.type === 'manhwa') {
			const data = {
				manhwas: get_json('/home/xande/Works/manhwas.json'),
				type: 'manhwa'
			}
			socket.send(JSON.stringify(data));
		} else if (msg.type === 'get_characters') {
			const json = get_json(`/home/xande/Works/json/${msg.manhwa}.json`);
			const data = {
				characters: json.characters || [],
				background_image: json.background_image,
				type: 'get_characters'
			}
			socket.send(JSON.stringify(data));
		} else if (msg.type === 'update_manhwa') {
			const data = {
				characters: JSON.parse(msg.characters),
				background_image: msg.background_image
			}
			fs.writeFileSync(`/home/xande/Works/json/${msg.manhwa}.json`, JSON.stringify(data));
			socket.send(JSON.stringify({
				type: 'message',
				message: 'file saved'
			}))
		}
	});

	socket.on('close', ()=> {
	});
});

function get_json(file) {
	if (fs.existsSync(file)) {
		const data = fs.readFileSync(file, 'utf8');
		return JSON.parse(data);
	} else {
		return undefined;
	}
}