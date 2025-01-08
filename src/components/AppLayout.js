import Head from "next/head";
import { Button } from 'primereact/button';
import SettingsPopup from './SettingsPopup';
import { useUser } from './UserProvider';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';

export default function AppLayout({ children }) {
  const { user } = useUser();
  const userId = user.id;

  return (
    <>
      <Head>
        <title>Gym Rat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href={`/api/manifest?userId=${userId}`} />
      </Head>

      <div className={styles.parent}>
        <Header userId={userId} />
        <main>{children}</main>
      </div>
    </>
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