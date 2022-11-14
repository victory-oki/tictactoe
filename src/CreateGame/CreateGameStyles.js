import styled from "styled-components";
import { white, green } from '../theme/colors';
export const ContainerStyled = styled.div`
  max-width: 112rem;
  margin: 0rem auto;

  .heading{
    color: ${white[100]};
    font-size: 2.4rem;
    text-align: center;
  }

  .form{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    & >*{
      text-align: center;
    }
    p, .link{
      width: 100%;
      font-size: 1.6rem;
      text-align: center;
      color: ${white[100]};
    }
    .link{
      text-decoration: none;
      color: ${green[100]};
      transition: all 0.2s ease-in-out;
      &:hover{
        text-decoration: underline;
      }
    }
  }

  .p-inputgroup-addon{
    background: transparent;
    color: ${white[100]};
  }
  .p-inputtext{
    font-size: 1.6rem;
    background: transparent;
    color: ${white[100]};
    &::placeholder, &:enabled:hover{
      color: ${white[100]};
    }
  }

  .p-inputgroup, .p-button{
    width: 30rem;
    font-size: 1.6rem;
    margin-top: 2rem;
  }
  .p-inputgroup{
    height: 5rem;
  }

`
