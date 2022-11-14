// import logo from './logo.svg';
import './assets/font/stylesheet.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import { Route, Routes } from 'react-router-dom';
import { SocketProvider } from './socketContext';
import LandingPage from './LandingPage/LandingPage';
import CreateGame from './CreateGame/CreateGame';
import JoinGame from './JoinGame/JoinGame';
import Game from './Game/Game';
import Lobby from './Lobby/Lobby';
import { ToastProvider } from './notificationContext';

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <ToastProvider>
          <Routes>
            <Route path='/' element={<LandingPage />}>
              <Route path='' element={<CreateGame />} />
              <Route path='create' element={<CreateGame />} />
              <Route path='Join' element={<JoinGame />} />
            </Route>
            <Route path='lobby/:id' element={<Lobby />} />
            <Route path='game/:id' element={<Game />} />
          </Routes>
        </ToastProvider>
      </SocketProvider>
    </div >
  );
}

export default App;


// 07789001687
