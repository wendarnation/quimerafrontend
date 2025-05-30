"use client";

import { useState, useEffect } from "react";
import { User, Settings, Trash2, Save, Eye, EyeOff, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface UserProfile {
  id: number;
  auth0Id: string;
  email: string;
  nickname: string | null;
  nombre_completo: string | null;
  rol: string;
  first_login: boolean;
}

interface SettingsClientProps {
  user: Auth0User;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nickname: "",
    nombre_completo: "",
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const profileData = await response.json();
        setProfile(profileData);
        setFormData({
          nickname: profileData.nickname || "",
          nombre_completo: profileData.nombre_completo || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      setSuccess("Perfil actualizado correctamente");
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          nickname: formData.nickname,
          nombre_completo: formData.nombre_completo,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "ELIMINAR") {
      setError("Debes escribir 'ELIMINAR' para confirmar");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la cuenta");
      }

      // Redirect to logout
      window.location.href = "/auth/logout";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la cuenta");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow rounded-lg border border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-white">Ajustes de Usuario</h1>
            </div>
          </div>

          <div className="p-6">
            {/* Logout Button */}
            <div className="mb-6 flex justify-end">
              <a
                href="/auth/logout"
                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-200 bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </a>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-900 border border-red-700 rounded-md p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-900 border border-green-700 rounded-md p-4">
                <p className="text-green-200 text-sm">{success}</p>
              </div>
            )}

            {/* Profile Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-white mb-4">
                Información del Perfil
              </h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Auth0 Info (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email (Auth0)
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      El email se gestiona a través de Auth0
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Rol
                    </label>
                    <input
                      type="text"
                      value={profile?.rol || "usuario"}
                      disabled
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
                      Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="Tu nickname"
                    />
                  </div>

                  <div>
                    <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-300">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombre_completo"
                      name="nombre_completo"
                      value={formData.nombre_completo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-700 pt-8">
              <div className="bg-red-900 border border-red-700 rounded-md p-6">
                <div className="flex items-center mb-4">
                  <Trash2 className="h-5 w-5 text-red-400 mr-2" />
                  <h3 className="text-lg font-medium text-red-200">
                    Zona de Peligro
                  </h3>
                </div>
                
                <p className="text-red-300 text-sm mb-4">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres hacer esto.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-200 bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar mi cuenta
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-200 text-sm font-medium">
                      Para confirmar, escribe "ELIMINAR" en el siguiente campo:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="block w-full max-w-xs px-3 py-2 border border-red-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-red-800 text-white placeholder-red-300"
                      placeholder="ELIMINAR"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting || deleteConfirmText !== "ELIMINAR"}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? "Eliminando..." : "Confirmar Eliminación"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
