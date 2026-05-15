// Importamos StrictMode — es un modo especial de React que nos avisa de posibles errores
import { StrictMode } from 'react'

// Importamos createRoot — es la función que "arranca" la aplicación en el navegador
import { createRoot } from 'react-dom/client'

// Importamos nuestro componente principal App
import App from './App.jsx'

// Buscamos en el HTML el elemento con id="root" y ahí montamos toda la aplicación
// Es como decirle a React: "dibuja todo dentro de esta caja"
createRoot(document.getElementById('root')).render(

  // StrictMode envuelve la app para detectar problemas durante el desarrollo
  // En producción no afecta nada, solo ayuda mientras programamos
  <StrictMode>
    <App /> {/* Aquí va toda nuestra aplicación */}
  </StrictMode>,
)