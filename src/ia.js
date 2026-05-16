export async function preguntarAIA(mensajes, paciente = {}) {
  
  const systemPrompt = `Eres MediAssist, un asistente médico de primer nivel diseñado 
especialmente para zonas rurales de Colombia donde el acceso a médicos es limitado.

INFORMACIÓN DEL PACIENTE:
- Nombre: ${paciente.nombre || 'No especificado'}
- Edad: ${paciente.edad || 'No especificada'}
- Condiciones previas: ${paciente.condiciones || 'Ninguna registrada'}

TUS REGLAS:
1. Respondes SIEMPRE en español simple y claro, sin términos médicos complejos
2. Orientas sobre síntomas básicos y primeros auxilios
3. Siempre indicas cuándo es una EMERGENCIA y debe ir urgente al médico
4. Nunca reemplazas a un médico real, siempre lo aclaras
5. Eres empático, paciente y comprensivo
6. Guardas contexto del historial de la conversación

IMPORTANTE: Si detectas síntomas de emergencia (dolor pecho, dificultad respirar, 
sangrado severo, pérdida de consciencia) indica IR A URGENCIAS INMEDIATAMENTE.`

  const mensajesFormateados = mensajes.map(m => ({
    role: m.rol === 'usuario' ? 'user' : 'assistant',
    content: m.contenido
  }))

  const respuesta = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it:free',
      messages: [
        { role: 'system', content: systemPrompt },
        ...mensajesFormateados
      ]
    })
  })

  const datos = await respuesta.json()
  
  if (datos.error) {
    console.error('Error de la IA:', datos.error)
    return 'Hubo un error al obtener respuesta.'
  }

  return datos.choices[0].message.content
}