import React from "react";
import { render, screen } from "@testing-library/react";
import CreateGame from "./CreateGame";
import {wrapContext, testSnapshot} from '../testHelpers';
describe('Create Game', () => {
    const wrappedComponent: JSX.Element = wrapContext(<CreateGame />);
    test('renders Create  Game Component', async () => {
        render(
            wrappedComponent
        );
        const textbox = await screen.findAllByRole('textbox');
        expect(textbox).toHaveLength(1);
        const button = await screen.findAllByRole('button');
        expect(button).toHaveLength(1);
        const link = await screen.findAllByRole('link');
        expect(link).toHaveLength(1);
    });

    it('Renders Correctly', ()=>{
        testSnapshot(wrappedComponent)
    })
})

