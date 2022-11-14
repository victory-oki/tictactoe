import { createSlice } from "@reduxjs/toolkit";
import { E_GAMEMODE, IGameData, IGameState, IPlayerData, IUpdateGameData } from "../gameModel";

const initialState: IGameState = {
    playerName: '',
    playerNo: 0,
    friendNo: 0,
    friendName: '',
    playerCharacter: '',
    friendCharacter: '',
    playerImage: undefined,
    friendImage: undefined,
    wins: 0,
    losses: 0,
    draws: 0,
    playCount: 0,
    gameGrid: '',
    gameMode: E_GAMEMODE.NORMAL,
    gridDimension:3,
    currentPlayLocation: []
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setPlayerName: (state, action) => {
            const payload = action.payload;
            state.playerName = payload;
        },
        initializeGame: (state, action: { payload: IGameData }) => {
            const players: IPlayerData[] = action.payload.playersData;
            players.forEach(element => {
                if (state.playerName === element.name) {
                    state.playerCharacter = element.character;
                    state.wins = element.wins;
                    state.losses = element.losses;
                    state.draws = element.draws;
                    state.playerNo = element.playerNo;
                    state.playerImage =  element.imageId;
                }
                else {
                    state.friendName = element.name;
                    state.friendCharacter = element.character;
                    state.friendNo = element.playerNo;
                    state.friendImage = element.imageId
                }
            });
            state.currentPlayLocation = action.payload.currentPlayLocation;
            state.playCount = action.payload.playCount;
            state.gameGrid = action.payload.gameGrid;
            state.gameMode = action.payload.gameMode;
            state.gridDimension = action.payload.gridDimension;
        },
        updateGame: (state, action: { payload: IUpdateGameData }) =>{
            const payload = action.payload
            if(payload.gameGrid){
                state.gameGrid = payload.gameGrid
            }
            state.playCount = payload.playCount
            state.currentPlayLocation = payload.playLocation;
        }
    }
})

export const { setPlayerName, initializeGame, updateGame } = gameSlice.actions;
export default gameSlice.reducer
