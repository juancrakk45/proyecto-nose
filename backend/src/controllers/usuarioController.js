import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registrar usuario (ya lo tienes)
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar si ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
};

// 🔐 Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparar contraseñas
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

// 📋 Listar usuarios (solo para pruebas o administración)
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password'); // sin contraseñas
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
  }
};

