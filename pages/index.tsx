import Head from 'next/head'
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../components/login"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Head>
        <title>Ed3Zapp</title>
        <meta name="description" content="All-in-one crypto rewards & incentives platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="body">
        <a>
          <span className="flex items-center justify-center">
            <img src="/ed3zapp.jpg" alt="Ed3Zapp Logo" width={500} height={275} />
          </span>
        </a>
        <p className="text-3xl font-bold">
       Incentives at a Zap for learners and content creators
        </p>
        <br></br>
        <span className="flex items-center justify-center">
        <Login/>
        </span>
      </main>
    </div>
  );
}