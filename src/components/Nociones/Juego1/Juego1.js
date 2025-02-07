import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Juego1.css';
import AudioButton from '../../common/AudioButton/AudioButton';

// Importación de imágenes
import imgAbajo from '../../../assets/imagenes/Nociones/abajo.png';
import imgAdelante from '../../../assets/imagenes/Nociones/adelante.png';
import imgAdentro from '../../../assets/imagenes/Nociones/adentro.png';
import imgAfuera from '../../../assets/imagenes/Nociones/afuera.png';
import imgArriba from '../../../assets/imagenes/Nociones/arriba.png';
import imgAtras from '../../../assets/imagenes/Nociones/atras.png';
import imgDerecha from '../../../assets/imagenes/Nociones/derecha.png';

// Importación de audios
import audioAbajo from '../../../assets/audios/Nociones/perroAbajo.mp3';
import audioAdelante from '../../../assets/audios/Nociones/perroAdelante.mp3';
import audioAdentro from '../../../assets/audios/Nociones/perroAdentro.mp3';
import audioIzquierda from '../../../assets/audios/Nociones/perroIzquierda.mp3';
import audioArriba from '../../../assets/audios/Nociones/perroArriba.mp3';
import audioAtras from '../../../assets/audios/Nociones/perroAtras.mp3';
import audioDerecha from '../../../assets/audios/Nociones/perroDerecha.mp3';
import HeaderGame from '../../ui/header_game';


// Componente principal del juego
const Juego1 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [preguntasAnteriores, setPreguntasAnteriores] = useState([]);

    // Definición de las preguntas del juego
    const preguntas = [
        {
            id: 1,
            instruccion: "Señala la imagen donde el perro se encuentra ARRIBA",
            audio: audioArriba,
            opciones: [
                { imagen: imgArriba, valor: "arriba", esCorrecta: true },
                { imagen: imgAbajo, valor: "abajo", esCorrecta: false },
                { imagen: imgAdentro, valor: "adentro", esCorrecta: false }
            ]
        },
        {
            id: 2,
            instruccion: "Señala la imagen donde el perro se encuentra ABAJO",
            audio: audioAbajo,
            opciones: [
                { imagen: imgAbajo, valor: "abajo", esCorrecta: true },
                { imagen: imgArriba, valor: "arriba", esCorrecta: false },
                { imagen: imgAtras, valor: "atras", esCorrecta: false }
            ]
        },
        {
            id: 3,
            instruccion: "Señala la imagen donde el perro se encuentra ADENTRO",
            audio: audioAdentro,
            opciones: [
                { imagen: imgAdentro, valor: "adentro", esCorrecta: true },
                { imagen: imgAfuera, valor: "afuera", esCorrecta: false },
                { imagen: imgAtras, valor: "atras", esCorrecta: false }
            ]
        },
        {
            id: 4,
            instruccion: "Señala la imagen donde el perro se encuentra a la IZQUIERDA",
            audio: audioIzquierda,
            opciones: [
                { imagen: imgAfuera, valor: "izquierda", esCorrecta: true },
                { imagen: imgAdentro, valor: "adentro", esCorrecta: false },
                { imagen: imgAdelante, valor: "adelante", esCorrecta: false }
            ]
        },
        {
            id: 5,
            instruccion: "Señala la imagen donde el perro se encuentra ADELANTE",
            audio: audioAdelante,
            opciones: [
                { imagen: imgAdelante, valor: "adelante", esCorrecta: true },
                { imagen: imgAtras, valor: "atras", esCorrecta: false },
                { imagen: imgArriba, valor: "arriba", esCorrecta: false }
            ]
        },
        {
            id: 6,
            instruccion: "Señala la imagen donde el perro se encuentra ATRÁS",
            audio: audioAtras,
            opciones: [
                { imagen: imgAtras, valor: "atras", esCorrecta: true },
                { imagen: imgAdelante, valor: "adelante", esCorrecta: false },
                { imagen: imgAbajo, valor: "abajo", esCorrecta: false }
            ]
        },
        {
            id: 7,
            instruccion: "Señala la imagen donde el perro se encuentra a la DERECHA",
            audio: audioDerecha,
            opciones: [
                { imagen: imgDerecha, valor: "derecha", esCorrecta: true },
                { imagen: imgAfuera, valor: "izquierda", esCorrecta: false },
                { imagen: imgAdelante, valor: "adelante", esCorrecta: false }
            ]
        }
    ];

    // Función para obtener una pregunta aleatoria
    const obtenerPreguntaAleatoria = () => {
        const preguntasDisponibles = preguntas.filter(
            pregunta => !preguntasAnteriores.includes(pregunta.id)
        );

        if (preguntasDisponibles.length === 0) {
            setPreguntasAnteriores([]);
            return { ...preguntas[Math.floor(Math.random() * preguntas.length)] };
        }

        return { ...preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)] };
    };

    const inicializarJuego = useCallback(() => {
        const preguntaAleatoria = obtenerPreguntaAleatoria();
        preguntaAleatoria.opciones = [...preguntaAleatoria.opciones].sort(() => Math.random() - 0.5);
        setPreguntaActual(preguntaAleatoria);
        setEstrellas(0);
        setMostrarModal(false);
        setPreguntasAnteriores([]);
    }, []);

    useEffect(() => {
        inicializarJuego();
    }, [inicializarJuego]);

    const mostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `NocJ1-feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '✖';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    // Función para verificar la respuesta seleccionada
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
                preguntaAleatoria.opciones = [...preguntaAleatoria.opciones].sort(() => Math.random() - 0.5);
                setPreguntaActual(preguntaAleatoria);
                setPreguntasAnteriores(prev => [...prev, preguntaAleatoria.id]);
            }
        }
    };

    // Renderizado del componente
    return (
        <div className="juego-numeros">
            <HeaderGame estrellas={estrellas} to="/nociones" />

            <div className="NocJ1-juego-contenido">
                {preguntaActual && (
                    <div className="NocJ1-instruccion">
                        <div className="instruccion-header">
                            <p>{preguntaActual.instruccion}</p>
                            <AudioButton
                                audioSrc={preguntaActual.audio}
                                className="instruccion-audio"
                            />
                        </div>
                        <div className="NocJ1-opciones-imagenes">
                            {preguntaActual.opciones.map((opcion, index) => (
                                <div
                                    key={index}
                                    className="NocJ1-opcion-imagen-container"
                                    onClick={() => verificarRespuesta(opcion.esCorrecta)}
                                >
                                    <img
                                        src={opcion.imagen}
                                        alt={`Opción ${index + 1}`}
                                        className="NocJ1-opcion-imagen"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {mostrarModal && (
                <div className="NocJ1-modal">
                    <div className="NocJ1-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego1;