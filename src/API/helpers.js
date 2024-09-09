import { BASE_URL } from ".";

export function get_image_url(path) {
  return `${BASE_URL}/stream/image/${path}`;
}

export function get_song_url(path) {
  return `${BASE_URL}/stream/song/${path}`;
}
