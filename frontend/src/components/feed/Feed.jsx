import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useState } from "react";
import { useHttp } from "../../hooks/useHttp";
import { useEffect } from "react";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

function Feed({ id }) {
  const [posts, setPosts] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [newPost, setNewPost] = useState({});
  const [comments, setComments] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/posts`
      );
      setPosts(res.data);

      setComments(res.comments);
    })();
  }, [sendRequest, newPost]);

  const addPost = async (post) => {
    setNewPost({ ...post, likes: [] });
  };

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
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share addPost={addPost}></Share>

        {isLoading && (
          <LoadingSpinner className="lds-dual-bigRing"></LoadingSpinner>
        )}
        {posts.length > 0 &&
          posts.map((item, i) => {
            const postComments = comments.filter(
              (comment) => comment.postId[0].toString() === item._id.toString()
            );
            const img = item.img
              ? `${process.env.REACT_APP_BACKEND_SHORT}/public/images/posts/${item.img}`
              : "";
            return (
              <Post
                addComment={addComment}
                removeComment={removeComment}
                key={i}
                username={item.userId.username}
                time={item.createdAt}
                userImage={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${item.userId.photo}`}
                text={item.desc}
                img={img}
                likes={item.likes.length}
                comments={postComments}
                id={item._id}
              ></Post>
            );
          })}
      </div>
    </div>
  );
}

export default Feed;
