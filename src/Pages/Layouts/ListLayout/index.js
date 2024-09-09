import { Outlet } from "react-router-dom";
import { useGetSongs } from "../../../API/songs/queryHooks";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useState,
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
  TbMusicBolt,
} from "react-icons/tb";
import { BiFullscreen } from "react-icons/bi";
import useOptionsStore from "../../../Store/optionsStore";
import AudioPlayer from "react-h5-audio-player";
import "../../../css/MusicPlayer.css";
import { get_song_url } from "../../../API/helpers";
import { MdClose, MdFilterListAlt } from "react-icons/md";
import useFilterStore from "../../../Store/filterStore";
import { useDebounce } from "use-debounce";

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
  const filterData = useFilterStore((state) => state.filterData);
  const [debouncedFilterData] = useDebounce(filterData, 300);

  const {
    data = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetSongs(debouncedFilterData, {
    select: (data) => {
      return data.pages.flat();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

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
    return <div className="p-4 text-center w-">No results found.</div>;

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

const FilterOption = () => {
  const toggle = useOptionsStore((state) => state.set_filter_visible);
  const filterData = useFilterStore((state) => state.filterData);
  const isFilterApplied =
    filterData.original_name ||
    filterData.album_title ||
    filterData.album_code ||
    filterData.genre_name ||
    filterData.artist_name
      ? true
      : false;

  return (
    <div
      className={`p-1 rounded-md duration-300 mb-2 ${
        isFilterApplied ? "bg-slate-700" : "hover:bg-slate-700"
      }`}
      onClick={() => toggle(true)}
    >
      <MdFilterListAlt size={24} />
    </div>
  );
};

const HideAll = () => {
  const [isHidden, setHidden] = useState(false);
  const set_songslist_visible = useOptionsStore(
    (state) => state.set_songslist_visible
  );

  const set_show_music_player = useSelectedSongStore(
    (state) => state.set_show_music_player
  );

  const handleHide = () => {
    setHidden((prev) => {
      set_songslist_visible(prev);
      set_show_music_player(prev);
      return !prev;
    });
  };

  return (
    <div
      className={`p-1 rounded-md duration-300 mb-2 ${
        isHidden ? "bg-slate-700" : "hover:bg-slate-700"
      }`}
      onClick={handleHide}
    >
      <TbMusicBolt size={24} />
    </div>
  );
};

const Options = () => {
  return (
    <div className="p-2 bg-black absolute top-0 left-full rounded-br-lg cursor-pointer">
      <FilterOption />
      <SongsListCollaperOption />
      <HideAll />
      <OpenSelectedSongOption />
      <div className="p-1 hover:bg-slate-700 rounded-md duration-300">
        <BiFullscreen size={24} />
      </div>
    </div>
  );
};

const Filter = () => {
  const is_open = useOptionsStore((state) => state.is_filter_visible);
  const toggle = useOptionsStore((state) => state.set_filter_visible);

  const { filterData, setFilterData } = useFilterStore((state) => ({
    filterData: state.filterData,
    setFilterData: state.setFilterData,
  }));

  const handleInputChange = (field) => (event) => {
    setFilterData({ [field]: event.target.value });
  };

  return (
    <motion.div
      className="absolute left-full bg-slate-800 p-2 rounded-br"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: is_open ? "auto" : 0, opacity: is_open ? 1 : 0 }}
      transition={{ duration: 0.3 }} // Adjust duration as needed
      style={{ overflow: "hidden" }} // Ensure content doesn't overflow during animation
    >
      <div className="mb-2 flex justify-between items-center">
        <div>Filter Song</div>
        <div onClick={() => toggle(false)} className="cursor-pointer">
          <MdClose />
        </div>
      </div>
      <input
        value={filterData.original_name}
        onChange={handleInputChange("original_name")}
        placeholder="Enter Song Name"
        className="outline-none border-none bg-slate-800 py-2"
      />
      <input
        value={filterData.album_title}
        onChange={handleInputChange("album_title")}
        placeholder="Enter Album Name"
        className="outline-none border-none bg-slate-800 py-2"
      />
      <input
        value={filterData.album_code}
        onChange={handleInputChange("album_code")}
        placeholder="Enter Album Code"
        className="outline-none border-none bg-slate-800 py-2"
      />
      <input
        value={filterData.genre_name}
        onChange={handleInputChange("genre_name")}
        placeholder="Enter Genre"
        className="outline-none border-none bg-slate-800 py-2"
      />
      <input
        value={filterData.artist_name}
        onChange={handleInputChange("artist_name")}
        placeholder="Enter Artist Name"
        className="outline-none border-none bg-slate-800 py-2"
      />
    </motion.div>
  );
};

const SongsListContainer = () => {
  const is_open = useOptionsStore((state) => state.is_songslist_visible);

  return (
    <div className="relative">
      <Options />
      <Filter />
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
  const show_music_player = useSelectedSongStore(
    (state) => state.show_music_player
  );

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: selected_song?.url && show_music_player ? "auto" : 0,
        opacity: selected_song?.url && show_music_player ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <AudioPlayer
        autoPlay
        src={selected_song?.url ? get_song_url(selected_song?.url) : ""}
        showJumpControls
      />
    </motion.div>
  );
};

const ListLayout = () => {
  return (
    <div className="flex w-screen h-screen">
      <SongsListContainer />
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          <Outlet />
        </div>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default ListLayout;
