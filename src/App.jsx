// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CamuLayout from './components/layout/CamuLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Evaluation from './pages/Evaluation';

export default function App() {
  return (
    <BrowserRouter>
      <CamuLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CamuLayout>
    </BrowserRouter>
  );
}
