import React, { useEffect, useState } from "react";
import axios from "@/services/axios";
import { Button } from "@/components/ui/button";

type Rol = {
  id: string;
  nombre: string;
};

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  estado: "ACTIVO" | "INACTIVO";
  rol: Rol;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Usuario[]>("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, []);

  const cambiarEstado = async (id: number, estadoActual: "ACTIVO" | "INACTIVO") => {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/usuarios/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuarios((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, estado: nuevoEstado } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };

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
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="text-center">
              <td className="border p-2">{usuario.nombre}</td>
              <td className="border p-2">{usuario.correo}</td>
              <td className="border p-2 capitalize">{usuario.rol?.nombre || "N/A"}</td>
              <td className="border p-2">
                {usuario.estado}
              </td>
              <td className="border p-2">
                <Button
                  variant="outline"
                  onClick={() => cambiarEstado(usuario.id, usuario.estado)}
                >
                  {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;

