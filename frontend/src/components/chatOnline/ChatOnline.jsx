import "./chatOnline.css";

function ChatOnline(props) {
  return (
    <div onClick={props.onClick} className="chatOnlineItem">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            alt=""
            src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${props.img}`}
          ></img>
          <div className="chatOnlineBadge"></div>
        </div>
        <div className="chatOnlineName">{props.name}</div>
      </div>
    </div>
  );
}

export default ChatOnline;
