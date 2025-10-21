import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// 🧠 Ruta protegida
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Ruta protegida accedida correctamente',
    usuario: req.usuario,
  });
});

export default router;
