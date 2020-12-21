import { autorun, makeAutoObservable, reaction, toJS } from "mobx";
import getAccessToken, { resetAccessToken } from "../util/accessTokens";
import env from "../util/env";
import fetchGooglePhotosAlbum from "../util/google/fetchGooglePhotosAlbum";
import { Album } from "../util/google/types";
import fetchSpotifyPlaylist from "../util/spotify/fetchSpotifyPlaylist";
import { SpotifyPlaylist } from "../util/spotify/types";
import { getNearestSong } from "./util";

class RootStore {
  public googleAccessToken?: string;
  public spotifyAccessToken?: string;
  private playlist?: SpotifyPlaylist;
  private photos?: Album;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      this.loadAccessTokens();
    }
    this.setupDataReactions();
  }

  /**
   * Load access token from URL
   * parameters or local storage
   */
  private loadAccessTokens() {
    this.googleAccessToken = getAccessToken("google")?.accessToken;
    this.spotifyAccessToken = getAccessToken("spotify")?.accessToken;
  }

  private resetGoogleAccessToken() {
    resetAccessToken("google");
    this.googleAccessToken = undefined;
  }

  private resetSpotifyAccessToken() {
    resetAccessToken("spotify");
    this.spotifyAccessToken = undefined;
  }

  /**
   * Automatically fetches data
   * from Google and Spotify
   * as soon as valid tokens
   * were retrieved
   */
  private setupDataReactions() {
    autorun(async () => {
      if (!this.googleAccessToken) return;
      try {
        this.photos = await fetchGooglePhotosAlbum({
          accessToken: this.googleAccessToken,
          albumId: env.albumId,
        });
      } catch (e) {
        this.resetGoogleAccessToken();
      }
    });

    autorun(async () => {
      if (!this.spotifyAccessToken) return;
      try {
        this.playlist = await fetchSpotifyPlaylist({
          accessToken: this.spotifyAccessToken,
          playlistId: env.playlistId,
        });
      } catch (e) {
        this.resetSpotifyAccessToken();
      }
    });
  }

  /**
   * Brings data into an easily
   * digestable form for the UI
   */
  public get imagesGrid() {
    if (!this.photos || !this.playlist) {
      return [];
    }
    // For each photo, find the nearest song in the playlist
    let alreadyAddedSongs: string[] = [];
    const photosWithSongs = this.photos.mediaItems.map(
      (mediaItem, _, currArr) => {
        const creationTime = new Date(
          mediaItem.mediaMetadata.creationTime
        ).getTime();
        const nearestSong = getNearestSong(creationTime, this.playlist);
        const isFirst = !alreadyAddedSongs.includes(nearestSong.track.id);
        alreadyAddedSongs.push(nearestSong.track.id);
        return {
          ...mediaItem,
          song: nearestSong,
          isFirst,
        };
      }
    );

    return photosWithSongs;
  }

  public get isAuthenticationNeeded() {
    return !this.googleAccessToken || !this.spotifyAccessToken;
  }
}

const rootStore = new RootStore();

export default rootStore;
