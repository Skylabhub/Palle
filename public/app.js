const socket = io();

let isHost = false;
let numeriEstratti = [];


function showScreen(screenId) {
    document.getElementById('homeScreen').style.display = screenId === 'homeScreen' ? 'block' : 'none';
    document.getElementById('gameScreen').style.display = screenId === 'gameScreen' ? 'block' : 'none';
}


function createRoom() {
    const roomCode = document.getElementById('roomCode').value;
    socket.emit('createRoom', roomCode);
    isHost = true;
    showScreen('gameScreen');
    document.getElementById('tombolone').style.display = 'grid';
    document.getElementById('cartella').style.display = 'none';
    document.getElementById('hostControls').style.display = 'block';
    generateTombolone();
}


function joinRoom() {
    const roomCode = document.getElementById('roomCode').value;
    socket.emit('joinRoom', roomCode);
    isHost = false;
    showScreen('gameScreen');
    document.getElementById('tombolone').style.display = 'none';
    document.getElementById('cartella').style.display = 'grid';
    document.getElementById('hostControls').style.display = 'none';
    generateCartella();
}


function estraiNumero() {
    const roomCode = document.getElementById('roomCode').value;
    socket.emit('estraiNumero', roomCode);
}

socket.on('numeroEstratto', (numero) => {
    numeriEstratti.push(numero);
    markTombolone(numero);
    markCartella(numero);
});


function generateTombolone() {
    const tomboloneContainer = document.getElementById('tombolone');
    tomboloneContainer.innerHTML = '';
    for (let i = 1; i <= 90; i++) {
        const numero = document.createElement('div');
        numero.classList.add('tombolone-numero');
        numero.textContent = i;
        tomboloneContainer.appendChild(numero);
    }
}


function markTombolone(numero) {
    const allNumbers = document.querySelectorAll('.tombolone-numero');
    allNumbers.forEach(num => {
        if (parseInt(num.textContent) === numero) {
            num.classList.add('checked');
        }
    });
}


function generateCartella() {
    const cartellaContainer = document.getElementById('cartella');
    cartellaContainer.innerHTML = '';
    let numbers = [];
    while (numbers.length < 15) {
        const randomNum = Math.floor(Math.random() * 90) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }
    numbers.sort((a, b) => a - b);
    numbers.forEach(num => {
        const numero = document.createElement('div');
        numero.textContent = num;
        cartellaContainer.appendChild(numero);
    });
}


function markCartella(numero) {
    const cartellaNumbers = document.querySelectorAll('#cartella div');
    cartellaNumbers.forEach(num => {
        if (parseInt(num.textContent) === numero) {
            num.classList.add('checked');
        }
    });
}


function endGame() {
    showScreen('homeScreen');
    document.getElementById('roomCode').value = '';
    document.getElementById('numeriEstratti').textContent = '';
    numeriEstratti = [];
}