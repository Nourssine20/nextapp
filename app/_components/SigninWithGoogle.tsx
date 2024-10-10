"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SigninWithGoogle: React.FC = () => {
  const router = useRouter(); 

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '100px',
  };

  const buttonStyle = {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={cardStyle}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>Bienvenue !</h1>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        Connectez-vous pour accéder à votre profil personnalisé.
      </p>

      <button
        type='button'
        style={buttonStyle}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#357ae8'}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#4285F4'}
        onClick={() => signIn('google', { redirect: true, callbackUrl: '/profile' })}
      >
        <Image
          src="/google-logo.png"
          alt="Google Logo"
          width={20}
          height={20}
          style={{ marginRight: '10px' }}
        />
        Se connecter avec Google
      </button>
    </div>
  );
};

export default SigninWithGoogle;
