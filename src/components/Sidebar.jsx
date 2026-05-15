import { Plus, Trash2, MessageSquare, Check, X, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function Sidebar({ conversaciones, idActivo, alCrear, alSeleccionar, alBorrar, alRenombrar, paciente, setPaciente, mostrarPerfil, setMostrarPerfil }) {

  const [renombrandoId, setRenombrandoId] = useState(null)
  const [textoNombre, setTextoNombre] = useState('')

  const iniciarRenombrar = (e, conv) => {
    e.stopPropagation()
    setRenombrandoId(conv.id)
    setTextoNombre(conv.nombre)
  }

  const guardarNombre = (id) => {
    if (textoNombre.trim()) alRenombrar(id, textoNombre)
    setRenombrandoId(null)
  }

  const inputStyle = {
    width: '100%',
    background: '#f0f4ff',
    border: '1px solid #d0daf0',
    borderRadius: '6px',
    color: '#1a1a2e',
    fontSize: '12px',
    padding: '6px 8px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      width: '260px',
      background: '#ffffff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      borderRight: '1px solid #d0daf0',
      overflowY: 'auto',
    }}>

      {/* Título */}
      <h2 style={{
        color: '#1a1a2e',
        marginBottom: '4px',
        fontSize: '18px',
        letterSpacing: '-0.3px'
      }}>🏥 MediAssist Rural</h2>
      <p style={{ color: '#7a9de0', fontSize: '11px', marginBottom: '16px' }}>
        Asistente médico para zonas rurales
      </p>

      {/* Panel del paciente */}
      <div style={{
        background: '#f0f4ff',
        borderRadius: '10px',
        marginBottom: '16px',
        border: '1px solid #d0daf0',
        overflow: 'hidden',
      }}>
        {/* Header del panel */}
        <div
          onClick={() => setMostrarPerfil(!mostrarPerfil)}
          style={{
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: mostrarPerfil ? '#e0e8ff' : '#f0f4ff',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} color="#3a7bd5" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a2e' }}>
              {paciente.nombre || 'Datos del Paciente'}
            </span>
          </div>
          {mostrarPerfil ? <ChevronUp size={14} color="#7a9de0" /> : <ChevronDown size={14} color="#7a9de0" />}
        </div>

        {/* Formulario del paciente */}
        {mostrarPerfil && (
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#7a9de0', marginBottom: '4px', display: 'block' }}>
                Nombre completo
              </label>
              <input
                style={inputStyle}
                placeholder="Ej: María González"
                value={paciente.nombre}
                onChange={e => setPaciente({ ...paciente, nombre: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#7a9de0', marginBottom: '4px', display: 'block' }}>
                Edad
              </label>
              <input
                style={inputStyle}
                placeholder="Ej: 45"
                value={paciente.edad}
                onChange={e => setPaciente({ ...paciente, edad: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#7a9de0', marginBottom: '4px', display: 'block' }}>
                Condiciones previas
              </label>
              <textarea
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Ej: Diabetes, hipertensión..."
                value={paciente.condiciones}
                onChange={e => setPaciente({ ...paciente, condiciones: e.target.value })}
                rows={2}
              />
            </div>
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '10px',
              color: '#856404',
            }}>
              ⚠️ Esta información se usa para personalizar las respuestas médicas
            </div>
          </div>
        )}
      </div>

      {/* Botón nueva consulta */}
      <button onClick={alCrear} style={{
        background: '#3a7bd5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <Plus size={16} /> Nueva consulta
      </button>

      {/* Lista de conversaciones */}
      {conversaciones.map(conv => (
        <div
          key={conv.id}
          onClick={() => alSeleccionar(conv.id)}
          onDoubleClick={(e) => iniciarRenombrar(e, conv)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: conv.id === idActivo ? '#2a3a6a' : 'transparent',
            color: conv.id === idActivo ? 'white' : '#a0aec0',
            marginBottom: '4px',
            border: conv.id === idActivo ? '1px solid #3a7bd5' : '1px solid transparent',
          }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <MessageSquare size={14} />
            {renombrandoId === conv.id ? (
              <input
                value={textoNombre}
                onChange={e => setTextoNombre(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') guardarNombre(conv.id)
                  if (e.key === 'Escape') setRenombrandoId(null)
                }}
                autoFocus
                onClick={e => e.stopPropagation()}
                style={{
                  background: '#2a2a4a',
                  border: '1px solid #3a7bd5',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '13px',
                  padding: '2px 6px',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            ) : (
              <span style={{ fontSize: '13px' }}>{conv.nombre}</span>
            )}
          </div>

          <button onClick={e => { e.stopPropagation(); alBorrar(conv.id) }} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0'
          }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <div style={{ marginTop: 'auto', color: '#4a5568', fontSize: '11px' }}>
        Doble clic para renombrar
      </div>
    </div>
  )
}

export default Sidebar