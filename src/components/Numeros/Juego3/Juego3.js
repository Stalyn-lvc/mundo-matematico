// Juego3.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Canvas from './Canvas';
import AudioButton from '../../common/AudioButton/AudioButton';
import numero1 from '../../../assets/audios/Numero/Numero1.mp3';
import numero2 from '../../../assets/audios/Numero/Numero2.mp3';
import numero3 from '../../../assets/audios/Numero/Numero3.mp3';
import numero4 from '../../../assets/audios/Numero/Numero4.mp3';
import numero5 from '../../../assets/audios/Numero/Numero5.mp3';
import numero6 from '../../../assets/audios/Numero/Numero6.mp3';
import numero7 from '../../../assets/audios/Numero/Numero7.mp3';
import numero8 from '../../../assets/audios/Numero/Numero8.mp3';
import numero9 from '../../../assets/audios/Numero/Numero9.mp3';
import './Juego3.css';
import HeaderGame from '../../ui/header_game';

const Juego3 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [numeroActual, setNumeroActual] = useState(1);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
    const [numerosDisponibles, setNumerosDisponibles] = useState([]);
    const canvasRef = useRef(null);

    const audios = {
        1: numero1, 2: numero2, 3: numero3, 4: numero4, 5: numero5,
        6: numero6, 7: numero7, 8: numero8, 9: numero9
    };

    const obtenerRutaAudio = (numero) => {
        return audios[numero];
    };

    const mezclarNumeros = () => {
        const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = numeros.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
        }
        return numeros;
    };

    useEffect(() => {
        inicializarJuego();
    }, []);

    const inicializarJuego = () => {
        const numerosAleatorios = mezclarNumeros();
        setNumerosDisponibles(numerosAleatorios);
        setNumeroActual(numerosAleatorios[0]);
        setEstrellas(0);
        setMostrarModal(false);
        setMostrarMensajeError(false);
    };

    const mostrarFeedback = (correcto) => {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${correcto ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = correcto ? '★' : '☹';
        document.body.appendChild(feedback);

        if (!correcto) {
            setMostrarMensajeError(true);
            setTimeout(() => setMostrarMensajeError(false), 2000);
        }

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    const handleVerificar = () => {
        if (canvasRef.current) {
            const resultado = canvasRef.current.verificarDibujo();
            const esCorrecta = resultado >= 75; // 75% de coincidencia mínima
            mostrarFeedback(esCorrecta);

            if (esCorrecta) {
                const nuevasEstrellas = estrellas + 1;
                setEstrellas(nuevasEstrellas);

                if (nuevasEstrellas >= 3) {
                    setTimeout(() => {
                        setMostrarModal(true);
                    }, 1000);
                } else {
                    const siguienteIndice = numerosDisponibles.indexOf(numeroActual) + 1;
                    setNumeroActual(numerosDisponibles[siguienteIndice]);
                }
            }
        }
    };

    return (
        <div className="juego-dibujo">
            <HeaderGame estrellas={estrellas} to="/numeros" />

            <div className="juego-contenido">
                <div className="instruccion-header">
                    <div className="numero-guia">
                        Dibuja el número: <span>{numeroActual}</span>
                    </div>
                    {numeroActual && (
                        <AudioButton
                            audioSrc={obtenerRutaAudio(numeroActual)}
                            className="numero-audio"
                        />
                    )}
                </div>

                <Canvas
                    ref={canvasRef}
                    numeroActual={numeroActual}
                />

                {mostrarMensajeError && (
                    <div className="mensaje-error">
                        ¡Intenta seguir mejor la plantilla y vuelve a intentarlo!
                    </div>
                )}

                <div className="controles">
                    <button onClick={() => {
                        if (canvasRef.current) {
                            canvasRef.current.limpiarCanvas();  
                        }
                    }}>Borrar</button>
                    <button onClick={handleVerificar}>Verificar</button>
                </div>
            </div>

            {mostrarModal && (
                <div className="modal">
                    <div className="modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 3 estrellas! 🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego3;  