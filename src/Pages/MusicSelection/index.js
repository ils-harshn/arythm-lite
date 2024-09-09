import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { get_image_url } from "../../API/helpers";

const Thumbnail = ({ path }) => {
  return (
    <div className="w-80 h-80">
      <img
        src={get_image_url(path)}
        crossOrigin="*"
        className="w-80 h-80 rounded"
        alt="thumb"
      />
    </div>
  );
};

const Details = ({ song }) => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <Thumbnail path={song.album.thumbnail} />
      <div className="mt-1">{song.original_name}</div>
      <div className="text-xs text-slate-400">{song.album.title}</div>
    </div>
  );
};

const MusicSelection = () => {
  const selected_song = useSelectedSongStore((state) => state.song);

  const meta = {
    title: selected_song
      ? `${selected_song.original_name}`
      : "Arythm Lite - Music Selection",
  };

  return (
    <DocumentMeta {...meta}>
      <div className="p-12 h-full">
        {selected_song ? (
          <Details song={selected_song} />
        ) : (
          <div className="flex justify-center items-center h-full">
            Select a song to play!
          </div>
        )}
      </div>
    </DocumentMeta>
  );
};

export default MusicSelection;
