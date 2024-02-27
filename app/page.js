import dynamic from "next/dynamic"; 

const SendBirdDynamic = dynamic (() => import("./components/ChatComponent"), {
  ssr : false,
  loading : () => <p>Loading...</p>
});

export default function Home() {
  const APP_ID = process.env.APP_ID;
  return (
    <main className="h-screen w-screen">
      <SendBirdDynamic APP_ID = {APP_ID}/>
    </main>
  );
}
