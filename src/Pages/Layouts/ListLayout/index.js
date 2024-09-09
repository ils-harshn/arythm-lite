import { Outlet } from "react-router-dom";
import { useGetSongs } from "../../../API/songs/queryHooks";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  // useState
} from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
} from "react-virtualized";
// import { get_image_url } from "../../../API/helpers";
import Skeleton from "react-loading-skeleton";
import useSelectedSongStore from "../../../Store/selectedSongStore";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
  TbListDetails,
} from "react-icons/tb";
import { BiFullscreen } from "react-icons/bi";
import useOptionsStore from "../../../Store/optionsStore";
import AudioPlayer from "react-h5-audio-player";
import "../../../css/MusicPlayer.css";
import { get_song_url } from "../../../API/helpers";

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50,
});

// const SongImage = ({ path }) => {
//   const [isLoaded, setLoaded] = useState(false);

//   return (
//     <>
//       {isLoaded === false ? (
//         <Skeleton className="w-16 h-16 absolute top-0 left-0" />
//       ) : null}
//       <img
//         src={get_image_url(path)}
//         width={64}
//         height={64}
//         alt="img"
//         onLoad={() => setLoaded(true)}
//       />
//     </>
//   );
// };

const Song = ({ data }) => {
  const selected_song = useSelectedSongStore((state) => state.song);
  const select_song = useSelectedSongStore((state) => state.set_song);

  return (
    <div className="flex items-center px-2 py-4 w-full cursor-pointer hover:bg-slate-800 duration-300">
      {/* <div
        className="w-16 h-16 overflow-hidden relative rounded"
        onClick={() => select_song(data)}
      >
        <SongImage path={data.album.thumbnail300x300} />
      </div> */}
      <div className="ml-4 w-52" onClick={() => select_song(data)}>
        <div
          className={`text-base truncate ${
            selected_song?._id === data._id ? "text-green-500" : ""
          }`}
        >
          {data.original_name}
        </div>
        <div className="truncate text-xs text-slate-300">
          {data.album.title}
        </div>
        <div className="truncate text-xs">
          {data.artists.map((artist, index) => (
            <span key={artist._id} className="text-slate-300">
              {artist.name}
              {index < data.artists.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const SongSkeleton = () => {
  return (
    <div className="flex items-center px-2 py-4 w-full">
      <div className="w-16 h-16 overflow-hidden relative rounded">
        <Skeleton className="w-16 h-16" />
      </div>
      <div className="ml-4 w-60">
        <Skeleton width={240} />
        <Skeleton width={120} height={10} />
      </div>
    </div>
  );
};

const SongsList = () => {
  const {
    data = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetSongs(
    {},
    {
      select: (data) => {
        return data.pages.flat();
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const isRowLoaded = useCallback(
    ({ index }) => {
      return !!data[index];
    },
    [data]
  );

  const loadMoreRows = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      return fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    cache.clearAll();
  }, [data.length]);

  if (isLoading) return <SongSkeleton />;

  if (isLoading === false && data?.length === 0)
    return <div className="mt-4 p-4 text-center">No results found.</div>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={data.length + (hasNextPage ? 2 : 0)} // Adjust row count
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              height={height}
              width={width}
              rowHeight={cache.rowHeight}
              rowCount={data.length + (isFetchingNextPage ? 1 : 0)} // Adjust row count
              rowRenderer={({ index, key, parent, style }) => {
                if (isFetchingNextPage && index >= data.length) {
                  return (
                    <div key={key} style={style}>
                      <div className="text-xs text-center">Loading More...</div>
                    </div>
                  );
                }

                const song = data[index];
                if (!song) return null;
                return (
                  <CellMeasurer
                    key={key}
                    cache={cache}
                    parent={parent}
                    columnIndex={0}
                    rowIndex={index}
                  >
                    {({ registerChild }) => (
                      <div ref={registerChild} style={style}>
                        <Song data={song} />
                      </div>
                    )}
                  </CellMeasurer>
                );
              }}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
            />
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

const OpenSelectedSongOption = () => {
  const selected_song = useSelectedSongStore((state) => state.song);
  return selected_song?._id ? (
    <div className="p-1 hover:bg-slate-700 rounded-md duration-300 mb-2">
      <TbListDetails size={24} />
    </div>
  ) : null;
};

const SongsListCollaperOption = () => {
  const is_open = useOptionsStore((state) => state.is_songslist_visible);
  const toggle = useOptionsStore((state) => state.set_songslist_visible);

  return (
    <div
      className="p-1 hover:bg-slate-700 rounded-md duration-300 mb-2"
      onClick={() => toggle(!is_open)}
    >
      {is_open ? (
        <TbLayoutSidebarLeftCollapseFilled size={24} />
      ) : (
        <TbLayoutSidebarRightCollapseFilled size={24} />
      )}
    </div>
  );
};

const Options = () => {
  return (
    <div className="p-2 bg-black absolute top-0 left-full rounded-br-lg cursor-pointer">
      <SongsListCollaperOption />
      <OpenSelectedSongOption />
      <div className="p-1 hover:bg-slate-700 rounded-md duration-300 mb-2">
        <BiFullscreen size={24} />
      </div>
    </div>
  );
};

const SongsListContainer = () => {
  const is_open = useOptionsStore((state) => state.is_songslist_visible);

  return (
    <div className="relative">
      <Options />
      <motion.div
        className="w-96 h-full"
        initial={{ width: 384 }}
        animate={{ width: is_open ? 384 : 0 }} // Adjust the width value as needed
        transition={{ duration: 0.3 }} // Adjust the duration as needed
      >
        <SongsList />
      </motion.div>
    </div>
  );
};

const MusicPlayer = () => {
  const selected_song = useSelectedSongStore((state) => state.song);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: selected_song?.url ? "auto" : 0,
        opacity: selected_song?.url ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <AudioPlayer
        autoPlay
        src={selected_song?.url ? get_song_url(selected_song?.url) : ""}
        showJumpControls
        crossOrigin="*"
      />
    </motion.div>
  );
};

const ListLayout = () => {
  return (
    <div className="flex w-screen h-screen">
      <SongsListContainer />
      <div className="flex-grow bg-slate-800 flex flex-col">
        <div className="flex-grow">
          <Outlet />
        </div>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default ListLayout;
