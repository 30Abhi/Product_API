
import OpenAI from "openai";
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from "../Config/DeepSeek.config.js";

export const DeepSeekUseABenefitsService = async (productName) => {
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
            "You are a product analyst. Return **only** JSON with two keys:\n" +
            "  • `uses`: an array of objects, each with `title` (string) and `description` (string).\n" +
            "  • `benefits`: an array of objects, each with `title` (string) and `description` (string).\n\n" +
            "Example:\n" +
            "```json\n" +
            "{\n" +
            '  "uses": [\n' +
            '    { "title": "Melting",     "description": "Cut into small pieces and heat until smooth." },\n' +
            '    { "title": "Coating",     "description": "Dip or brush onto desserts for an even layer." }\n' +
            "  ],\n" +
            '  "benefits": [\n' +
            '    { "title": "Versatility", "description": "Works in baking, confectionery, and more." },\n' +
            '    { "title": "Consistency","description": "Produces uniform, glossy coatings." }\n' +
            "  ]\n" +
            "}\n" +
            "```\n\n" +
            "If there are no applicable uses or benefits, return empty arrays.",
        },
        {
          role: "user",
          content: `List the typical uses and the primary benefits of "${productName}" in that JSON format.`,
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

    const isValidItem = (item) =>
      item &&
      typeof item.title === "string" &&
      typeof item.description === "string";

    if (
      !payload ||
      !Array.isArray(payload.uses) ||
      !Array.isArray(payload.benefits) ||
      !payload.uses.every(isValidItem) ||
      !payload.benefits.every(isValidItem)
    ) {
      throw new Error("DeepSeek returned invalid uses/benefits format");
    }

    return {
      uses: payload.uses,
      benefits: payload.benefits,
    };
  } catch (err) {
    console.error("DeepSeekUseABenefitsService Error:", err);
    throw new Error("Failed to fetch product uses & benefits");
  }
};
