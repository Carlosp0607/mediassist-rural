export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Acepta cualquiera de los dos nombres para no depender de cómo quedó
  // configurada la variable en Vercel. El nombre recomendado es OPENROUTER_API_KEY.
  const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: 'Falta la API Key. Configura OPENROUTER_API_KEY en Vercel > Settings > Environment Variables y vuelve a desplegar.'
    });
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
      body: JSON.stringify(req.body)
    });

    const texto = await response.text();

    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      // OpenRouter respondió algo que no es JSON (HTML de error, rate limit, etc.)
      return res.status(502).json({
        error: `Respuesta no válida de OpenRouter (HTTP ${response.status}): ${texto.slice(0, 300)}`
      });
    }

    if (!response.ok) {
      // Devuelve el mensaje real de OpenRouter (401 = key inválida/revocada,
      // 402 = sin créditos, 404 = modelo inexistente, 429 = límite diario).
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
