import dotenv from 'dotenv'

dotenv.config()

/**
 * Service to interact with Google Gemini on the backend safely.
 * Supports configurable model names (e.g. gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash).
 */
export async function generateGeminiReasoning(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return {
      success: false,
      isLiveAI: false,
      reason: 'GEMINI_API_KEY not configured on backend. Operating via 5Directions Deterministic Resilience Engine.',
      modelUsed: null,
      text: null
    }
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`[Gemini API] Request failed status ${response.status}:`, errorText)
      return {
        success: false,
        isLiveAI: false,
        reason: `Gemini API returned status ${response.status}: ${response.statusText}`,
        modelUsed: modelName,
        text: null
      }
    }

    const data = await response.json()
    const candidate = data.candidates?.[0]
    const text = candidate?.content?.parts?.[0]?.text

    if (!text) {
      return {
        success: false,
        isLiveAI: false,
        reason: 'Empty response returned by Gemini model',
        modelUsed: modelName,
        text: null
      }
    }

    return {
      success: true,
      isLiveAI: true,
      modelUsed: modelName,
      text: text.trim()
    }
  } catch (error) {
    console.warn('[Gemini API] Network or invocation error:', error.message)
    return {
      success: false,
      isLiveAI: false,
      reason: error.message,
      modelUsed: modelName,
      text: null
    }
  }
}
