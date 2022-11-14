import React, { useState, useEffect } from "react";
import { SoundPlayerStyled } from './SoundPlayerStyles';
import { IAudioConfig, useAudio } from "./useAudioHooks";

export const defaultConfig: IAudioConfig = {
    autoPlay: false,
    loop: false,
}

interface Props {
    url: string;
    config?: IAudioConfig
};
const SoundPlayer = (props: Props) => {
    const url = props.url;
    const config = props.config ?? defaultConfig;
    const { playing, toggle } = useAudio(url, config);

    return (
        <SoundPlayerStyled>
            <span onClick={toggle}>{playing ?
                <i className="pi volume-icon pi-volume-off"></i> :
                <i className="pi volume-icon pi-volume-up"></i>}</span>
        </SoundPlayerStyled>
    );
};

export default SoundPlayer;
