import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import data from "./data";

const API = "https://evil-714859248413.us-central1.run.app/";

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
        {data.album.title}
      </motion.h2>

      {/* Song title */}
      <motion.p className="text-sm text-gray-300 truncate mt-1">
        {data.original_name}
      </motion.p>
    </motion.div>
  );
};

const SelectedSongCard = ({ data, onClickClose }) => {
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
              <div className="flex items-center space-x-2 mt-2">
                {data.artists.map((artist) => (
                  <div key={artist._id} className="flex items-center space-x-2">
                    <img
                      src={`${API}stream/image/${artist.artists_thumbnail300x300}`}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full shadow-md"
                    />
                    <p className="text-sm">{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Song controls */}
            <div className="mt-4">
              <audio controls className="w-full" autoPlay>
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {data.map((item) => (
          <SongCard
            key={item._id}
            data={item}
            onClick={() => {
              setSelectedItem(item);
              console.log(item.album.title);
            }}
          />
        ))}
      </div>
      {selectedItem && (
        <SelectedSongCard
          data={selectedItem}
          onClickClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default App;
