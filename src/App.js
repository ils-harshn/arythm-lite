import "react-loading-skeleton/dist/skeleton.css";
import "./css/Skeleton.css";
import DocumentMeta from "react-document-meta";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListLayout from "./Pages/Layouts/ListLayout";
import MusicSelection from "./Pages/MusicSelection";
import MusicSelectionV2 from "./Pages/MusicSelectionV2";

function App() {
  const meta = {
    title: "Arythm Lite - Loading",
  };

  return (
    <DocumentMeta {...meta}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListLayout />}>
            <Route index element={<MusicSelection />} />
            <Route path="/v1" element={<MusicSelection />} />
            <Route path="/v2" element={<MusicSelectionV2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DocumentMeta>
  );
}

export default App;
