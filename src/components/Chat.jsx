import { useState } from 'react'
import { Send, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function Chat({ mensajes, alEnviar, alBorrar, alEditar, paciente }) {

  const [texto, setTexto] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [textoEditado, setTextoEditado] = useState('')

  const manejarEnvio = () => {
    if (!texto.trim()) return
    alEnviar(texto)
    setTexto('')
  }

  const manejarEdicion = (mensaje) => {
    setEditandoId(mensaje.id)
    setTextoEditado(mensaje.contenido)
  }

  const guardarEdicion = (id) => {
    alEditar(id, textoEditado)
    setEditandoId(null)
  }

  // Detecta si el mensaje contiene una emergencia
  const esEmergencia = (texto) => {
    const palabras = ['urgencias', 'emergencia', 'inmediatamente', 'urgente', '911', 'ambulancia']
    return palabras.some(p => texto.toLowerCase().includes(p))
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#ffffff',
    }}>

      {/* Header médico */}
      <div style={{
        background: '#2c4a7c',
        padding: '14px 24px',
        borderBottom: '1px solid #2a2a4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '15px' }}>
            🏥 MediAssist Rural
          </span>
          <span style={{
            background: '#27ae60',
            color: 'white',
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: '500',
          }}>● En línea</span>
        </div>

        {/* Info del paciente activo */}
        {paciente.nombre && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '12px', color: '#a0c4ff' }}>
              👤 {paciente.nombre} {paciente.edad ? `· ${paciente.edad} años` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Aviso médico */}
      <div style={{
        background: '#fff3cd',
        borderBottom: '1px solid #ffc107',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <AlertTriangle size={14} color="#856404" />
        <span style={{ fontSize: '11px', color: '#856404' }}>
          Este asistente no reemplaza a un médico. En caso de emergencia llame al <strong>123</strong> (Colombia).
        </span>
      </div>

      {/* Área de mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#f8faff',
      }}>

        {/* Mensaje de bienvenida */}
        {mensajes.length === 0 && (
          <div style={{ textAlign: 'center', color: '#7a9de0', marginTop: '40px' }}>
            <p style={{ fontSize: '40px' }}>🏥</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#2c4a7c', marginTop: '8px' }}>
              Bienvenido a MediAssist Rural
            </p>
            <p style={{ fontSize: '13px', color: '#7a9de0', marginTop: '8px', maxWidth: '300px', margin: '8px auto 0' }}>
              Cuéntame tus síntomas y te orientaré. Recuerda llenar los datos del paciente en el panel izquierdo.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '24px',
              maxWidth: '280px',
              margin: '24px auto 0',
            }}>
              {['¿Qué hacer si tengo fiebre alta?', 'Tengo dolor en el pecho', 'Mi hijo tiene diarrea frecuente'].map(sugerencia => (
                <button
                  key={sugerencia}
                  onClick={() => alEnviar(sugerencia)}
                  style={{
                    background: 'white',
                    border: '1px solid #d0daf0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#3a7bd5',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                  💬 {sugerencia}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensajes */}
        {mensajes.map(mensaje => (
          <div key={mensaje.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: mensaje.rol === 'usuario' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '70%',
              background: mensaje.rol === 'usuario' ? '#3a7bd5' : '#ffffff',
              color: mensaje.rol === 'usuario' ? 'white' : '#1a1a2e',
              padding: '12px 16px',
              borderRadius: mensaje.rol === 'usuario' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              fontSize: '14px',
              lineHeight: '1.6',
              border: mensaje.rol === 'usuario' ? 'none' : '1px solid #d0daf0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              outline: esEmergencia(mensaje.contenido) ? '2px solid #e74c3c' : 'none',
              /* AQUÍ SE ARREGLA EL DESBORDE HORIZONTAL */
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>

              {/* Alerta de emergencia */}
              {esEmergencia(mensaje.contenido) && mensaje.rol === 'asistente' && (
                <div style={{
                  background: '#ffeaea',
                  border: '1px solid #e74c3c',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  color: '#c0392b',
                  fontWeight: '600',
                }}>
                  🚨 EMERGENCIA — Llame al 123 ahora
                </div>
              )}

              {editandoId === mensaje.id ? (
                <div>
                  <textarea
                    value={textoEditado}
                    onChange={e => setTextoEditado(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: 'inherit',
                      fontSize: '14px',
                      resize: 'none',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => guardarEdicion(mensaje.id)} style={{
                      background: 'white', color: '#3a7bd5', border: 'none',
                      borderRadius: '6px', padding: '4px 10px', cursor: 'pointer'
                    }}><Check size={12} /></button>
                    <button onClick={() => setEditandoId(null)} style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: 'inherit'
                    }}><X size={12} /></button>
                  </div>
                </div>
              ) : (
                /* AQUÍ SE ARREGLA EL TEXTO CON ASTERISCOS */
                <ReactMarkdown>{mensaje.contenido}</ReactMarkdown>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {mensaje.rol === 'usuario' && (
                <button onClick={() => manejarEdicion(mensaje)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#7a9de0', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px'
                }}><Edit2 size={12} /> Editar</button>
              )}
              <button onClick={() => alBorrar(mensaje.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#7a9de0', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px'
              }}><Trash2 size={12} /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Área de escritura */}
      <div style={{
        padding: '16px 24px',
        background: 'white',
        borderTop: '1px solid #d0daf0',
        display: 'flex',
        gap: '10px',
      }}>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); manejarEnvio() }}}
          placeholder="Describe tus síntomas..."
          style={{
            flex: 1,
            border: '1.5px solid #d0daf0',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'Inter, sans-serif',
            color: '#1a1a2e',
            background: '#f0f4ff',
          }}
          rows={1}
        />
        <button onClick={manejarEnvio} style={{
          background: '#3a7bd5',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 16px',
          cursor: 'pointer',
        }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default Chat