import { DeepseekService } from "../Service/DeepSeek.Service.js";

export const ProductController=async (req,res)=>{

    console.log("request made to Product controller");

    const productName=req.body.productName;
    

    try {
        const response =await DeepseekService(productName);
        return res.json({
        message: response,
        status:"Sucess",
    });

    } 
    catch (error) {
        return res.status(404).json({
            message:error.message,
            status:"Unsucess"
        })
    }

    

};
