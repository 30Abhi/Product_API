import { MongoConfig } from "../Config/Mongo.Config.js";
import ProductModel from "../Schema/ProductSchema.js";

export const productDBMiddleware = async (req, res, next) => {
  try {
    // Fetch first 2 products where aiDesc is null or does not exist
    await MongoConfig();
    
    const products = await ProductModel.find(
      { $or: [{ aiDesc: null }, { aiDesc: { $exists: false } }] }, 
      { name: 1, _id: 1 }// Projection 
    )
      .limit(2); 

    console.log("PRODUCTS--->", products);

    // Map product names to req.productNames
    req.productNamesAID = products.map(product => product);

    next();
  } catch (error) {
    console.error("Error in productDBMiddleware:", error.message);
    next(error);
  }
};