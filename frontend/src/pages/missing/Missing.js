import "./missing.css";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
function Missing() {
  return (
    <div className="missing">
      <div className="missingWrapper">
        <DoNotDisturbIcon className="missingIcon"></DoNotDisturbIcon>
        <p>This route does not exist!</p>
      </div>
    </div>
  );
}

export default Missing;
