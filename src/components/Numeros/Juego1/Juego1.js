import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import './Juego1.css';
import HeaderGame from '../../ui/header_game';


const JuegoNumeros = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [numeroActual, setNumeroActual] = useState(1); 
    const [numeros, setNumeros] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]); 
    const [indiceActual, setIndiceActual] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);

    const audios = { 1: numero1, 2: numero2, 3: numero3, 4: numero4, 5: numero5, 6: numero6, 7: numero7, 8: numero8, 9: numero9 };

    const obtenerRutaAudio = (numero) => audios[numero];

    const obtenerColorNumero = (num) => {
        const colores = {
            1: '#FF5733', 2: '#33FF57', 3: '#3357FF',
            4: '#FF33F5', 5: '#33FFF5', 6: '#FFB533',
            7: '#FF3333', 8: '#33FF33', 9: '#3333FF'
        };
        return colores[num] || '#000000';
    };

    const inicializarJuego = useCallback(() => {
        const numerosDisponibles = mezclarArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        setNumeros(numerosDisponibles);
        setNumeroActual(numerosDisponibles[0]);
        setEstrellas(0);
        setIndiceActual(0);
        setMostrarModal(false);
    }, []);

    useEffect(() => {
        inicializarJuego();
    }, [inicializarJuego]);

    const mezclarArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const verificarRespuesta = (numeroSeleccionado) => {
        const esCorrecta = numeroSeleccionado === numeroActual;
        mostrarFeedback(esCorrecta);
        
        if (esCorrecta) {
            const nuevasEstrellas = estrellas + 1;
            setEstrellas(nuevasEstrellas);
            
            if (nuevasEstrellas >= 5) {
                setTimeout(() => setMostrarModal(true), 1000);
            } else {
                setIndiceActual(indiceActual + 1);
                setNumeroActual(numeros[indiceActual + 1]);
            }
        }
    };

    const mostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `NumJ1-feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '✖';
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    };

    const convertirATexto = (numero) => {
        const textos = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
        return textos[numero - 1] || '';
    };

    const opciones = useMemo(() => {
        if (!numeroActual) return [];
        const nums = [numeroActual];
        while (nums.length < 3) {
            const randomNum = Math.floor(Math.random() * 9) + 1;
            if (!nums.includes(randomNum)) nums.push(randomNum);
        }
        return mezclarArray(nums);
    }, [numeroActual]);

    return (
        <div className="NumJ1-juego">
            <HeaderGame estrellas={estrellas} to="/numeros" />
            
            <div className="NumJ1-juego-contenido">
                <div className="NumJ1-instruccion">
                    <div className="NumJ1-instruccion-header">
                        <p>Selecciona el Número: <span>{convertirATexto(numeroActual)}</span></p>
                        {numeroActual && <AudioButton audioSrc={obtenerRutaAudio(numeroActual)} className="NumJ1-numero-audio" />}
                    </div>
                    <div className="NumJ1-opciones-numeros">
                        {opciones.map((numero, index) => (
                            <button 
                                key={index} 
                                onClick={() => verificarRespuesta(numero)} 
                                className="NumJ1-opcion-numero-container"
                                style={{ color: obtenerColorNumero(numero) }}
                            >
                                {numero}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {mostrarModal && (
                <div className="NumJ1-modal">
                    <div className="NumJ1-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={inicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JuegoNumeros;