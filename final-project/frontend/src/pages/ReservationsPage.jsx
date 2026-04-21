import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reservations");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Fetch failed");
        setReservations(data);
        setStatus("ok");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
    load();
  }, []);

  return (
    <div className="banner">
      <NavBar />

      <div className="content reserve-content">
        <h2>Reservations</h2>

        {status === "loading" && <p className="reserve-info">Loading...</p>}
        {status === "error" && (
          <div className="error">Failed to load reservations.</div>
        )}

        {status === "ok" && (
          <div className="httpbin-box">
            <h4 className="httpbin-title">Saved reservations (from database)</h4>

            {reservations.length === 0 ? (
              <p className="reserve-info">No reservations found.</p>
            ) : (
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{String(r.date).slice(0, 10)}</td>
                      <td>{String(r.time).slice(0, 5)}</td>
                      <td>{r.created_at ? new Date(r.created_at).toLocaleString("fi-FI") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
``