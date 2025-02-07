import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import jardinNumeros from '../../assets/imagenes/JardinNumeros.png';
import formasColores from '../../assets/imagenes/FormasColores.png';
import nociones from '../../assets/imagenes/Nociones.png';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="Home-seccion-modulos">
            <div className="Home-header">
                <div className="Home-titulo-contenedor">
                    <h2>Modelo Matemático</h2>
                </div>
            </div>

            <div className="Home-tarjetas-container">
                {/*  Modulo: Jardín de Números */}
                <div className="Home-tarjeta" onClick={() => navigate('/numeros')}>
                    <div className="Home-imagen-modulo">
                        <img src={jardinNumeros} alt="Jardín de Números" />
                    </div>
                    <h3>El Jardín de Números</h3>
                    <p>Identificar y nombrar números</p>
                    <button className="Home-play-button">
                        Jugar
                    </button>
                </div>

                {/* Modulo: Formas y Colores */}
                <div className="Home-tarjeta" onClick={() => navigate('/formas')}>
                    <div className="Home-imagen-modulo">
                        <img src={formasColores} alt="Formas y Colores" />
                    </div>
                    <h3>Formas y Colores</h3>
                    <p>Diferenciación de figuras y colores</p>
                    <button className="Home-play-button">
                        Jugar
                    </button>
                </div>

                {/* Modulo: Nociones Espaciales */}
                <div className="Home-tarjeta" onClick={() => navigate('/nociones')}>
                    <div className="Home-imagen-modulo">
                        <img src={nociones} alt="Nociones Espaciales" />
                    </div>
                    <h3>Nociones</h3>
                    <p>Posiciones y relaciones en el espacio</p>
                    <button className="Home-play-button">
                        Jugar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;