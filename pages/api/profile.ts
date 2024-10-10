
import dbConnect from '../../lib/mongodb';
import UserProfile from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const userProfile = new UserProfile(req.body);
      await userProfile.save();
      return res.status(201).json({ message: 'Profil créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du profil' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
