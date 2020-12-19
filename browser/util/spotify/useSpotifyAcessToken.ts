import { useEffect, useState } from "react";

export interface AppUrlParameters {
  accessToken?: string;
  expiresIn?: number;
}

export default function useSpotifyAcessToken() {
  const [data, setData] = useState<AppUrlParameters>({});

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.hash.substring(1));
    setData({
      accessToken: params.get("access_token"),
      // Usually expires in 1h
      expiresIn: parseFloat(params.get("expires_in")),
    });
  }, []);

  return data;
}
