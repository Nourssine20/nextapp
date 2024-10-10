import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

const parisCoords = { lat: 48.8566, lon: 2.3522 };


const validateAddress = async (address: string) => {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();

  if (data && data.features && data.features.length > 0) {
    const userCoords = data.features[0].geometry.coordinates; 
    const distance = calculateDistance(parisCoords.lat, parisCoords.lon, userCoords[1], userCoords[0]);
    return distance <= 50; 
  }
  return false;
};


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('MyProjectNext');

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { firstName, lastName, birthDate, address, phone } = req.body;

    // Valider l'adresse
    const isValidAddress = await validateAddress(address);
    if (!isValidAddress) {
      return res.status(400).json({ error: 'L\'adresse doit être située à moins de 50 km de Paris.' });
    }

    try {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { firstName, lastName, birthDate, address, phone } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'User updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Unable to update user' });
    }
  } else if (req.method === 'GET') {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(id as string) });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
