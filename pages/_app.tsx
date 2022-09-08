import "../styles/globals.css";
import Head from "next/head";
import Page from "../components/page";
import { StoreProvider } from "../services/store";
import Footer from "../components/footer";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("../components/auth"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>Ed3Zapp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
      <Auth />
        <Component {...pageProps} />
      </Page>
      <Footer />
    </StoreProvider>
  );
}

export default MyApp;
