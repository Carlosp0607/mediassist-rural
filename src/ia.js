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
sangrado severo, pérdida de consciencia) indica IR A URGENCIAS INMEDIATAMENTE.`;

  const mensajesFormateados = mensajes.map(m => ({
    role: m.rol === 'usuario' ? 'user' : 'assistant',
    content: m.contenido
  }));

  try {
    const respuesta = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...mensajesFormateados
        ]
      })
    });

    // Si /api/chat no existe (por ejemplo en `npm run dev`), Vite devuelve el index.html
    // y esto revienta. Lo detectamos antes de parsear.
    const tipo = respuesta.headers.get('content-type') || '';
    if (!tipo.includes('application/json')) {
      console.error('La ruta /api/chat no devolvió JSON. ¿Estás usando `npm run dev` en vez de `vercel dev`?');
      return '⚠️ La ruta /api/chat no está disponible. En local usa `vercel dev`; en producción revisa que la carpeta /api se haya desplegado.';
    }

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.error) {
      const detalle = datos?.error?.message || datos?.error || `HTTP ${respuesta.status}`;
      console.error('Error de la IA:', detalle);
      return `⚠️ No pude responder. Detalle técnico: ${detalle}`;
    }

    const contenido = datos?.choices?.[0]?.message?.content;
    if (!contenido) {
      console.error('Respuesta inesperada de la API:', datos);
      return '⚠️ La IA devolvió una respuesta vacía. Intenta de nuevo.';
    }

    return contenido;

  } catch (error) {
    console.error('Error en la llamada:', error);
    return `⚠️ No se pudo conectar con el servidor de la IA: ${error.message}`;
  }
}
