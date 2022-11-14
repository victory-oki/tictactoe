import { useState } from "react"
import { GridCol } from "../gameModel";

const useRandomHook = (gridDimension:number):any => {
    const generatePlayLocations = (grid = null):Map<number, number[]>=>{
        const mapLength = gridDimension * gridDimension;
        const locations = new Map();
        let row = 0;
        for(let i=0; i< mapLength; i++){
            if(i%gridDimension === 0 && i !== 0){
                row += 1;
            }
            const col = i - (row * gridDimension);
            if(grid && grid[row][col]) continue;
            locations.set(i, [row, col]);
        }
        return locations;
    }

    const [playLocations, setPlayLocations]  =  useState(generatePlayLocations());
    const invalidateLocation = (index:number)=>{
        console.log('Invalidating... size before: ', playLocations.size);
        playLocations.delete(index);
        console.log('Invalidated... size after: ', playLocations.size);
    }
    const findRandomLocation = ():number[]=>{
        const randomIndex = Math.floor(Math.random() * playLocations.size);
        return Array.from(playLocations.values())[randomIndex];
    }
    const reBuildPlayLocation = (grid:GridCol[][])=>{
        setPlayLocations(generatePlayLocations(grid as any))
    }
    return {
        invalidateLocation,
        findRandomLocation,
        reBuildPlayLocation
    }
}

export default useRandomHook;
