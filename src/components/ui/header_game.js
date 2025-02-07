import { useNavigate, useLocation } from "react-router-dom";
import '../../assets/css/header_game.css';

export default function HeaderGame({estrellas, to}) {
    const navigate = useNavigate();
    const location = useLocation();

    const obtenerTituloJuego = () => {
        const juegos = {
            // Números
            '/numeros/juego1': 'Aventura Numérica',
            '/numeros/juego2': 'Números en Nuestro Mundo',
            '/numeros/juego3': 'Dibujando Números',
            
            // Formas
            '/formas/juego1': 'Colorea la figura',
            '/formas/juego2': 'Identificación de figuras',
            '/formas/juego3': 'Formar objetos con figuras',
            
            // Nociones
            '/nociones/juego1': 'Posiciones Básicas',
            '/nociones/juego2': 'Relaciones Espaciales',
            '/nociones/juego3': 'Nociones de Tiempo'
        };
        return juegos[location.pathname] || 'Juego Educativo';
    };

    const StarGrid = ({ totalStars }) => {
        return (
            <div className="star-grid-container">
                <div className="star-row-top">
                    {[...Array(Math.min(3, totalStars))].map((_, index) => (
                        <span key={`top-${index}`} className="Noc-estrella">★</span>
                    ))}
                </div>
                {totalStars > 3 && (
                    <div className="star-row-bottom">
                        {[...Array(Math.min(2, totalStars - 3))].map((_, index) => (
                            <span key={`bottom-${index}`} className="Noc-estrella">★</span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="Noc-header-container">
            <div className="Noc-header">
                <button className="Noc-volver" onClick={() => navigate(to)}>←</button>
                <div className="Noc-titulo-contenedor">
                    <h2>{obtenerTituloJuego()}</h2>
                </div>
                <div className="Noc-estrellas">
                    <StarGrid totalStars={estrellas} />
                </div>
            </div>
        </div>
    );
}