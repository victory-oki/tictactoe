const app = require('express')();
const server = require('http').Server(app);
const cors = require('cors');
const socketController = require('./controllers/socketController');
app.use(cors());

const io = require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ['GET', 'POST']
    }
  });

const port = 3001;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

io.sockets.on('connection', async (client) => {
    console.log(`user connected: ${client.id}`);

    client.on('join', async data=>socketController.handleJoinEvent(io, client,data));

    client.on('game_check', (data)=>socketController.handleGameCheckEvent(io, client, data))

    client.on('game_update',(data)=>socketController.handleGameUpdateEvent(io, client, data))

    client.on('settings_update', (data)=>socketController.handleSettingsUpdate(io, client, data))
    client.on('play_again',(data)=>socketController.handlePlayAgainEvent(io, client, data))
})
