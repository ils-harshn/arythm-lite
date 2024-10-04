import { motion } from "framer-motion";
import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { NoSongSelected } from "../MusicSelection";
import { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import useMusicPlayerRefStore from "../../Store/musicPlayerRefStore";
import { get_image_url } from "../../API/helpers";
import { ThumbnailV4 as ThumbnailV5 } from "../MusicSelectionV4";

const AddVisualizer = ({ imgBgRef }) => {
  const containerRef = useRef(null);
  const playerRef = useMusicPlayerRefStore((state) => state.music_player_ref);
  const audioMotionRef = useRef(null); // Track if it's already initialized

  useEffect(() => {
    const audioElement = playerRef?.current?.audio?.current;
    const bgContainer = imgBgRef.current;

    if (audioElement) {
      // Check if the audioMotionAnalyzer is already initialized
      if (!audioMotionRef.current) {
        // Initialize the AudioMotionAnalyzer
        audioMotionRef.current = new AudioMotionAnalyzer(containerRef.current, {
          onCanvasDraw: (instance) => {
            const lowEnergy = instance.getEnergy("bass");
            const midEnergy = instance.getEnergy("midrange");
            const highEnergy = instance.getEnergy("treble");

            bgContainer.style.opacity =
              0.1 + Math.max(lowEnergy, midEnergy, highEnergy) * 0.8;
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
      bgContainer.style.opacity = "0.1";
    };
  }, [playerRef, imgBgRef]);

  return <div ref={containerRef} className="hidden"></div>;
};

const Details = ({ song }) => {
  const bgImageContainerRef = useRef(null);

  return (
    <motion.div
      className="w-full h-full flex justify-center items-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={bgImageContainerRef}
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          filter: "blur(2px)",
        }}
      >
        <img
          className="block h-full w-full object-cover"
          src={get_image_url(song.album.thumbnail)}
          alt="backdp"
        />
      </div>
      <ThumbnailV5 song={song} />
      <AddVisualizer imgBgRef={bgImageContainerRef} />
    </motion.div>
  );
};

const MusicSelectionV5 = () => {
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

export default MusicSelectionV5;
