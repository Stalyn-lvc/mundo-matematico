import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FormasDashboard.css';
import juego1Imagen from '../../assets/imagenes/Formas/FormasJuego1.png';
import juego2Imagen from '../../assets/imagenes/Formas/FormasJuego2.png';
import juego3Imagen from '../../assets/imagenes/Formas/FormasJuego3.png';

function FormasDashboard() {
    const navigate = useNavigate();

    return (
        <div className="For-seccion-juegos">
            <div className="For-header">
                <button className="For-volver" onClick={() => navigate('/')}></button>
                <div className="For-titulo-contenedor">
                    <h2>Formas y Colores</h2>
                </div>
                
            </div>

            <div className="For-tarjetas-container">
                {/* Primera tarjeta - más pequeña */}
                <div className="For-tarjeta" onClick={() => navigate('/formas/juego1')}>
                    <div className="For-imagen-juego">
                        <img src={juego1Imagen} alt="Colorea la figura" />
                    </div>
                    <h3>Colorea la figura</h3>
                    <p>Identificar y Colorear las figuras</p>
                    <button className="For-play-button">Jugar</button>
                </div>

                {/* Segunda tarjeta - más grande */}
                <div className="For-tarjeta" onClick={() => navigate('/formas/juego2')}>
                    <div className="For-imagen-juego">
                        <img src={juego2Imagen} alt="Identificación de figuras" />
                    </div>
                    <h3>Identificación de figuras</h3>
                    <p>Identificar y Colorear las figuras</p>
                    <button className="For-play-button">Jugar</button>
                </div>

                {/* Tercera tarjeta - más pequeña */}
                <div className="For-tarjeta" onClick={() => navigate('/formas/juego3')}>
                    <div className="For-imagen-juego">
                        <img src={juego3Imagen} alt="Formar objetos con figuras" />
                    </div>
                    <h3>Formar objetos con figuras</h3>
                    <p>Ensambla objetos usando formas</p>
                    <button className="For-play-button">Jugar</button>
                </div>
            </div>
        </div>
    );
}

export default FormasDashboard;