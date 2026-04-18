import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@retroma/react/styles.css";
import "./gallery.css";
import Gallery from "./Gallery";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

createRoot(root).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
