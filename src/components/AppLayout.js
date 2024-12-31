import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import BlockLoader from "./BlockLoader";

import { PrimeReactContext } from 'primereact/api';
const lightTheme =  "/themes/nano/theme.css";
const darkTheme = "/themes/soho-dark/theme.css";
import Head from 'next/head';

export default function AppLayout({ children, userId }) {
  const router = useRouter();
  const [userExists, setUserExists] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const changeTheme = (theme) => {
    let themeLink = document.getElementById('theme-link');
    if (themeLink) {
      themeLink.href = theme; 
    } else {
      themeLink = document.createElement('link');
      themeLink.id = 'theme-link';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    changeTheme(darkMode ? darkTheme : lightTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      changeTheme(darkTheme);
    } else {
      changeTheme(lightTheme);
    }
  }, [darkMode]);

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
        <Header 
          userId={userId} 
          toggleDarkMode={toggleDarkMode}
        />
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

function Header({ userId, toggleDarkMode }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
          <Link href={`/${userId}`}>
              <span className={styles.headerButton}>🐭 Gym Rat</span>
          </Link>
          <Link href={`#`}>
              <span className={styles.headerButton} onClick={toggleDarkMode}>🧀</span>
          </Link>
      </div>
  </header>
  );
}
