import { autorun, makeAutoObservable } from "mobx";
import getAccessToken, { resetAccessToken } from "../util/accessTokens";
import env from "../util/env";
import fetchGooglePhotosAlbum from "../util/google/fetchGooglePhotosAlbum";
import { Album } from "../util/google/types";
import fetchSpotifyPlaylist from "../util/spotify/fetchSpotifyPlaylist";
import { SpotifyPlaylist } from "../util/spotify/types";
import SlideShowStore from "./SlideShowStore";
import { PhotoWithSong } from "./types";
import { mapSongsToPhotos } from "./util";

class RootStore {
  public googleAccessToken?: string;
  public spotifyAccessToken?: string;
  public playlist?: SpotifyPlaylist;
  private photos?: Album;
  public slideShow?: SlideShowStore;
  private slideShowTimeout?: number;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      this.loadAccessTokens();
      this.setupKeyboardBindings();
    }
    this.setupDataReactions();
  }

  private setupKeyboardBindings() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.previousPhoto();
      }
      if (e.key === "ArrowRight") {
        this.nextPhoto();
      }
      if (e.key === "Escape") {
        this.stopSlidshow();
        this.slideShow.closeSlideShow();
      }
    });
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
        this.slideShow = new SlideShowStore({
          spotifyAccessToken: this.spotifyAccessToken,
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
  public get imagesGrid(): PhotoWithSong[] {
    if (!this.photos || !this.playlist) {
      return [];
    }
    return mapSongsToPhotos(this.photos, this.playlist);
  }

  public get isAuthenticationNeeded() {
    return !this.googleAccessToken || !this.spotifyAccessToken;
  }

  public nextPhoto() {
    if (!this.slideShow?.activePhotoId) return;
    const currIndex = this.imagesGrid.findIndex(
      (photo) => photo.id === this.slideShow?.activePhotoId
    );
    let newIndex = currIndex + 1;
    if (newIndex >= this.imagesGrid.length) {
      newIndex = 0;
    }
    const newPhoto = this.imagesGrid[newIndex];
    this.slideShow.setActivePhoto({
      activePhotoId: newPhoto.id,
      activeSongUri: newPhoto.song.track.uri,
    });
  }

  public previousPhoto() {
    if (!this.slideShow?.activePhotoId) return;
    const currIndex = this.imagesGrid.findIndex(
      (photo) => photo.id === this.slideShow?.activePhotoId
    );
    let newIndex = currIndex - 1;
    if (newIndex < 0) {
      newIndex = this.imagesGrid.length - 1;
    }
    const newPhoto = this.imagesGrid[newIndex];
    this.slideShow.setActivePhoto({
      activePhotoId: newPhoto.id,
      activeSongUri: newPhoto.song.track.uri,
    });
  }

  public startSlideShow(fromPhotoId: string = this.imagesGrid[0].id) {
    if (!this.slideShow.activePhotoId) {
      const fromPhoto = this.imagesGrid.find((p) => p.id === fromPhotoId);
      this.slideShow.setActivePhoto({
        activePhotoId: fromPhoto.id,
        activeSongUri: fromPhoto.song.track.uri,
      });
    } else if (!this.slideShow.activeSongUri) {
      const photo = this.imagesGrid.find(
        (p) => p.id === this.slideShow.activePhotoId
      );
      if (photo) {
        this.slideShow.setActivePhoto({
          activePhotoId: photo.id,
          activeSongUri: photo.song.track.uri,
        });
      }
    }
    const activePhoto = this.imagesGrid.find(
      (p) => p.id === this.slideShow.activePhotoId
    );
    if (!activePhoto) return;
    this.slideShowTimeout = window.setTimeout(() => {
      this.nextPhoto();
      // Continue slideshow
      this.startSlideShow();
    }, activePhoto.slideDuration * 1000);
  }

  public stopSlidshow() {
    if (this.slideShowTimeout) {
      window.clearTimeout(this.slideShowTimeout);
      this.slideShowTimeout = undefined;
    }
  }

  public get isSlideshowActive() {
    return !!this.slideShowTimeout;
  }

  public get slideshowDuration() {
    return this.imagesGrid.reduce((val, photo) => {
      return val + (photo.slideDuration ?? 0);
    }, 0);
  }
}

const rootStore = new RootStore();

export default rootStore;
