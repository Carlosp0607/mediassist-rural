const MODELO = 'meta-llama/llama-3.1-8b-instruct';
const MAX_MENSAJES = 30;
const MAX_CARACTERES = 4000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Falta la API Key en el servidor.' });
  }

  const mensajes = req.body?.messages;
  if (!Array.isArray(mensajes) || mensajes.length === 0 || mensajes.length > MAX_MENSAJES) {
    return res.status(400).json({ error: 'Formato de mensajes inválido.' });
  }

  const rolesValidos = ['system', 'user', 'assistant'];
  const limpios = [];
  for (const m of mensajes) {
    if (!m || !rolesValidos.includes(m.role) || typeof m.content !== 'string' || m.content.length > MAX_CARACTERES) {
      return res.status(400).json({ error: 'Mensaje inválido.' });
    }
    limpios.push({ role: m.role, content: m.content });
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
      body: JSON.stringify({ model: MODELO, messages: limpios })
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
