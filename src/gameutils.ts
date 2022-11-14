export const generatePossibleWinCombinations = (row: number, col: number, gridDim = 3): string[][] => {
    const combinations:string[][] = [];
    let vertical = [];
    let horizontal = [];
    let forwardSlash = [];
    let backwardSlash = [];
    for (let i = 0; i < gridDim; i++) {
        vertical.push(`${i}${col}`);
        horizontal.push(`${row}${i}`);
        backwardSlash.push(`${i}${i}`);
        forwardSlash.push(`${i}${(gridDim - 1) - i}`);
    }
    combinations.push(vertical, horizontal)
    if(row === col){
        combinations.push(backwardSlash);
    }
    if((row + col === gridDim - 1)){
        combinations.push(forwardSlash);
    }
    return combinations;
}

export function deepClone<T>(obj: T):T {
    return JSON.parse(JSON.stringify(obj))
}

export function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    let firstPartStr = ("000" + firstPart.toString(36)).slice(-3);
    let secondPartStr = ("000" + secondPart.toString(36)).slice(-3);
    return firstPartStr + secondPartStr;
}

export const isSameObj = (initial:any, newObj:any):boolean=>{
    return JSON.stringify(initial) === JSON.stringify(newObj);
}

const isDiagonalAvailable = (row: number, col: number, gridDim = 3): boolean => {
    return (row === col) || (row + col === gridDim - 1);
}


