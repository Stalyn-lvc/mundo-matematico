import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../common/AudioButton/AudioButton';
import './Juego2.css';

// Importar imágenes de colores
import imgAmarillo from '../../../assets/imagenes/Formas/Amarillo.png';
import imgAzul from '../../../assets/imagenes/Formas/Azul.png';
import imgRojo from '../../../assets/imagenes/Formas/Rojo.png';
import imgVerde from '../../../assets/imagenes/Formas/Verde.png';

// Importar imágenes de formas
import imgCuadrado from '../../../assets/imagenes/Formas/Cuadrado.png';
import imgCirculo from '../../../assets/imagenes/Formas/Circulo.png';
import imgRectangulo from '../../../assets/imagenes/Formas/Rectangulo.png';
import imgTriangulo from '../../../assets/imagenes/Formas/Triangulo.png';

// Importar audios
import audioAmarillo from '../../../assets/audios/Formas/J2_Amarillo.mp3';
import audioAzul from '../../../assets/audios/Formas/J2_Azul.mp3';
import audioRojo from '../../../assets/audios/Formas/J2_Rojo.mp3';
import audioVerde from '../../../assets/audios/Formas/J2_Verde.mp3';
import audioCirculo from '../../../assets/audios/Formas/J2_Circulo.mp3';
import audioCuadrado from '../../../assets/audios/Formas/J2_Cuadrado.mp3';
import audioRectangulo from '../../../assets/audios/Formas/J2_Rectangulo.mp3';
import audioTriangulo from '../../../assets/audios/Formas/J2_Triangulo.mp3';
import HeaderGame from '../../ui/header_game';

// Definir las preguntas fuera del componente
const preguntas = [
    // Preguntas de colores
    {
        tipo: 'color',
        instruccion: "Señala el color AMARILLO",
        audio: audioAmarillo,
        opciones: [
            { imagen: imgAmarillo, valor: "amarillo", esCorrecta: true },
            { imagen: imgAzul, valor: "azul", esCorrecta: false },
            { imagen: imgRojo, valor: "rojo", esCorrecta: false }
        ]
    },
    {
        tipo: 'color',
        instruccion: "Señala el color AZUL",
        audio: audioAzul,
        opciones: [
            { imagen: imgAzul, valor: "azul", esCorrecta: true },
            { imagen: imgVerde, valor: "verde", esCorrecta: false },
            { imagen: imgRojo, valor: "rojo", esCorrecta: false }
        ]
    },
    {
        tipo: 'color',
        instruccion: "Señala el color ROJO",
        audio: audioRojo,
        opciones: [
            { imagen: imgRojo, valor: "rojo", esCorrecta: true },
            { imagen: imgAmarillo, valor: "amarillo", esCorrecta: false },
            { imagen: imgVerde, valor: "verde", esCorrecta: false }
        ]
    },
    {
        tipo: 'color',
        instruccion: "Señala el color VERDE",
        audio: audioVerde,
        opciones: [
            { imagen: imgVerde, valor: "verde", esCorrecta: true },
            { imagen: imgAzul, valor: "azul", esCorrecta: false },
            { imagen: imgAmarillo, valor: "amarillo", esCorrecta: false }
        ]
    },
    // Preguntas de formas
    {
        tipo: 'forma',
        instruccion: "Señala el CÍRCULO",
        audio: audioCirculo,
        opciones: [
            { imagen: imgCirculo, valor: "círculo", esCorrecta: true },
            { imagen: imgCuadrado, valor: "cuadrado", esCorrecta: false },
            { imagen: imgTriangulo, valor: "triángulo", esCorrecta: false }
        ]
    },
    {
        tipo: 'forma',
        instruccion: "Señala el CUADRADO",
        audio: audioCuadrado,
        opciones: [
            { imagen: imgCuadrado, valor: "cuadrado", esCorrecta: true },
            { imagen: imgRectangulo, valor: "rectángulo", esCorrecta: false },
            { imagen: imgCirculo, valor: "círculo", esCorrecta: false }
        ]
    },
    {
        tipo: 'forma',
        instruccion: "Señala el RECTÁNGULO",
        audio: audioRectangulo,
        opciones: [
            { imagen: imgRectangulo, valor: "rectángulo", esCorrecta: true },
            { imagen: imgTriangulo, valor: "triángulo", esCorrecta: false },
            { imagen: imgCuadrado, valor: "cuadrado", esCorrecta: false }
        ]
    },
    {
        tipo: 'forma',
        instruccion: "Señala el TRIÁNGULO",
        audio: audioTriangulo,
        opciones: [
            { imagen: imgTriangulo, valor: "triángulo", esCorrecta: true },
            { imagen: imgCirculo, valor: "círculo", esCorrecta: false },
            { imagen: imgRectangulo, valor: "rectángulo", esCorrecta: false }
        ]
    }
];

const Juego2 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tipoAnterior, setTipoAnterior] = useState(null);
    const [ultimasOrdenes, setUltimasOrdenes] = useState([]);

    const obtenerNuevaPregunta = () => {
        // Separar preguntas por tipo
        const preguntasColores = preguntas.filter(p => p.tipo === 'color');
        const preguntasFormas = preguntas.filter(p => p.tipo === 'forma');
        
        // Seleccionar tipo opuesto al anterior
        let tipoActual;
        if (!tipoAnterior) {
            tipoActual = Math.random() < 0.5 ? 'color' : 'forma';
        } else {
            tipoActual = tipoAnterior === 'color' ? 'forma' : 'color';
        }
        
        // Filtrar preguntas disponibles que no estén en las últimas usadas
        const preguntasDisponibles = (tipoActual === 'color' ? preguntasColores : preguntasFormas)
            .filter(pregunta => !ultimasOrdenes.includes(pregunta.instruccion));
        
        // Si no hay preguntas disponibles, usar todas las del tipo actual
        const preguntasParaUsar = preguntasDisponibles.length > 0 
            ? preguntasDisponibles 
            : (tipoActual === 'color' ? preguntasColores : preguntasFormas);
        
        // Seleccionar y mezclar pregunta aleatoria
        const preguntaAleatoria = {...preguntasParaUsar[Math.floor(Math.random() * preguntasParaUsar.length)]};
        preguntaAleatoria.opciones = [...preguntaAleatoria.opciones].sort(() => Math.random() - 0.5);
        
        // Actualizar estados
        setTipoAnterior(tipoActual);
        setUltimasOrdenes(prev => {
            const nuevas = [...prev, preguntaAleatoria.instruccion];
            if (nuevas.length > 4) { // Mantener últimas 4 órdenes
                nuevas.shift();
            }
            return nuevas;
        });
        
        return preguntaAleatoria;
    };

    const inicializarJuego = () => {
        setEstrellas(0);
        setUltimasOrdenes([]);
        setTipoAnterior(null);
        const nuevaPregunta = obtenerNuevaPregunta();
        setPreguntaActual(nuevaPregunta);
        setMostrarModal(false);
    };

    useEffect(() => {
        inicializarJuego();
    }, []);

    const mostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `formas-j2-feedback ${esCorrecta ? 'formas-j2-correcto' : 'formas-j2-incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '☹';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

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
                setTimeout(() => {
                    const nuevaPregunta = obtenerNuevaPregunta();
                    setPreguntaActual(nuevaPregunta);
                }, 1500);
            }
        }
    };

    return (
        <div className="formas-j2-contenedor">
            <HeaderGame estrellas={estrellas} to="/formas" />

            <div className="formas-j2-juego-contenido">
                {preguntaActual && (
                    <div className="formas-j2-instruccion">
                        <div className="formas-j2-instruccion-header">
                            <p>{preguntaActual.instruccion}</p>
                            <AudioButton 
                                audioSrc={preguntaActual.audio}
                                className="formas-j2-instruccion-audio"
                            />
                        </div>
                        <div className="formas-j2-opciones-imagenes">
                            {preguntaActual.opciones.map((opcion, index) => (
                                <div 
                                    key={index}
                                    className="formas-j2-opcion-imagen-container"
                                    onClick={() => verificarRespuesta(opcion.esCorrecta)}
                                >
                                    <img 
                                        src={opcion.imagen} 
                                        alt={opcion.valor}
                                        className="formas-j2-opcion-imagen"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {mostrarModal && (
                <div className="formas-j2-modal">
                    <div className="formas-j2-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego2;