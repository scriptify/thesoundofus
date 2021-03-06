interface RedirectToGoogleLoginParams {
  clientId: string;
}

export function getGoogleOAuthUrl({ clientId }: RedirectToGoogleLoginParams) {
  const reqUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  reqUrl.searchParams.set("client_id", clientId);
  reqUrl.searchParams.set("response_type", "token");
  reqUrl.searchParams.set("state", "google");
  reqUrl.searchParams.set(
    "redirect_uri",
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI
  );
  reqUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/photoslibrary.readonly"
  );
  return reqUrl.toString();
}

export function mediaItemBaseUrlToImgSrc(baseUrl: string) {
  return `${baseUrl}=w2048-h1024`;
}
