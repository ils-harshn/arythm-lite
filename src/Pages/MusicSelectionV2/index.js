import { motion } from "framer-motion";
import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { NoSongSelected, Thumbnail } from "../MusicSelection";
import { get_image_url } from "../../API/helpers";

const Details = ({ song }) => {
  return (
    <motion.div
      key={song._id}
      className="w-full h-full flex justify-center items-center flex-col relative"
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
      <Thumbnail path={song.album.thumbnail} />
      <div className="mt-1 text-white font-semibold">{song.original_name}</div>
      <div className="text-xs text-white">{song.album.title}</div>
    </motion.div>
  );
};

const MusicSelectionV2 = () => {
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

export default MusicSelectionV2;
