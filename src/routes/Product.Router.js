import {Router} from 'express';
import { ProductController } from '../controllers/Product.Controller.js';
import multer from 'multer';
import { csvParserMiddleware } from '../middlewares/csvParserMiddleware.js';


const router=Router();
const upload = multer({ dest: 'uploads/' });

router.use('/',upload.single('file'),csvParserMiddleware,ProductController);

export default router;
