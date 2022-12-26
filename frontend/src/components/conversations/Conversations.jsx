import "./conversations.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
function Conversations(props) {
  return (
    <div className="conversation">
      <div onClick={props.onClick} className="convImgContainer">
        <img
          className="conImg"
          src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${props.photo}`}
          alt="conImg"
        />
        <span className="conversationText">{props.friend}</span>
      </div>
      <div className="deleteIcon" onClick={props.deleteConv}>
        <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
      </div>
    </div>
  );
}

export default Conversations;
