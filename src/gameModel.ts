export interface IjoinObj {
    actionType: 'CREATE' | 'JOIN';
    username: string;
}

export interface IPlayerData {
    name: string,
    playerNo: number,
    character: E_GAMECHARACTER,
    wins: number,
    losses: number,
    draws: number,
    imageId: number
}

export interface IGameData {
    playersData: IPlayerData[]
    playCount: number,
    gridDimension: number,
    currentPlayLocation: number[],
    gameGrid: string,
    gameMode:E_GAMEMODE
}

export interface IUpdateGameData {
    playLocation: number[]
    playCount: number,
    gameGrid?: string,
    roomId?: string
}

export interface IPlayAgainData {
    roomId: string,
    isDraw: boolean,
    winCharacter: string
}

export interface IGameStats {
    xwins: number,
    owins: number,
    draws: number
}
export interface IGameState {
    playerName: string,
    playerNo: number,
    playerImage?: number,
    friendNo: number,
    friendName: string,
    friendImage?: number,
    playerCharacter: E_GAMECHARACTER | string
    friendCharacter: string,
    wins: number,
    losses: number,
    draws: number,
    playCount: number,
    gridDimension: number,
    gameGrid: string,
    gameMode: E_GAMEMODE,
    currentPlayLocation: number[]
}

export const enum GameStatus {
    InPlay = 'InPlay',
    Win = 'Win',
    Draw = 'Draw'
}

export type GridCol = string | null;

export interface IGameProps {
    gameStatus: GameStatus;
    msgStatus: string;
    winLocation: Set<string>;
    grid: GridCol[][],
    winCharacter: string
}

export const EVENTS = {
    CREATE_SUCCESS: 'create_success',
    JOIN_SUCCESS: 'join_success',
    JOIN: 'join',
    ERROR: 'error',
    GAME_START: 'game_start',
    PLAY_AGAIN: 'play_again',
    GAME_RESTART_AGAIN: 'game_restart_again',
    GAME_CHECK: 'game_check',
    GAME_CHECK_SUCCESS: 'game_check_success',
    GAME_CHECK_FAILED: 'game_check_failed',
    GAME_UPDATE: 'game_update',
    SETTINGS_UPDATE: 'settings_update',
    SETTINGS_CHANGED: 'settings_changed',
}

export interface IGameHooks {
    gameReady: boolean,
    isFullscreen: boolean,
    game: IGameProps,
    playerImage: number | undefined,
    playerNo: number,
    playerName: string,
    playerCharacter: string,
    friendImage: number | undefined,
    friendNo: number,
    friendName: string,
    friendCharacter: string,
    seconds: number,
    gameMode: E_GAMEMODE,
    gridDimension:number,
    wins: number,
    losses: number,
    draws: number,
    playCount: number,
    StatusIcon: { [key in GameStatus]: string },
    renderCharacterColor: (value: string) => string,
    canPlay: () => boolean,
    isWin: () => boolean,
    isDraw: () => boolean,
    isPlayLocation: (row: number, col: number) => boolean,
    isWinLocation: (row: number, col: number) => boolean,
    playTurn: (row: number, col: number) => void,
    playAgain: () => void,
    toggleFullScreen: () => void,
}


export const enum E_GAMEMODE {
    NORMAL = 'NORMAL',
    BLITZ = 'BLITZ'
}

export const enum E_GAMECHARACTER {
    X = 'X',
    O = 'O'
}
