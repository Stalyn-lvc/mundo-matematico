import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Juego2.css';
import AudioButton from '../../common/AudioButton/AudioButton';
import leon from '../../../assets/imagenes/Nociones/leon.png';
import mesa from '../../../assets/imagenes/Nociones/mesa.png';

// Importar audios
import audioArriba from '../../../assets/audios/Nociones/arriba.mp3';
import audioAbajo from '../../../assets/audios/Nociones/abajo.mp3';
import audioDerecha from '../../../assets/audios/Nociones/derecha.mp3';
import audioIzquierda from '../../../assets/audios/Nociones/izquierda.mp3';
import HeaderGame from '../../ui/header_game';

const Juego2 = () => {
    const navigate = useNavigate();
    const [estrellas, setEstrellas] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [instruccionActual, setInstruccionActual] = useState(null);
    const [posicionLeon, setPosicionLeon] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zonaActiva, setZonaActiva] = useState('');
    const [instruccionesUsadas, setInstruccionesUsadas] = useState([]);

    const todasLasInstrucciones = [
        { 
            texto: "Coloca el león arriba de la mesa", 
            posicionCorrecta: "detras",
            audio: audioArriba
        },
        { 
            texto: "Coloca el león abajo de la mesa", 
            posicionCorrecta: "delante",
            audio: audioAbajo
        },
        { 
            texto: "Coloca el león a la izquierda de la mesa", 
            posicionCorrecta: "izquierda",
            audio: audioIzquierda
        },
        { 
            texto: "Coloca el león a la derecha de la mesa", 
            posicionCorrecta: "derecha",
            audio: audioDerecha
        }
    ];

    const NocJ2ObtenerInstruccionAleatoria = () => {
        const instruccionesDisponibles = todasLasInstrucciones.filter(
            instruccion => !instruccionesUsadas.includes(instruccion.posicionCorrecta)
        );

        if (instruccionesDisponibles.length === 0) {
            setInstruccionesUsadas([]);
            return todasLasInstrucciones[Math.floor(Math.random() * todasLasInstrucciones.length)];
        }

        const instruccion = instruccionesDisponibles[
            Math.floor(Math.random() * instruccionesDisponibles.length)
        ];

        setInstruccionesUsadas(prev => [...prev, instruccion.posicionCorrecta]);
        return instruccion;
    };

    const NocJ2InicializarJuego = () => {
        setEstrellas(0);
        setMostrarModal(false);
        setPosicionLeon({ x: 50, y: 50 });
        setInstruccionesUsadas([]);
        setInstruccionActual(NocJ2ObtenerInstruccionAleatoria());
        setZonaActiva('');
    };

    useEffect(() => {
        NocJ2InicializarJuego();
    }, []);

    const calcularPosicionEnPorcentaje = (e, areaJuego) => {
        // Determinar si es un evento de mouse o touch
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const rect = areaJuego.getBoundingClientRect();
        const mouseX = ((clientX - rect.left) / rect.width) * 100;
        const mouseY = ((clientY - rect.top) / rect.height) * 100;
        
        return { mouseX, mouseY };
    };

    const NocJ2HandleStartDrag = (e) => {
        // Prevenir comportamiento por defecto para eventos táctiles
        e.preventDefault();
        
        const areaJuego = document.querySelector('.NocJ2-area-juego');
        const { mouseX, mouseY } = calcularPosicionEnPorcentaje(e, areaJuego);
        
        setOffset({
            x: mouseX - posicionLeon.x,
            y: mouseY - posicionLeon.y
        });
        setIsDragging(true);
    };

    const NocJ2HandleMoveDrag = (e) => {
        if (!isDragging) return;
        
        // Prevenir scroll durante el arrastre
        e.preventDefault();
        
        const areaJuego = document.querySelector('.NocJ2-area-juego');
        const { mouseX, mouseY } = calcularPosicionEnPorcentaje(e, areaJuego);

        let newX = mouseX - offset.x;
        let newY = mouseY - offset.y;

        // Asegurar que el león se mantenga dentro del área de juego
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        setPosicionLeon({ x: newX, y: newY });

        // Determinar zona activa
        if (newY < 30) setZonaActiva('detras');
        else if (newY > 70) setZonaActiva('delante');
        else if (newX < 30) setZonaActiva('izquierda');
        else if (newX > 70) setZonaActiva('derecha');
        else setZonaActiva('');
    };

    const NocJ2HandleEndDrag = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const areaJuego = document.querySelector('.NocJ2-area-juego');
        
        // Añadir listeners para eventos de mouse
        areaJuego.addEventListener('mousedown', NocJ2HandleStartDrag);
        window.addEventListener('mousemove', NocJ2HandleMoveDrag);
        window.addEventListener('mouseup', NocJ2HandleEndDrag);
        
        // Añadir listeners para eventos táctiles
        areaJuego.addEventListener('touchstart', NocJ2HandleStartDrag, { passive: false });
        window.addEventListener('touchmove', NocJ2HandleMoveDrag, { passive: false });
        window.addEventListener('touchend', NocJ2HandleEndDrag);
        
        return () => {
            // Limpiar todos los listeners
            areaJuego.removeEventListener('mousedown', NocJ2HandleStartDrag);
            window.removeEventListener('mousemove', NocJ2HandleMoveDrag);
            window.removeEventListener('mouseup', NocJ2HandleEndDrag);
            
            areaJuego.removeEventListener('touchstart', NocJ2HandleStartDrag);
            window.removeEventListener('touchmove', NocJ2HandleMoveDrag);
            window.removeEventListener('touchend', NocJ2HandleEndDrag);
        };
    }, [isDragging, offset, posicionLeon]);

    const NocJ2MostrarFeedback = (esCorrecta) => {
        const feedback = document.createElement('div');
        feedback.className = `NocJ2-feedback ${esCorrecta ? 'correcto' : 'incorrecto'}`;
        feedback.innerHTML = esCorrecta ? '★' : '✖';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    const NocJ2VerificarPosicion = () => {
        if (!instruccionActual) return;
        
        const esCorrecta = zonaActiva === instruccionActual.posicionCorrecta;
        NocJ2MostrarFeedback(esCorrecta);
        
        if (esCorrecta) {
            const nuevasEstrellas = estrellas + 1;
            setEstrellas(nuevasEstrellas);
            
            if (nuevasEstrellas >= 5) {
                setTimeout(() => setMostrarModal(true), 1000);
            } else {
                setPosicionLeon({ x: 50, y: 50 });
                setZonaActiva('');
                setInstruccionActual(NocJ2ObtenerInstruccionAleatoria());
            }
        }
    };

    return (
        <div className="NocJ2-juego">
            <HeaderGame estrellas={estrellas} to="/nociones" />
            <div className="NocJ2-juego-contenido">
                {instruccionActual && (
                    <div className="NocJ2-instruccion">
                        <div className="NocJ2-instruccion-header">
                            <p>{instruccionActual.texto}</p>
                            <AudioButton 
                                audioSrc={instruccionActual.audio}
                                className="NocJ2-instruccion-audio"
                            />
                        </div>
                    </div>
                )}

                <div 
                    className="NocJ2-area-juego"
                    style={{ touchAction: 'none' }}
                >
                    <div className={`NocJ2-zona-guia detras ${zonaActiva === 'detras' ? 'activa' : ''}`}></div>
                    <div className={`NocJ2-zona-guia delante ${zonaActiva === 'delante' ? 'activa' : ''}`}></div>
                    <div className={`NocJ2-zona-guia izquierda ${zonaActiva === 'izquierda' ? 'activa' : ''}`}></div>
                    <div className={`NocJ2-zona-guia derecha ${zonaActiva === 'derecha' ? 'activa' : ''}`}></div>
                    
                    <img 
                        src={mesa} 
                        alt="Mesa" 
                        className="NocJ2-mesa"
                    />
                    <img 
                        src={leon} 
                        alt="León" 
                        className="NocJ2-leon"
                        style={{
                            left: `${posicionLeon.x}%`,
                            top: `${posicionLeon.y}%`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                        draggable="false"
                    />
                </div>

                <button 
                    className="NocJ2-verificar-btn"
                    onClick={NocJ2VerificarPosicion}
                >
                    Verificar Posición
                </button>
            </div>

            {mostrarModal && (
                <div className="NocJ2-modal">
                    <div className="NocJ2-modal-contenido">
                        <h2>¡FELICIDADES!</h2>
                        <p>¡Has ganado 5 estrellas! 🌟🌟🌟🌟🌟</p>
                        <button onClick={NocJ2InicializarJuego}>Jugar de nuevo</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juego2;