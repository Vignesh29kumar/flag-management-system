import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CheckFlag from "./pages/CheckFlag";
import "./styles/global.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckFlag />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
