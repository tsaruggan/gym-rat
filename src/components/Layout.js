import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Layout = ({ children, userId }) => {
  return (
    <div className={styles.parent}>
      <Header userId={userId} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;


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
