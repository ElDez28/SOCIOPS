import "./errorModal.css";
import ClearIcon from "@mui/icons-material/Clear";
function ErrorModal(props) {
  return (
    <div onClick={props.onClick} className="modalOverlay">
      <div className="messageWrapper">
        <div className="iconWrapper" onClick={props.onClick}>
          <ClearIcon className="errorIcon"></ClearIcon>
        </div>
        <p className="errorText">{props.children}</p>
      </div>
    </div>
  );
}

export default ErrorModal;
