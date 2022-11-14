import React, { useState } from 'react'
import { GameContainerStyled } from './GameStyles';
import { ReactComponent as DrawIcon } from '../assets/draw-icon.svg';
import { ProgressSpinner } from 'primereact/progressspinner';
import { orange } from '../theme';
import Avatar from '../components/Avatar/Avatar';
import { Button } from 'primereact/button';
import useGameHooks from './useGameHooks';
import { E_GAMECHARACTER, E_GAMEMODE, IGameHooks } from '../gameModel';
import SoundPlayer from '../components/SoundPlayer/SoundPlayer';
import Settings from '../components/Settings/Settings';
import { Tooltip } from 'primereact/tooltip';

function Game() {
  const {
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
    seconds,
    gameMode,
    StatusIcon,
    gridDimension,
    isFullscreen,
    playCount,
    renderCharacterColor,
    canPlay,
    isWin,
    isDraw,
    isPlayLocation,
    isWinLocation,
    playTurn,
    playAgain,
    toggleFullScreen
  }: IGameHooks = useGameHooks();

  const [isOpened, openModal] = useState(false);
  return (
    <GameContainerStyled>
      <Settings isOpened={isOpened} openModal={openModal} />
      <div className="container">
        {
          !gameReady ? (
            <>
              <ProgressSpinner style={{ width: '150px', height: '150px' }} strokeWidth="6" fill="transparent" animationDuration=".5s" />
            </>
          ) : (
            <>
              <div className="nav">
                <p className="title">Crosses & Noughts</p>
                <ul className="list">
                  <li className="list__item">
                    {
                      (!isWin() && !isDraw() && playCount > 0) && <Tooltip target=".disabled-button" position={'bottom'} />
                    }
                    <span className="disabled-button mr-2" data-pr-tooltip="Can't change Settings While a game is in play 😅">
                      <i className="pi nav__icon pi-cog" onClick={() => {
                        if (isWin() || isDraw() || playCount < 1) {
                          openModal(true);
                        }
                      }}></i>
                    </span>
                  </li>
                  <li className="list__item"><SoundPlayer url={require(`../assets/sound.mp3`)} config={{ autoPlay: false, loop: true }} /></li>
                  <li className="list__item" onClick={()=>toggleFullScreen()}>{
                  isFullscreen ? <i className='pi nav__icon pi-window-minimize' />: <i className='pi nav__icon pi-window-maximize' />
                  }</li>
                </ul>
              </div>
              <div className="header">
              </div>
              <div className="status">
                <div className="status__icon">{StatusIcon[game.gameStatus]}</div>
                <div className="status__text">
                  <p className="status__text--heading">Status</p>
                  <div className="status__footer">
                    <p className="status__text--content">{game.msgStatus}</p>
                    {
                      isWin() || isDraw() ? (
                        <Button label="Play Again" className="p-button-outlined p-button-secondary status__btn" onClick={
                          () => playAgain()
                        } />
                      ) : null
                    }
                    {
                      gameMode === E_GAMEMODE.BLITZ && canPlay() && !isWin() && !isDraw() ? (
                        <p
                          className={'time-label ' + (seconds < 30 && seconds > 10 ? 'time-label--warning ' : '') +
                            (seconds <= 10 ? 'time-label--danger animate__animated animate__pulse animate__infinite' : '')}>
                          00:{`${seconds}`.length > 1 ? `${seconds}` : `0${seconds}`}
                        </p>
                      ) : null
                    }
                  </div>
                </div>
              </div>
              <div className="game">
                <div className="player">
                  <div className="player__img">
                    <Avatar fileName={`${playerImage}.svg`} />
                    <i className={canPlay() && !isWin() && !isDraw() ? 'pi pi-angle-down animate__animated animate__bounce animate__infinite show' : ''}></i>
                    <p className="player__char" style={{ color: renderCharacterColor(playerCharacter) }}>{playerCharacter}</p>
                  </div>
                  <p className="player__id">Player {playerNo}</p>
                  <p className="player__name">{playerName}</p>
                  <p className="player__stats">
                    <span className="player_stats--win" style={{ color: renderCharacterColor(playerCharacter) }}>{wins} wins</span>
                    <span className="player_stats--draw">{draws} draws</span>
                  </p>
                </div>
                <div className="grid">
                  {
                    game.grid.map((item: any[], rowIndex: number) => (
                      <div className="row" key={rowIndex}>
                        {
                          item.map((colItem, colIndex) => (
                            <div
                              className="col"
                              onClick={() => !isWin() && !isDraw() && playTurn(rowIndex, colIndex)}
                              key={colIndex}
                              style={{
                                color: renderCharacterColor(colItem ?? ''),
                                background: isWinLocation(rowIndex, colIndex) ? orange[50] : 'hsla(0, 0%, 98%, 1)'
                              }}
                            >
                              <p className={isPlayLocation(rowIndex, colIndex) ? 'animate__animated animate__heartBeat animate__repeat-1' : ''}>
                                {colItem ?? ''}
                              </p>
                            </div>
                          ))
                        }
                      </div>
                    ))
                  }
                </div>
                <div className="player">
                  <div className="player__img">
                    <Avatar fileName={`${friendImage}.svg`} />
                    <i className={!canPlay() && !isWin() && !isDraw() ? 'pi pi-angle-down animate__animated animate__bounce animate__infinite show' : ''}></i>
                    <p className="player__char player__char--right" style={{ color: renderCharacterColor(friendCharacter) }}>{friendCharacter}</p>
                  </div>
                  <p className="player__id">Player {friendNo}</p>
                  <p className="player__name">{friendName}</p>
                  <p className="player__stats">
                    <span className="player_stats--win" style={{ color: renderCharacterColor(friendCharacter) }}>{losses} wins</span>
                    <span className="player_stats--draw">{draws} draws</span>
                  </p>
                </div>
              </div>
            </>
          )
        }
      </div>
    </GameContainerStyled>
  )
}

export default Game

