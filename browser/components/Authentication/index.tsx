import { observer } from "mobx-react-lite";
import React from "react";
import { FaSpotify as SpotifyIcon } from "react-icons/fa";
import { FaGoogle as GoogleIcon } from "react-icons/fa";
import rootStore from "../../state/RootStore";
import env from "../../util/env";
import { getGoogleOAuthUrl } from "../../util/google";
import { getSpotifyOAuthUrl } from "../../util/spotify";

import AuthButton from "./AuthButton";

interface Props {}

const Authentication = ({}: Props) => {
  const googleOAuthUrl = getGoogleOAuthUrl({ clientId: env.googleClientId });
  const spotifyOAuthUrl = getSpotifyOAuthUrl({ clientId: env.spotifyClientId });

  return (
    <section className="w-full h-full fixed flex justify-center items-center p-4">
      <div className="w-full max-w-xl p-4 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-center mb-10">
          Accounts verbinden
        </h1>
        <AuthButton
          url={spotifyOAuthUrl}
          icon={<SpotifyIcon color="#1DB954" />}
          isAuthenticated={!!rootStore.spotifyAccessToken}
          text="Spotify Login"
        />
        <div className="mt-4" />
        <AuthButton
          url={googleOAuthUrl}
          icon={<GoogleIcon color="#DB4437" />}
          isAuthenticated={!!rootStore.googleAccessToken}
          text="Google Login"
        />
      </div>
    </section>
  );
};

export default observer(Authentication);
