"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Welcome, {session.user.name}!</span>
        <button 
          onClick={() => signOut()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('github')}
      style={{
        padding: '8px 16px',
        backgroundColor: '#ff69b4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Sign in with GitHub
    </button>
  );
}
