const roomsCache = new Map();

exports.handleJoinEvent = async (io, client, data)=>{
    const rooms = io.sockets.adapter.rooms;
    data.room = data.room? data.room : generateUnusedUID();
    // CHECK IF CLIENT TRIES TO JOIN A ROOM THAT EXIST
    if(data.actionType === 'JOIN' && !rooms.has(data.room) && !roomsCache.has(data.room)){
        io.to(client.id).emit('error', {message: "Couldn't join room because it does not exist"});
        return
    }
    const roomUsers = await io.in(`${data.room}`).fetchSockets();
    let roomUsersCount = roomUsers.length;
    if(roomUsersCount === 2){
        io.to(client.id).emit('error', {message: "Can't Join room cause room is full"});
        return;
    }
    if(roomUsers.findIndex(user=>user.data.username === data.username) !== -1){
        io.to(client.id).emit('error', {message: "This Username is already used by your friend please use another username"});
        return;
    }
    else if(roomsCache.has(data.room)){
        const existingRoom = roomsCache.get(data.room);
        if(!existingRoom.playersData.some(player=>player.name === data.username)){
            io.to(client.id).emit('error', {message: "To enter already Exisiting room please input correct username"});
            return;
        }
    }
    client.join(data.room);
    roomUsersCount += 1;
    client.data.username = data.username;
    if(roomUsersCount < 2){
        if(data.actionType === 'CREATE'){
            io.to(client.id).emit('create_success', {roomId: data.room});
        }
        if(data.actionType === 'JOIN'){
            io.to(client.id).emit('join_success', {roomId: data.room});
        }
    }
    else{
        startGame(io, data);
    }
}

exports.handleGameCheckEvent = (io, client, roomId)=>{
    if(roomsCache.has(roomId)){
        io.to(client.id).emit('game_check_success', roomsCache.get(roomId));
    }
    else{
        io.to(client.id).emit('game_check_failed', `Game doesn't exist or has expired`);
    }
}

exports.handleGameUpdateEvent = (io, client, {roomId, playCount, playLocation})=>{
    const existingRoom = roomsCache.get(roomId);
    existingRoom.playCount = playCount ?? 0;
    const [row,col] = playLocation;
    const character = playCount % 2 === 0? 'O' : 'X';
    const newGrid = JSON.parse(existingRoom.gameGrid);
    newGrid[row][col] = character;
    existingRoom.gameGrid = JSON.stringify(newGrid);
    existingRoom.currentPlayLocation = playLocation;
    roomsCache.set(roomId, existingRoom);
    io.in(roomId).emit('game_update', {gameGrid:existingRoom.gameGrid,playCount,playLocation});
}

exports.handlePlayAgainEvent = (io, client, {roomId,isDraw,winCharacter = ''})=>{
    const existingRoom = roomsCache.get(roomId);
    updatePlayerStats(existingRoom, {isDraw, winCharacter});
    const grid = new Array(3).fill(new Array(3).fill(null))
    existingRoom.playCount = 0;
    existingRoom.currentPlayLocation= [];
    existingRoom.gameGrid= JSON.stringify(grid);
    roomsCache.set(roomId, existingRoom);
    restartGame(roomId);
    io.in(roomId).emit('game_restart_again', roomsCache.get(roomId));
}


exports.handleSettingsUpdate = (io, client, {roomId, playerNo, playerCharacter, gameMode, isDraw, winCharacter})=>{
    //UPDATE ROOM BASED ON ROOMID
    const existingRoom = roomsCache.get(roomId);
    updatePlayerStats(existingRoom,{isDraw, winCharacter});
    console.log(existingRoom);
    existingRoom.playersData.forEach(player => {
        if(player.playerNo === playerNo){
            player.character = playerCharacter;
        }
        else{
            player.character = playerCharacter === 'X'? 'O' : 'X';
        }
    });
    existingRoom.gameMode = gameMode;
    //UPDATE ROOMCACHE WITH NEW SETTINGS
    roomsCache.set(roomId, existingRoom);
    //TRIGGER GAME RESTART
    restartGame(roomId);
    io.in(roomId).emit('settings_changed', roomsCache.get(roomId));
}

function updatePlayerStats(existingRoom, data){
    const {isDraw, winCharacter} =  data;
    existingRoom.playersData.forEach(player => {
        if(isDraw){
            player.draws += 1;
        }
        else if(winCharacter){
            if(player.character === winCharacter){
                player.wins += 1;
            }
            else{
                player.losses += 1
            }
        }
    });
}


exports.handleSettingsUpdate = (io, client, {roomId, playerNo, playerCharacter, gameMode, gridDimension})=>{
    //UPDATE ROOM BASED ON ROOMID
    const existingRoom = roomsCache.get(roomId);
    existingRoom.playersData.forEach(player => {
        if(player.playerNo === playerNo){
            player.character = playerCharacter
        }
        else{
            player.character = playerCharacter === 'X'? 'O' : 'X'
        }
    });
    existingRoom.gameMode = gameMode ?? 'NORMAL';
    existingRoom.gridDimension = gridDimension ?? 3;
    //UPDATE ROOMCACHE WITH NEW SETTINGS
    roomsCache.set(roomId, existingRoom);
    //TRIGGER GAME RESTART
    restartGame(roomId);
    io.in(roomId).emit('settings_changed', roomsCache.get(roomId));
}

function generateNewGameData(roomUsers, gridDimension = 3){
    const grid = new Array(gridDimension).fill(new Array(gridDimension).fill(null))
    const [imageIdOne, imageIdTwo] = generateTwoRandomNumbers();
    const gameData = {
        playersData:[{
            name: roomUsers[0].data.username,
            playerNo: 1,
            character: 'X',
            wins: 0,
            losses: 0,
            draws: 0,
            imageId: imageIdOne
        },
        {
            name: roomUsers[1].data.username,
            playerNo: 2,
            character: 'O',
            wins: 0,
            losses: 0,
            draws: 0,
            imageId: imageIdTwo
        }],
        gameMode: 'NORMAL',
        playCount: 0,
        currentPlayLocation: [],
        gridDimension,
        gameGrid: JSON.stringify(grid)
    }
    return gameData
}
function generateUnusedUID(){
    let uid = '';
    do{
        uid = generateUID();
    }while(roomsCache.has(uid));
    return uid;
}
function generateTwoRandomNumbers(){
    const firstRandomNumber = Math.floor(Math.random() * 10) + 1;
    let secondRandomNumber  = firstRandomNumber;
    do{
        secondRandomNumber = Math.floor(Math.random() * 10) + 1;
    }while(firstRandomNumber === secondRandomNumber);

    return [firstRandomNumber, secondRandomNumber]
}

async function startGame(io, {room}){
    const roomUsers = await io.in(`${room}`).fetchSockets();
    const gameExists = roomsCache.has(room)
    const gameData = gameExists? roomsCache.get(room) : generateNewGameData(roomUsers);
    roomsCache.set(room, gameData);
    io.in(room).emit('game_start', gameData);
}

function restartGame(roomId){
    const existingRoom = roomsCache.get(roomId);
    const grid = new Array(existingRoom.gridDimension).fill(new Array(existingRoom.gridDimension).fill(null))
    existingRoom.playCount = 0;
    existingRoom.currentPlayLocation= [];
    existingRoom.gameGrid= JSON.stringify(grid);
    roomsCache.set(roomId, existingRoom);
}

function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    let firstPartStr = ("000" + firstPart.toString(36)).slice(-3);
    let secondPartStr = ("000" + secondPart.toString(36)).slice(-3);
    return (firstPartStr + secondPartStr).toLocaleUpperCase();
}
