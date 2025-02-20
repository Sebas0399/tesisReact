import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./pages/about";
import Documentation from "./pages/documentation";
import GettingStartedPage from "./pages/docs/getting-started";
import ModelsAndDatasetsPage from "./pages/docs/models-and-datasets";
import "./App.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="home" element={<App />} />
      <Route path="about" element={<About />} />
      <Route path="documentation" element={<Documentation />} />
      <Route path="docs/getting-started" element={<GettingStartedPage />} />
      <Route path="docs/models-and-datasets" element={<ModelsAndDatasetsPage />} />
    </Routes>
  </BrowserRouter>
);