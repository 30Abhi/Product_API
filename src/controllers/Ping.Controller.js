export const PingController=(req,res)=>{
    console.log("request made to Ping controller");
    return res.json({
        message:"Ping get succesful on Ping controller",
        status:true,
    })
};
