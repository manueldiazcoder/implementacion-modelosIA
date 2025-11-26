import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./ai-assistant/presentation/pages/Home";
import AssistantChat from "./ai-assistant/presentation/pages/AssistantChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<AssistantChat />} />
      </Routes>
    </BrowserRouter>
  );
}
