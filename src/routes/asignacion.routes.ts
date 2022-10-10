import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {list,create,desactivar,test} from '../controllers/asignacion.controller';

const router = Router ();
router.get('/asignacion/test',test);
router.get('/asignacion/list/:page/:limit',list);
router.post('/asignacion/create',create);
router.delete('/asignacion/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;