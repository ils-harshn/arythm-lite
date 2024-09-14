import { BASE_URL } from ".";

export function get_image_url(path) {
  return `${BASE_URL}/stream/image/${path}`;
}

export function get_song_url(path) {
  return `${BASE_URL}/stream/song/${path}`;
}

export const parseLyrics = (lrc) => {
  const lines = lrc.split("\n");
  return lines
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const [, minutes, seconds, milliseconds, text] = match;
        return {
          time:
            parseInt(minutes) * 60 +
            parseInt(seconds) +
            parseInt(milliseconds) / 1000,
          text: text.trim(),
        };
      }
      return null;
    })
    .filter(Boolean);
};

export const findCurrentLyricIndex = (lyrics, currentTime) => {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i].time <= currentTime) {
      return i;
    }
  }
  return -1;
};
