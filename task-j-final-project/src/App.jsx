import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import ReservePage from "./pages/ReservePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/reserve" element={<ReservePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;