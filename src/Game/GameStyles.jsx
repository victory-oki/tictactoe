import styled from 'styled-components';
import bg from '../assets/bg.jpg';
import { white, black, orange, red } from '../theme/colors';


export const GameContainerStyled = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0.1px;
  position: relative;
  background-color: ${black[100]};
  &::before {
    content: "";
    background-image: url(${bg});
    background-size: contain;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.05;
    z-index: 1;
  }
  .container{
    max-width: 112rem;
    margin: 0rem auto;
    position: relative;
    z-index: 2;
  }
  .nav{
    padding: 1rem calc((100vw - 112rem) / 2);
    background: ${black[100]};
    width: 100vw;
    box-shadow: 5px 5px 15px 5px rgba(${black[100]});
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;

    .title{
      font-size: 2.4rem;
      color: ${white[100]};
      font-weight: bold;
    }
    .list{
      list-style: none;
      display: flex;
      & >:not(:last-child){
        margin-right: 4rem;
      }
    }
    &__icon{
      font-size: 2rem;
      cursor: pointer;
      color: ${white[100]};
    }
  }
  .header{
    margin: 7rem 3rem;
    text-align: center;
    &__title{
      font-size: 5.4rem;
      color: ${white[100]};
      margin-bottom: 2.5rem;
      font-weight: bold;
    }
    &__brief{
      font-size: 2rem;
      color: ${white[200]};
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 40rem;
      margin: 2rem auto;
    }
  }
  .item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & >:not(:last-child){
        margin-bottom: 2rem;
    }
    & >:first-child{
        font-family: 'Fredoka One', cursive;
        fill: ${white[100]};
        width: 2.4rem;
    }
    &--1{
      color: ${orange[100]};
    }
    &--2{
      color: ${orange[200]};
    }
  }
  .status{
    background: ${black[200]};
    padding: 2.4rem;
    display: flex;
    align-items: flex-end;
    border-radius: 1.9rem;
    max-width: 50rem;
    margin: 0 auto;
    margin-bottom: 2.5rem;
    &__icon{
      font-size: 4.5rem;
      margin-right: 2rem;
    }
    &__text{
      color: ${white[100]};
      width: 100%;
      &--heading{
        font-size: 1.6rem;
        font-weight: bold;
      }
      &--content{
        font-size: 2.4rem;
        font-weight: 400;
      }
    }
    &__footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__btn{
      color: #d3d3d3 !important;
      font-size: 1.6rem;
    }
  }
  .game{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brief{
    font-size: 2rem;
    color: ${white[200]};
    font-weight: 500;
  }
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
    margin-bottom: 6rem;
  }

  .player{
    background: ${black[200]};
      width: 17rem;
      height: 18rem;
      border-radius: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.2rem;

      &__img{
        display: flex;
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
        border: 0.5rem;
        background-color: grey;
        margin-top: -5rem;
        text-align: center;
        margin-bottom: 2rem;
        border: 3px solid ${white[100]};
        position: relative;
        .pi{
          position: absolute;
          display: none;
          color: ${white[100]};
          font-size: 2.5rem;
          top: -50%;
          left: 30%;
          /* transform: translate(-125%,0); */
          &.show{
            display: inline-block;
          }
        }
      }
      &__id{
        font-size: 1.2rem;
        font-weight: 200;
        color: ${white[100]};
        text-align: center;
      }
      &__name{
        font-size: 1.6rem;
        color: ${white[100]};
        text-align: center;
      }
      &__stats{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
        width: 100%;
        font-size: 1.6rem;
        font-weight: 400;
        color: ${white[200]};
        margin-top: auto;
        &--win{}
        &--draw{
        }
      }
      &__char{
        font-family: 'Fredoka One', cursive;
        font-size: 2rem;
        color: ${white[100]};
        position: absolute;
        bottom: -1rem;
        right: 0;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background-color: ${white[50]};
        display: flex;
        align-items: center;
        justify-content: center;
        &--right{
          left: 0;
          right: unset;
        }
      }
  }
  .grid{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 50rem;
      height: 50rem;
      /* border: 1px solid #515151; */
      margin: 0 auto;
      & >:not(:last-child){
        margin-bottom: 2rem;
      }
      .row{
          width: 100%;
          display: flex;
          flex: 1;
          & >:not(:last-child){
            margin-right: 2rem;
          }
      }
      .col{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          border-radius: 1.5rem;
          transition: all .4s ease-in-out;
          font-size: 4rem;
          font-family: 'Fredoka One', cursive;
          background: hsla(0, 0%, 98%, 1);
          background: radial-gradient(circle, hsla(0, 0%, 98%, 1) 100%, hsla(177, 74%, 88%, 1) 100%);
          background: -moz-radial-gradient(circle, hsla(0, 0%, 98%, 1) 100%, hsla(177, 74%, 88%, 1) 100%);
          background: -webkit-radial-gradient(circle, hsla(0, 0%, 98%, 1) 100%, hsla(177, 74%, 88%, 1) 100%);

          &:hover{
            background: hsla(0, 0%, 98%, 1);
            background: radial-gradient(circle, hsla(0, 0%, 98%, 1) 56%, hsla(177, 74%, 88%, 1) 100%);
            background: -moz-radial-gradient(circle, hsla(0, 0%, 98%, 1) 56%, hsla(177, 74%, 88%, 1) 100%);
            background: -webkit-radial-gradient(circle, hsla(0, 0%, 98%, 1) 56%, hsla(177, 74%, 88%, 1) 100%);
          }
      }
  }
  .time-label{
    font-size: 2.4rem;
    font-weight: 500;
    &--warning{
      color: ${orange[100]};
    }
    &--danger{
      color: ${red[100]};
    }
  }
`
