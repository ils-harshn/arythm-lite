import { BASE_URL } from ".";

export function get_media_url(path) {
  return `${BASE_URL}/stream/image/${path}`;
}
