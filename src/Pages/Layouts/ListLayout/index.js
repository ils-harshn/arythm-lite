import "react-h5-audio-player/lib/styles.css";
import { Outlet } from "react-router-dom";
import { useGetSongs } from "../../../API/songs/queryHooks";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { AutoSizer, InfiniteLoader, List } from "react-virtualized";

import Skeleton from "react-loading-skeleton";
import useSelectedSongStore from "../../../Store/selectedSongStore";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
  TbListDetails,
  TbMusicBolt,
} from "react-icons/tb";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import useOptionsStore from "../../../Store/optionsStore";
import AudioPlayer from "react-h5-audio-player";
import "../../../css/MusicPlayer.css";
import { get_song_url } from "../../../API/helpers";
import { MdClose, MdFilterListAlt } from "react-icons/md";
import useFilterStore from "../../../Store/filterStore";
import { useDebounce } from "use-debounce";

const Song = ({ data }) => {
  const selected_song = useSelectedSongStore((state) => state.song);
  const select_song = useSelectedSongStore((state) => state.set_song);

  return (
    <div
      className={`flex items-center px-2 py-4 w-full cursor-pointer duration-300 ${
        selected_song?._id === data._id ? "bg-slate-900" : "hover:bg-slate-800"
      }`}
    >
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
    <div className="flex items-center px-2 py-4 w-full cursor-pointer">
      <div className="ml-4 w-52">
        <div>
          <Skeleton width={240} />
        </div>
        <div className="truncate text-xs text-slate-300">
          <Skeleton width={120} height={10} />
        </div>
        <div className="truncate text-xs">
          <Skeleton width={160} height={10} />
        </div>
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

  if (isLoading) return Array.from({ length: 5 }).map(() => <SongSkeleton />);

  if (isLoading === false && data?.length === 0)
    return <div className="p-4 text-center">No results found.</div>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={data.length + (hasNextPage ? 5 : 0)}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              height={height}
              width={width}
              rowHeight={88} // Fixed row height
              rowCount={data.length + (isFetchingNextPage ? 5 : 0)}
              rowRenderer={({ index, key, style }) => {
                if (isFetchingNextPage && index >= data.length) {
                  return (
                    <div key={key} style={style}>
                      <SongSkeleton />
                    </div>
                  );
                }

                const song = data[index];
                if (!song) return null;

                return (
                  <div key={key} style={style}>
                    <Song data={song} />
                  </div>
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

const FullScreenToggleOption = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      onClick={handleFullScreenToggle}
      className="p-1 hover:bg-slate-700 rounded-md duration-300 cursor-pointer"
    >
      {isFullScreen ? (
        <BiExitFullscreen size={24} />
      ) : (
        <BiFullscreen size={24} />
      )}
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
      <FullScreenToggleOption />
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
      className="absolute left-full bg-black rounded-br p-2 w-56 border-r border-b border-slate-700"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: is_open ? "auto" : 0, opacity: is_open ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <div className="mb-4 flex justify-between items-center border-b pb-2 border-slate-700">
        <div>Filter Song</div>
        <div
          onClick={() => toggle(false)}
          className="cursor-pointer hover:bg-slate-500 duration-300 rounded p-1"
        >
          <MdClose size={16} />
        </div>
      </div>

      <div>
        <div className="mb-2">
          <label className="ml-1 block text-xs font-medium">Song Name</label>
          <input
            value={filterData.original_name}
            onChange={handleInputChange("original_name")}
            type="text"
            className="p-1 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-400 sm:text-sm"
            placeholder="Enter song name"
          />
        </div>

        <div className="mb-2">
          <label className="ml-1 block text-xs font-medium">Album Name</label>
          <input
            value={filterData.album_title}
            onChange={handleInputChange("album_title")}
            type="text"
            className="p-1 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-400 sm:text-sm"
            placeholder="Enter album name"
          />
        </div>

        <div className="mb-2">
          <label className="ml-1 block text-xs font-medium">Genre Name</label>
          <input
            value={filterData.genre_name}
            onChange={handleInputChange("genre_name")}
            type="text"
            className="p-1 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-400 sm:text-sm"
            placeholder="Enter genre name"
          />
        </div>

        <div className="mb-2">
          <label className="ml-1 block text-xs font-medium">Artist Name</label>
          <input
            value={filterData.artist_name}
            onChange={handleInputChange("artist_name")}
            type="text"
            className="p-1 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-400 sm:text-sm"
            placeholder="Enter artist name"
          />
        </div>

        <div className="mb-4">
          <label className="ml-1 block text-xs font-medium">Album Code</label>
          <input
            value={filterData.album_code}
            onChange={handleInputChange("album_code")}
            type="text"
            className="p-1 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-400 sm:text-sm"
            placeholder="Enter album code"
          />
        </div>

        <div className="mb-2">
          <button
            onClick={() =>
              setFilterData({
                original_name: "",
                album_title: "",
                album_code: "",
                genre_name: "",
                artist_name: "",
              })
            }
            className={`text-sm w-full bg-indigo-600 text-white p-1 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              filterData.original_name ||
              filterData.album_title ||
              filterData.album_code ||
              filterData.genre_name ||
              filterData.artist_name
                ? ""
                : "disabled opacity-50"
            }`}
          >
            Clear All
          </button>
        </div>
      </div>
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
        animate={{ width: is_open ? 384 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <SongsList />
      </motion.div>
    </div>
  );
};

const LineLoader = ({ className = "" }) => {
  return (
    <div className={`w-full h-[1px] bg-gray-900 overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full bg-slate-500"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

const MusicPlayer = () => {
  const selected_song = useSelectedSongStore((state) => state.song);
  const show_music_player = useSelectedSongStore(
    (state) => state.show_music_player
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

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
      <div className="relative">
        {isLoading ? <LineLoader className="absolute top-0 left-0" /> : null}
        <AudioPlayer
          autoPlay
          src={selected_song?.url ? get_song_url(selected_song?.url) : ""}
          showJumpControls
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onWaiting={handleWaiting}
        />
      </div>
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
