import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {list,create,edit,desactivar,test, listPorEstado, atender, finalizar, } from '../controllers/tarea.controller';

const router = Router ();
router.get('/tarea/test/',test);
router.get('/tarea/listEstado/:tipo/:page/:limit',listPorEstado);
router.get('/tarea/list/:page/:limit',list);
router.post('/tarea/create',create);
router.put('/tarea/edit/:id',edit);
router.put('/tarea/atender/:id',atender);
router.put('/tarea/finalizar/:id',finalizar);
// router.delete('/tarea/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;