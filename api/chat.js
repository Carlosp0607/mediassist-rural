export default async function handler(req, res) {
  try {
    const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://mediassist-rural.vercel.app',
        'X-Title': 'MediAssist Rural'
      },
      body: JSON.stringify(req.body)
    })
    const datos = await respuesta.json()
    console.log('Respuesta OpenRouter:', JSON.stringify(datos))
    res.status(200).json(datos)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}