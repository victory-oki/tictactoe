
import { render, screen, within } from "@testing-library/react";
import { testSnapshot, wrapContext } from "../testHelpers"
import Lobby from "./Lobby";
import * as routerMock from 'react-router-dom';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: ()=>({id:'TESTCODE'}),
}));

describe('Test if lobby renders correctly',()=>{

    test('Renders Correctly with params', ()=>{

        const wrappedComponent: JSX.Element = wrapContext(<Lobby />);
        render(
            wrappedComponent
        );
        within(screen.getByTestId('code-section')).getByText('TESTCODE');
    })

    it('renders correctly', ()=>{
        const wrappedComponent: JSX.Element = wrapContext(<Lobby />);
        testSnapshot(wrappedComponent)
    })
})
