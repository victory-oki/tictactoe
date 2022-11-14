import { describe, expect, test } from '@jest/globals';
import * as GameUtils from './gameutils';
describe('game utilities', () => {
    test('generate Possible Win Combinations (no diagonals)', () => {
        const arrayIsSame = (array1: string[], array2: string[]) => {
            const set = new Set(array1);
            return array2.every(val => set.has(val));
        };
        const winCombinations: string[][] = GameUtils.generatePossibleWinCombinations(1, 0);
        expect(winCombinations.length).toBe(2);
        expect(arrayIsSame(winCombinations[0], ['00', '10', '20'])).toBeTruthy();
        expect(arrayIsSame(winCombinations[1], ['10', '11', '12'])).toBeTruthy();
    });
    test('generate Possible Win Combinations (with diagonals)', () => {
        const arrayIsSame = (array1: string[], array2: string[]) => {
            const set = new Set(array1);
            return array2.every(val => set.has(val));
        };
        const winCombinations: string[][] = GameUtils.generatePossibleWinCombinations(1, 1);
        expect(winCombinations.length).toBe(4);
        expect(arrayIsSame(winCombinations[0], ['01', '11', '21'])).toBeTruthy();
        expect(arrayIsSame(winCombinations[1], ['10', '11', '12'])).toBeTruthy();
        expect(arrayIsSame(winCombinations[2], ['00', '11', '22'])).toBeTruthy();
        expect(arrayIsSame(winCombinations[3], ['02', '11', '20'])).toBeTruthy();
    });
    test('deep clone', () => {
        const houseForSale  = { bedrooms: 3, baths: 2};
        expect(GameUtils.deepClone(houseForSale)).not.toBe(houseForSale);
        expect(GameUtils.deepClone(houseForSale)).toHaveProperty('bedrooms', 3);
        expect(GameUtils.deepClone(houseForSale)).toHaveProperty('baths', 2);
    });
    test('isSameObj function', ()=>{
        const houseForSale  = { bedrooms: 3, baths: 2};
        const anotherHouseForSale  = { bedrooms: 2, baths: 2};
        expect(GameUtils.isSameObj(houseForSale, houseForSale)).toBeTruthy();
        expect(GameUtils.isSameObj(houseForSale, anotherHouseForSale)).toBeFalsy();
    })
});
