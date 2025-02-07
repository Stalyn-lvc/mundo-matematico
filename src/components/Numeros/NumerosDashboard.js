import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NumerosDashboard.css';
import juego1Imagen from '../../assets/imagenes/NumerosJuego1.png';
import juego2Imagen from '../../assets/imagenes/NumerosJuego2.png';
import juego3Imagen from '../../assets/imagenes/NumerosJuego3.png';

function NumerosDashboard() {
    const navigate = useNavigate();

    return (
        <div className="Num-seccion-juegos">
            <div className="Num-header">
                <button className="Num-volver" onClick={() => navigate('/')}></button>
                <div className="Num-titulo-contenedor">
                    <h2>El Jardín de Números</h2>
                </div>
            </div>

            <div className="Num-tarjetas-container">
                <div className="Num-tarjeta" onClick={() => navigate('/numeros/juego1')}>
                    <div className="Num-imagen-juego">
                        <img src={juego1Imagen} alt="Aventura Numérica" />
                    </div>
                    <h3>Aventura Numérica</h3>
                    <p>Enseña a contar secuencias</p>
                    <button className="Num-play-button">Jugar</button>
                </div>

                <div className="Num-tarjeta" onClick={() => navigate('/numeros/juego2')}>
                    <div className="Num-imagen-juego">
                        <img src={juego2Imagen} alt="Números en Nuestro Mundo" />
                    </div>
                    <h3>Números en Nuestro Mundo</h3>
                    <p>Señala la figura correcta</p>
                    <button className="Num-play-button">Jugar</button>
                </div>

                <div className="Num-tarjeta" onClick={() => navigate('/numeros/juego3')}>
                    <div className="Num-imagen-juego">
                        <img src={juego3Imagen} alt="Dibujando Números" />
                    </div>
                    <h3>Dibujando Números</h3>
                    <p>Dibuja el número que aparece</p>
                    <button className="Num-play-button">Jugar</button>
                </div>
            </div>
        </div>
    );
}

export default NumerosDashboard;