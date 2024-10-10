
"use client";

import { signOut } from "next-auth/react";

const Signout = () => {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
    >
      Déconnexion
    </button>
  );
};

export default Signout;
