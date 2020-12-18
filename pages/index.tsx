import { useEffect } from "react";

function onSpotifyLogin() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  if (!clientId)
    throw new Error("process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID not defined");
  const reqUrl = new URL("https://accounts.spotify.com/authorize");
  reqUrl.searchParams.set("client_id", clientId);
  reqUrl.searchParams.set("response_type", "token");
  reqUrl.searchParams.set("redirect_uri", window.location.href);
  reqUrl.searchParams.set(
    "scope",
    "streaming user-read-email user-read-private"
  );
  window.location.replace(reqUrl.toString());
}

export default function Home() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.hash.substring(1));
    const data = {
      accessToken: params.get("access_token"),
      // Usually expires in 1h
      expiresIn: params.get("expires_in"),
    };
    console.log({ data });
  }, []);

  return (
    <main>
      <button onClick={onSpotifyLogin}>Spotify Login</button>
    </main>
  );
}
