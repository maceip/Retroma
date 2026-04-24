import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@retroma/react/styles.css";
import "./chat-app.css";
import ChatApp from "./ChatApp";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

createRoot(root).render(
  <StrictMode>
    <ChatApp />
  </StrictMode>,
);
