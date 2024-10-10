"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import './home.css';
import { FaSignOutAlt } from 'react-icons/fa'; 
import Image from 'next/image'; 

const Home = () => {
  const { data: session } = useSession();

  return (
    <div className="page-container">
      <div className="content">
        <h1 className="title">Bienvenue dans notre application</h1>
        {session ? (
          <>
            <p className="description">
              Connecté en tant que <span className="highlight">{session.user?.email}</span>
            </p>
            <p className="description">
              Désolé, votre session est expirée. Vous devez vous reconnecter.
            </p>
            <div className="button-group">
              <button 
                onClick={() => signOut()} 
                className="button logout"
              >
                <FaSignOutAlt className="icon" /> Reconnectez-vous
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="description">
              Veuillez vous connecter pour accéder à votre profil
            </p>
            <button 
              onClick={() => signIn('google')} 
              className="button login google"
            >
              <Image
                src="/google-logo.png" 
                alt="Google Logo"
                width={20}
                height={20}
                style={{ marginRight: '10px' }}
              /> 
              Connexion avec Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
