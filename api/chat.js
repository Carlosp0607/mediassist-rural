const MODELO = 'meta-llama/llama-3.1-8b-instruct';
const MAX_MENSAJES = 40;          // mensajes de conversación que se envían al modelo
const MAX_CARACTERES = 8000;      // tamaño máximo por mensaje (lo que pase se recorta)
const MAX_SISTEMA = 4000;         // tamaño máximo del mensaje de sistema

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Falta la API Key en el servidor.' });
  }

  const recibidos = req.body?.messages;
  if (!Array.isArray(recibidos) || recibidos.length === 0) {
    return res.status(400).json({ error: 'Formato de mensajes inválido.' });
  }

  // Descarta lo que no tenga forma de mensaje y recorta los textos largos
  const validos = recibidos.filter(
    m => m && ['system', 'user', 'assistant'].includes(m.role) && typeof m.content === 'string'
  );

  const sistema = validos
    .filter(m => m.role === 'system')
    .slice(0, 1)
    .map(m => ({ role: 'system', content: m.content.slice(0, MAX_SISTEMA) }));

  const conversacion = validos
    .filter(m => m.role !== 'system')
    .slice(-MAX_MENSAJES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) }));

  if (conversacion.length === 0) {
    return res.status(400).json({ error: 'No hay mensajes para enviar.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mediassist-rural.vercel.app',
        'X-Title': 'MediAssist Rural'
      },
      body: JSON.stringify({ model: MODELO, messages: [...sistema, ...conversacion] })
    });

    const texto = await response.text();
    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      return res.status(502).json({ error: `Respuesta no válida de OpenRouter (HTTP ${response.status}).` });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || `OpenRouter devolvió HTTP ${response.status}`,
        code: response.status
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: `Fallo de red hacia OpenRouter: ${error.message}` });
  }
}
