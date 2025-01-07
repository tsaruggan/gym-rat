import { Button } from 'primereact/button';
import SettingsPopup from './SettingsPopup';
import { useUser } from './UserProvider';
import { useRouter } from 'next/router';
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

function Header({ userId }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>

        <Button className={styles.headerButton} onClick={() => { router.push(`/${userId}`) }}>
          <span>🐭 Gym Rat</span>
        </Button>
        <SettingsPopup />
      </div>
    </header>
  );
}