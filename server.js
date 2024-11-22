const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};


io.on('connection', (socket) => {
    console.log('Un giocatore si è connesso:', socket.id);


    socket.on('createRoom', (roomCode) => {
        rooms[roomCode] = { host: socket.id, players: [], numeriEstratti: [] };
        socket.join(roomCode);
        io.to(socket.id).emit('roomCreated', roomCode);
    });


    socket.on('joinRoom', (roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(socket.id).emit('roomJoined', roomCode);
        } else {
            io.to(socket.id).emit('error', 'Stanza non trovata');
        }
    });


    socket.on('estraiNumero', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].host === socket.id) {
            let numeroEstratto;
            do {
                numeroEstratto = Math.floor(Math.random() * 90) + 1;
            } while (rooms[roomCode].numeriEstratti.includes(numeroEstratto));
            
            rooms[roomCode].numeriEstratti.push(numeroEstratto);
            io.to(roomCode).emit('numeroEstratto', numeroEstratto);
        }
    });

    socket.on('disconnect', () => {
        console.log('Giocatore disconnesso:', socket.id);
		// NOTA: AGGIUNGI CODICE PER TOGLIERE DALLA STANZA IL GIOCATORE
    });
});


server.listen(3000, () => {
    console.log('Server avviato su http://localhost:3000');
});