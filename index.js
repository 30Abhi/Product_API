import express from 'express';
import cors from 'cors';
import PingRouter from './src/routes/PingRouter.js'
import ProductRouter from './src/routes/Product.Router.js'
import { Port } from './src/Config/Server.Config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/ping2',(req,res)=>{
    console.log("hi");
    return res.json({
        message:'get request on ping made succesfully',
        code :'1234567'
    })
})

app.use('/ping',PingRouter);

app.use('/product',ProductRouter);


app.listen(Port,()=>{
    console.log(`server running on http://localhost:${Port}`);
})

