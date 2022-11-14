import { useEffect, useState } from "react";
export interface IAudioConfig{
    autoPlay: boolean,
    loop: boolean
}
export const useAudio = (url: string, config:IAudioConfig) => {
    const [audio] = useState<HTMLAudioElement>(new Audio(url));
    audio.loop = config.loop;
    const [playing, setPlaying] = useState<boolean>(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        if(config.autoPlay){
            audio.addEventListener("canplaythrough", () => setPlaying(true));
        }
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
            audio.removeEventListener("canplaythrough", () => setPlaying(true));
        };
    }, []);

    return { playing, audio, toggle };
};
