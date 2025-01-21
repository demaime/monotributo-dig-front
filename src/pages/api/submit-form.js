import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const data = req.body;
    const result = await db.collection("registros").insertOne(data);

    res
      .status(201)
      .json({ message: "Registro creado exitosamente", id: result.insertedId });
  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
}
