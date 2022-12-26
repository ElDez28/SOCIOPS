import "./convModal.css";
import { useState } from "react";
import { useHttp } from "../../hooks/useHttp";
import { useSelector } from "react-redux";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner.js";
function ConvModal(props) {
  const [selectedFriend, setSelectedFriend] = useState({});
  const [warning, setWarning] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { sendRequest, isLoading, error } = useHttp();

  const createConv = async () => {
    if (!selectedFriend.id) {
      return setWarning(true);
    } else {
      setWarning(false);
      try {
        const { data } = await sendRequest(
          "post",
          `${process.env.REACT_APP_BACKEND_URL}/conversations`,
          { receiverId: selectedFriend._id }
        );
        props.closeModal();

        const friendId = data.members.filter((id) => id !== user._id)[0];
        const res = await sendRequest(
          "get",
          `${process.env.REACT_APP_BACKEND_URL}/users/${friendId}`
        );
        const friend = res.data.data;
        const newConv = { ...data, members: [user, friend] };
        props.setConv(newConv);
      } catch (err) {}
    }
  };

  return (
    <>
      <div onClick={props.closeModal} className="overlay">
        {" "}
      </div>
      <div className="container">
        <div className="friendsWrapper">
          {props.friends.map((friend, i) => {
            return (
              friend._id !== user._id && (
                <div
                  key={i}
                  onClick={() => setSelectedFriend(friend)}
                  className={`usersToChatWith ${
                    selectedFriend?._id === friend._id && "selected"
                  }`}
                >
                  <img
                    className="userImg"
                    alt="user"
                    src={`${process.env.REACT_APP_BACKEND_SHORT}/public/images/users/${friend.photo}`}
                  ></img>
                  <span className="userName">{friend.username}</span>
                </div>
              )
            );
          })}
        </div>
        <div className="buttonWrapper">
          <button onClick={createConv} className="startChat" type="button">
            {isLoading ? (
              <LoadingSpinner className="lds-dual-ring"></LoadingSpinner>
            ) : (
              "Create chat"
            )}
          </button>
          {warning && (
            <span className="warning">You must pick user to chat with</span>
          )}
        </div>
      </div>
    </>
  );
}

export default ConvModal;
