import {Router} from 'express';
import { ProductController } from '../controllers/Product.Controller.js';

import { productDBMiddleware } from '../middlewares/productDB.Middleware.js';


const router=Router();


router.use('/',productDBMiddleware,ProductController);

export default router;
