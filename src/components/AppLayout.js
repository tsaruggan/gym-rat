import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import BlockLoader from "./BlockLoader";

export default function AppLayout({ children, userId }) {
  const router = useRouter();
  const [userExists, setUserExists] = useState(null);

  useEffect(() => {
    // Check if the user exists
    const validateQueryParams = async () => {
      try {
        const response = await fetch(`/api/checkUserExists?userId=${userId}`);
        const result = await response.json();

        // Redirect if rate limiting
        if (response.status === 429) {
          router.replace('/429');
        }

        // Redirect if error or user id does not exist
        if (!response.ok || result.exists === false) {
          router.push('/404');
        }

        // Update app state (turn off loading)
        setUserExists(result.exists); 
      } catch (error) {
        console.error('Error:', error);
        router.push('/404');
      }
    }

    if (userId) {
      validateQueryParams();
    }
  }, [userId]);

  const renderLoading = () => {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BlockLoader />
      </div>      
    );
  }

  const renderApp = () => {
    return (
      <div className={styles.parent}>
        <Header userId={userId} />
        <main>{children}</main>
      </div>
    );
  }

  if (!userId || !userExists) {
    return <>{ renderLoading() }</>;
  } else {
    return <>{ renderApp() }</>;
  }
};

function Header({ userId }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
          <Link href={`/${userId}`}>
              <span className={styles.headerButton}>🐭 Gym Rat</span>
          </Link>
          <Link href={`/${userId}`}>
              <span className={styles.headerButton}>🧀</span>
          </Link>
      </div>
  </header>
  );
}
