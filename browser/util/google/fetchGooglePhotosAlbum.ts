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
        albumId,
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

interface ShareAlbum {
  id: string;
  title: string;
}

export async function retrieveRelevantAlbum(accessToken: string) {
  const albums = (await fetch(
    `https://photoslibrary.googleapis.com/v1/sharedAlbums`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json())) as { sharedAlbums: ShareAlbum[] };
  const foundAlbum = albums.sharedAlbums.find(
    (album) => album.title === "Us 💕"
  );
  console.log("retrieveRelevantAlbum", { albums, foundAlbum });
  return foundAlbum;
}
