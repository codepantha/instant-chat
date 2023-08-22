'use client';

import { signOut } from 'next-auth/react';

const User = () => {
  const handleLogout = () => signOut();

  return <button onClick={handleLogout}>Logout</button>;
};

export default User;
