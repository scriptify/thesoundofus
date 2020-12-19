import { useEffect, useState } from "react";
import { Album } from "../spotify/types";

interface UseGooglePhotosParams {
  accessToken?: string;
  albumId: string;
}

/**
 * Retrieve photos of an album
 */
export default function useGooglePhotosAlbum({
  accessToken,
  albumId,
}: UseGooglePhotosParams) {
  const [album, setAlbum] = useState<Album>();

  useEffect(() => {
    let didCancel = false;
    if (accessToken) {
      (async () => {
        const data = await fetch(
          "https://photoslibrary.googleapis.com/v1/mediaItems:search",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              pageSize: "100",
              albumId: albumId,
            }),
          }
        ).then((res) => res.json());
        if (!didCancel) {
          setAlbum(data);
        }
      })();
    }

    return () => {
      didCancel = true;
    };
  }, [accessToken, albumId]);

  return album;
}
