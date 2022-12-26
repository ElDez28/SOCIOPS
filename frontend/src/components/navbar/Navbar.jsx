import "./navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import { Person, Chat, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Navbar() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const goToProfilePage = () => {
    navigate(`/${user.username}`);
  };
  const goToMsg = () => {
    navigate(`/messenger`);
  };
  const goToMissing = () => {
    navigate("/something/ok");
  };
  return (
    <div className="navbarContainer">
      <div className="navbarLeft">
        <Link to="/home" className="logo">
          Sociops
        </Link>
      </div>
      <div className="navbarCenter">
        <div className="searchBar">
          <input
            className="searchInput"
            placeholder="Search for post, friends or video"
            type="search"
          ></input>
          <SearchIcon className="searchIcon"></SearchIcon>
        </div>
      </div>
      <div className="navbarRight">
        <div className="navbarLinks">
          <Link to={`/${user.username}`} className="navbarLink">
            Homepage
          </Link>
          <Link to={`/home`} className="navbarLink">
            Timeline
          </Link>
        </div>
        <div className="navbarIcons">
          <div onClick={goToMissing} className="navbarIconItem">
            <Person className="navbarIcon"></Person>
            <span className="navbarIconBadge">1</span>
          </div>
          <div onClick={goToMsg} className="navbarIconItem">
            <Chat className="navbarIcon"></Chat>
            <span className="navbarIconBadge">1</span>
          </div>
          <div className="navbarIconItem">
            <Notifications className="navbarIcon"></Notifications>
            <span className="navbarIconBadge">1</span>
          </div>
        </div>
        <div onClick={goToProfilePage} className="navbarImgContainer">
          <img
            src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${user.photo}`}
            className="navbarImg"
            alt="baerdedMan"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
