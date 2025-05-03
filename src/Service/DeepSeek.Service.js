// Service/DeepSeek.Service.js

import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepseekDescriptionService = async (productName) => {
  try {
    const openai = new OpenAI({
      baseURL: DEEPSEEK_API_URL,
      apiKey: DEEPSEEK_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced product manager. Format your output as JSON and include only the fields the user requested."
        },
        {
          role: "user",
          content: `Provide me the description for "${productName}" .`
        }
      ]
    });

    let raw = response.choices[0].message.content;

    raw = raw
      .replace(/^\s*```(?:json)?\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    const firstBrace = raw.indexOf('{');
    const lastBrace  = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      console.error("Could not parse JSON from DeepSeek response:", raw);
      throw new Error("DeepSeek returned invalid JSON");
    }

    if (!payload.description) {
      throw new Error("DeepSeek response missing `description` field");
    }
    

    const paragraphs = payload.description
      .split(/\r?\n\r?\n+/)
      .map(para => para.trim())
      .filter(Boolean);

    const descriptionHTML = paragraphs
      .map(para => `<p>${para.replace(/\r?\n/g, '<br/>')}</p>`)
      .join('\n');

    return {
      description: descriptionHTML,          
    };

  } catch (error) {
    console.error("Error in DeepseekService →", error.message);
    throw new Error("Failed to get product info");
  }
};
