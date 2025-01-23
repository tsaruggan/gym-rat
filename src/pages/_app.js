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

  const title = "Gym Rat";
  const description = "App for weightlifting 🐭";
  const image = "social.jpg";

  return (
    <div className={GeistMono.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gymratapp.net" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`/images/${image}`} />
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
