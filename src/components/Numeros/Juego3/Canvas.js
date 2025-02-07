import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const plantillaRef = useRef(null);
    const puntosRef = useRef([]);
    const dibujandoRef = useRef(false);

    useEffect(() => {
        inicializarCanvas();
    }, [props.numeroActual]);

    useImperativeHandle(ref, () => ({
        verificarDibujo: () => {
            return calcularPorcentajeCoincidencia();
        },
        limpiarCanvas: () => {
            const lienzo = canvasRef.current;
            const ctx = lienzo.getContext('2d');
            ctx.clearRect(0, 0, lienzo.width, lienzo.height);
            puntosRef.current = [];
        }
    }));

    const inicializarCanvas = () => {
        const lienzo = canvasRef.current;
        const plantilla = plantillaRef.current;
        
        const ctxLienzo = lienzo.getContext('2d');
        const ctxPlantilla = plantilla.getContext('2d');

        ctxLienzo.strokeStyle = '#000';
        ctxLienzo.lineWidth = 3;
        ctxLienzo.lineCap = 'round';
        ctxLienzo.lineJoin = 'round';

        // Limpiar lienzos
        ctxLienzo.clearRect(0, 0, lienzo.width, lienzo.height);
        ctxPlantilla.clearRect(0, 0, plantilla.width, plantilla.height);

        ctxPlantilla.font = 'bold 300px Arial'; 
        ctxPlantilla.globalAlpha = 0.2;
        ctxPlantilla.fillStyle = '#1e40af';
        ctxPlantilla.textAlign = 'center';
        ctxPlantilla.textBaseline = 'middle';
        
        ctxPlantilla.strokeStyle = '#1e40af';
        ctxPlantilla.lineWidth = 8;
        
       const centerY = plantilla.height/2 + 20;
        ctxPlantilla.strokeText(
            props.numeroActual.toString(), 
            plantilla.width/2, 
            centerY
        );
        ctxPlantilla.fillText(
            props.numeroActual.toString(), 
            plantilla.width/2, 
            centerY
        );

        puntosRef.current = [];
    };

    const calcularPorcentajeCoincidencia = () => {
        const plantilla = plantillaRef.current;
        const ctxPlantilla = plantilla.getContext('2d');
        const imageData = ctxPlantilla.getImageData(0, 0, plantilla.width, plantilla.height);
        
        let puntosCorrectos = 0;
        const puntos = puntosRef.current;
        const totalPuntos = puntos.length;

        if (totalPuntos === 0) return 0;

        puntos.forEach(punto => {
            const index = (Math.floor(punto.y) * plantilla.width + Math.floor(punto.x)) * 4;
            if (imageData.data[index + 3] > 0) {
                puntosCorrectos++;
            }
        });

        return (puntosCorrectos / totalPuntos) * 100;
    };

    const iniciarDibujo = (e) => {
        e.preventDefault();
        dibujandoRef.current = true;
        const ctx = canvasRef.current.getContext('2d');
        const pos = obtenerPosicion(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        puntosRef.current.push(pos);
    };

    const dibujar = (e) => {
        e.preventDefault();
        if (!dibujandoRef.current) return;
        
        const ctx = canvasRef.current.getContext('2d');
        const pos = obtenerPosicion(e);
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        puntosRef.current.push(pos);
    };

    const terminarDibujo = () => {
        dibujandoRef.current = false;
    };

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
        
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        
        return {
            x: x * scaleX,
            y: y * scaleY
        };
    };

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                width={200}
                height={350} 
                onMouseDown={iniciarDibujo}
                onMouseMove={dibujar}
                onMouseUp={terminarDibujo}
                onMouseLeave={terminarDibujo}
                onTouchStart={iniciarDibujo}
                onTouchMove={dibujar}
                onTouchEnd={terminarDibujo}
                className="lienzo-principal"
            />
            <canvas
                ref={plantillaRef}
                width={200}
                height={350}
                className="lienzo-plantilla"
            />
        </div>
    );
});

Canvas.displayName = 'Canvas';

export default Canvas;