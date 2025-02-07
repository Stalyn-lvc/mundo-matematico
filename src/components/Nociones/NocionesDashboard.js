import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NocionesDashboard.css';
import flechaIcon from '../../assets/imagenes/flecha.png';
import nocionesJ1 from '../../assets/imagenes/Nociones/NocionesJ1.png';
import nocionesJ2 from '../../assets/imagenes/Nociones/NocionesJ2.png';
import nocionesJ3 from '../../assets/imagenes/Nociones/NocionesJ3.png';

function NocionesDashboard() {
    const navigate = useNavigate();

    return (
        <div className="Noc-seccion-juegos">
            <div className="Noc-header">
                <button className="Noc-volver" onClick={() => navigate('/')}></button>
                <div className="Noc-titulo-contenedor">
                    <h2>Nociones Espaciales</h2>
                </div>
            </div>

            <div className="Noc-tarjetas-container">
                <div className="Noc-tarjeta" onClick={() => navigate('/nociones/juego1')}>
                    <div className="Noc-imagen-juego">
                        <img src={nocionesJ1} alt="Posiciones Básicas" />
                    </div>
                    <h3>Posiciones Básicas</h3>
                    <p>Aprende arriba, abajo, dentro y fuera</p>
                    <button className="Noc-play-button">Jugar</button>
                </div>

                <div className="Noc-tarjeta" onClick={() => navigate('/nociones/juego2')}>
                    <div className="Noc-imagen-juego">
                        <img src={nocionesJ2} alt="Relaciones Espaciales" />
                    </div>
                    <h3>Relaciones Espaciales</h3>
                    <p>Identifica arriba, abajo, izquierda y derecha</p>
                    <button className="Noc-play-button">Jugar</button>
                </div>

                <div className="Noc-tarjeta" onClick={() => navigate('/nociones/juego3')}>
                    <div className="Noc-imagen-juego">
                        <img src={nocionesJ3} alt="Nociones de Tiempo" />
                    </div>
                    <h3>Nociones de Tiempo</h3>
                    <p>Aprende sobre día, noche y el clima</p>
                    <button className="Noc-play-button">Jugar</button>
                </div>
            </div>
        </div>
    );
}

export default NocionesDashboard;