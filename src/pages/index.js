import React, { useState, useEffect } from "react";

export default function Home() {
  const [provinces, setProvinces] = useState([]); // Lista de provincias
  const [localities, setLocalities] = useState([]); // Lista de localidades según la provincia seleccionada
  const [selectedProvince, setSelectedProvince] = useState(""); // Cambiar a ID de provincia en lugar del nombre
  const [searchLocalidad, setSearchLocalidad] = useState("");
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [showProvinceResults, setShowProvinceResults] = useState(false);
  const [showLocalityResults, setShowLocalityResults] = useState(false);
  const [provinceInput, setProvinceInput] = useState("");
  const [localityInput, setLocalityInput] = useState("");
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

  // Función para filtrar provincias
  const handleProvinceSearch = (value) => {
    setProvinceInput(value);
    const filtered = provinces.filter((province) =>
      province.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProvinces(filtered);
    setShowProvinceResults(true);
  };

  // Función para filtrar localidades
  const handleLocalitySearch = (value) => {
    setLocalityInput(value);
    const filtered = localities.filter((locality) =>
      locality.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLocalities(filtered);
    setShowLocalityResults(true);
  };

  // Función para seleccionar provincia
  const selectProvince = (province) => {
    setProvinceInput(province.nombre);
    setSelectedProvince(province.id);
    setShowProvinceResults(false);
  };

  // Función para seleccionar localidad
  const selectLocality = (locality) => {
    setLocalityInput(locality);
    setShowLocalityResults(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Convertir a mayúsculas solo los campos de texto, no email ni teléfono
    if (["apellido", "nombre", "dni"].includes(id)) {
      setFormData({
        ...formData,
        [id]: value.toUpperCase(),
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Formulario de Registro
        </h2>

        <p className="text-red-600 text-sm mb-4">
          * Todos los campos son obligatorios
        </p>

        <form className="space-y-4">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-sm placeholder-gray-400 p-2"
              placeholder="INGRESE SU APELLIDO"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-sm placeholder-gray-400 p-2"
              placeholder="INGRESE SU NOMBRE"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-sm placeholder-gray-400 p-2"
              placeholder="INGRESE SU DNI"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="provincia"
              className="block text-sm font-medium text-gray-700"
            >
              Provincia
            </label>
            <input
              type="text"
              id="provincia"
              required
              value={provinceInput}
              onChange={(e) => handleProvinceSearch(e.target.value)}
              onFocus={() => setShowProvinceResults(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder-gray-400 p-2"
              placeholder="Buscar provincia..."
            />
            {showProvinceResults && filteredProvinces.length > 0 && (
              <div className="absolute z-10 w-full left-0 bg-white mt-1 rounded-md shadow-lg max-h-40 overflow-auto border border-gray-300">
                {filteredProvinces.map((province) => (
                  <div
                    key={province.id}
                    onClick={() => selectProvince(province)}
                    className="p-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-gray-100"
                  >
                    {province.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedProvince && (
            <div className="relative">
              <label
                htmlFor="localidad"
                className="block text-sm font-medium text-gray-700"
              >
                Localidad
              </label>
              <input
                type="text"
                id="localidad"
                required
                value={localityInput}
                onChange={(e) => handleLocalitySearch(e.target.value)}
                onFocus={() => setShowLocalityResults(true)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder-gray-400 p-2"
                placeholder="Buscar localidad..."
              />
              {showLocalityResults && filteredLocalities.length > 0 && (
                <div className="absolute z-10 w-full left-0 bg-white mt-1 rounded-md shadow-lg max-h-40 overflow-auto border border-gray-300">
                  {filteredLocalities.map((locality, index) => (
                    <div
                      key={index}
                      onClick={() => selectLocality(locality)}
                      className="p-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-gray-100"
                    >
                      {locality}
                    </div>
                  ))}
                </div>
              )}
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
              <option value="">SELECCIONE UN GÉNERO</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="FEMENINO">FEMENINO</option>
              <option value="OTRO">OTRO</option>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder-gray-400 p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder-gray-400 p-2"
              placeholder="Ej: 11-1234-5678"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
