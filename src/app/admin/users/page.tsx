"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Crown,
  User,
} from "lucide-react";
import {
  useUserManagement,
  User as UserType,
} from "../../../hooks/useUserManagement";

const ROLES = [
  {
    value: "usuario",
    label: "Usuario",
    color: "bg-lightaccentwhite text-verylightblack",
  },
  {
    value: "admin",
    label: "Administrador",
    color: "bg-verylightblack/10 text-lightblack",
  },
];

export default function AdminUsersPage() {
  const { users, isLoading, error, fetchUsers, updateUserRole, deleteUser } =
    useUserManagement();

  const [selectedUsers, setSelectedUsers] = useState<{ [key: number]: string }>(
    {}
  );
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [operationLoading, setOperationLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [openSelects, setOpenSelects] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setOperationLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      setSelectedUsers((prev) => ({ ...prev, [userId]: newRole }));
    } catch (error) {
      showNotification("error", "Error al actualizar el rol");
      console.error("Error updating role:", error);
    } finally {
      setOperationLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setOperationLoading(userId);
    try {
      await deleteUser(userId);
      showNotification("success", "Usuario eliminado correctamente");
      setShowDeleteModal(null);
    } catch (error) {
      showNotification("error", "Error al eliminar el usuario");
      console.error("Error deleting user:", error);
    } finally {
      setOperationLoading(null);
    }
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find((r) => r.value === role) || ROLES[0];
  };

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-lightblack">
                Gestión de Usuarios
              </h1>
              <p className="text-verylightblack mt-1">
                Controla roles, permisos y administra la comunidad
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6 transition-all duration-300 hover:border-darkaccentwhite">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blueneon" />
              </div>
              <div>
                <p className="text-2xl font-bold text-lightblack">
                  {users.length}
                </p>
                <p className="text-sm text-verylightblack">Total Usuarios</p>
              </div>
            </div>
          </div>

          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6 transition-all duration-300 hover:border-darkaccentwhite">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-100 rounded-xl">
                <User className="h-6 w-6 text-pinkneon" />
              </div>
              <div>
                <p className="text-2xl font-bold text-lightblack">
                  {users.filter((u) => u.rol === "usuario").length}
                </p>
                <p className="text-sm text-verylightblack">Usuarios</p>
              </div>
            </div>
          </div>

          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6 transition-all duration-300 hover:border-darkaccentwhite">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-lightaccentwhite rounded-xl">
                <Crown className="h-6 w-6 text-verylightblack" />
              </div>
              <div>
                <p className="text-2xl font-bold text-lightblack">
                  {users.filter((u) => u.rol === "admin").length}
                </p>
                <p className="text-sm text-verylightblack">Administradores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-lightblack">
                  Lista de Usuarios
                </h2>
                <span className="text-sm text-verylightblack">
                  ({users.length})
                </span>
              </div>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-verylightblack" />
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-redneon/5">
              <div className="flex items-center space-x-3 text-redneon">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Error al cargar usuarios: {error.message}
                </span>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-lightwhite border-b border-lightaccentwhite">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-verylightblack uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-verylightblack uppercase tracking-wider">
                    Rol Actual
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-verylightblack uppercase tracking-wider">
                    Cambiar Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-verylightblack uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-verylightblack uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-lightwhite divide-y divide-lightaccentwhite">
                {users.map((user) => {
                  const roleInfo = getRoleInfo(user.rol);
                  const selectedRole = selectedUsers[user.id] || user.rol;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-lightwhite/80 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-lightaccentwhite flex items-center justify-center">
                              <Users className="h-5 w-5 text-verylightblack" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-lightblack">
                              {user.nombre_completo ||
                                user.nickname ||
                                "Sin nombre"}
                            </div>
                            <div className="text-sm text-verylightblack">
                              {user.email}
                            </div>
                            {user.first_login && (
                              <div className="text-xs text-orangeneon font-medium mt-1 flex items-center space-x-1">
                                <div className="w-2 h-2 bg-orangeneon rounded-full animate-pulse"></div>
                                <span>Primer login pendiente</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${roleInfo.color}`}
                        >
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={selectedRole}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            onFocus={() =>
                              setOpenSelects((prev) => ({
                                ...prev,
                                [user.id]: true,
                              }))
                            }
                            onBlur={() =>
                              setOpenSelects((prev) => ({
                                ...prev,
                                [user.id]: false,
                              }))
                            }
                            disabled={operationLoading === user.id}
                            className="appearance-none bg-lightwhite border border-lightaccentwhite rounded-lg px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-darkaccentwhite focus:border-darkaccentwhite disabled:bg-lightaccentwhite disabled:cursor-not-allowed cursor-pointer text-lightblack transition-all duration-200 hover:border-darkaccentwhite w-full"
                          >
                            {ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown
                              className={`h-4 w-4 text-verylightblack transition-transform duration-200 ${
                                openSelects[user.id] ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          {operationLoading === user.id && (
                            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-verylightblack" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-verylightblack">
                        {new Date(user.fecha_registro).toLocaleDateString(
                          "es-ES"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setShowDeleteModal(user.id)}
                          disabled={operationLoading === user.id}
                          className="text-redneon hover:text-redneon/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 p-2 hover:bg-redneon/10 rounded-lg cursor-pointer"
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
              <div className="inline-flex p-4 bg-lightaccentwhite/50 rounded-full mb-4">
                <Users className="h-8 w-8 text-verylightblack" />
              </div>
              <h3 className="text-lg font-semibold text-lightblack mb-2">
                No hay usuarios
              </h3>
              <p className="text-sm text-verylightblack">
                No se encontraron usuarios en el sistema.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-lightblack/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-lightwhite border border-lightaccentwhite rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-redneon/10 mb-4">
                  <AlertTriangle className="h-8 w-8 text-redneon" />
                </div>
                <h3 className="text-xl font-semibold text-lightblack mb-2">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-verylightblack mb-6">
                  ¿Estás seguro de que quieres eliminar este usuario? Esta
                  acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-6 py-3 bg-lightwhite border border-lightaccentwhite text-lightblack rounded-lg hover:bg-lightaccentwhite/30 transition-all duration-300 font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(showDeleteModal)}
                    disabled={operationLoading === showDeleteModal}
                    className="px-6 py-3 bg-redneon text-lightwhite rounded-lg hover:bg-redneon/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-300 font-medium cursor-pointer"
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
        </div>
      )}
    </div>
  );
}
