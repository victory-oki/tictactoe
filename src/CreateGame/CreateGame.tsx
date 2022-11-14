import React, { useEffect, useState } from 'react';
import { ContainerStyled } from './CreateGameStyles';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useSocket } from '../socketContext';
import * as GameUtils from '../gameutils';
import { EVENTS, IjoinObj } from '../gameModel';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPlayerName } from '../Game/gameSlice';
import { FormikErrors, FormikProps, useFormik } from 'formik';
import { classNames } from 'primereact/utils';

function CreateGame() {
    const [username, setUsername] = useState('');
    const socket = useSocket();
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    interface IformValues {name: string};
    const formik:FormikProps<IformValues> = useFormik<IformValues>({
        initialValues: {
            name: '',
        },
        validate: (data) => {
            let errors:FormikErrors<IformValues> = {};
            if (!data.name) {
                errors.name = 'Name is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            setUsername(data.name);
            handleCreateGame(data.name);
            formik.resetForm();
        }
    });
    useEffect(() => {
        setupSocketListeners();
        return () => {
            destroyListeners();
        }
    }, [username]);

    const setupSocketListeners = () => {
        socket.on(EVENTS.CREATE_SUCCESS, ({roomId}) => {
            dispatch(setPlayerName(username));
            navigate(`/lobby/${roomId}`, { replace: false });
        });
    }
    const destroyListeners = () => {
        socket.off(EVENTS.CREATE_SUCCESS)
    }

    const handleCreateGame = (username:string): void => {
        const joinObject: IjoinObj = { actionType: 'CREATE', username };
        socket.emit(EVENTS.JOIN, joinObject);
    }

    const isFormFieldValid = (name:keyof IformValues) => !!(formik?.touched[name] && formik?.errors[name]);
    const getFormErrorMessage = (name:keyof IformValues) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <ContainerStyled>
            <h1 className="heading">Create Game</h1>
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="p-inputgroup">
                    <span className={classNames({ 'p-invalid': isFormFieldValid('name'), 'p-inputgroup-addon': true })}>
                        <i className="pi pi-user"></i>
                    </span>
                    <InputText placeholder="Username"id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })}/>
                </div>
                {getFormErrorMessage('name')}
                input
                <Button label="Create Game" className="p-button-success" />
                <p>or</p>
                <Link to={'/join'} className='link'>Join Existing game</Link>
            </form>
        </ContainerStyled>
    )
}

export default CreateGame
