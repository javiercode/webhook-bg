import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {list,create,edit,desactivar,findNombre,test,findId,listSucursal} from '../controllers/cliente.controller';

const router = Router ();
router.get('/cliente/test',test);
router.get('/cliente/list/:page/:limit',list);
router.get('/cliente/listSucursal',listSucursal);
router.get('/cliente/findCI/:param',findNombre);
router.get('/cliente/find/:id',findId);
router.post('/cliente/create',create);
router.put('/cliente/edit/:id',edit);
// router.delete('/cliente/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;