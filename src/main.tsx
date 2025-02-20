import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter, Routes, Route } from "react-router";
import About from "./pages/about.tsx";
import Documentation from "./pages/documentation.tsx";
import GettingStartedPage from "./pages/docs/getting-started.tsx";
import ModelsAndDatasetsPage from "./pages/docs/models-and-datasets.tsx";
const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="home" element={<App />} />

      <Route index element={<About />} />
      <Route path="about" element={<About />} />

      <Route index element={<Documentation />} />
      <Route path="documentation" element={<Documentation />} />

      <Route index element={<GettingStartedPage />} />
      <Route path="docs/getting-started" element={<GettingStartedPage />} />

      <Route index element={<ModelsAndDatasetsPage />} />
      <Route path="docs/models-and-datasets" element={<ModelsAndDatasetsPage />} />
    </Routes>{" "}
  </BrowserRouter>
);
