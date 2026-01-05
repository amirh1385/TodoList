import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import React from 'react';
import Login from './pages/Login';
import Verify from './pages/Verify';

const root = createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);