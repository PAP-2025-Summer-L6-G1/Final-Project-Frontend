import { Link } from "react-router-dom";
import { handleMouseLeave, handleMouseMove } from "../utils/tilt-hover";
import { useContext } from "react";
import AccountContext from "../contexts/AccountContext";

export default function HomepageCard(props) {
  const {loggedInUser} = useContext(AccountContext);

  return (
    <Link to={loggedInUser != "" ? props.to : "/"} className="homepage-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      <img src={props.icon} className="homepage-card-icon" />
      <div className="homepage-card-text">
        <h2>{props.title}</h2>
        <p>{props.desc}</p>
      </div>
    </Link>
  );
}