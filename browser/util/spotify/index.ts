interface RedirectToSpotifyLoginParams {
  clientId: string;
}

export function getSpotifyOAuthUrl({ clientId }: RedirectToSpotifyLoginParams) {
  const reqUrl = new URL("https://accounts.spotify.com/authorize");
  reqUrl.searchParams.set("client_id", clientId);
  reqUrl.searchParams.set("response_type", "token");
  reqUrl.searchParams.set("state", "spotify");
  reqUrl.searchParams.set(
    "redirect_uri",
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI
  );
  reqUrl.searchParams.set(
    "scope",
    "streaming user-read-email user-read-private playlist-read-collaborative"
  );
  return reqUrl.toString();
}
