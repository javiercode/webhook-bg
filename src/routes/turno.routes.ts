import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {list,create,desactivar,test} from '../controllers/turno.controller';

const router = Router ();
router.get('/turno/test',test);
router.get('/turno/list/:page/:limit',list);
router.post('/turno/create',create);
router.delete('/turno/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;