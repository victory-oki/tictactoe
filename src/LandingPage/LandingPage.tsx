import React from 'react'
import { ContainerStyled } from './LandingPageStyles'
import { Outlet } from "react-router-dom";

function LandingPage() {
  return (
    <ContainerStyled>
      <div className="container">
        <div className="header">
          <h1 className="header__title">Crosses & Noughts</h1>
          <h1 className="header__brief">Welcome to Crosses & Noughts or as some call it TicTacToe.</h1>
        </div>
        <div className="content">
          <Outlet />
        </div>

      </div>
    </ContainerStyled>
  )
}

export default LandingPage
