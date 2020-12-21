import { autorun, makeAutoObservable, reaction } from "mobx";
import getAccessToken, { resetAccessToken } from "../util/accessTokens";
import env from "../util/env";
import fetchGooglePhotosAlbum from "../util/google/fetchGooglePhotosAlbum";
import { Album } from "../util/google/types";
import fetchSpotifyPlaylist from "../util/spotify/fetchSpotifyPlaylist";
import { SpotifyPlaylist } from "../util/spotify/types";

class RootStore {
  public googleAccessToken?: string;
  public spotifyAccessToken?: string;
  public playlist?: SpotifyPlaylist;
  public photos?: Album;

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
}

const rootStore = new RootStore();

export default rootStore;
