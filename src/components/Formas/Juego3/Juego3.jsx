import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Juego3.css';
import HeaderGame from '../../ui/header_game';

const Juego3 = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const previewCanvasRefs = useRef({});
    const [figuraSeleccionada, setFiguraSeleccionada] = useState(null);
    const [figurasColocadas, setFigurasColocadas] = useState([]);
    const [puntoInicial, setPuntoInicial] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [estrellas, setEstrellas] = useState(0);
    const [puntosTriangulo, setPuntosTriangulo] = useState([]);

    const figuras = [
        { id: 'cuadrado', nombre: 'Cuadrado', color: '#4A90E2' },
        { id: 'triangulo', nombre: 'Triángulo', color: '#50E3C2' },
        { id: 'rectangulo', nombre: 'Rectángulo', color: '#F5A623' },
        { id: 'circulo', nombre: 'Círculo', color: '#D0021B' }
    ];

    // Inicializar las vistas previas de las figuras
    useEffect(() => {
        figuras.forEach(figura => {
            const canvas = previewCanvasRefs.current[figura.id];
            if (canvas) {
                const ctx = canvas.getContext('2d');
                dibujarPreview(ctx, figura, canvas.width, canvas.height);
            }
        });
    }, []);

    // Función para dibujar las previsualizaciones en el panel lateral
    const dibujarPreview = (ctx, figura, width, height) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = figura.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.6;

        switch (figura.id) {
            case 'cuadrado':
                ctx.rect(centerX - size/2, centerY - size/2, size, size);
                break;
            case 'triangulo':
                ctx.moveTo(centerX, centerY - size/2);
                ctx.lineTo(centerX + size/2, centerY + size/2);
                ctx.lineTo(centerX - size/2, centerY + size/2);
                break;
            case 'rectangulo':
                ctx.rect(centerX - size*0.6, centerY - size/3, size*1.2, size*0.6);
                break;
            case 'circulo':
                ctx.arc(centerX, centerY, size/2, 0, Math.PI * 2);
                break;
            default:
                break;
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    // Función para obtener las coordenadas exactas del mouse
    const obtenerCoordenadas = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    // Función para dibujar figuras en el canvas principal
    const dibujarFigura = (ctx, figura, punto1, punto2) => {
        ctx.fillStyle = figura.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (figura.id === 'triangulo' && Array.isArray(punto1)) {
            // Dibujo especial para triángulo con 3 puntos
            ctx.moveTo(punto1[0].x, punto1[0].y);
            ctx.lineTo(punto1[1].x, punto1[1].y);
            ctx.lineTo(punto1[2].x, punto1[2].y);
        } else {
            const width = Math.abs(punto2.x - punto1.x);
            const height = Math.abs(punto2.y - punto1.y);
            const minX = Math.min(punto1.x, punto2.x);
            const minY = Math.min(punto1.y, punto2.y);
            const centerX = minX + width/2;
            const centerY = minY + height/2;

            switch (figura.id) {
                case 'cuadrado':
                    const lado = Math.max(width, height);
                    ctx.rect(centerX - lado/2, centerY - lado/2, lado, lado);
                    break;
                case 'rectangulo':
                    ctx.rect(minX, minY, width, height);
                    break;
                case 'circulo':
                    const radio = Math.max(width, height) / 2;
                    ctx.arc(centerX, centerY, radio, 0, Math.PI * 2);
                    break;
            }
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    // Función para renderizar el canvas
    const renderizar = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar figuras colocadas
        figurasColocadas.forEach(figura => {
            dibujarFigura(ctx, figura, figura.punto1, figura.punto2);
        });

        // Si estamos dibujando un triángulo, mostrar los puntos y líneas en progreso
        if (figuraSeleccionada?.id === 'triangulo' && puntosTriangulo.length > 0) {
            ctx.strokeStyle = '#666';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();

            // Dibujar líneas entre los puntos existentes
            ctx.moveTo(puntosTriangulo[0].x, puntosTriangulo[0].y);
            for (let i = 1; i < puntosTriangulo.length; i++) {
                ctx.lineTo(puntosTriangulo[i].x, puntosTriangulo[i].y);
            }

            // Si no hemos completado el triángulo, mostrar línea al mouse
            if (puntosTriangulo.length < 3) {
                ctx.lineTo(mousePos.x, mousePos.y);
            }
            
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (puntoInicial) {
            // Para otras figuras, mantener el comportamiento original
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(puntoInicial.x, puntoInicial.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = '#666';
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    // Efecto para renderizar el canvas cuando cambian las figuras o la posición del mouse
    useEffect(() => {
        renderizar();
    }, [figurasColocadas, puntoInicial, mousePos, puntosTriangulo]);

    // Manejadores de eventos
    const handleCanvasClick = (e) => {
        if (!figuraSeleccionada) return;

        const coords = obtenerCoordenadas(e);

        if (figuraSeleccionada.id === 'triangulo') {
            // Manejo especial para el triángulo
            const nuevosPuntos = [...puntosTriangulo, coords];
            
            if (nuevosPuntos.length < 3) {
                // Todavía no tenemos los 3 puntos, seguimos agregando
                setPuntosTriangulo(nuevosPuntos);
            } else {
                // Ya tenemos los 3 puntos, crear el triángulo
                setFigurasColocadas([
                    ...figurasColocadas,
                    {
                        ...figuraSeleccionada,
                        punto1: nuevosPuntos,
                        punto2: null
                    }
                ]);
                setPuntosTriangulo([]); // Limpiar los puntos para el siguiente triángulo
            }
        } else {
            // Comportamiento original para otras figuras
            if (!puntoInicial) {
                setPuntoInicial(coords);
            } else {
                setFigurasColocadas([
                    ...figurasColocadas,
                    {
                        ...figuraSeleccionada,
                        punto1: puntoInicial,
                        punto2: coords
                    }
                ]);
                setPuntoInicial(null);
            }
        }
    };

    const handleMouseMove = (e) => {
        const coords = obtenerCoordenadas(e);
        setMousePos(coords);
    };

    const handleDeshacer = () => {
        setFigurasColocadas(prev => prev.slice(0, -1));
        setPuntoInicial(null);
        setPuntosTriangulo([]);
    };

    const handleLimpiar = () => {
        setFigurasColocadas([]);
        setPuntoInicial(null);
        setPuntosTriangulo([]);
    };

    return (
        <div className="formas-constructor">
            <HeaderGame estrellas={estrellas} to="/formas" />

            <div className="formas-constructor-contenido">
                <div className="formas-panel-lateral">
                    <h3>Figuras</h3>
                    <div className="formas-lista-figuras">
                        {figuras.map(figura => (
                            <div
                                key={figura.id}
                                className={`formas-figura-item ${figuraSeleccionada?.id === figura.id ? 'seleccionada' : ''}`}
                                onClick={() => {
                                    setFiguraSeleccionada(figura);
                                    setPuntoInicial(null);
                                    setPuntosTriangulo([]);
                                }}
                            >
                                <canvas
                                    ref={el => previewCanvasRefs.current[figura.id] = el}
                                    width={50}
                                    height={50}
                                    className="formas-figura-preview"
                                />
                                <span>{figura.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="formas-area-trabajo">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onClick={handleCanvasClick}
                        onMouseMove={handleMouseMove}
                        className="formas-lienzo-constructor"
                    />
                    
                    <div className="formas-controles-constructor">
                        <button onClick={handleDeshacer}>Deshacer</button>
                        <button onClick={handleLimpiar}>Limpiar Todo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Juego3;