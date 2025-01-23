import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { dni } = req.body;

    if (!dni || !/^[0-9]{7,8}$/.test(dni)) {
      return res.status(400).json({ message: "DNI inválido" });
    }

    const user = await db.collection("registros").findOne({ dni });

    if (user) {
      return res.status(200).json({
        exists: true,
        email: user.email,
      });
    }

    return res.status(200).json({
      exists: false,
    });
  } catch (error) {
    console.error("Error checking DNI:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
