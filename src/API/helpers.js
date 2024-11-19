import { BASE_URL } from ".";

const USE_DIRECT_SRC = process.env.REACT_APP_USE_SRC_DIRECT_URL === "TRUE";

export function get_image_url(path) {
  if (USE_DIRECT_SRC) return `${process.src.REACT_APP_SRC_DIRECT_URL}${path}`;
  return `${BASE_URL}/stream/image/${path}`;
}

export function get_song_url(path) {
  if (USE_DIRECT_SRC) return `${process.src.REACT_APP_SRC_DIRECT_URL}${path}`;
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
