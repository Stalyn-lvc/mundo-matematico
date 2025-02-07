import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const ColorCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const plantillaRef = useRef(null);
    const pintadoRef = useRef([]);
    const estaColoreandoRef = useRef(false);

    // Efecto para inicializar y redimensionar el lienzo
    useEffect(() => {
        const manejarRedimensionado = () => {
            const contenedor = canvasRef.current.parentElement;
            const anchoContenedor = contenedor.clientWidth;
            const alturaContenedor = Math.min(anchoContenedor * 0.9, window.innerHeight * 0.5);

            // Establecer dimensiones de los lienzos
            canvasRef.current.width = anchoContenedor;
            canvasRef.current.height = alturaContenedor;
            plantillaRef.current.width = anchoContenedor;
            plantillaRef.current.height = alturaContenedor;

            // Reinicializar lienzo con nuevas dimensiones
            inicializarLienzo();
        };

        // Configuración inicial
        manejarRedimensionado();

        // Agregar listener de redimensionado
        window.addEventListener('resize', manejarRedimensionado);

        // Prevenir scroll durante el dibujo
        const prevenirScroll = (e) => {
            if (estaColoreandoRef.current) {
                e.preventDefault();
            }
        };

        // Agregar listeners para prevenir scroll
        document.addEventListener('touchmove', prevenirScroll, { passive: false });

        // Limpiar listeners
        return () => {
            window.removeEventListener('resize', manejarRedimensionado);
            document.removeEventListener('touchmove', prevenirScroll);
        };
    }, [props.figuraActual]);

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
        validarColoreo: () => {
            return validarPintadoDentroFigura();
        },
        limpiarCanvas: () => {
            const lienzo = canvasRef.current;
            const ctx = lienzo.getContext('2d');
            ctx.clearRect(0, 0, lienzo.width, lienzo.height);
            pintadoRef.current = [];
        }
    }));

    // Inicializar lienzo con plantilla de forma
    const inicializarLienzo = () => {
        const lienzo = canvasRef.current;
        const plantilla = plantillaRef.current;
        
        const ctxLienzo = lienzo.getContext('2d');
        const ctxPlantilla = plantilla.getContext('2d');

        // Configuración del contexto de dibujo
        ctxLienzo.lineWidth = 40; // Reducir grosor de línea para móviles
        ctxLienzo.lineCap = 'round';
        ctxLienzo.lineJoin = 'round';

        // Limpiar ambos lienzos
        ctxLienzo.clearRect(0, 0, lienzo.width, lienzo.height);
        ctxPlantilla.clearRect(0, 0, plantilla.width, plantilla.height);

        // Configuración del lienzo de plantilla
        ctxPlantilla.lineWidth = 3;
        ctxPlantilla.strokeStyle = '#1e40af';
        ctxPlantilla.fillStyle = 'rgba(30, 64, 175, 0.1)';

        // Calcular centro y tamaño con relleno mínimo
        const relleno = 20; // Reducir relleno para móviles
        const centroX = plantilla.width / 2;
        const centroY = plantilla.height / 2;
        const tamano = Math.min(plantilla.width - relleno * 2, plantilla.height - relleno * 2);

        // Dibujar forma según la figura actual
        switch(props.figuraActual) {
            case 'triangulo':
                dibujarTriangulo(ctxPlantilla, centroX, centroY, tamano);
                break;
            case 'cuadrado':
                dibujarCuadrado(ctxPlantilla, centroX, centroY, tamano);
                break;
            case 'circulo':
                dibujarCirculo(ctxPlantilla, centroX, centroY, tamano);
                break;
            case 'rectangulo':
                dibujarRectangulo(ctxPlantilla, centroX, centroY, tamano);
                break;
            case 'estrella':
                dibujarEstrella(ctxPlantilla, centroX, centroY, tamano);
                break;
            default:
                break;
        }

        // Reiniciar puntos de dibujo
        pintadoRef.current = [];
    };

    // Métodos para dibujar formas
    const dibujarTriangulo = (ctx, x, y, tamano) => {
        ctx.beginPath();
        ctx.moveTo(x, y - tamano/2);
        ctx.lineTo(x + tamano/2, y + tamano/2);
        ctx.lineTo(x - tamano/2, y + tamano/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    const dibujarCuadrado = (ctx, x, y, tamano) => {
        ctx.beginPath();
        ctx.rect(x - tamano/2, y - tamano/2, tamano, tamano);
        ctx.fill();
        ctx.stroke();
    };

    const dibujarCirculo = (ctx, x, y, tamano) => {
        ctx.beginPath();
        ctx.arc(x, y, tamano/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    };

    const dibujarRectangulo = (ctx, x, y, tamano) => {
        ctx.beginPath();
        ctx.rect(x - tamano/1.5, y - tamano/3, tamano*1.3, tamano*0.6);
        ctx.fill();
        ctx.stroke();
    };

    const dibujarEstrella = (ctx, x, y, tamano) => {
        const picos = 5;
        const radioExterior = tamano/2;
        const radioInterior = tamano/4;

        ctx.beginPath();
        ctx.moveTo(x + radioExterior, y);

        for(let i = 0; i < picos * 2; i++) {
            const radio = i % 2 === 0 ? radioExterior : radioInterior;
            const angulo = (i * Math.PI) / picos;
            ctx.lineTo(
                x + radio * Math.cos(angulo),
                y + radio * Math.sin(angulo)
            );
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    // Validar si el dibujo está dentro de la forma
    const validarPintadoDentroFigura = () => {
        const plantilla = plantillaRef.current;
        const ctxPlantilla = plantilla.getContext('2d');
        const datosImagen = ctxPlantilla.getImageData(0, 0, plantilla.width, plantilla.height);
        
        let puntosDentro = 0;
        const puntos = pintadoRef.current;
        const totalPuntos = puntos.length;

        if (totalPuntos === 0) return false;

        puntos.forEach(punto => {
            const indice = (Math.floor(punto.y) * plantilla.width + Math.floor(punto.x)) * 4;
            if (datosImagen.data[indice + 3] > 0) {
                puntosDentro++;
            }
        });

        return (puntosDentro / totalPuntos) >= 0.85;
    };

    // Iniciar coloreado
    const iniciarColoreado = (e) => {
        e.preventDefault(); // Prevenir acciones predeterminadas
        if (!props.colorSeleccionado) return;
        
        estaColoreandoRef.current = true;
        const ctx = canvasRef.current.getContext('2d');
        const pos = obtenerPosicion(e);
        
        ctx.strokeStyle = props.colorSeleccionado;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        pintadoRef.current.push(pos);
    };

    // Continuar coloreando
    const colorear = (e) => {
        e.preventDefault(); // Prevenir desplazamiento
        if (!estaColoreandoRef.current || !props.colorSeleccionado) return;
        
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = 40;
        const pos = obtenerPosicion(e);
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        pintadoRef.current.push(pos);
    };

    // Detener coloreado
    const terminarColoreado = () => {
        estaColoreandoRef.current = false;
    };

    // Calcular posición de dibujo
    const obtenerPosicion = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        const escalaX = canvasRef.current.width / rect.width;
        const escalaY = canvasRef.current.height / rect.height;
        
        return {
            x: x * escalaX,
            y: y * escalaY
        };
    };

    return (
        <div className="formas-canvas-container">
            <canvas
                ref={canvasRef}
                onMouseDown={iniciarColoreado}
                onMouseMove={colorear}
                onMouseUp={terminarColoreado}
                onMouseLeave={terminarColoreado}
                onTouchStart={iniciarColoreado}
                onTouchMove={colorear}
                onTouchEnd={terminarColoreado}
                className="formas-lienzo-principal"
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
            <canvas
                ref={plantillaRef}
                className="formas-lienzo-plantilla"
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
        </div>
    );
});

ColorCanvas.displayName = 'ColorCanvas';

export default ColorCanvas;