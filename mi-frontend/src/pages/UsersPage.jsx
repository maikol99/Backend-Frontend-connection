// src/pages/UsersPage.jsx
import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, Server } from 'lucide-react';
import { userService } from '../services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // GET - Obtener lista de usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST - Crear nuevo usuario
  const createUser = async () => {
    if (!newUserName || !newUserEmail) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newUser = await userService.create({
        name: newUserName,
        email: newUserEmail,
      });
      
      setUsers([newUser, ...users]);
      setNewUserName('');
      setNewUserEmail('');
      alert(`Usuario creado: ${newUser.name}`);
    } catch (err) {
      setError('Error al crear usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar usuario
  const updateUser = async (id) => {
    const newName = prompt('Nuevo nombre:');
    const newEmail = prompt('Nuevo email:');
    if (!newName || !newEmail) return;

    setLoading(true);
    try {
      const updatedUser = await userService.update(id, {
        name: newName,
        email: newEmail,
      });
      
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      alert('Usuario actualizado exitosamente');
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar usuario
  const deleteUser = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    setLoading(true);
    try {
      await userService.delete(id);
      setUsers(users.filter(user => user.id !== id));
      alert('Usuario eliminado');
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Server className="w-8 h-8 text-blue-600" />
            Frontend → Node.js API
          </h1>
          <p className="text-gray-600">
            Conectando con tu API local en <code className="bg-gray-100 px-2 py-1 rounded text-sm">localhost:3001</code>
          </p>
        </div>

        {/* Formulario POST */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            POST - Crear Usuario
          </h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nombre completo"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={createUser}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              Crear Usuario
            </button>
          </div>
        </div>

        {/* Botón GET */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            GET - Obtener Usuarios
          </h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </>
            ) : (
              'Cargar Usuarios desde el Backend'
            )}
          </button>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">❌ Error:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">💡 Asegúrate de que el servidor Node.js esté corriendo en el puerto 3001</p>
          </div>
        )}

        {/* Lista de usuarios */}
        {users.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Lista de Usuarios ({users.length})
            </h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-400">ID: {user.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateUser(user.id)}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                      title="PUT - Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      title="DELETE - Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}