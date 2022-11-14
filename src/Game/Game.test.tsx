import React from 'react';
import { describe, expect, test } from '@jest/globals';
import * as hooks from './useGameHooks';
import Game from './Game';
import { E_GAMEMODE, GameStatus, GridCol } from '../gameModel';
import { testSnapshot, wrapContext } from '../testHelpers';

const gridInit: GridCol[][] = [[null, null, null], [null, null, null], [null, null, null]];
const defaultMockreturnValue = {
    gameReady: false,
    wins: 0,
    losses: 0,
    draws: 0,
    game:{
        gameStatus: GameStatus.InPlay,
        msgStatus: '',
        winLocation:new Set<string>(),
        grid: gridInit,
        winCharacter: ''
    },
    playerName: 'Tory',
    playerNo: 1,
    friendNo: 2,
    friendName: 'Pat',
    playerCharacter: 'X',
    friendCharacter: 'O',
    playerImage: 1,
    friendImage: 2,
    StatusIcon:{
        Win: '🏆',
        win2: '🎉',
        Draw: '⚖',
        InPlay: '🕓'
    },
    seconds:59,
    gameMode:E_GAMEMODE.NORMAL,
    renderCharacterColor: jest.fn(),
    canPlay: jest.fn(),
    isWin: jest.fn(),
    isDraw: jest.fn(),
    isPlayLocation: jest.fn(),
    isWinLocation: jest.fn(),
    playTurn: jest.fn(),
    playAgain: jest.fn()
};

describe('Game', () => {
    const wrappedComponent: JSX.Element = wrapContext(<Game/>);
    it('should render the component in loading state', () => {
        const hookSpy = jest.spyOn(hooks, 'default').mockReturnValue(defaultMockreturnValue);

        testSnapshot(wrappedComponent);

        expect(hookSpy).toHaveBeenCalledTimes(1);

    });

    it('should render the component in default state', () => {
        const hookSpy = jest.spyOn(hooks, 'default').mockReturnValue({...defaultMockreturnValue, gameReady: true});

        testSnapshot(wrappedComponent, true);
    });

    // test('generate Possible Win Combinations (no diagonals)', () => {
    //     const arrayIsSame = (array1: string[], array2: string[]) => {
    //         const set = new Set(array1);
    //         return array2.every(val => set.has(val));
    //     };
    // });
});
