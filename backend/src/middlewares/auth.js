const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartstudio-secret-key-2026';

// Middleware para verificar token JWT
// TEMPORARIAMENTE DESABILITADO - Permitindo acesso sem autenticação
const authMiddleware = (req, res, next) => {
  // Criar usuário padrão para não quebrar código que depende de req.user
  req.user = {
    id: 1,
    email: 'admin@smartstudio.com',
    role: 'admin'
  };
  return next();
  
  /* CÓDIGO ORIGINAL COMENTADO - Descomentar quando autenticação estiver pronta
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    // Verificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
      }

      // Adicionar dados do usuário na requisição
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      return next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
  */
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware opcional - não bloqueia se não tiver token
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return next();
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        };
      }
      return next();
    });
  } catch (error) {
    return next();
  }
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth };

