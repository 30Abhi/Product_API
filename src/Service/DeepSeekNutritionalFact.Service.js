import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepseekNutritionService = async (productName) => {
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
            "You are a nutritionist bot. Return only JSON. If nutritional facts apply, output an array: [{ name: string, value: number, metric: string }]. Otherwise respond with “Not applicable”.",
        },
        { role: "user", content: `Provide nutritional facts for ${productName}` },
      ],
    });

    let raw = resp.choices[0].message.content
      .replace(/^\s*```(?:json)?/, "")
      .replace(/```$/, "")
      .trim();

    // 1. Early exit if not applicable
    if (/not applicable/i.test(raw)) return null;


    raw = raw.replace(/'([^']+)'\s*:/g, '"$1":')   // keys
             .replace(/:\s*'([^']+)'/g, ': "$1"'); // values


    const payload = JSON.parse(raw);

    console.log("Nutrition PayLoad--->",payload);


    return  payload ;
  } catch (err) {
    console.error("DeepseekNutritionService Error:", err);
    throw new Error("Failed to fetch product nutritional information");
  }
};
