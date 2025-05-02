import ProductModel from "../Schema/ProductSchema.js";
import { DeepseekService } from "../Service/DeepSeek.Service.js";


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

                const itemUpdated=await ProductModel.findOneAndUpdate({
                    _id : current._id
                },{
                    $set:{
                        aiDesc:response.description,
                        aiSearchkeywords:response.synonyms
                    }
                });

                console.log("itemUpdated-->",itemUpdated);


                results.push({ productName: current.name, aidescription:response.description,synonyms:response.synonyms });

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
