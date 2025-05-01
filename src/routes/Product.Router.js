import {Router} from 'express';
import { ProductController } from '../controllers/Product.Controller.js';
const router=Router();


router.use('/',ProductController);

export default router;
