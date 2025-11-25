import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AssistantChat from "./features/ai-assistant/presentation/components/AssistantChat";

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
