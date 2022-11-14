import React, { useEffect } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { ContainerStyled } from './LobbyStyles'
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSocket } from '../socketContext';
import { EVENTS } from '../gameModel';
function Lobby() {
    const { id: roomId } = useParams();
    const socket = useSocket();
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        setupSocketListeners();
        return ()=>{
          destroyListeners();
        }
      }, [roomId]);

    const setupSocketListeners = ()=>{
        socket.on(EVENTS.GAME_START, ()=>{
            navigate(`/game/${roomId}`, { replace: false });
        })
    }

    const destroyListeners = ()=>{
        socket.off(EVENTS.GAME_START)
    }

    return (
        <ContainerStyled>
            <div className="container">
                <div className="header">
                    <h1 className="header__title">Lobby</h1>
                    <p className="header__brief">We are waiting for your friend, please share the following code: <b className='u-emphasis'><code data-testid = 'code-section'>{roomId?.toLocaleUpperCase()}</code></b></p>
                    <p className="brief">you would be redirected as soon as your friend joins</p>
                </div>
                <div className="content">
                <ProgressSpinner style={{width: '150px', height: '150px'}} strokeWidth="6" fill="transparent" animationDuration=".5s"/>
                </div>
            </div>
        </ContainerStyled>
    )
}

export default Lobby
