import { useState, useEffect } from 'react'
import { v4 as idUnico } from 'uuid'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { preguntarAIA } from './ia'
import './App.css'

function App() {

  const [conversaciones, setConversaciones] = useState(() => {
    const guardadas = localStorage.getItem('conversaciones')
    return guardadas ? JSON.parse(guardadas) : [
      { id: idUnico(), nombre: 'Consulta 1', mensajes: [] }
    ]
  })

  const [idActivo, setIdActivo] = useState(() => {
    return localStorage.getItem('idActivo') || conversaciones[0].id
  })

  // NUEVO — perfil del paciente
  const [paciente, setPaciente] = useState(() => {
    const guardado = localStorage.getItem('paciente')
    return guardado ? JSON.parse(guardado) : { nombre: '', edad: '', condiciones: '' }
  })

  // NUEVO — controla si el panel del paciente está abierto
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  useEffect(() => {
    localStorage.setItem('conversaciones', JSON.stringify(conversaciones))
  }, [conversaciones])

  useEffect(() => {
    localStorage.setItem('idActivo', idActivo)
  }, [idActivo])

  // NUEVO — guarda perfil del paciente
  useEffect(() => {
    localStorage.setItem('paciente', JSON.stringify(paciente))
  }, [paciente])

  const conversacionActiva = conversaciones.find(c => c.id === idActivo) || conversaciones[0]

  const crearConversacion = () => {
    const nueva = { id: idUnico(), nombre: `Consulta ${conversaciones.length + 1}`, mensajes: [] }
    setConversaciones([...conversaciones, nueva])
    setIdActivo(nueva.id)
  }

  const borrarConversacion = (id) => {
    const filtradas = conversaciones.filter(c => c.id !== id)
    if (filtradas.length === 0) {
      const nueva = { id: idUnico(), nombre: 'Consulta 1', mensajes: [] }
      setConversaciones([nueva])
      setIdActivo(nueva.id)
    } else {
      setConversaciones(filtradas)
      setIdActivo(filtradas[0].id)
    }
  }

  const renombrarConversacion = (id, nuevoNombre) => {
    setConversaciones(conversaciones.map(c =>
      c.id === id ? { ...c, nombre: nuevoNombre } : c
    ))
  }

  const enviarMensaje = async (texto) => {
    const mensajeUsuario = { id: idUnico(), rol: 'usuario', contenido: texto }
    const mensajesActualizados = [...conversacionActiva.mensajes, mensajeUsuario]
    actualizarMensajes(idActivo, mensajesActualizados)

    const mensajeCargando = { id: 'cargando', rol: 'asistente', contenido: '✍️ Analizando síntomas...' }
    actualizarMensajes(idActivo, [...mensajesActualizados, mensajeCargando])

    // NUEVO — pasamos los datos del paciente a la IA
    const respuesta = await preguntarAIA(mensajesActualizados, paciente)

    const mensajeIA = { id: idUnico(), rol: 'asistente', contenido: respuesta }
    actualizarMensajes(idActivo, [...mensajesActualizados, mensajeIA])
  }

  const borrarMensaje = (idMensaje) => {
    actualizarMensajes(idActivo, conversacionActiva.mensajes.filter(m => m.id !== idMensaje))
  }

  const editarMensaje = (idMensaje, textoNuevo) => {
    actualizarMensajes(idActivo, conversacionActiva.mensajes.map(m =>
      m.id === idMensaje ? { ...m, contenido: textoNuevo } : m
    ))
  }

  const actualizarMensajes = (idConv, nuevosMensajes) => {
    setConversaciones(prev => prev.map(c =>
      c.id === idConv ? { ...c, mensajes: nuevosMensajes } : c
    ))
  }

  return (
    <div className="app">
      <Sidebar
        conversaciones={conversaciones}
        idActivo={idActivo}
        alCrear={crearConversacion}
        alSeleccionar={setIdActivo}
        alBorrar={borrarConversacion}
        alRenombrar={renombrarConversacion}
        paciente={paciente}
        setPaciente={setPaciente}
        mostrarPerfil={mostrarPerfil}
        setMostrarPerfil={setMostrarPerfil}
      />
      <Chat
        mensajes={conversacionActiva?.mensajes || []}
        alEnviar={enviarMensaje}
        alBorrar={borrarMensaje}
        alEditar={editarMensaje}
        paciente={paciente}
      />
    </div>
  )
}

export default App