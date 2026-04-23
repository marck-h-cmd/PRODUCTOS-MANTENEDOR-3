const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const usuario = await prisma.seg_usuarios.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas o usuario inactivo' });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const roles = usuario.roles.map(r => r.rol.nombre);
    const permisos = usuario.roles.flatMap(r => r.rol.permisos.map(p => p.permiso.codigo));

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        roles,
        permisos
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          roles,
          permisos
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

module.exports = { login };
