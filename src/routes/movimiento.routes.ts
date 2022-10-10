import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {list,upload,edit,desactivar,test,findId} from '../controllers/movimiento.controller';
import Multer from 'multer';

const uploaded = Multer({ dest: './public/data/uploads/' })

const router = Router ();
router.get('/movimiento/test',test);
router.get('/movimiento/list/:page/:limit',list);
router.get('/movimiento/find/:id',findId);
router.post('/movimiento/upload', uploaded.single('image'),upload);
router.post('/movimiento/uploades', uploaded.array('image'),upload);
router.put('/movimiento/edit/:id',edit);
router.delete('/movimiento/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;