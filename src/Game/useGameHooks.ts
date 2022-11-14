import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { EVENTS, E_GAMECHARACTER, E_GAMEMODE, GameStatus, GridCol, IGameData, IGameHooks, IGameProps, IGameStats, IPlayAgainData, IPlayerData, IUpdateGameData } from "../gameModel";
import { useToast } from "../notificationContext";
import { useSocket } from "../socketContext";
import { RootState } from "../store";
import { initializeGame, updateGame } from "./gameSlice";
import * as GameUtils from '../gameutils';
import { orange } from '../theme';
import useRandomHook from "./useRandomHook";
import { useAudio } from "../components/SoundPlayer/useAudioHooks";
import { defaultConfig } from "../components/SoundPlayer/SoundPlayer";

const useGameHooks = (): IGameHooks => {
  const gridInit: GridCol[][] = [[]];
  const GRID_DIMENSION = 3;
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(59);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [game, setGame] = useState<IGameProps>({
    gameStatus: GameStatus.InPlay,
    msgStatus: '',
    winLocation: new Set(),
    grid: gridInit,
    winCharacter: ''
  });
  const navigate: NavigateFunction = useNavigate();
  const { id: gameId } = useParams();
  const socket = useSocket();
  const dispatch = useDispatch();
  const toast = useToast();
  const {audio:playSound} = useAudio(require('../assets/sound2.wav'), defaultConfig);
  const {
    playerName,
    friendName,
    playerNo,
    friendNo,
    playerCharacter,
    friendCharacter,
    gameGrid,
    playCount,
    playerImage,
    friendImage,
    gameMode,
    wins,
    losses,
    draws,
    currentPlayLocation,
    gridDimension
  } = useSelector((store: RootState) => store.game);
  const { invalidateLocation, findRandomLocation, reBuildPlayLocation } = useRandomHook(gridDimension);
  useEffect(() => {
    setGameIfExist();
    setupSocketListeners();
    const fullScreenChangeHandler = ()=>{
      const isFullscreen = document.fullscreenElement? true: false;
      setIsFullscreen(isFullscreen);
    }
    document.addEventListener('fullscreenchange', fullScreenChangeHandler);
    return () => {
      destroyListeners();
      document.removeEventListener('fullscreenchange',fullScreenChangeHandler )
    }
  }, [gameId]);

  useEffect(() => {
    if (gameGrid) {
      let status = GameStatus.InPlay;
      let winCharacter = '';
      const newSet: Set<string> = new Set();
      const newGrid = JSON.parse(gameGrid);

      if (gameMode === E_GAMEMODE.BLITZ && currentPlayLocation.length > 0) {
        const [row, col] = currentPlayLocation;
        const index = row * GRID_DIMENSION + col
        invalidateLocation(index);
      }

      if (playCount > 2 && currentPlayLocation.length > 0) {
        const [row, col] = currentPlayLocation;
        const winLocation = getWinLocationIfExists(row, col, newGrid);
        if (winLocation.length > 0) {
          winCharacter = newGrid[winLocation[0][0]][winLocation[0][1]];
          winLocation.forEach(location => newSet.add(`${location[0]}${location[1]}`));
          status = GameStatus.Win;
          stopCountDown();
        }
        else if (playCount === Math.pow(gridDimension,2)) {
          status = GameStatus.Draw;
          stopCountDown();
        }
      }
      const game: IGameProps = {
        gameStatus: status,
        msgStatus: updateStatusMessage(status, winCharacter),
        winLocation: newSet,
        grid: newGrid,
        winCharacter
      }
      setGame(game);
    }
  }, [gameGrid, playerCharacter, gameMode]);
  useEffect(() => {
    if (playCount && gameMode === E_GAMEMODE.BLITZ && canPlay() && !isWin() && !isDraw()) {
      startCountDown();
    }
    else {
      stopCountDown();
    }
  }, [playCount])
  useEffect(() => {
    if (seconds === 0) {
      stopCountDown();
      const msg = 'You ran out of time, A random spot was played for you';
      toast.current?.show({ severity: 'info', summary: 'Play Again', detail: msg, life: 3000 });
      const [row, col] = findRandomLocation();
      playTurn(row, col);
    }
  }, [seconds])
  const setupSocketListeners = (): void => {
    socket.on(EVENTS.GAME_CHECK_SUCCESS, (gameData: IGameData) => {
      if (isUserNameSet()) {
        dispatch(initializeGame(gameData));
        setGameReady(true);
        if (gameData.gameMode === E_GAMEMODE.BLITZ) {
          const grid = JSON.parse(gameData.gameGrid);
          reBuildPlayLocation(grid);
        }
      }
      else {
        navigate(`/join?gameId=${gameId}`, { replace: false });
      }
    })
    socket.on(EVENTS.GAME_UPDATE, (updateData: IUpdateGameData) => {
      dispatch(updateGame(updateData))
    })
    socket.on(EVENTS.GAME_CHECK_FAILED, (msg: string) => {
      navigate(`/create`, { replace: false, state: msg })
    })
    socket.on(EVENTS.GAME_RESTART_AGAIN, (gameData: IGameData) => {
      const msg = 'Game has started Again, Enjoy 🎉'
      toast.current?.show({ severity: 'info', summary: 'Play Again', detail: msg, life: 3000 });
      dispatch(initializeGame(gameData));

      if (gameData.gameMode === E_GAMEMODE.BLITZ) {
        const grid = JSON.parse(gameData.gameGrid);
        reBuildPlayLocation(grid);
      }
    })
    socket.on(EVENTS.SETTINGS_CHANGED, (gameData: IGameData) => {
      const msg = 'Game Restarted Due to Settings Change 😅';
      toast.current?.show({ severity: 'info', summary: 'Settings Changed', detail: msg, life: 3000 });
      dispatch(initializeGame(gameData));
    })
  }

  const destroyListeners = (): void => {
    socket.off(EVENTS.GAME_CHECK_SUCCESS);
    socket.off(EVENTS.GAME_CHECK_FAILED);
    socket.off(EVENTS.GAME_RESTART_AGAIN);
    socket.off(EVENTS.SETTINGS_CHANGED);
    socket.off(EVENTS.GAME_UPDATE);
  }


  const isUserNameSet = (): boolean => {
    return playerName === '' ? false : true;
  }

  const setGameIfExist = (): void => {
    socket.emit(EVENTS.GAME_CHECK, gameId)
  }

  const getWinLocationIfExists = (row: number, col: number, grid: GridCol[][]): number[][] => {
    const combinations = GameUtils.generatePossibleWinCombinations(row, col, gridDimension);
    console.log('combinations ',combinations, gridDimension)
    let location: number[][] = []
    combinations.forEach(combination => {
      let combinationStr = ''
      let tempLocations:number[][]= []
      combination.forEach((location)=>{
        const [row, col] = location.split('');
        combinationStr += `${grid[+row][+col]}`;
        tempLocations.push([+row, +col])
      })
      const isWin = [E_GAMECHARACTER.X.repeat(gridDimension), E_GAMECHARACTER.O.repeat(gridDimension)].includes(combinationStr);
      console.log(E_GAMECHARACTER.X.repeat(gridDimension),combinationStr)
      if (isWin) location.push(...tempLocations);
    })
    return location;
  }

  const canPlay = () => {
    if (playerCharacter === 'X') {
      return playCount % 2 === 0;
    }
    else {
      return playCount % 2 !== 0;
    }
  }

  const playTurn = (row: number, col: number): void => {
    if (canPlay()) {
      if (game.grid[row][col] !== null) {
        const message = `Can't play in this square! pick an empty square to play in`;
        toast.current?.show({ severity: 'info', summary: 'Wait your turn', detail: message, life: 3000 });
        return;
      }
      const newGrid = GameUtils.deepClone<GridCol[][]>(game.grid);
      newGrid[row][col] = playerCharacter;
      // playSound.play();
      const gameUpdateData: IUpdateGameData = {
        roomId: gameId,
        playCount: playCount + 1,
        playLocation: [row, col]
      }
      socket.emit(EVENTS.GAME_UPDATE, gameUpdateData);
    }
    else {
      const message = `It's ${friendName} turn to play, please wait for your turn`;
      toast.current?.show({ severity: 'info', summary: 'Illegal Play', detail: message, life: 3000 })
    }
  }

  const StatusIcon = {
    Win: '🏆',
    win2: '🎉',
    Draw: '⚖',
    InPlay: '🕓'
  }

  const renderCharacterColor = (value: string): string => {
    return value === 'X' ? orange[100] : orange[200]
  }

  const isPlayLocation = (row: number, col: number): boolean => {
    let currentLocation = currentPlayLocation.length > 0 ? `${currentPlayLocation[0]}${currentPlayLocation[1]}` : '';
    return currentLocation === `${row}${col}`
  }

  const updateStatusMessage = (status: GameStatus, winCharacter: string = ''): string => {
    let statusMsg = '';
    switch (status) {
      case GameStatus.InPlay: {
        statusMsg = canPlay() ? `It's your Turn` : `It's ${friendName}'s Turn`;
        break;
      }
      case GameStatus.Win: {
        statusMsg = `${winCharacter === playerCharacter ? 'You' : friendName} win :)`;
        break;
      }
      case GameStatus.Draw: {
        statusMsg = `This Game is a Tie`;
        break;
      }
      default: { }
    }
    return statusMsg;
  }

  const isWin = (): boolean => game.winLocation.size > 0;
  const isDraw = (): boolean => playCount === Math.pow(gridDimension,2) && !isWin();
  const playAgain = (): void => {
    if (gameId) {
      const data: IPlayAgainData = {
        roomId: gameId,
        isDraw: isDraw(),
        winCharacter: game.winCharacter
      }
      socket.emit(EVENTS.PLAY_AGAIN, data)
    }
  }
  const isWinLocation = (row: number, col: number): boolean => {
    return game.winLocation.has(`${row}${col}`)
  }
  const startCountDown = () => {
    const interval: any = setInterval(() => {
      setSeconds((prevState) => prevState - 1)
    }, 1000)
    setIntervalId(interval)
  }
  const stopCountDown = () => {
    clearInterval(intervalId);
    setSeconds(59);
  }
  const toggleFullScreen = ()=>{
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  return {
    gameReady,
    wins,
    losses,
    draws,
    game,
    playerImage,
    playerNo,
    playerName,
    playerCharacter,
    friendImage,
    friendNo,
    friendName,
    friendCharacter,
    playCount,
    seconds,
    gameMode,
    StatusIcon,
    gridDimension,
    isFullscreen,
    renderCharacterColor,
    canPlay,
    isWin,
    isDraw,
    isPlayLocation,
    isWinLocation,
    playTurn,
    playAgain,
    toggleFullScreen
  }
}

export default useGameHooks;
