import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import ReservePage from "./pages/ReservePage";
import StatusPage from "./pages/StatusPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}