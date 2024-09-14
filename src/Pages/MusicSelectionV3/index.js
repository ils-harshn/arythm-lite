import { motion } from "framer-motion";
import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { MusicPlayingTime, NoSongSelected, Thumbnail } from "../MusicSelection";
import {
  findCurrentLyricIndex,
  get_image_url,
  parseLyrics,
} from "../../API/helpers";
import { useGetSongLyric } from "../../API/songs/queryHooks";
import { useEffect, useState } from "react";
import useMusicPlayerRefStore from "../../Store/musicPlayerRefStore";

const Lyrics = ({ song }) => {
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const {
    data: lyricData,
    refetch: fetchLyric,
    isError,
    isLoading,
    isFetching,
  } = useGetSongLyric({ path: song?.lyrics }, { enabled: false });
  const playerRef = useMusicPlayerRefStore((state) => state.music_player_ref);

  useEffect(() => {
    if (song?.lyrics) {
      fetchLyric();
    }
  }, [song?.lyrics, fetchLyric]);

  useEffect(() => {
    if (lyricData) {
      setParsedLyrics(parseLyrics(lyricData));
    }
  }, [lyricData]);

  useEffect(() => {
    const audioElement = playerRef?.current?.audio?.current;
    const handleTimeUpdate = () => {
      if (audioElement && parsedLyrics.length > 0) {
        const currentTime = audioElement.currentTime;
        const index = findCurrentLyricIndex(parsedLyrics, currentTime);
        setCurrentIndex(index);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [playerRef, parsedLyrics]);

  const prevLyric = parsedLyrics[currentIndex - 1]?.text || "";
  const currentLyric = parsedLyrics[currentIndex]?.text || "";
  const nextLyric = parsedLyrics[currentIndex + 1]?.text || "";

  if (isError || isLoading || isFetching) return null;

  return (
    <div className="text-center w-[600px] ml-20">
      <div className="opacity-50">{prevLyric}</div>
      <div className="font-semibold text-2xl my-2">{currentLyric}</div>
      <div className="opacity-50">{nextLyric}</div>
    </div>
  );
};

const Details = ({ song }) => {
  return (
    <motion.div
      key={song._id}
      className="w-full h-full flex justify-center items-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="-z-50 absolute top-0 left-0 w-full h-full"
        style={{
          filter: "blur(6px)",
        }}
      >
        <img
          className="block h-full w-full object-cover"
          src={get_image_url(song.album.thumbnail)}
          alt="backdp"
        />
      </div>
      <div>
        <Thumbnail path={song.album.thumbnail} />
        <div className="mt-1 text-white font-semibold text-center">
          {song.original_name}
        </div>
        <div className="text-xs text-white text-center">{song.album.title}</div>
        <MusicPlayingTime className="text-sm mt-2 text-center" />
      </div>
      <Lyrics song={song} />
    </motion.div>
  );
};

const MusicSelectionV3 = () => {
  const selected_song = useSelectedSongStore((state) => state.song);

  const meta = {
    title: selected_song
      ? `${selected_song.original_name}`
      : "Arythm Lite - Music Selection",
  };

  return (
    <DocumentMeta {...meta}>
      <div className="h-full">
        {selected_song ? <Details song={selected_song} /> : <NoSongSelected />}
      </div>
    </DocumentMeta>
  );
};

export default MusicSelectionV3;
