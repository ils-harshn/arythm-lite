import "react-loading-skeleton/dist/skeleton.css";
import "./css/Skeleton.css";
import DocumentMeta from "react-document-meta";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListLayout from "./Pages/Layouts/ListLayout";
import MusicSelection from "./Pages/MusicSelection";
import MusicSelectionV2 from "./Pages/MusicSelectionV2";
import MusicSelectionV3 from "./Pages/MusicSelectionV3";
import MusicSelectionV4 from "./Pages/MusicSelectionV4";
import ListLayoutV4 from "./Pages/Layouts/ListLayout/ListLayoutV4";
import ListLayoutV5 from "./Pages/Layouts/ListLayout/ListLayoutV5";
import MusicSelectionV5 from "./Pages/MusicSelectionV5";

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
            <Route path="/v3" element={<MusicSelectionV3 />} />
          </Route>
          <Route path="/" element={<ListLayoutV4 />}>
            <Route path="/v4" element={<MusicSelectionV4 />} />
          </Route>
          <Route path="/" element={<ListLayoutV5 />}>
            <Route path="/v5" element={<MusicSelectionV5 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DocumentMeta>
  );
}

export default App;
