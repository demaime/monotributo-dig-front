import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Output from "./output";

export default function Home() {
  const router = useRouter();
  const [provinces, setProvinces] = useState([]); // Lista completa de provincias
  const [localities, setLocalities] = useState([]); // Lista de localidades de la provincia seleccionada
  const [selectedProvince, setSelectedProvince] = useState(""); // ID de la provincia seleccionada
  const [localityInput, setLocalityInput] = useState(""); // Valor del input de localidad
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    genero: "",
  });

  // Cargar las provincias al montar el componente
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://apis.datos.gob.ar/georef/api/provincias"
        );
        const data = await response.json();
        setProvinces(
          data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre))
        ); // Ordenar provincias alfabéticamente
      } catch (error) {
        console.error("Error al cargar las provincias:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Cargar las localidades cada vez que cambia la provincia seleccionada
  useEffect(() => {
    if (selectedProvince) {
      const fetchLocalities = async () => {
        try {
          const response = await fetch(
            `https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvince}&campos=nombre,departamento&max=1000`
          );
          const data = await response.json();

          // Procesar localidades y eliminar duplicados usando Set
          const localitiesSet = new Set(
            data.localidades.map((locality) => {
              const department = locality.departamento
                ? locality.departamento.nombre
                : "";
              return department
                ? `${locality.nombre} (${department})`
                : locality.nombre;
            })
          );

          // Convertir Set a Array y ordenar
          setLocalities([...localitiesSet].sort());
        } catch (error) {
          console.error("Error al cargar las localidades:", error);
        }
      };
      fetchLocalities();
    } else {
      setLocalities([]);
    }
  }, [selectedProvince]);

  // Agregar estas funciones de validación
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/; // Acepta exactamente 10 dígitos
    return regex.test(phone);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/; // Letras, espacios, guiones y apóstrofes
    return regex.test(name);
  };

  // Modificar la función handleInputChange
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Validaciones específicas por campo
    switch (id) {
      case "telefono":
        if (value === "" || /^[0-9]*$/.test(value)) {
          setFormData({ ...formData, [id]: value });
        }
        break;

      case "apellido":
      case "nombre":
        if (value === "" || validateName(value)) {
          setFormData({ ...formData, [id]: value.toUpperCase() });
        }
        break;

      case "dni":
        if (value === "" || /^[0-9]*$/.test(value)) {
          setFormData({ ...formData, [id]: value });
        }
        break;

      default:
        setFormData({ ...formData, [id]: value });
    }
  };

  // Modificar la función handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
    if (!validateName(formData.apellido)) {
      alert("El apellido solo puede contener letras, espacios y guiones");
      return;
    }
    if (!validateName(formData.nombre)) {
      alert("El nombre solo puede contener letras, espacios y guiones");
      return;
    }
    if (!/^[0-9]{7,8}$/.test(formData.dni)) {
      alert("El DNI debe contener entre 7 y 8 números");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Por favor ingrese un email válido");
      return;
    }
    if (!validatePhone(formData.telefono)) {
      alert("El teléfono debe contener 10 números");
      return;
    }

    // Validar que todos los campos estén completos
    const formFields = {
      ...formData,
      provincia: selectedProvince,
      localidad: localityInput,
    };

    if (Object.values(formFields).some((field) => field === "")) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
      });

      if (response.ok) {
        router.push("/output");
      } else {
        throw new Error("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <div className="min-h-screen bg-blue p-4 text-sm">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Formulario de Registro
        </h2>

        <p className="text-red-600 text-sm mb-4">
          * Todos los campos son obligatorios
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-700"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              required
              value={formData.apellido}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-xs placeholder-gray-400 p-2"
              placeholder="Ingrese su apellido"
            />
          </div>

          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              required
              value={formData.nombre}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-xs placeholder-gray-400 p-2"
              placeholder="Ingrese su nombre"
            />
          </div>

          <div>
            <label
              htmlFor="dni"
              className="block text-sm font-medium text-gray-700"
            >
              DNI
            </label>
            <input
              type="text"
              id="dni"
              required
              value={formData.dni}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-xs placeholder-gray-400 p-2"
              placeholder="Ingrese su DNI"
            />
          </div>

          <div>
            <label
              htmlFor="provincia"
              className="block text-sm font-medium text-gray-700"
            >
              Provincia
            </label>
            <select
              id="provincia"
              required
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 p-2"
            >
              <option value="">Seleccione una provincia</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedProvince && (
            <div>
              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-gray-700"
              >
                Localidad
              </label>
              <select
                id="localidad"
                required
                value={localityInput}
                onChange={(e) => setLocalityInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 p-2"
              >
                <option value="">Seleccione una localidad</option>
                {localities.map((locality, index) => (
                  <option key={index} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Género
            </label>
            <select
              id="genero"
              required
              value={formData.genero}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 p-2"
            >
              <option value="">Seleccione un género</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-xs placeholder-gray-400 p-2"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              required
              value={formData.telefono}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-xs placeholder-gray-400 p-2"
              placeholder="Ej: 11-1234-5678"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue text-white rounded-md py-2 px-4 hover:bg-green focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
