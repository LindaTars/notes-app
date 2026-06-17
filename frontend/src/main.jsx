import React from "react";
import './index.css'
import ReactDOM from 'react-dom/client'
import App from "./App";
import { TemaProvider } from "./components/TemaContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <TemaProvider>
    <App />
  </TemaProvider>
)