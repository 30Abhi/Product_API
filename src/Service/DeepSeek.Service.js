import OpenAI from "openai";
import { DEEPSEEK_API_KEY } from "../Config/DeepSeek.config.js";
import { DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepseekService = async (productName) => {

  try {
    const openai = new OpenAI({
      baseURL: DEEPSEEK_API_URL,
      apiKey: DEEPSEEK_API_KEY
    });


    // console.log("configs",DEEPSEEK_API_KEY,DEEPSEEK_API_URL);

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an experienced product manager.Provide Format your output as JSON .Provide only those details that are asked by user"
        },
        {
          role: "user",
          content: `Provide me the description for ${productName} and synonyms for search engine `
        }
      ],
      model: "deepseek-chat",
    });


    // … after getting `raw` …
    let raw = response.choices[0].message.content;

    // 1. Strip any Markdown code fences (```json … ```)
    raw = raw
      .replace(/^\s*```(?:json)?\s*/, '')   // remove leading ``` or ```json
      .replace(/\s*```$/, '')               // remove trailing ```
      .trim();

    // 2. (Optional) If the model still adds a title or “Product Description…” line, drop everything
    //    before the first “{” and after the last “}”.
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }

    // 3. Parse
    let payload;
    try {
      payload = JSON.parse(raw);
      // console.log(payload);
    } catch (err) {
      console.error("Could not parse JSON from DeepSeek response:", raw);
      throw new Error("DeepSeek returned invalid JSON");
    }

    // 4. Extract description
    if (!payload.description) {
      throw new Error("DeepSeek response missing `description` field");
    }
    if (!payload.synonyms) {
      throw new Error("DeepSeek response missing `search Keywords/synonyms` field");
    }
    return { description: payload.description, synonyms: payload.synonyms };




  } catch (error) {
    console.log("Error in fetching product details--->> ", error.message);

    throw new Error("Failed to get Prodect Info")
  }



}
