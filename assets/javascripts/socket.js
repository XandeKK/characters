class Socket {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8080');
        this.handler = {
            manhwa: this.manhwa.bind(this),
            get_characters: this.get_characters.bind(this),
            error: this.get_error,
            message: this.get_message
        };

        this.socket_event();
    }

    socket_event() {
        this.socket.onopen = () => {
            Alert.alert('Connected to server!');
            this.socket.send(JSON.stringify({
                type: 'manhwa'
            }));
        };

        this.socket.onmessage = (event) => {
            const json = JSON.parse(event.data);
            this.handler[json.type](json);
        };

        this.socket.onclose = () => {
            Alert.alert('Disconnected from server');
        };
    }

    manhwa(msg) {
        const parent = document.getElementById('manhwa');
        msg.manhwas.forEach(manhwa=> {
            const option = document.createElement('option');
            option.value = manhwa;
            option.textContent = manhwa;
            parent.appendChild(option);
        });

        parent.addEventListener('change', (evt)=> {
            this.socket.send(JSON.stringify({
                type: 'get_characters',
                manhwa: evt.target.value
            }));
        });
    }

    get_characters(msg) {
        const parent = document.getElementById('characters');
        parent.innerHTML = '';
        window.characters = [];
        if (msg.background_image) {
            window.background_image = msg.background_image;
            parent.style.backgroundImage = `url(${msg.background_image})`;
            parent.style.backgroundSize = '100% auto';
        }
        msg.characters.forEach(character=> {
            create_character(character, parent);
        });

        document.getElementById('add').addEventListener('click', evt=>{
            const character = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value
            };
            const file = document.getElementById('image').files[0];
            const reader = new FileReader();
            reader.onload = () => {
                character['image'] = reader.result;
                create_character(character, document.getElementById('characters'))
                this.socket.send(JSON.stringify({
                    type: 'update_manhwa',
                    manhwa: document.getElementById('manhwa').value,
                    characters: JSON.stringify(window.characters),
                    background_image: window.background_image || false
                }));
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('change').addEventListener('click', evt=> {
            const key = document.getElementById('key').value;
            const value = key === 'image' ? null : document.getElementById(key).value;
            const character_name = document.getElementById('change_name').value;
            change_character(character_name, key, value);
        });

        document.getElementById('delete').addEventListener('click', evt=> {
            const character_name = document.getElementById('change_name').value;
            delete_character(character_name);
        });

        document.getElementById('save_image').addEventListener('click', evt=> {
            html2canvas(document.querySelector("#characters")).then(canvas => {
                const dataUrl = canvas.toDataURL("image/jpeg");
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = document.getElementById('manhwa').value + '.jpg';
                link.click();
            });
        });

        document.getElementById('background').addEventListener('change', event => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                window.background_image = reader.result;
                parent.style.backgroundImage = `url(${reader.result})`;
                parent.style.backgroundSize = '100% auto';

                socket.socket.send(JSON.stringify({
                    type: 'update_manhwa',
                    manhwa: document.getElementById('manhwa').value,
                    characters: JSON.stringify(window.characters),
                    background_image: window.background_image || false
                }));
            };
            reader.readAsDataURL(file);
         });
    }

    get_error(msg) {
        Alert.alert(JSON.stringify(msg.message), 'danger');
    }

    get_message(msg) {
        Alert.alert(JSON.stringify(msg.message), 'info');
    }
}

function create_character(character, parent) {
    window.characters.push(character);
    const id = window.characters.length - 1;
    const main_div = document.createElement('div');
    main_div.id = 'main-' + id;
    main_div.className = 'flex gap-2 bg-white/[.95] rounded p-2 h-28 w-full';

    main_div.addEventListener('click', evt=> {
        main_div.className = 'hidden';
    });

    const img = document.createElement('img');
    img.className = 'w-24 h-24';
    img.id = 'image-' + id;
    img.src = character.image;
    main_div.appendChild(img);

    const secondary_div = document.createElement('div');
    main_div.appendChild(secondary_div);

    const name_p = document.createElement('p');
    name_p.id = 'name-' + id;
    name_p.className = 'text-xl';
    name_p.textContent = character.name;
    secondary_div.appendChild(name_p);

    const description_p = document.createElement('p');
    description_p.id = 'description-' + id;
    description_p.className = 'text-gray-600';
    description_p.textContent = character.description;
    secondary_div.appendChild(description_p);

    parent.appendChild(main_div);
}

function change_character(character_name, key, value=null) {
    const id = window.characters.findIndex(character=> character.name.toLowerCase().includes(character_name.toLowerCase()));
    if (id === -1) {
        Alert.alert("Not found", 'warning');
        return;
    }
    const character = window.characters[id];
    if (key === 'image') {
        const file = document.getElementById('image').files[0];
        const image = document.getElementById('image-' + id);
        const reader = new FileReader();
        reader.onload = () => {
            character[key] = reader.result;
            image.src = reader.result;
            socket.socket.send(JSON.stringify({
                type: 'update_manhwa',
                manhwa: document.getElementById('manhwa').value,
                characters: JSON.stringify(window.characters),
                background_image: window.background_image || false
            }));
        };
        reader.readAsDataURL(file);
    } else {
        character[key] = value;
        document.getElementById(key + '-' + id).textContent = value;
        socket.socket.send(JSON.stringify({
            type: 'update_manhwa',
            manhwa: document.getElementById('manhwa').value,
            characters: JSON.stringify(window.characters),
            background_image: window.background_image || false
        }));
    }
}

function delete_character(character_name) {
    const id = window.characters.findIndex(character=> character.name.toLowerCase().includes(character_name.toLowerCase()));
    window.characters.splice(id, 1);
    document.getElementById('main-' + id).remove();
    socket.socket.send(JSON.stringify({
        type: 'update_manhwa',
        manhwa: document.getElementById('manhwa').value,
        characters: JSON.stringify(window.characters),
        background_image: window.background_image || false
    }));
}

const socket = new Socket();