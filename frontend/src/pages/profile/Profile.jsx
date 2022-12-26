import "./profile.css";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
import Post from "../../components/post/Post";
import Share from "../../components/share/Share";
import { friendActions } from "../../components/redux-store/store";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { friend } = useSelector((state) => state.friend);
  const { sendRequest, isLoading } = useHttp();
  const params = useParams();
  const username = params.id;
  const [currentUser, setCurrentUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/users?username=${username}`
      );

      setCurrentUser(res.data[0]);
      dispatch(friendActions.setFriend(res.data[0]));

      const postRes = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/posts/${res.data[0]._id}/getUserPosts`
      );
      setPosts(postRes.data);
      const comments = postRes.data.map((item) => item.comments).flat();
      setComments(comments);
    })();
  }, [username, sendRequest, dispatch]);
  const addComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const removeComment = (id) => {
    const targetedItem = comments.find((item) => item._id === id);
    const index = comments.indexOf(targetedItem);
    const newArray = [...comments];
    newArray.splice(index, 1);
    setComments(newArray);
  };
  const addPost = async (post) => {
    await sendRequest(
      "get",
      `${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`
    );

    setPosts((prev) => [post, ...prev]);
  };
  if (!currentUser._id) {
    return (
      <div className="loading">
        <LoadingSpinner className="lds-dual-bigRing"></LoadingSpinner>
      </div>
    );
  } else {
    return (
      <>
        <Navbar></Navbar>
        <div className="profile">
          <Sidebar></Sidebar>

          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  className="profileCoverImg"
                  src="https://images.unsplash.com/photo-1666489022561-fbed9186153a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                  alt="cover"
                ></img>
                <img
                  className="profileImg"
                  src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${currentUser.photo}`}
                  alt="cover"
                ></img>
              </div>
            </div>
            <div className="profileRightBottom">
              <div className="feed">
                <div className="feedWrapper">
                  <>
                    {user.id === currentUser._id && (
                      <Share addPost={addPost}></Share>
                    )}

                    {isLoading && (
                      <LoadingSpinner className="lds-dual-bigRing"></LoadingSpinner>
                    )}
                    {posts.length > 0 &&
                      posts.map((item, i) => {
                        const postComments = comments?.filter(
                          (comment) =>
                            comment.postId[0].toString() === item._id.toString()
                        );

                        const img = item.img
                          ? `${process.env.REACT_APP_BACKEND_SHORT}/public/images/posts/${item.img}`
                          : "";
                        return (
                          <Post
                            key={i}
                            username={currentUser.username}
                            time={item.createdAt}
                            userImage={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${currentUser.photo}`}
                            text={item.desc}
                            img={img}
                            likes={item.likes.length}
                            comments={postComments}
                            id={item._id}
                            addComment={addComment}
                            removeComment={removeComment}
                          ></Post>
                        );
                      })}
                  </>
                </div>
              </div>
              <Rightbar user={friend} profile={true}></Rightbar>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
