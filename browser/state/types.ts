import { MediaItem } from "../util/google/types";
import { Item } from "../util/spotify/types";

export interface PhotoWithSong extends MediaItem {
  song?: Item;
  isFirst?: boolean;
  slideDuration?: number;
}
