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

const NoSongSelected = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <div className="text-center">
          <h3 className="text-6xl font-semibold">
            <span className="text-red-500">AR</span>
            <span className="text-white">ythm</span>
            <span
              className="text-black"
              style={{
                textShadow:
                  "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
              }}
            >
              lite.
            </span>
          </h3>
          <p className="mt-4 text-xs">Collection of all time songs</p>
        </div>

        <hr className="my-10" />
      </div>
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
      <div className="h-full">
        {selected_song ? <Details song={selected_song} /> : <NoSongSelected />}
      </div>
    </DocumentMeta>
  );
};

export default MusicSelection;
