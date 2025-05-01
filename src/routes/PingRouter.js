import {Router} from 'express';
import { PingController } from '../controllers/Ping.Controller.js';
const router=Router();

router.get('/',(req,res)=>{
    
    console.log("hi");
    return res.json({
        message:'get request on ping made succesfully',
        code :'1234567'
    })
    
});

router.use('/desc',PingController);

export default router;

