import { motion } from "framer-motion";
import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { MusicPlayingTime, NoSongSelected } from "../MusicSelection";
import { useEffect, useRef, useState } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import useMusicPlayerRefStore from "../../Store/musicPlayerRefStore";
import { get_image_url } from "../../API/helpers";
import Skeleton from "react-loading-skeleton";

const AddVisualizer = ({ on }) => {
  const containerRef = useRef(null);
  const playerRef = useMusicPlayerRefStore((state) => state.music_player_ref);
  const audioMotionRef = useRef(null); // Track if it's already initialized

  useEffect(() => {
    const audioElement = playerRef?.current?.audio?.current;
    const body = on.current;

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
          onCanvasDraw: (instance) => {
            const lowEnergy = instance.getEnergy("bass");
            const midEnergy = instance.getEnergy("midrange");
            const highEnergy = instance.getEnergy("treble");

            const r = Math.round(lowEnergy * 255);
            const g = Math.round(midEnergy * 255);
            const b = Math.round(highEnergy * 255);

            body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          },
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
      body.style.backgroundColor = ``;
    };
  }, [playerRef, on]);

  return <div ref={containerRef} className="absolute w-full h-full z-0"></div>;
};

export const ThumbnailV4 = ({ song }) => {
  const [isLoaded, setLoaded] = useState(false);
  const path = song.album.thumbnail;

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = get_image_url(path);

    if (img.complete) {
      setLoaded(true);
    } else {
      img.onload = () => setLoaded(true);
    }
  }, [path]);

  return (
    <div className="w-80 h-80 relative">
      {isLoaded ? null : (
        <div className="absolute top-[-4px] left-0 w-80 h-80">
          <Skeleton width={320} height={320} className="rounded" />
        </div>
      )}
      <div>
        <img
          src={get_image_url(path)}
          className="w-80 h-80 rounded"
          alt="thumb"
        />
      </div>
      <div className="flex justify-between absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="truncate w-[220px]">{song.original_name}</div>
        <MusicPlayingTime />
      </div>
    </div>
  );
};

const Details = ({ song }) => {
  const detailContainerRef = useRef(null);

  return (
    <motion.div
      ref={detailContainerRef}
      className="w-full h-full flex justify-center items-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AddVisualizer on={detailContainerRef} />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <img
          className="block h-full w-full object-cover"
          src={get_image_url(song.album.thumbnail)}
          alt="backdp"
        />
      </div>
      <ThumbnailV4 song={song} />
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
