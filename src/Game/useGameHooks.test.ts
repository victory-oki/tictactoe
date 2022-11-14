import { act, renderHook } from '@testing-library/react-hooks';
import useGameHooks from './useGameHooks';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: ()=>jest.fn(),
}));
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: ()=>jest.fn(),
    useDispatch: ()=>jest.fn(),
}));

describe('useGameHooks()', ()=>{
    it('Should do stuff', ()=>{
        const { result } = renderHook(() => useGameHooks())
        console.log(result.current)
    })
})
