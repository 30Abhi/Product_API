
export const ProductController=async (req,res)=>{

    console.log("request made to Product controller");
    return res.json({
        status:"Ping get succesful on Product controller",
    });

    

};
