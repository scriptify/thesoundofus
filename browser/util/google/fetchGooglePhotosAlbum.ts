import { Album } from "./types";

interface FetchGooglePhotosAlbumParams {
  accessToken: string;
  albumId: string;
}

/**
 * Retrieve photos of an album
 */
export default async function fetchGooglePhotosAlbum({
  accessToken,
  albumId,
}: FetchGooglePhotosAlbumParams): Promise<Album> {
  const req = await fetch(
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
  );

  if (req.status !== 200) {
    throw new Error(req.status.toString());
  }

  const data = await req.json();

  return data;
}
