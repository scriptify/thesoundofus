import { Album } from "./types";

interface FetchGooglePhotosAlbumParams {
  accessToken: string;
  albumId: string;
  nextPageToken?: string;
}

/**
 * Retrieve photos of an album
 */
export default async function fetchGooglePhotosAlbum({
  accessToken,
  albumId,
  nextPageToken,
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
        pageToken: nextPageToken,
      }),
    }
  );

  if (req.status !== 200) {
    throw new Error(req.status.toString());
  }

  const data: Album = await req.json();
  if (data.nextPageToken) {
    const nextAlbumPage = await fetchGooglePhotosAlbum({
      accessToken,
      albumId,
      nextPageToken: data.nextPageToken,
    });
    return {
      mediaItems: [...data.mediaItems, ...nextAlbumPage.mediaItems],
    };
  }

  return data;
}
