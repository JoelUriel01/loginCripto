'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente al login cuando carga la página
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Sistema de Login Criptografía
        </h1>
        <p className="text-white text-lg">
          Redirigiendo al login...
        </p>
      </div>
    </div>
  );
}
