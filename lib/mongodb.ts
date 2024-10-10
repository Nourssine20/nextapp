import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Définissez la variable d'environnement MONGODB_URI dans le fichier .env");
}

// Déclarer le type pour éviter les erreurs de typage TypeScript
declare global {
  var mongo: { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null } | undefined;
}

// Utiliser une variable globale pour éviter la re-connexion
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
  // Vérifier que 'cached' est défini
  if (!cached) {
    throw new Error("La variable 'cached' n'est pas définie.");
  }

  // Si déjà connecté, retourner la connexion existante
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    // Créer une promesse de connexion à MongoDB, avec une vérification sur MONGODB_URI
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    }).catch((error) => {
      console.error("Erreur de connexion à MongoDB:", error.message);
      throw error; // Relancer l'erreur après l'avoir journalisée
    });
  }

  // Attendre que la promesse de connexion se résolve
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;