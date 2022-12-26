import "./sidebar.css";
import {
  RssFeed,
  Chat,
  VideoLibrary,
  Group,
  Bookmark,
  QuestionMark,
  Work,
  Event,
  School,
} from "@mui/icons-material";
import { useState } from "react";

function Sidebar() {
  const [showMore, setShowMore] = useState(false);

  const showMoreHandler = () => {
    setShowMore((prev) => !prev);
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon"></RssFeed>
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon"></Chat>
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <VideoLibrary className="sidebarIcon"></VideoLibrary>
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon"></Group>
            <span className="sidebarListItemText">Group</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon"></Bookmark>
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <QuestionMark className="sidebarIcon"></QuestionMark>
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <Work className="sidebarIcon"></Work>
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon"></Event>
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon"></School>
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button onClick={showMoreHandler} type="button" className="sidebarBtn">
          Show More
        </button>

        {showMore && (
          <ul className="sidebarFriendList">
            {/* {friends.map((user) => {
              return (
                <li key={user.id} className="sidebarFriend">
                  <img
                    className="sidebarProfileImg"
                    src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${user.photo}`}
                    alt="profile"
                  ></img>
                  <span className="sidebarFriendName">{user.username}</span>
                </li>
              );
            })} */}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
