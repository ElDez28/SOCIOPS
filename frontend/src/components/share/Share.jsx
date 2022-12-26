import "./share.css";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHttp } from "../../hooks/useHttp";
const Share = (props) => {
  const textRef = useRef();
  const fileRef = useRef();
  const [file, setFile] = useState("");
  const [fileValue, setFileValue] = useState("");
  const { sendRequest, isLoading } = useHttp();
  const { user } = useSelector((state) => state.user);
  const fileHandler = (e) => {
    setFileValue(e.target.value);
    setFile(e.target.files[0]);
  };
  const resetFileHandler = (e) => {
    setFile("");
    setFileValue("");
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("desc", textRef.current.value);

      if (file) {
        formData.append("img", file);
      }

      const res = await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      await props.addPost(res.data);
      console.log(res.data);
      setFile("");
    } catch (err) {}
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${user.photo}`}
            alt="bearded Man"
          ></img>
          <input
            ref={textRef}
            type="text"
            placeholder={`What's on your mind ${user.username}`}
            className="shareInput"
          />
        </div>
        {file && (
          <div className="postImgPreview">
            <img
              className="postImg"
              alt="preview"
              src={URL.createObjectURL(file)}
            ></img>
            <div onClick={resetFileHandler}>
              <ClearIcon className="clearIcon"></ClearIcon>
            </div>
          </div>
        )}

        <form className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <label className="fileLabel" htmlFor="file">
                {" "}
                <PermMediaOutlinedIcon className=" media"></PermMediaOutlinedIcon>
              </label>
              <input
                ref={fileRef}
                type="file"
                id="file"
                value={fileValue}
                className="shareOptionFile"
                onChange={fileHandler}
              ></input>
            </div>
            <div className="shareOption">
              <LabelImportantOutlinedIcon className=" tag"></LabelImportantOutlinedIcon>
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <LocationOnOutlinedIcon className=" location"></LocationOnOutlinedIcon>
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsOutlinedIcon className=" feeling"></EmojiEmotionsOutlinedIcon>
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" onClick={submitHandler} className="shareButton">
            {isLoading ? (
              <LoadingSpinner className="lds-dual-ring"></LoadingSpinner>
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
