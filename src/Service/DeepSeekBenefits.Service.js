// Service/DeepSeekBenefits.Service.js

import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepSeekBenefitsService = async (productName) => {
  try {
    const openai = new OpenAI({
      baseURL: DEEPSEEK_API_URL,
      apiKey: DEEPSEEK_API_KEY,
    });

    const resp = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a product analyst. Return **only** JSON with a single key:\n" +
            "  • `benefits`: an array of objects, each `{ title: string, description: string }`.\n\n" +
            "Example:\n```json\n" +
            "{\n" +
            '  "benefits": [\n' +
            '    { "title": "Gloss",   "description": "Gives a shiny finish to coatings." },\n' +
            '    { "title": "Texture", "description": "Improves mouthfeel in baked goods." }\n' +
            "  ]\n" +
            "}\n```\n\n" +
            "If no benefits apply, return `{ \"benefits\": [] }`.",
        },
        {
          role: "user",
          content: `List the primary benefits of "${productName}" in that format.`,
        },
      ],
    }); 

    let raw = resp.choices[0].message.content
      .replace(/^\s*```(?:json)?/, "")
      .replace(/```$/, "")
      .trim();

    raw = raw
      .replace(/'([^']+)'(?=\s*:)/g, '"$1"')    // keys
      .replace(/:\s*'([^']+)'/g, ': "$1"');     // string values

    const payload = JSON.parse(raw); 
    if (
      !payload ||
      !Array.isArray(payload.benefits) ||
      !payload.benefits.every(
        (b) =>
          b &&
          typeof b.title === "string" &&
          typeof b.description === "string"
      )
    ) {
      throw new Error("Invalid `benefits` format from DeepSeek");
    }

    const benefitsHTML = payload.benefits
      .map(
        ({ title, description }) =>
          `<p><strong>${title}:</strong> ${description}</p>`
      )
      .join("");

    return { benefits:benefitsHTML };
  } catch (err) {
    console.error("DeepSeekBenefitsService Error:", err);
    throw new Error("Failed to fetch product benefits");
  }
};
