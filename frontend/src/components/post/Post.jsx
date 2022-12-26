import "./post.css";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
import { useSelector } from "react-redux";
function Post(props) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { sendRequest } = useHttp();
  const [likes, setLikes] = useState([]);
  const [hearths, setHearths] = useState([]);
  const [loved, setLoved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [newComment, setNewComment] = useState("");

  const clickHandler = () => {
    navigate(`/${props.username}`);
  };

  useEffect(() => {
    (async () => {
      const data = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/posts/${props.id}`
      );
      setLikes(data.data.data.likes);

      setHearths(data.data.data.hearths);
    })();
  }, [sendRequest, props.id]);
  const deleteComment = async (id) => {
    try {
      await sendRequest(
        "delete",
        `${process.env.REACT_APP_BACKEND_URL}/comments/${id}`
      );

      props.removeComment(id);
    } catch (err) {}
  };
  useEffect(() => {
    if (likes.includes(user._id)) {
      setLiked(true);
    }
    if (hearths.includes(user._id)) {
      setLoved(true);
    }
  }, [hearths, likes, user._id]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);
  }, []);

  const hearthHandler = async () => {
    try {
      await sendRequest(
        "patch",
        `${process.env.REACT_APP_BACKEND_URL}/posts/${props.id}/lovePost`
      );
    } catch (err) {}
    if (loved === false) {
      if (liked === true) {
        setLiked(false);
        setLikes((prev) => prev.filter((id) => id !== user._id));
      }
      setLoved(true);
      setHearths((prev) => [...prev, user._id]);
    }
    if (loved === true) {
      setLoved(false);
      setHearths((prev) => prev.filter((id) => id !== user._id));
    }
  };
  const submitComment = async (postId) => {
    try {
      const res = await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/comments/${postId}`,
        { text: newComment }
      );
      const newCommentData = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/comments/${res.data._id}`
      );

      props.addComment(newCommentData.data.data);
      setNewComment("");
    } catch (err) {}
  };
  const likeHandler = async () => {
    try {
      await sendRequest(
        "patch",
        `${process.env.REACT_APP_BACKEND_URL}/posts/${props.id}/likePost`
      );
    } catch (err) {}
    if (liked === false) {
      if (loved === true) {
        setLoved(false);
        setHearths((prev) => prev.filter((id) => id !== user._id));
      }
      setLiked(true);
      setLikes((prev) => [...prev, user._id]);
    }
    if (liked === true) {
      setLiked(false);
      setLikes((prev) => prev.filter((id) => id !== user._id));
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <div onClick={clickHandler}>
              <img
                className="postProfileImg"
                src={props.userImage}
                alt="bearded Man"
              ></img>
            </div>
            <span className="postUsername">{props.username}</span>
            <span className="postDate">{props.time}</span>
          </div>
          <div className="postTopRight">
            <MoreVertOutlinedIcon></MoreVertOutlinedIcon>
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{props.text}</span>
          <img className="postImage" src={props.img} alt={props.name}></img>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <div className="icons">
              {!liked ? (
                <div onClick={likeHandler}>
                  <ThumbUpOffAltIcon className="likeIcon"></ThumbUpOffAltIcon>
                </div>
              ) : (
                <div onClick={likeHandler}>
                  <ThumbUpIcon className="likeIcon"></ThumbUpIcon>
                </div>
              )}
              {loved ? (
                <div onClick={hearthHandler}>
                  <FavoriteIcon className="hearthIcon"></FavoriteIcon>
                </div>
              ) : (
                <div onClick={hearthHandler}>
                  <FavoriteBorderOutlinedIcon className="hearthIcon"></FavoriteBorderOutlinedIcon>
                </div>
              )}
            </div>
            <div>
              <span className="likedPeople">
                {`${likes.length + hearths.length} people liked it`}
              </span>
            </div>
          </div>
          <div
            onClick={() => setOpenComments((prev) => !prev)}
            className="postBottomRight"
          >
            <span>
              {`${props.comments?.length} ${
                props.comments?.length === 1 ? "comment" : "comments"
              }`}{" "}
            </span>
          </div>
        </div>
        {openComments && (
          <div className="commentsContainer">
            {props.comments?.map((item) => {
              return (
                <div key={item._id} className="commentWrapper">
                  <div className="commentImg">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${item.userId[0].photo}`}
                      alt=""
                    ></img>
                    <p className="username">{item.userId[0].username}</p>
                  </div>
                  <p className="commentText">{item.text}</p>
                  {item.userId[0]._id === currentUser._id && (
                    <button
                      type="button"
                      onClick={() => deleteComment(item._id)}
                      className="deleteComment"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
            <div className="inputComment">
              <input
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                type="text"
                placeholder="Write your comment..."
              ></input>
              <button onClick={() => submitComment(props.id)} type="button">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
