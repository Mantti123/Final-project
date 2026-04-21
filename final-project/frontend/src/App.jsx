import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import ReservePage from "./pages/ReservePage";
import StatusPage from "./pages/StatusPage";
import ReservationsPage from "./pages/ReservationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}