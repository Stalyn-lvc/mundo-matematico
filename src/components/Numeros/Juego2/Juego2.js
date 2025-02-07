import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Juego2.css';
import HeaderGame from '../../ui/header_game';

const Juego2 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [nivelActual, setNivelActual] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    const frutas = ['🍎', '🍐', '🍌', '🍊', '🍇', '🍉', '🍓', '🍑', '🥝'];

    const mezclarArray = (array) => array.sort(() => Math.random() - 0.5);

    const generarNuevoNivel = () => {
        const frutaAleatoria = frutas[Math.floor(Math.random() * frutas.length)];
        const cantidadAleatoria = Math.floor(Math.random() * 7) + 1;

        let opciones = [cantidadAleatoria];
        while (opciones.length < 3) {
            const randomNum = Math.floor(Math.random() * 9) + 1;
            if (!opciones.includes(randomNum)) opciones.push(randomNum);
        }
        opciones = mezclarArray(opciones);

        setNivelActual({ fruta: frutaAleatoria, cantidad: cantidadAleatoria, opciones });
    };

    useEffect(() => {
        generarNuevoNivel();
    }, []);

    const verificarRespuesta = (numeroSeleccionado) => {
        const esCorrecta = numeroSeleccionado === nivelActual.cantidad;
        mostrarFeedback(esCorrecta);
        
        if (esCorrecta) {
            const nuevasEstrellas = estrellas + 1;
            setEstrellas(nuevasEstrellas);
            
            if (nuevasEstrellas >= 5) {
                setTimeout(() => setMostrarModal(true), 1000);
            } else {
                setTimeout(() => generarNuevoNivel(), 1500);
            }
        }
    };

    const mostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `NumJ2-feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '✖';
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    };

    const reiniciarJuego = () => {
        setEstrellas(0);
        setMostrarModal(false);
        generarNuevoNivel();
    };

    return (
        <div className="NumJ2-juego-mundo">
            <HeaderGame estrellas={estrellas} to="/numeros" />
            
            <div className="NumJ2-juego-contenido">
                <div className="NumJ2-instruccion">
                    <div className="NumJ2-instruccion-header">
                        <p>Selecciona la cantidad de Frutas:</p>
                    </div>
                </div>

                {nivelActual && (
                    <>
                        <div className="NumJ2-elementos-container">
                            {Array(nivelActual.cantidad).fill(null).map((_, index) => (
                                <div key={index} className="NumJ2-fruta">{nivelActual.fruta}</div>
                            ))}
                        </div>
                        <div className="NumJ2-opciones-numeros">
                            {nivelActual.opciones.map((numero, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => verificarRespuesta(numero)} 
                                    className="NumJ2-opcion-numero-container"
                                >
                                    <span className="NumJ2-opcion-numero">{numero}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {mostrarModal && (
                <div className="NumJ2-modal">
                    <div className="NumJ2-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={reiniciarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego2;