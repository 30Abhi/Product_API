import ProductModel from "../Schema/ProductSchema.js";
import { DeepseekDescriptionService } from "../Service/DeepSeek.Service.js";
import { DeepSeekBenefitsService } from "../Service/DeepSeekBenefits.Service.js";
import { DeepseekFAQService } from "../Service/DeepSeekFAQ.Service.js";
import { DeepseekNutritionService } from "../Service/DeepSeekNutritionalFact.Service.js";
import { DeepseekSynonymsService } from "../Service/DeepseekSynonymsService.js";
import { DeepSeekUsesService } from "../Service/DeepSeekUses.Service.js";

export const ProductController = async (req, res) => {

    console.log("Request made to Product controller");

    const productNamesAID = req.productNamesAID;

    if (!Array.isArray(productNamesAID) || productNamesAID.length === 0) {
        return res.status(400).json({
            status: "Unsuccess",
            message: "No products to process",
        });
    }

    try {

        const results = [];

        for (const current of productNamesAID) {
            try {
                console.log("PRODUCT BEING PROCESSED--->", current.name);

                let changes = {}; // Initialize changes object for the current product

                if (!current.aiDesc) {
                    const Descriptionresponse = await DeepseekDescriptionService(current.name);
                    await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiDesc: Descriptionresponse.description } },
                        { new: true }
                    );
                    changes.aiDesc = Descriptionresponse.description;
                }

                

                if (!Array.isArray(current.aiSearchkeywords) || current.aiSearchkeywords.length === 0) {
                    const Synonymsresponse = await DeepseekSynonymsService(current.name);
                    
                    const updatedProduct=await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiSearchkeywords: Synonymsresponse.synonyms } },
                        { new: true }
                    );
                    // console.log("Updated Product ai searchKeywords :", updatedProduct);
                    changes.aiSearchkeywords = Synonymsresponse.synonyms;
                }

                
                if (!Array.isArray(current.aiFAQS) || current.aiFAQS.length === 0) {
                    const FAQresponse = await DeepseekFAQService(current.name);
                    await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiFAQS: FAQresponse.FAQs } },
                        { new: true }
                    );
                    changes.aiFAQS = FAQresponse.FAQs;
                }

                if (!Array.isArray(current.aiNutritionFacts) || current.aiNutritionFacts.length === 0) {
                    const NutritonResponse = await DeepseekNutritionService(current.name);
                    await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiNutritionFacts: NutritonResponse?.nutritional_facts } },
                        { new: true }
                    );
                    changes.aiNutritionFacts = NutritonResponse?.nutritional_facts;
                }

                if (!current.aiUses) {
                    const UsesResponse = await DeepSeekUsesService(current.name);
                    await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiUses: UsesResponse.uses } },
                        { new: true }
                    );
                    changes.aiUses = UsesResponse.uses;
                }

                if (!current.aiBenefits) {
                    const BenefitsResponse = await DeepSeekBenefitsService(current.name);
                    await ProductModel.findOneAndUpdate(
                        { _id: current._id },
                        { $set: { aiBenefits: BenefitsResponse.benefits } },
                        { new: true }
                    );
                    changes.aiBenefits = BenefitsResponse.benefits;
                }

                // Push the changes for the current product into the results array
                results.push({
                    productName: current.name,
                    changes,
                });
            } catch (err) {
                console.error(`Error processing product ${current.name}:`, err.message);

                // Add the error to the results for tracking
                results.push({
                    productName: current.name,
                    error: err.message,
                });
            }
        }

        return res.json({
            status: "Success",
            data: results,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Unsuccess",
            message: err.message,
        });
    }
};