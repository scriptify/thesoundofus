export interface Photo {
  cameraMake: string;
  cameraModel: string;
  focalLength: number;
  apertureFNumber: number;
  isoEquivalent: number;
}

export interface MediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo: Photo;
}

export interface MediaItem {
  id: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: MediaMetadata;
  filename: string;
}

export interface Album {
  mediaItems: MediaItem[];
  nextPageToken?: string;
}
