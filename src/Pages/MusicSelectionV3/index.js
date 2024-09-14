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

const LyricCurrentLine = ({ currentLyric }) => {
  return (
    <motion.div
      key={currentLyric} // Key is important to trigger re-animation on change
      className="font-semibold text-2xl my-2 w-[600px]"
      initial={{ opacity: 0, y: 10 }} // Start animation with opacity 0 and slight downward position
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
      exit={{ opacity: 0, y: -10 }} // Animate out by moving upwards and fading out
      transition={{ duration: 0.3 }} // Control the speed of the animation
    >
      {currentLyric}
    </motion.div>
  );
};

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

  return (
    <motion.div
      className={`text-center overflow-hidden ${
        isError || isLoading || isFetching ? "" : "ml-20"
      }`}
      animate={{ width: isError || isLoading || isFetching ? "0px" : "600px" }}
      initial={{ width: "0px" }}
      transition={{ duration: 0.2 }}
    >
      <div className="opacity-50 w-[600px]">{prevLyric}</div>
      <LyricCurrentLine currentLyric={currentLyric} />
      <div className="opacity-50 w-[600px]">{nextLyric}</div>
    </motion.div>
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
          filter: "blur(20px)",
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
