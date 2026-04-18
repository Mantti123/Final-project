import { useState } from "react";
import { z } from "zod";
import NavBar from "../components/NavBar";

const schema = z.object({
  name: z.string().trim().min(2, "Nimen tulee olla vähintään 2 merkkiä."),
  date: z.string().min(1, "Päivämäärä on pakollinen."),
  time: z.string().min(1, "Kellonaika on pakollinen."),
});

function formatDateFi(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("fi-FI");
}

export default function ReservePage() {
  const [form, setForm] = useState({ name: "", date: "", time: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [responseJson, setResponseJson] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResponseJson(null);
    setSubmittedData(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setStatus("sending");

      // talteen se data, jonka käyttäjä syötti
      setSubmittedData(result.data);

      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();
      setResponseJson(json);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="banner">
      <NavBar />

      <div className="content reserve-content">
        <h2>Reserve Appointment</h2>

        <p className="reserve-info">
          Opening hours: 08-16<br />
          Address: Keskuskatu 27, 48100 Kotka<br />
          You can make reservation by calling me or by email:<br />
          tel.0401231234<br />
          example@gmail.com
        </p>

        <form className="reserve-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>

          <div className="field">
            <label htmlFor="time">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              min="08:00"
              max="16:00"
              required
            />
            {errors.time && <div className="error">{errors.time}</div>}
          </div>

          <button className="button" type="submit" disabled={status === "sending"}>
            <span></span>
            {status === "sending" ? "SENDING..." : "MAKE RESERVATION"}
          </button>
        </form>

        <div className="response-area">
          {status === "success" && submittedData && (
  <div className="confirm-box">
    <h4 className="confirm-title">
        Thank you for your reservation, {submittedData.name}!
    </h4>

    <p className="confirm-text">
      You have reserved appointment on{" "}
      <strong>{formatDateFi(submittedData.date)}</strong>{" "}
      <strong>{submittedData.time}</strong>.
    </p>
  </div>
)}

{status === "success" && responseJson && (
  <div className="httpbin-box">
    <h4 className="httpbin-title">Returned response shown on page</h4>
    <pre className="httpbin-pre">{JSON.stringify(responseJson, null, 2)}</pre>
  </div>
)}

          {status === "error" && (
            <div className="error">Lähetys epäonnistui. Yritä uudelleen.</div>
          )}
        </div>
      </div>
    </div>
  );
}

