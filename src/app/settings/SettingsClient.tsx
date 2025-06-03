"use client";

import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Trash2,
  Save,
  LogOut,
  AlertTriangle,
} from "lucide-react";
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

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
      setError(
        err instanceof Error ? err.message : "Error al eliminar la cuenta"
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lightwhite">
        {/* Header Section */}
        <div className="bg-lightwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4">
              <div>
                <div className="h-8 bg-lightaccentwhite rounded animate-pulse w-48"></div>
                <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-80 mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
              <div className="h-6 bg-lightaccentwhite rounded animate-pulse w-40"></div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-24 mb-2"></div>
                    <div className="h-10 bg-lightaccentwhite rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">
                  Ajustes de Usuario
                </h1>
                <p className="text-verylightblack mt-1 text-sm sm:text-base">
                  Gestiona tu perfil y configuración de cuenta
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <a
              href="/auth/logout"
              className="inline-flex items-center bg-lightblack cursor-pointer hover:bg-pinkneon text-darkwhite hover:text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-lightwhite border border-redneon/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-redneon flex-shrink-0" />
              <p className="text-redneon text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-verylightblack" />
              <h2 className="text-lg font-semibold text-lightblack">
                Información del Perfil
              </h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-2 bg-lightaccentwhite/30 border border-lightaccentwhite rounded-md text-verylightblack cursor-not-allowed text-sm focus:outline-none"
                />
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                  >
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                    placeholder="Tu nombre de usuario"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nombre_completo"
                    className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre_completo"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center bg-lightaccentwhite cursor-pointer hover:bg-lightblack text-lightblack hover:text-darkwhite px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-lightwhite border border-redneon/20 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-redneon/20 bg-redneon/5">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-redneon" />
              <h2 className="text-lg font-semibold text-redneon">
                Zona de Peligro
              </h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-verylightblack text-sm mb-6">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Se eliminarán
              todos tus datos, favoritos y configuraciones. Por favor, asegúrate
              de que realmente quieres hacer esto.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center bg-lightwhite cursor-pointer hover:bg-redneon text-redneon hover:text-lightwhite px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar mi cuenta
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-lightblack text-sm font-medium">
                  Para confirmar la eliminación de tu cuenta, escribe "ELIMINAR"
                  en el siguiente campo:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="block w-full max-w-xs px-4 py-2 bg-lightwhite border border-redneon rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack text-sm"
                  placeholder="ELIMINAR"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirmText !== "ELIMINAR"}
                    className="inline-flex items-center bg-lightwhite cursor-pointer hover:bg-redneon text-redneon hover:text-lightwhite px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleting ? "Eliminando..." : "Confirmar Eliminación"}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                      setError(null);
                    }}
                    className="inline-flex items-center bg-lightaccentwhite cursor-pointer hover:bg-lightaccentwhite/50 text-lightblack hover:text-verylightblack px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out"
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
  );
}
