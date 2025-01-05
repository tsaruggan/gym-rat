import Link from 'next/link';
import { useUser } from './UserProvider';
import styles from '@/styles/Home.module.css';

export default function AppLayout({ children }) {
  const { user, darkMode, setDarkMode, units, setUnits } = useUser();
  const toggle = () => {
    setDarkMode(!darkMode);
    setUnits(darkMode ? "kg" : "lb");
  }

  return (
    <div className={styles.parent}>
      <Header
        userId={user.id}
        toggleDarkMode={toggle}
      />
      <main>{children}</main>
    </div>
  );

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