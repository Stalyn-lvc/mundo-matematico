import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import NumerosDashboard from './components/Numeros/NumerosDashboard';
import Juego1 from './components/Numeros/Juego1/Juego1';
import Juego2 from './components/Numeros/Juego2/Juego2';
import Juego3 from './components/Numeros/Juego3/Juego3';
import NocionesDashboard from './components/Nociones/NocionesDashboard';
import Juego1Nociones from './components/Nociones/Juego1/Juego1';
import Juego2Nociones from './components/Nociones/Juego2/Juego2';
import Juego3Nociones from './components/Nociones/Juego3/Juego3';
import FormasDashboard from './components/Formas/FormasDashboard';
import Juego1Formas from './components/Formas/Juego1/Juego1';
import Juego2Formas from './components/Formas/Juego2/Juego2';
import Juego3Formas from './components/Formas/Juego3/Juego3';

function App() {
    return (
        <Router>
            <Routes>
                {/* Numeros */}
                <Route path="/" element={<Home />} />
                <Route path="/numeros" element={<NumerosDashboard />} />
                <Route path="/numeros/juego1" element={<Juego1 />} />
                <Route path="/numeros/juego2" element={<Juego2 />} />
                <Route path="/numeros/juego3" element={<Juego3 />} />
                {/* Nociones */}
                <Route path="/nociones" element={<NocionesDashboard />} />
                <Route path="/nociones/juego1" element={<Juego1Nociones />} />
                <Route path="/nociones/juego2" element={<Juego2Nociones />} />
                <Route path="/nociones/juego3" element={<Juego3Nociones />} />
                {/* Formas */}
                <Route path="/formas" element={<FormasDashboard />} />
                <Route path="/formas/juego1" element={<Juego1Formas />} />
                <Route path="/formas/juego2" element={<Juego2Formas />} />
                <Route path="/formas/juego3" element={<Juego3Formas />} />
            </Routes>
        </Router>
    );
}

export default App;