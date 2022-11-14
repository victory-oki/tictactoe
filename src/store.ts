import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './Game/gameSlice';
const reducers = {
    game: gameReducer
}

export const store = configureStore({reducer: reducers});
export type RootState = ReturnType<typeof store.getState>
