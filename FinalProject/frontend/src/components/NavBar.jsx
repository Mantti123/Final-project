import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/reserve">Reserve appointment</Link>
        </li>
        <li>
          <Link to="/status">Status</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;