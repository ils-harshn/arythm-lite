import { motion } from "framer-motion";
import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { MusicPlayingTime, NoSongSelected, Thumbnail } from "../MusicSelection";
import { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import useMusicPlayerRefStore from "../../Store/musicPlayerRefStore";

const AddVisualizer = () => {
  const containerRef = useRef(null);
  const playerRef = useMusicPlayerRefStore((state) => state.music_player_ref);
  const audioMotionRef = useRef(null); // Track if it's already initialized

  useEffect(() => {
    const audioElement = playerRef?.current?.audio?.current;

    if (audioElement) {
      // Check if the audioMotionAnalyzer is already initialized
      if (!audioMotionRef.current) {
        // Initialize the AudioMotionAnalyzer
        audioMotionRef.current = new AudioMotionAnalyzer(containerRef.current, {
          mode: 1,
          ledBars: true,
          showBgColor: true,
          overlay: true,
          colorMode: "gradient",
          gradient: "rainbow",
          showScaleX: false,
          showPeaks: true,
        });
      } else {
        // If audio is already connected, disconnect it first
        audioMotionRef.current.disconnectInput();
      }

      // Connect the new audio element to the AudioMotionAnalyzer
      audioMotionRef.current.connectInput(audioElement);
    }

    return () => {
      if (audioMotionRef.current) {
        audioMotionRef.current.disconnectInput(); // Disconnect the audio on cleanup
        audioMotionRef.current.destroy(); // Clean up the visualizer
        audioMotionRef.current = null; // Reset the ref
      }
    };
  }, [playerRef]);

  return <div ref={containerRef} className="absolute w-full h-full"></div>;
};

const Details = ({ song }) => {
  return (
    <motion.div
      className="w-full h-full flex justify-center items-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Thumbnail path={song.album.thumbnail} />
      <div className="mt-1">{song.original_name}</div>
      <div className="text-xs text-slate-300">{song.album.title}</div>
      <MusicPlayingTime className="text-sm mt-2" />
      <AddVisualizer />
    </motion.div>
  );
};

const MusicSelectionV4 = () => {
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

export default MusicSelectionV4;
