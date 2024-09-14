const ENDPOINTS = {
  GET_SONGS: "/songs",
  GET_RANDOM_SONG: "/random-song",
  GET_SONG_LYRIC: (path) => `/get/lyric/${path}`,
  STATUS: "/status",
};

export default ENDPOINTS;
