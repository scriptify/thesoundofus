import { useEffect, useState } from "react";

export interface AppUrlParameters {
  accessToken?: string;
  expiresIn?: number;
  /**
   * google or spotify
   */
  type?: string;
}

/**
 * Reads OAuth2 Access token from
 * the URL hash fragement
 */
export default function useAccessToken() {
  const [data, setData] = useState<AppUrlParameters>({});

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.hash.substring(1));
    const state = params.get("state");

    setData({
      accessToken: params.get("access_token"),
      // Usually expires in 1h
      expiresIn: parseFloat(params.get("expires_in")),
      type: state,
    });
  }, []);

  return data;
}
