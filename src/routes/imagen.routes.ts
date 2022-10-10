import {Router} from 'express';
import {list,create,desactivar,test,findId} from '../controllers/imagen.controller';
import multer from 'multer';
import { TokenMiddleware } from '../configs/TokenMiddleware';
const upload = multer({dest:'/upload'});

const router = Router ();
router.get('/imagen/test',test);
router.get('/imagen/list/:page/:limit',list);
router.get('/imagen/find/:id',findId);
router.post('/imagen/create',create);
router.delete('/imagen/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;