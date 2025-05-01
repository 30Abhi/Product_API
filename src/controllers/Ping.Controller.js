

export const PingController=(req,res)=>{
    console.log("request made to Ping controller");
    return res.json({
        status:"Ping get succesful on Ping controller",
    })
};
