import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.parent}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
            <Link href="/">
                <span className={styles.logo}>🐭 Gym Rat</span>
            </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;


function Header(props) {
    return (
        <div>
            
        </div>
    );
}
