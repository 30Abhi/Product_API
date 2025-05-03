// Service/DeepSeekSynonyms.Service.js

import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";


 
export const DeepseekSynonymsService = async (productName) => {
  try {
    const openai = new OpenAI({
      baseURL: DEEPSEEK_API_URL,
      apiKey: DEEPSEEK_API_KEY,
    });

    // Request only the synonyms in JSON format
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a product manager. Return only valid JSON with a single key `synonyms`, whose value is an array of strings. Example: { \"synonyms\": [\"term1\", \"term2\"] }"
        },
        {
          role: "user",
          content: `Provide me the synonyms for \"${productName}\".`
        }
      ],
    });

    // Extract raw content and remove any code fences
    let raw = response.choices[0].message.content
      .replace(/```(?:json)?/g, "")
      .trim();

    // Isolate JSON object
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    // Normalize single quotes to double quotes if present
    raw = raw
      .replace(/'([^']+)'(?=\s*:)/g, '"$1"')   // keys
      .replace(/:\s*'([^']+)'/g, ': "$1"');    // string values

    // Parse JSON
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      console.error("DeepSeekSynonymsService JSON parse error:", raw);
      throw new Error("DeepSeek returned invalid JSON");
    }

    // Validate
    if (!payload.synonyms || !Array.isArray(payload.synonyms)) {
      throw new Error("DeepSeek response missing or invalid 'synonyms' array");
    }

    return { synonyms: payload.synonyms };
  } catch (err) {
    console.error("DeepSeekSynonymsService Error:", err);
    throw new Error("Failed to fetch product synonyms");
  }
};
