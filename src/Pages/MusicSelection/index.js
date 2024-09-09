import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";

const MusicSelection = () => {
  const selected_song = useSelectedSongStore((state) => state.song);

  const meta = {
    title: selected_song
      ? `${selected_song.original_name}`
      : "Arythm Lite - Music Selection",
  };

  return (
    <DocumentMeta {...meta}>
      <div className="ml-12">{selected_song?.title}</div>
    </DocumentMeta>
  );
};

export default MusicSelection;
