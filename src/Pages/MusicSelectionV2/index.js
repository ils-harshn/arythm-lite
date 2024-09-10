import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { NoSongSelected, Thumbnail } from "../MusicSelection";
import { get_image_url } from "../../API/helpers";

const Details = ({ song }) => {
  return (
    <div
      key={song._id}
      className="w-full h-full flex justify-center items-center flex-col relative"
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
      <div className="mt-1">{song.original_name}</div>
      <div className="text-xs text-slate-400">{song.album.title}</div>
    </div>
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
