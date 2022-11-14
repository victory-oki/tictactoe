import React, { useState, useEffect, useRef } from 'react'

import { ContainerStyled } from './JoinGameStyles';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useSocket } from '../socketContext';
import { EVENTS, IjoinObj } from '../gameModel';
import { Link, NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPlayerName } from '../Game/gameSlice';
import { useToast } from '../notificationContext';
import { FormikErrors, FormikProps, useFormik } from 'formik';
import { classNames } from 'primereact/utils';


function JoinGame() {
    interface IformValues {name: string, gameId: string};
    const [formData, setFormData] = useState<IformValues>({
        name : '',
        gameId: ''
    });
    const socket = useSocket();
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    let [searchParams] = useSearchParams();

    const formik:FormikProps<IformValues> = useFormik<IformValues>({
        initialValues: {
            name: '',
            gameId: ''
        },
        validate: (data) => {
            let errors:FormikErrors<IformValues> = {};
            if (!data.name) {
                errors.name = 'Name is required.';
            }
            if (!data.gameId) {
                errors.gameId = 'Game Code is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            setFormData({name:data.name, gameId:data.gameId});
            handleJoinGame(data);
            formik.resetForm();
        }
    });

    // TODO: CHECK IF QUERY PARAMS AVAILABLE ON LOAD AND SET IT
    useEffect(()=>{
        const queryGameId = searchParams.get('gameId') ?? '';
        console.log(queryGameId);
        if(queryGameId){
            setFormData({name:'', gameId:queryGameId});
            formik.setValues({name:'', gameId:queryGameId});
            const message = `Please input your username to join ${queryGameId}`
            toast.current?.show({severity: 'info', summary: 'To Join Back', detail: message, life: 3000})
        }
    },[])

    useEffect(()=>{
        setupSocketListeners();
        return ()=>{
          destroyListeners();
        }
    },[formData])
    const setupSocketListeners = ()=>{
        socket.on(EVENTS.ERROR, ({message})=>showError(message));
        socket.on(EVENTS.GAME_START, ()=>{
            console.log(formData)
            dispatch(setPlayerName(formData.name));
            navigate(`/game/${formData.gameId}`, { replace: false });
        })
        socket.on(EVENTS.JOIN_SUCCESS, () =>{
            console.log(formData)
            dispatch(setPlayerName(formData.name));
            navigate(`/lobby/${formData.gameId}`, { replace: false });
        });
    }

    const destroyListeners = ()=>{
        socket.off(EVENTS.ERROR);
        socket.off(EVENTS.GAME_START);
        socket.off(EVENTS.JOIN_SUCCESS);
    }

    const showError = (message:string)=>{
        toast.current?.show({severity: 'error', summary: 'Validation failed', detail: message, life: 3000});
    }

    const handleJoinGame = (formData:IformValues):void => {
        const joinObject:IjoinObj = { room: formData.gameId, actionType: 'JOIN', senderId: socket.id, username:formData.name}
        socket.emit(EVENTS.JOIN, joinObject);
    }


    const isFormFieldValid = (name:keyof IformValues) => !!(formik?.touched[name] && formik?.errors[name]);
    const getFormErrorMessage = (name:keyof IformValues) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <ContainerStyled>
            <h1 className="heading">Join Game</h1>
            <form className="form"  onSubmit={formik.handleSubmit}>
                <div className="p-inputgroup input-field">
                    <span className={classNames({ 'p-invalid': isFormFieldValid('name'), 'p-inputgroup-addon': true })}>
                        <i className="pi pi-user"></i>
                    </span>
                    <InputText placeholder="Username" id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })}/>
                </div>
                {getFormErrorMessage('name')}
                <InputText placeholder="Input Game Code" id="gameId" name="gameId" value={formik.values.gameId} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('gameId'), 'input-field': true })}/>
                {getFormErrorMessage('gameId')}
                <Button label="Join Game" className="p-button-success"/>
                <p>or</p>
                <Link to={'/create'} className='link'>Create New game</Link>
            </form>
        </ContainerStyled>
    )
}

export default JoinGame
