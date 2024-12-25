import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.parent}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;


function Header(props) {
    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
            <Link href="/">
                <span className={styles.headerButton}>🐭 Gym Rat</span>
            </Link>
            <Link href="/">
                <span className={styles.headerButton}>🧀</span>
            </Link>
        </div>
    </header>
    );
}
