import React, { useState, useRef } from 'react';
import './AudioButton.css';

const AudioButton = ({ audioSrc, className }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div className={`audio-button-container ${className || ''}`}>
            <button 
                className={`audio-button ${isPlaying ? 'playing' : ''}`}
                onClick={playAudio}
            >
                {isPlaying ? '🔊' : '🔈'}
            </button>
            <audio 
                ref={audioRef}
                src={audioSrc}
                onEnded={handleAudioEnd}
            />
        </div>
    );
};

export default AudioButton;