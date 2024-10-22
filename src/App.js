import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

import data from "./data";

const API = "https://mongo-db-arsongs-api.onrender.com/";

const SongCard = ({ data, onClick, ...props }) => {
  return (
    <motion.div
      layoutId={`${data._id}-sc`}
      className="group cursor-pointer border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
      {...props}
      onClick={onClick}
    >
      {/* Album title */}
      <motion.h2 className="text-lg font-semibold text-white truncate">
        {data.original_name}  
      </motion.h2>

      {/* Song title */}
      <motion.p className="text-sm text-gray-300 truncate mt-1">
        {data.album.title}
      </motion.p>
    </motion.div>
  );
};

const SelectedSongCard = ({ data, onClickClose, onSongEnd }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  }, []); // Adjust the volume when data changes (e.g., when a new song is selected)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `${API}stream/song/${data.url}`;
      audioRef.current.play();
    }
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
          onClick={onClickClose}
        >
          <motion.div
            layoutId={`${data._id}-sc`}
            className="w-[500px] bg-gray-900 text-white h-fit p-6 rounded-lg relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={onClickClose}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              ✕
            </motion.button>

            {/* Album thumbnail */}
            <div className="flex items-center space-x-4">
              <img
                src={`${API}stream/image/${data.album.thumbnail300x300}`}
                alt={data.album.title}
                className="w-20 h-20 rounded-lg shadow-md"
              />
              <div>
                {/* Song title */}
                <motion.h2 className="text-2xl font-bold">
                  {data.original_name}
                </motion.h2>
                {/* Album title */}
                <p className="text-sm text-gray-400">
                  Album: {data.album.title}
                </p>
                {/* Genre */}
                <p className="text-sm text-gray-400">
                  Genre: {data.genre.name}
                </p>
                {/* Year */}
                <p className="text-sm text-gray-400">
                  Released: {data.album.year}
                </p>
              </div>
            </div>

            {/* Artists section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Artists:</h3>
              <div className="flex items-center flex-wrap gap-3 mt-2">
                {data.artists.map((artist) => (
                  <div key={artist._id} className="flex items-center">
                    <img
                      src={`${API}stream/image/${artist.artists_thumbnail300x300}`}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full shadow-md mr-2"
                    />
                    <p className="text-sm">{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Song controls */}
            <div className="mt-4">
              <audio
                ref={audioRef}
                controls
                className="w-full"
                autoPlay
                onEnded={onSongEnd} // Call onSongEnd when the song ends
              >
                <source
                  src={`${API}stream/song/${data.url}`}
                  type="audio/mp3"
                />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    original_name: "",
    artist: "",
    genre: "",
    album: "",
    year: ""
  });

  const handleSongEnd = () => {
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    setSelectedItem(filteredData[randomIndex]);
    document.title = filteredData[randomIndex].original_name;
  };

  // Filtering the data array based on the filter values
  const filteredData = data.filter((item) => {
    const matchesOriginalName = item.original_name
      .toLowerCase()
      .includes(filters.original_name.toLowerCase());
    const matchesArtist = item.artists.some((artist) =>
      artist.name.toLowerCase().includes(filters.artist.toLowerCase())
    );
    const matchesGenre = item.genre.name
      .toLowerCase()
      .includes(filters.genre.toLowerCase());
    const matchesAlbum = item.album.title
      .toLowerCase()
      .includes(filters.album.toLowerCase());
    const matchesYear = item.album.year
      .toString()
      .includes(filters.year);

    return (
      matchesOriginalName &&
      matchesArtist &&
      matchesGenre &&
      matchesAlbum &&
      matchesYear
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="p-4 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 rounded-md shadow-md">
        <input
          type="text"
          name="original_name"
          value={filters.original_name}
          onChange={handleFilterChange}
          placeholder="Filter by Song Title"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="artist"
          value={filters.artist}
          onChange={handleFilterChange}
          placeholder="Filter by Artist"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          placeholder="Filter by Genre"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="album"
          value={filters.album}
          onChange={handleFilterChange}
          placeholder="Filter by Album"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          placeholder="Filter by Year"
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Songs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {filteredData.map((item) => (
          <SongCard
            key={item._id}
            data={item}
            onClick={() => {
              setSelectedItem(item);
              document.title = item.original_name;
            }}
          />
        ))}
      </div>

      {selectedItem && (
        <SelectedSongCard
          data={selectedItem}
          onClickClose={() => {
            document.title = "Arythm Lite";
            setSelectedItem(null);
          }}
          onSongEnd={handleSongEnd}
        />
      )}
    </>
  );
};


export default App;
