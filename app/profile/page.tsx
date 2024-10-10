'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaPen } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './profile.css';

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  phone: string;
}

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    birthDate: session?.user?.birthDate || '',
    address: session?.user?.address || '',
    phone: session?.user?.phone || '',
  });
  const [tempUserData, setTempUserData] = useState<UserData>(userData);
  const [addressValid, setAddressValid] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      setUserData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        birthDate: session.user.birthDate || '',
        address: session.user.address || '',
        phone: session.user.phone || '',
      });
      setTempUserData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        birthDate: session.user.birthDate || '',
        address: session.user.address || '',
        phone: session.user.phone || '',
      });
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const checkAddressValidity = async (address: string) => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`);
      if (!response.ok) throw new Error('Erreur lors de la validation de l\'adresse');

      const data = await response.json();
      if (data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        const [lng, lat] = coords;
        const distance = calculateDistance(lat, lng, 48.8566, 2.3522);
        return distance <= 50;
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
    return false;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const earthRadius = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAddressValid = await checkAddressValidity(tempUserData.address);
    if (!isAddressValid) {
      setAddressValid(false);
      toast.error('Adresse invalide !');
      return;
    }
    setAddressValid(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempUserData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du profil');
      }

      const result = await response.json();
      toast.success('Profil enregistré avec succès !');
      setUserData(tempUserData);
      setEditMode(false);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    toast.success('Vous êtes déconnecté !');
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="profile-container">
      <Toaster />
      <h1>Bienvenue, {userData.firstName} {userData.lastName}</h1>
      <div className="profile-details">
        {session?.user?.image && (
          <img src={session.user.image} alt="Image de profil" className="profile-image" />
        )}
        <p><strong>Email :</strong> {session?.user?.email}</p>
        <p><strong>Nom :</strong> {userData.lastName || 'Non spécifié'}</p>
        <p><strong>Prénom :</strong> {userData.firstName || 'Non spécifié'}</p>
        <p><strong>Date de naissance :</strong> {userData.birthDate || 'Non spécifié'}</p>
        <p><strong>Adresse :</strong> {userData.address || 'Non spécifié'}</p>
        <p><strong>Numéro de téléphone :</strong> {userData.phone || 'Non spécifié'}</p>

        <div className="button-group">
          <button onClick={() => setEditMode(true)} className="edit-button">
            <FaPen /> Modifier
          </button>
          <button onClick={confirmLogout} className="logout-button">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="popup">
          <div className="popup-content">
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="popup-actions">
              <button onClick={handleLogout} className="confirm-logout-button">Oui</button>
              <button onClick={cancelLogout} className="cancel-logout-button">Non</button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nom :</label>
            <input
              name="lastName"
              value={tempUserData.lastName}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Prénom :</label>
            <input
              name="firstName"
              value={tempUserData.firstName}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date de naissance :</label>
            <input
              type="date"
              name="birthDate"
              value={tempUserData.birthDate}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Adresse :</label>
            <input
              name="address"
              value={tempUserData.address}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            {!addressValid && <p className="error">L'adresse doit être dans un rayon de 50 km de Paris.</p>}
          </div>
          <div className="form-group">
            <label>Numéro de téléphone :</label>
            <input
              name="phone"
              value={tempUserData.phone}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Enregistrer</button>
            <button type="button" onClick={() => setEditMode(false)} className="cancel-button">Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
