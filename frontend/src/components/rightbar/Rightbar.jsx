import "./rightbar.css";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/useHttp";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { friendActions, userActions } from "../redux-store/store";

function Rightbar(props) {
  const Friends = (props) => {
    const { user } = useSelector((state) => state.user);
    const { isLoading, error, sendRequest } = useHttp();

    return (
      <div className="rightbarFollowings">
        {error && (
          <div className="errorBox">
            <DangerousIcon></DangerousIcon>
            <p>Failed to fetch friends</p>
          </div>
        )}
        {!isLoading &&
          !error &&
          props.user.followers.length > 0 &&
          props.user.followers.map((follower, i) => {
            return (
              <div key={i} className="rightbarFollowing">
                <img
                  className={`rightbarFollowingImg ${
                    props.home ? "active" : ""
                  }`}
                  src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${follower.photo}`}
                  alt="following"
                ></img>
                <span className="rightbarFollowingName">
                  {follower.username}
                </span>
              </div>
            );
          })}
        {props.user.followers.length === 0 && (
          <p className="noFriends">
            {" "}
            {props.user._id === user.id
              ? "You have no followers 😿"
              : "User has no followers 😿"}{" "}
          </p>
        )}
      </div>
    );
  };

  const HomeBar = (props) => {
    return (
      <>
        {" "}
        <div className="rightbarWrapper">
          <div className="birthdayContainer">
            <img
              className="birthdayImg"
              src="https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              alt="rodendan"
            ></img>
            <span className="birthdayText">
              <b>Pola Foster</b> and <b>3 other friends</b> have birthday today
            </span>
          </div>
        </div>
        <div className="adContainer">
          <span>AD</span>
          <img
            className="rightBarAd"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="ad"
          ></img>
        </div>
        <div className="friendList">
          <h4 className="onlineFriends">Online Friends</h4>
          <Friends user={props.user} home={true}></Friends>
        </div>
      </>
    );
  };
  const ProfileBar = (props) => {
    const dispatch = useDispatch();
    const { friend } = useSelector((state) => state.friend);
    const { user } = useSelector((state) => state.user);
    const [follow, setFollow] = useState();
    const { sendRequest, error, isLoading } = useHttp();

    useEffect(() => {
      setFollow(user.following.includes(props.user?.id));
    }, []);

    const followHandler = async () => {
      if (follow === true) {
        setFollow((prev) => false);
        dispatch(userActions.removeFollower(props.user._id));
        dispatch(friendActions.removeFollower(user._id));
        try {
          await sendRequest(
            "patch",
            `${process.env.REACT_APP_BACKEND_URL}/users/${props.user.id}/unfollow`
          );
        } catch (err) {}
      } else {
        try {
          setFollow((prev) => true);
          dispatch(userActions.addFollower(props.user?._id));
          dispatch(friendActions.addFollower(user));
          await sendRequest(
            "patch",
            `${process.env.REACT_APP_BACKEND_URL}/users/${props.user.id}/follow`
          );
        } catch (err) {
          console.log(err);
        }
      }
    };

    return (
      <>
        <div className="infoWrapper">
          {props.user.id !== user.id && (
            <button onClick={followHandler} type="button" className="followBtn">
              {!follow
                ? `Follow ${props.user.username}`
                : `Unfollow ${props.user.username}`}
            </button>
          )}
          <h4 className="rightbarTitle">User information</h4>
          <div className="rightbarInfo">
            <div className="rightbarInfoItem">
              <div className="rightbarInfoKey">City:</div>
              <div className="rightbarInfoValue">{props.user.city}</div>
            </div>
            <div className="rightbarInfoItem">
              <div className="rightbarInfoKey">From:</div>
              <div className="rightbarInfoValue">{props.user.from}</div>
            </div>
            <div className="rightbarInfoItem">
              <div className="rightbarInfoKey">Relationship</div>
              <div className="rightbarInfoValue">{props.user.relationship}</div>
            </div>
            <h4 className="rightbarTitle">Users followers</h4>
            <Friends user={props.user}></Friends>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      {props.home && <HomeBar user={props.user}></HomeBar>}
      {props.profile && <ProfileBar user={props.user}></ProfileBar>}
    </div>
  );
}

export default Rightbar;
