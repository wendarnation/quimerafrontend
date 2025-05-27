"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Shield, 
  Trash2, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2 
} from "lucide-react";
import { useUserManagement, User } from "../../../hooks/useUserManagement";

const ROLES = [
  { value: 'usuario', label: 'Usuario', color: 'bg-blue-100 text-blue-800' },
  { value: 'admin', label: 'Administrador', color: 'bg-red-100 text-red-800' }
];

export default function AdminUsersPage() {
  const { users, isLoading, error, fetchUsers, updateUserRole, deleteUser } = useUserManagement();

  const [selectedUsers, setSelectedUsers] = useState<{ [key: number]: string }>({});
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [operationLoading, setOperationLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setOperationLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      showNotification('success', 'Rol actualizado correctamente');
      setSelectedUsers(prev => ({ ...prev, [userId]: newRole }));
    } catch (error) {
      showNotification('error', 'Error al actualizar el rol');
      console.error('Error updating role:', error);
    } finally {
      setOperationLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setOperationLoading(userId);
    try {
      await deleteUser(userId);
      showNotification('success', 'Usuario eliminado correctamente');
      setShowDeleteModal(null);
    } catch (error) {
      showNotification('error', 'Error al eliminar el usuario');
      console.error('Error deleting user:', error);
    } finally {
      setOperationLoading(null);
    }
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[0];
  };



  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Administración de Usuarios</h1>
                <p className="text-gray-400">Gestiona los roles y permisos de los usuarios</p>
              </div>
            </div>
            
            {/* Navigation breadcrumb */}
            <nav className="mt-4">
              <ol className="flex items-center space-x-2 text-sm">
                <li><a href="/" className="text-blue-400 hover:text-blue-300">Inicio</a></li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-400">Admin</li>
                <li className="text-gray-500">/</li>
                <li className="font-medium text-white">Usuarios</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div className={`rounded-md p-4 ${
            notification.type === 'success' 
              ? 'bg-green-900 border border-green-700' 
              : 'bg-red-900 border border-red-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-200' : 'text-red-200'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-sm rounded-lg border border-gray-700">
          {/* Stats Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-white">
                  Lista de Usuarios ({users.length})
                </h2>
              </div>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Error al cargar usuarios: {error.message}</span>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rol Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cambiar Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => {
                  const roleInfo = getRoleInfo(user.rol);
                  const selectedRole = selectedUsers[user.id] || user.rol;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-300" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.nombre_completo || user.nickname || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            {user.first_login && (
                              <div className="text-xs text-orange-400 font-medium">
                                Primer login pendiente
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={operationLoading === user.id}
                            className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
                          >
                            {ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          {operationLoading === user.id && (
                            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.fecha_registro).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setShowDeleteModal(user.id)}
                          disabled={operationLoading === user.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !isLoading && (
            <div className="px-6 py-12 text-center">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-white mb-2">No hay usuarios</h3>
              <p className="text-sm text-gray-400">No se encontraron usuarios en el sistema.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-600 w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mt-4">
                Confirmar eliminación
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-400">
                  ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteModal)}
                  disabled={operationLoading === showDeleteModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {operationLoading === showDeleteModal && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
