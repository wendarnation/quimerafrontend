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
  Search,
  Filter,
  X,
} from "lucide-react";
import {
  useUserManagement,
  User as UserType,
} from "../../../hooks/useUserManagement";
import UserManagementSkeleton from "../../../components/admin/UserManagementSkeleton";

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

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

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

  // Función para filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      (user.nombre_completo &&
        user.nombre_completo
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (user.nickname &&
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "todos" || user.rol === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("todos");
  };

  // Show skeleton while loading
  if (isLoading && users.length === 0) {
    return <UserManagementSkeleton />;
  }

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">
                Gestión de Usuarios
              </h1>
              <p className="text-verylightblack mt-1 text-sm sm:text-base">
                Controla roles, permisos y administra la comunidad
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-lightblack">Filtros</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-lg hover:bg-lightaccentwhite/30 transition-all duration-200 cursor-pointer"
              >
                <Filter className="h-4 w-4 text-verylightblack" />
                <span className="text-sm text-verylightblack">
                  {showFilters ? "Ocultar" : "Mostrar"} Filtros
                </span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="px-6 py-4 bg-lightwhite/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda por texto */}
                <div className="relative">
                  <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2">
                    Buscar Usuario
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-verylightblack" />
                    <input
                      type="text"
                      placeholder="Nombre, email o nombre de usuario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-verylightblack hover:text-lightblack transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtro por rol */}
                <div>
                  <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2">
                    Filtrar por Rol
                  </label>
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full appearance-none bg-lightwhite border border-lightaccentwhite rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite cursor-pointer"
                    >
                      <option value="todos">Todos los roles</option>
                      {ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-verylightblack" />
                    </div>
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    disabled={!searchTerm && roleFilter === "todos"}
                    className="w-full px-4 py-2 bg-lightwhite border border-lightaccentwhite text-lightblack rounded-lg hover:bg-lightaccentwhite/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer text-sm font-medium"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>

              {/* Indicadores de filtros activos */}
              {(searchTerm || roleFilter !== "todos") && (
                <div className="mt-4 pt-4 border-t border-lightaccentwhite">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-verylightblack">
                      Filtros activos:
                    </span>
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 bg-blueneon/10 text-blueneon rounded-full text-xs">
                        Búsqueda: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:text-blueneon/80 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {roleFilter !== "todos" && (
                      <span className="inline-flex items-center px-2 py-1 bg-pinkneon/10 text-pinkneon rounded-full text-xs">
                        Rol: {ROLES.find((r) => r.value === roleFilter)?.label}
                        <button
                          onClick={() => setRoleFilter("todos")}
                          className="ml-1 hover:text-pinkneon/80 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6 transition-all duration-300 hover:border-darkaccentwhite">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blueneon" />
              </div>
              <div>
                <p className="text-2xl font-bold text-lightblack">
                  {filteredUsers.length}
                </p>
                <p className="text-sm text-verylightblack">
                  {searchTerm || roleFilter !== "todos"
                    ? "Usuarios Filtrados"
                    : "Total Usuarios"}
                </p>
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
                  {filteredUsers.filter((u) => u.rol === "usuario").length}
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
                  {filteredUsers.filter((u) => u.rol === "admin").length}
                </p>
                <p className="text-sm text-verylightblack">Administradores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List - Desktop Table */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden hidden md:block">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-lightblack">
                  Lista de Usuarios
                </h2>
              </div>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-verylightblack" />
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightaccentwhite/30">
              <div className="flex items-center space-x-3 text-lightblack">
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
                {filteredUsers.map((user) => {
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
                              <div className="text-xs font-medium mt-1 flex items-center space-x-1">
                                <div className="w-2 h-2 bg-orangeneon rounded-full animate-pulse"></div>
                                <span className="text-orangeneon">
                                  Primer login pendiente
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${roleInfo.color}`}
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
                            disabled={operationLoading === user.id}
                            className="appearance-none bg-lightwhite border border-darkaccentwhite rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent disabled:bg-lightaccentwhite disabled:cursor-not-allowed cursor-pointer text-lightblack transition-colors hover:border-darkaccentwhite w-full shadow-lg"
                          >
                            {ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-lightblack" />
                          </div>
                          {operationLoading === user.id && (
                            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
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

          {filteredUsers.length === 0 && !isLoading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex p-4 bg-lightaccentwhite/50 rounded-full mb-4">
                <Users className="h-8 w-8 text-verylightblack" />
              </div>
              <h3 className="text-lg font-semibold text-lightblack mb-2">
                {searchTerm || roleFilter !== "todos"
                  ? "No se encontraron usuarios"
                  : "No hay usuarios"}
              </h3>
              <p className="text-sm text-verylightblack">
                {searchTerm || roleFilter !== "todos"
                  ? "Intenta ajustar los filtros de búsqueda."
                  : "No se encontraron usuarios en el sistema."}
              </p>
            </div>
          )}
        </div>

        {/* Users List - Mobile Cards */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-lightblack">
                Lista de Usuarios ({filteredUsers.length})
              </h2>
            </div>
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-verylightblack" />
            )}
          </div>

          {error && (
            <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3 text-lightblack">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Error al cargar usuarios: {error.message}
                </span>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && !isLoading ? (
            <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-8 text-center">
              <div className="inline-flex p-4 bg-lightaccentwhite/50 rounded-full mb-4">
                <Users className="h-8 w-8 text-verylightblack" />
              </div>
              <h3 className="text-lg font-semibold text-lightblack mb-2">
                {searchTerm || roleFilter !== "todos"
                  ? "No se encontraron usuarios"
                  : "No hay usuarios"}
              </h3>
              <p className="text-sm text-verylightblack">
                {searchTerm || roleFilter !== "todos"
                  ? "Intenta ajustar los filtros de búsqueda."
                  : "No se encontraron usuarios en el sistema."}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.rol);
              const selectedRole = selectedUsers[user.id] || user.rol;

              return (
                <div
                  key={user.id}
                  className="bg-lightwhite border border-lightaccentwhite rounded-xl p-4 space-y-4"
                >
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-lightaccentwhite flex items-center justify-center">
                        <Users className="h-6 w-6 text-verylightblack" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-lightblack truncate">
                        {user.nombre_completo || user.nickname || "Sin nombre"}
                      </div>
                      <div className="text-sm text-verylightblack truncate">
                        {user.email}
                      </div>
                      {user.first_login && (
                        <div className="text-xs font-medium mt-1 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-orangeneon rounded-full animate-pulse"></div>
                          <span className="text-verylightblack">
                            Primer login pendiente
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setShowDeleteModal(user.id)}
                        disabled={operationLoading === user.id}
                        className="text-redneon hover:text-redneon/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 p-2 hover:bg-redneon/10 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Role and Actions */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2">
                        Rol Actual
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2">
                        Cambiar Rol
                      </label>
                      <div className="relative">
                        <select
                          value={selectedRole}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          disabled={operationLoading === user.id}
                          className="appearance-none bg-lightwhite border border-darkaccentwhite rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent disabled:bg-lightaccentwhite disabled:cursor-not-allowed cursor-pointer text-lightblack transition-colors hover:border-darkaccentwhite w-full shadow-lg"
                        >
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-lightblack" />
                        </div>
                        {operationLoading === user.id && (
                          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-verylightblack" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-1">
                        Fecha de Registro
                      </label>
                      <span className="text-sm text-verylightblack">
                        {new Date(user.fecha_registro).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
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
