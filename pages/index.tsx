import { observer } from "mobx-react-lite";
import rootStore from "../browser/state/RootStore";
import Authentication from "../browser/components/Authentication";
import { useEffect, useState } from "react";

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
    didRender && (
      <main>{rootStore.isAuthenticationNeeded && <Authentication />}</main>
    )
  );
}

export default observer(Home);
