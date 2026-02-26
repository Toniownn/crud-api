const axios = require("axios");

exports.getAssistant = async (req, res) => {
  try {
    const { id } = req.query;

    const response = await axios({
      method: "get",
      url: `https://api.openai.com/v1/assistants/${id}`,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
        "Content-Type": "application/json",
      },
    });

    console.log(`test: ${process.env.OPENAI_API_KEY}`);
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
