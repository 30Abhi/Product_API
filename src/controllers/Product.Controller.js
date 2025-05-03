import ProductModel from "../Schema/ProductSchema.js";
import { DeepseekService } from "../Service/DeepSeek.Service.js";
import { DeepseekFAQService } from "../Service/DeepSeekFAQ.Service.js";
import { DeepseekNutritionService } from "../Service/DeepSeekNutritionalFact.Service.js";
import { DeepSeekUseABenefitsService } from "../Service/DeepSeekUseABenefits.Service.js";


export const ProductController = async (req, res) => {

    console.log("request made to Product controller");

    const productNamesAID = req.productNamesAID;

    if (!Array.isArray(productNamesAID) || productNamesAID.length === 0) {
        return res.status(400).json({
            status: "Unsuccess",
            message: "No products to process"
        });
    }

    try {
        const results = [];


        for (const current of productNamesAID) {
            
            try {
                console.log("PRODUCT BEING PROCESSED",current);

                const response = await DeepseekService(current.name);
                const FAQresponse = await DeepseekFAQService(current.name);
                const NutritonResponse=await DeepseekNutritionService(current.name);
                const HowtoUseBenefitsResponse=await DeepSeekUseABenefitsService(current.name);

                console.log("HowtoUseBenefitsResponse---->",HowtoUseBenefitsResponse);

                const itemUpdated=await ProductModel.findOneAndUpdate({
                    _id : current._id
                },{
                    $set:{
                        aiDesc:response.description,
                        aiSearchkeywords:response.synonyms,
                        aiFAQS:FAQresponse.FAQs,
                        aiNutritionFacts:NutritonResponse?.nutritional_facts,
                        aiUses:HowtoUseBenefitsResponse.uses,
                        aiBenefits:HowtoUseBenefitsResponse.benefits
                    }
                },
                { new: true });

                // console.log("itemUpdated-->",itemUpdated);


                results.push({ 
                    productName: current.name, 
                    aidescription:response.description,
                    synonyms:response.synonyms,aiFAQs:FAQresponse.FAQs,
                    aiNutrition:NutritonResponse?.nutritionalFacts,
                    aiUses:HowtoUseBenefitsResponse.uses,
                    aiBenefits:HowtoUseBenefitsResponse.benefits
                 });

            } catch (err) {
                throw new Error(err);
            }
        }

        return res.json({
            status: "Success",
            data: results
        });
    } catch (err) {
        return res.status(500).json({
            status: "Unsuccess",
            message: err.message
        });
    }
};
