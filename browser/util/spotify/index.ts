interface RedirectToSpotifyLoginParams {
  clientId: string;
}

export function redirectToSpotifyLogin({
  clientId,
}: RedirectToSpotifyLoginParams) {
  const reqUrl = new URL("https://accounts.spotify.com/authorize");
  reqUrl.searchParams.set("client_id", clientId);
  reqUrl.searchParams.set("response_type", "token");
  reqUrl.searchParams.set("redirect_uri", window.location.origin + "/");
  reqUrl.searchParams.set(
    "scope",
    "streaming user-read-email user-read-private playlist-read-collaborative"
  );
  window.location.replace(reqUrl.toString());
}
