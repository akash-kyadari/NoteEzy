export default async function handler(req, res) {
  const { prompt, notes } = req.body;

  if (!prompt || !notes) {
    return res.status(400).json({ result: "Missing prompt or notes." });
  }

  const fullPrompt = `${prompt}\n\nContext:\n${notes}`;
  const apiKey = process.env.GEMINI_API_KEY; // <-- Set this in your .env.local

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      return res
        .status(500)
        .json({ result: `Gemini API Error: ${data.error.message}` });
    }

    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";
    res.status(200).json({ result });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ result: "Server error while calling Gemini." });
  }
}
