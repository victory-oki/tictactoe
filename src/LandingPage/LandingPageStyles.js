import styled from 'styled-components';
import bg from '../assets/bg.jpg';
import { white, black } from '../theme/colors';
export const ContainerStyled = styled.div`
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
  .header{
    margin-bottom: 6rem;
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
    }
  }
  .brief{
    font-size: 2rem;
    color: ${white[200]};
    font-weight: 500;
  }
  button{
    padding: 1.4rem 2.4rem;
    font-size: 1.6rem;
  }
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
    margin-bottom: 6rem;
  }
`
