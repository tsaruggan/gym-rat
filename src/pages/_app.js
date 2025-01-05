import "@/styles/globals.css";
import Head from "next/head";
import { GeistMono } from "geist/font/mono";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import UserProvider from "@/components/UserProvider";
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAppPage = router.pathname.startsWith("/[userId]");

  return (
    <div className={GeistMono.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gym Rat</title>
        <meta name="description" content="weightlifting tracker" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <PrimeReactProvider>
        {isAppPage ? (
          <UserProvider userId={router.query.userId}>
            <Component {...pageProps} />
          </UserProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </PrimeReactProvider>
    </div>
  );
}
