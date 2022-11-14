import React from "react";
import { render, screen } from "@testing-library/react";
import {wrapContext, testSnapshot} from '../testHelpers';
import JoinGame from "./JoinGame";
describe('Join Game', () => {
    const wrappedComponent: JSX.Element = wrapContext(<JoinGame />);
    test('renders Join Game Component', async () => {
        render(
            wrappedComponent
        );
        const textbox = await screen.findAllByRole('textbox');
        expect(textbox).toHaveLength(2);
        const button = await screen.findAllByRole('button');
        expect(button).toHaveLength(1);
        const link = await screen.findAllByRole('link');
        expect(link).toHaveLength(1);
    });

    it('Renders Correctly', ()=>{
        testSnapshot(wrappedComponent)
    })
})

