import "./message.css";

function Message(props) {
  return (
    <div className={`message ${props.own}`}>
      <div className={`messageTop ${props.own}`}>
        <img
          alt="user"
          src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${props.img}`}
          className="messageImg"
        ></img>
        <p className="messageText">{props.text}</p>
      </div>
      <div className={`messageBottom ${props.own}`}>{props.date}</div>
    </div>
  );
}

export default Message;
