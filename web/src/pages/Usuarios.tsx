import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance"; // en lugar de "axios"
import Button from "../components/ui/Button";

type Rol = { /* ... */ };
type Usuario = { /* ... */ };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get<Usuario[]>("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Respuesta de /usuarios:", res.data);
        if (Array.isArray(res.data)) {
          setUsuarios(res.data);
        } else {
          console.error("Respuesta no es un array:", res.data);
          setErrorMsg("No se pudo obtener la lista de usuarios.");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setErrorMsg("Hubo un error al obtener los usuarios.");
      }
    };
    obtenerUsuarios();
  }, []);

  const cambiarEstado = async (id: number, estadoActual: "ACTIVO" | "INACTIVO") => {
    if (!usuarios) return;
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      const token = localStorage.getItem("token");
      await api.patch(`/usuarios/${id}`, { estado: nuevoEstado }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(prev =>
        prev?.map(user =>
          user.id === id ? { ...user, estado: nuevoEstado } : user
        ) ?? null
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };

  if (errorMsg) {
    return <div className="p-4 text-red-600">{errorMsg}</div>;
  }

  if (!usuarios) {
    return <div className="p-4">Cargando usuarios...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Administración de Usuarios</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} className="text-center">
              <td className="border p-2">{usuario.nombre}</td>
              <td className="border p-2">{usuario.correo}</td>
              <td className="border p-2 capitalize">{usuario.rol?.nombre || "N/A"}</td>
              <td className="border p-2">{usuario.estado}</td>
              <td className="border p-2">
                <Button variant="outline" onClick={() => cambiarEstado(usuario.id, usuario.estado)}>
                  {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
