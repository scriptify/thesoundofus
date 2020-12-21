import { throws } from "assert";
import { autorun, makeAutoObservable, reaction, toJS } from "mobx";
import getAccessToken, { resetAccessToken } from "../util/accessTokens";
import env from "../util/env";
import fetchGooglePhotosAlbum from "../util/google/fetchGooglePhotosAlbum";
import { Album } from "../util/google/types";
import fetchSpotifyPlaylist from "../util/spotify/fetchSpotifyPlaylist";
import { SpotifyPlaylist } from "../util/spotify/types";
import SlideShowStore from "./SlideShowStore";
import { PhotoWithSong } from "./types";
import { getNearestSong } from "./util";

class RootStore {
  public googleAccessToken?: string;
  public spotifyAccessToken?: string;
  public playlist?: SpotifyPlaylist;
  private photos?: Album;
  public slideShow?: SlideShowStore;
  private slideShowInterval?: number;
  private SLIDESHOW_INTERVAL: number = 10000;

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
    this.slideShowInterval = window.setInterval(() => {
      this.nextPhoto();
    }, this.SLIDESHOW_INTERVAL);
  }

  public stopSlidshow() {
    if (this.slideShowInterval) {
      window.clearInterval(this.slideShowInterval);
      this.slideShowInterval = undefined;
    }
  }

  public get isSlideshowActive() {
    return !!this.slideShowInterval;
  }
}

const rootStore = new RootStore();

export default rootStore;
