import { observer } from "mobx-react-lite";
import rootStore from "../browser/state/RootStore";
import Authentication from "../browser/components/Authentication";
import { useEffect, useState } from "react";
import ImagesGrid from "../browser/components/ImagesGrid";
import Loading from "../browser/components/Loading";
import Head from "next/head";

function Home() {
  // function onPlayRandom() {
  //   if (!playerLoading && playlist) {
  //     const trackUri = playlist.tracks.items[0].track.uri;
  //     play(trackUri);
  //   }
  // }

  const [didRender, setRender] = useState<boolean>(false);

  useEffect(() => {
    setRender(true);
  }, []);

  // So... pretty useless to Next.js for this app
  return (
    <>
      <Head>
        <title>The Sound of Us</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      {didRender ? (
        <main>
          {rootStore.isAuthenticationNeeded ? (
            <Authentication />
          ) : (
            <ImagesGrid />
          )}
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default observer(Home);
