export default async function handler(req, res) {
  const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VITE_OPENROUTER_KEY}`,
      'HTTP-Referer': 'https://chatbot-crud.vercel.app',
      'X-Title': 'MediAssist Rural'
    },
    body: JSON.stringify(req.body)
  })
  const datos = await respuesta.json()
  res.status(200).json(datos)
}