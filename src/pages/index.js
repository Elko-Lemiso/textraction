// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the specific key exists in local storage
    const isAuthenticated = localStorage.getItem('yourLocalStorageKey'); // Replace 'yourLocalStorageKey' with your actual key

    // Redirect to /auth if the key is not present
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [router]);

  // You can show a loading state while the check is being performed
  return <p>Loading...</p>; // Or any other loading indicator
}
