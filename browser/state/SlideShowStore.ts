import { makeAutoObservable, reaction } from "mobx";
import SpotifyWebPlayer from "../util/spotify/WebPlayer";

interface SlideShowStoreParams {
  spotifyAccessToken: string;
}

interface SetActivePhotoParameters {
  activePhotoId: string;
  activeSongUri: string;
}

export default class SlideShowStore {
  public activePhotoId?: string;
  public activeSongUri?: string;
  public spotifyWebPlayer: SpotifyWebPlayer;
  public loading: boolean = true;

  constructor({ spotifyAccessToken }: SlideShowStoreParams) {
    makeAutoObservable(this);
    this.spotifyWebPlayer = new SpotifyWebPlayer({
      accessToken: spotifyAccessToken,
      onError: () => {},
    });
    this.setup();
  }

  private async setup() {
    await this.spotifyWebPlayer.load();
    this.loading = false;
    reaction(
      () => this.activeSongUri,
      () => {
        if (this.activeSongUri) {
          this.spotifyWebPlayer.play(this.activeSongUri);
        } else {
          this.spotifyWebPlayer.pause();
        }
      }
    );
  }

  public setActivePhoto({
    activePhotoId,
    activeSongUri,
  }: SetActivePhotoParameters) {
    this.activePhotoId = activePhotoId;
    this.activeSongUri = activeSongUri;
  }

  public closeSlideShow() {
    this.activePhotoId = undefined;
  }

  public start() {}
}
