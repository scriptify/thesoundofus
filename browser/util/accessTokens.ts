export interface AppUrlParameters {
  accessToken?: string;
  expiresIn?: number;
  /**
   * google or spotify
   */
  type?: string;
}

function getLocalStorageKey(type: string) {
  return `${type}-at-soundofus`;
}

/**
 * Reads OAuth2 Access token from
 * the URL hash fragement or from
 * local storage, if defined.
 */
export default function getAccessToken(
  type: string
): AppUrlParameters | undefined {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.hash.substring(1));
  const state = params.get("state");

  if (state === type) {
    const urlData: AppUrlParameters = {
      accessToken: params.get("access_token"),
      // Usually expires in 1h
      expiresIn: parseFloat(params.get("expires_in")),
      type: state,
    };

    localStorage.setItem(getLocalStorageKey(type), JSON.stringify(urlData));

    window.location.hash = "";

    return urlData;
  }

  const persistedData = localStorage.getItem(getLocalStorageKey(type));

  if (persistedData !== null) {
    return JSON.parse(persistedData);
  }

  return undefined;
}

/**
 * If a token becomes invalid after some time,
 * delete it from localStorage with
 * this function
 */
export function resetAccessToken(type: string) {
  localStorage.setItem(getLocalStorageKey(type), null);
}
