import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../common/AudioButton/AudioButton';
import './Juego3.css';

// Importar imágenes
import imgDia from '../../../assets/imagenes/Nociones/dia.png';
import imgNoche from '../../../assets/imagenes/Nociones/noche.png';
import imgAtardecer from '../../../assets/imagenes/Nociones/atardecer.png';
import imgSoleado from '../../../assets/imagenes/Nociones/soleado.png';
import imgNublado from '../../../assets/imagenes/Nociones/nublado.png';
import imgLluvioso from '../../../assets/imagenes/Nociones/lluvioso.png';
import imgNieve from '../../../assets/imagenes/Nociones/nieve.png';

// Importar audios
import audioDia from '../../../assets/audios/Nociones/dia.mp3';
import audioNoche from '../../../assets/audios/Nociones/noche.mp3';
import audioAtardecer from '../../../assets/audios/Nociones/atardecer.mp3';
import audioSoleado from '../../../assets/audios/Nociones/soleado.mp3';
import audioNublado from '../../../assets/audios/Nociones/nublado.mp3';
import audioLluvioso from '../../../assets/audios/Nociones/lluvioso.mp3';
import audioNieve from '../../../assets/audios/Nociones/nieve.mp3';
import HeaderGame from '../../ui/header_game';

const Juego3 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [preguntasAnteriores, setPreguntasAnteriores] = useState([]);

    const preguntas = [
        {
            id: 1,
            instruccion: "Seleccione la imagen de: DÍA",
            audio: audioDia,
            respuestaCorrecta: imgDia,
            alternativas: [imgNoche, imgAtardecer]
        },
        {
            id: 2,
            instruccion: "Seleccione la imagen de: NOCHE",
            audio: audioNoche,
            respuestaCorrecta: imgNoche,
            alternativas: [imgDia, imgAtardecer]
        },
        {
            id: 3,
            instruccion: "Seleccione la imagen de: TARDE",
            audio: audioAtardecer,
            respuestaCorrecta: imgAtardecer,
            alternativas: [imgDia, imgNoche]
        },
        {
            id: 4,
            instruccion: "Seleccione la imagen de: SOLEADO",
            audio: audioSoleado,
            respuestaCorrecta: imgSoleado,
            alternativas: [imgNublado, imgLluvioso]
        },
        {
            id: 5,
            instruccion: "Seleccione la imagen de: NUBLADO",
            audio: audioNublado,
            respuestaCorrecta: imgNublado,
            alternativas: [imgSoleado, imgLluvioso]
        },
        {
            id: 6,
            instruccion: "Seleccione la imagen de: LLUVIOSO",
            audio: audioLluvioso,
            respuestaCorrecta: imgLluvioso,
            alternativas: [imgNublado, imgNieve]
        },
        {
            id: 7,
            instruccion: "Seleccione la imagen de: NEVADO",
            audio: audioNieve,
            respuestaCorrecta: imgNieve,
            alternativas: [imgLluvioso, imgSoleado]
        }
    ];

    const obtenerPreguntaAleatoria = () => {
        const preguntasDisponibles = preguntas.filter(
            pregunta => !preguntasAnteriores.includes(pregunta.id)
        );

        if (preguntasDisponibles.length === 0) {
            setPreguntasAnteriores([]);
            return { ...preguntas[Math.floor(Math.random() * preguntas.length)] };
        }

        const preguntaSeleccionada = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
        
        const alternativaAleatoria = preguntaSeleccionada.alternativas[
            Math.floor(Math.random() * preguntaSeleccionada.alternativas.length)
        ];

        return {
            ...preguntaSeleccionada,
            opciones: [
                { imagen: preguntaSeleccionada.respuestaCorrecta, esCorrecta: true },
                { imagen: alternativaAleatoria, esCorrecta: false }
            ].sort(() => Math.random() - 0.5)
        };
    };

    const inicializarJuego = useCallback(() => {
        const preguntaAleatoria = obtenerPreguntaAleatoria();
        setPreguntaActual(preguntaAleatoria);
        setEstrellas(0);
        setMostrarModal(false);
        setPreguntasAnteriores([]);
    }, []);

    useEffect(() => {
        inicializarJuego();
    }, [inicializarJuego]);

    const verificarRespuesta = (esCorrecta) => {
        mostrarFeedback(esCorrecta);

        if (esCorrecta) {
            const nuevasEstrellas = estrellas + 1;
            setEstrellas(nuevasEstrellas);

            if (nuevasEstrellas >= 5) {
                setTimeout(() => {
                    setMostrarModal(true);
                }, 1000);
            } else {
                const preguntaAleatoria = obtenerPreguntaAleatoria();
                setPreguntaActual(preguntaAleatoria);
                setPreguntasAnteriores(prev => [...prev, preguntaAleatoria.id]);
            }
        }
    };

    const mostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `NocJ3-feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '✖';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    return (
        <div className="juego-numeros">
            <HeaderGame estrellas={estrellas} to="/nociones" />

            <div className="NocJ3-juego-contenido">
                {preguntaActual && (
                    <div className="NocJ3-instruccion">
                        <div className="NocJ3-instruccion-header">
                            <p>{preguntaActual.instruccion}</p>
                            <AudioButton
                                audioSrc={preguntaActual.audio}
                                className="NocJ3-instruccion-audio"
                            />
                        </div>
                        <div className="NocJ3-opciones-imagenes">
                            {preguntaActual.opciones.map((opcion, index) => (
                                <div
                                    key={index}
                                    className="NocJ3-opcion-imagen-container"
                                    onClick={() => verificarRespuesta(opcion.esCorrecta)}
                                >
                                    <img
                                        src={opcion.imagen}
                                        alt={`Opción ${index + 1}`}
                                        className="NocJ3-opcion-imagen"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {mostrarModal && (
                <div className="NocJ3-modal">
                    <div className="NocJ3-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego3;