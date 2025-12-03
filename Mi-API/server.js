// server.js - API REST con Node.js y Express

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Parsea el body JSON

// Base de datos simulada (en memoria)
let users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
  { id: 2, name: 'María García', email: 'maria@example.com' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com' }
];

let nextId = 4;

// ============================================
// RUTAS DE LA API
// ============================================

// GET - Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

// GET - Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// POST - Crear nuevo usuario
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validación
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y email son requeridos'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'Usuario creado exitosamente'
  });
});

// PUT - Actualizar usuario completo
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => {
   return u.id === id
});
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  users[userIndex] = {
    id,
    name,
    email
  };
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'Usuario actualizado exitosamente'
  });
});

// PATCH - Actualizar campos específicos
app.patch('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates
  };
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'Usuario actualizado exitosamente'
  });
});

// DELETE - Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    data: deletedUser,
    message: 'Usuario eliminado exitosamente'
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api/users`);
});