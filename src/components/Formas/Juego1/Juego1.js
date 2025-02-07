import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LienzoColor from './ColorCanvas'; 
import AudioButton from '../../common/AudioButton/AudioButton';
import colorAmarillo from '../../../assets/audios/Formas/Amarillo.mp3';
import colorAzul from '../../../assets/audios/Formas/Azul.mp3';
import colorRojo from '../../../assets/audios/Formas/Rojo.mp3';
import colorVerde from '../../../assets/audios/Formas/Verde.mp3';
import colorNaranja from '../../../assets/audios/Formas/Naranja.mp3';
import colorMorado from '../../../assets/audios/Formas/Morado.mp3';
import './Juego1.css';
import HeaderGame from '../../ui/header_game';

const Juego1 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [figuraActual, setFiguraActual] = useState('');
    const [colorObjetivo, setColorObjetivo] = useState('');
    const [coloresDisponibles, setColoresDisponibles] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
    const [colorSeleccionado, setColorSeleccionado] = useState(null);
    const [ultimaFigura, setUltimaFigura] = useState('');
    const canvasRef = useRef(null);

    // Definición de figuras y colores
    const figuras = ['triangulo', 'cuadrado', 'circulo', 'rectangulo', 'estrella'];

    const coloresPosibles = {
        amarillo: '#FFE600',
        azul: '#0066FF',
        rojo: '#FF0000',
        verde: '#00FF00',
        naranja: '#FF6600',
        morado: '#9933FF'
    };

    const audios = {
        amarillo: colorAmarillo,
        azul: colorAzul,
        rojo: colorRojo,
        verde: colorVerde,
        naranja: colorNaranja,
        morado: colorMorado
    };

    // Seleccionar figura aleatoria sin repetir la última
    const seleccionarFiguraAleatoria = () => {
        const figurasDisponibles = figuras.filter(figura => figura !== ultimaFigura);
        const figuraSeleccionada = figurasDisponibles[Math.floor(Math.random() * figurasDisponibles.length)];
        setUltimaFigura(figuraSeleccionada);
        return figuraSeleccionada;
    };

    // Seleccionar colores aleatorios para la paleta
    const seleccionarColoresAleatorios = (ultimoColorObjetivo) => {
        const coloresDisponibles = Object.entries(coloresPosibles)
            .filter(([nombre]) => nombre !== ultimoColorObjetivo);
        
        const colorObj = coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)][0];

        const coloresRestantes = coloresDisponibles
            .filter(([nombre]) => nombre !== colorObj);
        
        // Mezclar colores restantes
        for (let i = coloresRestantes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coloresRestantes[i], coloresRestantes[j]] = 
            [coloresRestantes[j], coloresRestantes[i]];
        }

        const coloresPaleta = coloresRestantes.slice(0, 2);

        // Insertar color objetivo en posición aleatoria
        const posicionAleatoria = Math.floor(Math.random() * 3);
        coloresPaleta.splice(posicionAleatoria, 0, [colorObj, coloresPosibles[colorObj]]);

        return {
            colorObjetivo: colorObj,
            colores: coloresPaleta
        };
    };

    // Inicializar juego
    useEffect(() => {
        inicializarJuego();
    }, []);

    const inicializarJuego = () => {
        const nuevaFigura = seleccionarFiguraAleatoria();
        const { colorObjetivo: nuevoColorObjetivo, colores } = seleccionarColoresAleatorios(colorObjetivo);
        
        setFiguraActual(nuevaFigura);
        setColorObjetivo(nuevoColorObjetivo);
        setColoresDisponibles(colores);
        setMostrarModal(false);
        setMostrarMensajeError(false);
        setColorSeleccionado(null);
        
        // Limpiar lienzo usando el método expuesto por ref
        if (canvasRef.current) {
            canvasRef.current.limpiarCanvas();
        }
    };

    // Mostrar feedback de acierto o error
    const mostrarFeedback = (correcto, errorTipo) => {
        const feedback = document.createElement('div');
        feedback.className = `formas-feedback ${correcto ? 'formas-correcto' : 'formas-incorrecto'}`;
        feedback.innerHTML = correcto ? '★' : '✖';
        document.body.appendChild(feedback);

        if (!correcto) {
            setMostrarMensajeError(errorTipo || 'fuera');
            setTimeout(() => setMostrarMensajeError(false), 2000);
        }

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    // Verificar coloreado
    const handleVerificar = () => {
        if (!colorSeleccionado) {
            setMostrarMensajeError('seleccionar');
            setTimeout(() => setMostrarMensajeError(false), 2000);
            return;
        }

        if (canvasRef.current) {
            const resultadoPintado = canvasRef.current.validarColoreo();
            const colorCorrecto = colorSeleccionado === colorObjetivo;

            if (!resultadoPintado) {
                mostrarFeedback(false, 'fuera');
                return;
            }

            if (!colorCorrecto) {
                mostrarFeedback(false, 'color');
                return;
            }

            mostrarFeedback(true);
            const nuevasEstrellas = estrellas + 1;
            setEstrellas(nuevasEstrellas);

            if (nuevasEstrellas >= 3) {
                setTimeout(() => {
                    setMostrarModal(true);
                    setEstrellas(0); 
                }, 1000);
            } else {
                const nuevaFigura = seleccionarFiguraAleatoria();
                const { colorObjetivo: nuevoColorObjetivo, colores } = seleccionarColoresAleatorios(colorObjetivo);
                setFiguraActual(nuevaFigura);
                setColorObjetivo(nuevoColorObjetivo);
                setColoresDisponibles(colores);
                setColorSeleccionado(null);
                canvasRef.current.limpiarCanvas();
            }
        }
    };

    // Obtener mensaje de error
    const getMensajeError = () => {
        switch (mostrarMensajeError) {
            case 'fuera':
                return '¡Intenta colorear dentro de la figura!';
            case 'color':
                return `¡Ese no es el color ${colorObjetivo}!`;
            case 'seleccionar':
                return '¡Selecciona un color primero!';
            default:
                return '';
        }
    };

    return (
        <div className="formas-juego-colorear">
            <HeaderGame estrellas={estrellas} to="/formas" />

            <div className="formas-juego-contenido">
                <div className="formas-colores-seccion">
                    <div className="formas-paleta-colores">
                        {coloresDisponibles.map(([nombre, codigo]) => (
                            <button
                                key={nombre}
                                className={`formas-color-btn ${colorSeleccionado === nombre ? 'formas-seleccionado' : ''}`}
                                style={{ backgroundColor: codigo }}
                                onClick={() => setColorSeleccionado(nombre)}
                            />
                        ))}
                    </div>
                </div>

                <div className="formas-area-dibujo">
                    <div className="formas-figura-guia">
                        <span>Colorea el/la {figuraActual} de color {colorObjetivo}</span>
                        <AudioButton 
                            audioSrc={audios[colorObjetivo]}
                            className="formas-instruccion-audio"
                        />
                    </div>
                    
                    <LienzoColor
                        ref={canvasRef}
                        figuraActual={figuraActual}
                        colorSeleccionado={colorSeleccionado ? coloresPosibles[colorSeleccionado] : null}
                    />

                    {mostrarMensajeError && (
                        <div className="formas-mensaje-error">
                            {getMensajeError()}
                        </div>
                    )}

                    <div className="formas-controles">
                        <button onClick={() => {
                            if (canvasRef.current) {
                                canvasRef.current.limpiarCanvas();
                            }
                        }}>Borrar</button>
                        <button onClick={handleVerificar}>Verificar</button>
                    </div>
                </div>
            </div>

            {mostrarModal && (
                <div className="formas-modal">
                    <div className="formas-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 3 estrellas! 🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego1;