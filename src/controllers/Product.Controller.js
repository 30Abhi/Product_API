import { DeepseekService } from "../Service/DeepSeek.Service.js";

export const ProductController = async (req, res) => {
    console.log("request made to Product controller");

    const productNames = req.productNames;
    if (!Array.isArray(productNames) || productNames.length === 0) {
        return res.status(400).json({
            status: "Unsuccess",
            message: "No products to process"
        });
    }

    try {
        const results = [];

        for (const name of productNames) {
            
            try {
                console.log("PRODUCT BEING PROCESSED",name);
                const description = await DeepseekService(name);
                
                results.push({ productName: name, description:description });
            } catch (err) {
                results.push({ productName: name, error: err.message });
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
