import React from 'react'
import ReactDOM from 'react-dom/client'

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"

// index.css'
import '../styles/index.css'
 
// components

import Contenido from './components/contenido';
import Titulo from './components/titulo'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Titulo />
    <Contenido />
  </React.StrictMode>,
)


