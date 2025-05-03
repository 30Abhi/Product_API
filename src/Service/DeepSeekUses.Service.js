// Service/DeepSeekUses.Service.js

import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepSeekUsesService = async (productName) => {
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
            "  • `uses`: an array of objects, each `{ title: string, description: string }`.\n\n" +
            "Example:\n```json\n" +
            "{\n" +
            '  "uses": [\n' +
            '    { "title": "Melting",   "description": "Cut into small pieces and heat until smooth." },\n' +
            '    { "title": "Coating",   "description": "Dip or brush onto desserts for an even layer." }\n' +
            "  ]\n" +
            "}\n```\n\n" +
            "If there are no applicable uses, return: `{ \"uses\": [] }`",
        },
        {
          role: "user",
          content: `List the typical uses of "${productName}" in that JSON format.`,
        },
      ],
    });

    let raw = resp.choices[0].message.content
      .replace(/^\s*```(?:json)?/, "")
      .replace(/```$/, "")
      .trim();

    raw = raw
      .replace(/'([^']+)'\s*:/g, '"$1":')   
      .replace(/:\s*'([^']+)'/g, ': "$1"'); 

    const payload = JSON.parse(raw);

    if (
      !payload ||
      !Array.isArray(payload.uses) ||
      !payload.uses.every(
        (u) =>
          u &&
          typeof u.title === "string" &&
          typeof u.description === "string"
      )
    ) {
      throw new Error("DeepSeek returned invalid `uses` format");
    }

    const usesHTML = payload.uses
      .map(
        ({ title, description }) =>
          `<p><strong>${title}:</strong> ${description}</p>`
      )
      .join("");

    return { uses:usesHTML };
  } catch (err) {
    console.error("DeepSeekUsesService Error:", err);
    throw new Error("Failed to fetch product uses");
  }
};
