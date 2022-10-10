import {Router} from 'express';
import { TokenMiddleware } from '../configs/TokenMiddleware';
import {listRoles, listUsuario, createRolUsuario, editRolUsuario, deleteRolUsuario, sucursalList, test} from '../controllers/usuario.controller';

const router = Router ();
router.get('/usuario/test',test);
router.get('/usuario/list/:page/:limit',listUsuario);
router.get('/sucursal/list',sucursalList);
router.get('/rol/list',listRoles);
router.post('/usuario/create',createRolUsuario);
router.put('/usuario/edit/:id',editRolUsuario);
router.delete('/usuario/delete/:id',deleteRolUsuario);

router.use(TokenMiddleware)
export default router;