import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { EVENTS, E_GAMECHARACTER, E_GAMEMODE } from '../../gameModel';
import { Button } from 'primereact/button';
import { FormikProps, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useToast } from '../../notificationContext';
import * as GameUtils from '../../gameutils';
import { useSocket } from '../../socketContext';
import { useParams } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
type Props = { isOpened: boolean, openModal: (val: boolean) => void }
export default function Settings(props: Props) {
    const options = ['NORMAL', 'BLITZ'];
    interface IformValues { playerCharacter: E_GAMECHARACTER, gameMode: E_GAMEMODE, gridDimension: number };
    const toast = useToast();
    const socket = useSocket();
    const { id: gameId } = useParams();
    const {
        playerCharacter,
        playerNo,
        gameMode,
        gridDimension
    } = useSelector((store: RootState) => store.game);
    const [initialValues, setInitialValues] = useState({ playerCharacter, gameMode, gridDimension });

    useEffect(() => {
        formik.setFieldValue('playerCharacter', playerCharacter);
        formik.setFieldValue('gameMode', gameMode);
        formik.setFieldValue('gridDimension', gridDimension);
        setInitialValues({ playerCharacter, gameMode, gridDimension });
    }, [playerCharacter, gameMode, gridDimension]);

    const formik: FormikProps<IformValues> = useFormik<IformValues>({
        initialValues: {
            playerCharacter: playerCharacter as E_GAMECHARACTER,
            gameMode: gameMode,
            gridDimension: gridDimension
        },
        validate: (data) => {
        },
        onSubmit: (data) => {
            if (GameUtils.isSameObj(initialValues, data)) {
                toast.current?.show({ severity: 'error', summary: 'No Change Detected', detail: 'Please make changes to form before hitting submit', life: 3000 });
            }
            else {
                socket.emit(EVENTS.SETTINGS_UPDATE, { ...data, roomId: gameId, playerNo})
            }
            props.openModal(false);
        }
    });

    const footer = (
        <div>
            <Button label="Dismiss" className="p-button-secondary p-button-text" onClick={() => props.openModal(false)} />
            <Button label="Submit" className="p-button-outlined p-button-success" onClick={() => formik.handleSubmit()} />
        </div>
    );
    return (
        <Dialog
            header="Settings"
            visible={props.isOpened}
            style={{ width: '30vw' }}
            onHide={() => props.openModal(false)}
            className='settings-form'
            footer={footer}
        >
            <div className="form">
                <div className="character-form">
                    <p className="input-heading">
                        <span>Choose a Character </span>
                        <Tooltip target=".info-1" />
                        <i className="pi pi-info-circle info-1" data-pr-tooltip="X plays first" data-pr-position='right'></i>
                    </p>
                    <div className="radio-group">
                        <div className='custom-radio'>
                            <input type='radio' id={E_GAMECHARACTER.X} value={E_GAMECHARACTER.X} name="playerCharacter"
                                onChange={() => formik.setFieldValue('playerCharacter', E_GAMECHARACTER.X)} checked={formik.values.playerCharacter === E_GAMECHARACTER.X} hidden />
                            <label htmlFor={E_GAMECHARACTER.X} className="custom-radio-label custom-radio-label--1" />
                        </div>
                        <div className='custom-radio'>
                            <input type='radio' id={E_GAMECHARACTER.O} value={E_GAMECHARACTER.O} name="playerCharacter"
                                onChange={() => formik.setFieldValue('playerCharacter', E_GAMECHARACTER.O)} checked={formik.values.playerCharacter === E_GAMECHARACTER.O}
                                hidden />
                            <label htmlFor={E_GAMECHARACTER.O} className="custom-radio-label custom-radio-label--2" />
                        </div>
                    </div>
                </div>
                <div className="game-mode-form">
                    <p className="input-heading">
                        <span>Select Game Mode</span>
                        <Tooltip target=".info-2" />
                        <i className="pi pi-info-circle info-2" data-pr-tooltip="In Blitz each player has 1 mins to play their turn" data-pr-position='right'></i>
                    </p>
                    <Dropdown value={formik.values.gameMode} options={options} onChange={formik.handleChange} placeholder="Select GameMode" name='gameMode' className='dropdown' />
                </div>
                <div className="field col-12 md:col-3 grid-form">
                    <p className="input-heading">
                            <span>Modify Game grid</span>
                            <Tooltip target=".info-3" />
                            <i className="pi pi-info-circle info-3" data-pr-tooltip="Set how many rows and columns you want" data-pr-position='right'></i>
                    </p>
                    {/* <label htmlFor="minmax-buttons"></label> */}
                    <InputNumber inputId="minmax-buttons" value={formik.values.gridDimension} name="gridDimension" onValueChange={formik.handleChange} mode="decimal" showButtons min={3} max={6} />
                </div>
            </div>
        </Dialog>
    )
}
