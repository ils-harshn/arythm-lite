import DocumentMeta from "react-document-meta";
import useSelectedSongStore from "../../Store/selectedSongStore";
import { get_image_url } from "../../API/helpers";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const Thumbnail = ({ path }) => {
  const [isLoaded, setLoaded] = useState(false);

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
