import "./messenger.css";
import Navbar from "../components/navbar/Navbar";
import Conversations from "../components/conversations/Conversations";
import Message from "../components/message/Message";
import ChatOnline from "../components/chatOnline/ChatOnline";
import { useSelector } from "react-redux";
import { useHttp } from "../hooks/useHttp";
import { useEffect, useState, useRef } from "react";

import { format } from "timeago.js";
import { io } from "socket.io-client";
import ConvModal from "../components/convModal/ConvModal";
function Messenger() {
  const [socket, setSocket] = useState();
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { sendRequest } = useHttp();
  const [conversations, setConversations] = useState([]);
  const [newConv, setNewConv] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  const chatHandler = async (conversation) => {
    setChat(conversation);
    try {
      const { data } = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/conversations/${conversation._id}`
      );
      setMessages(data.data.messages);
    } catch (err) {}
  };
  const deleteConv = async (id) => {
    try {
      await sendRequest(
        "delete",
        `${process.env.REACT_APP_BACKEND_URL}/conversations/${id}`
      );
      setConversations((prev) => prev.filter((conv) => conv._id !== id));
    } catch (err) {}
  };
  useEffect(() => {
    (async () => {
      try {
        const { data } = await sendRequest(
          "get",
          `${process.env.REACT_APP_BACKEND_URL}/conversations/myConversations`
        );

        setConversations(data);
      } catch (err) {}
    })();
  }, [sendRequest, newConv]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    arrivalMessage &&
      chat?.members.find((member) => member._id === arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, chat]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await sendRequest(
          "get",
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );
        setUsers(data);
      } catch (err) {}
    })();
  }, [sendRequest]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: chat._id,
      text: newMessage,
    };

    try {
      const { data } = await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/messages`,
        message
      );
      setMessages((prev) => [...prev, data]);

      setNewMessage("");
    } catch (err) {}
  };
  const setOnlineChat = async (id) => {
    try {
      const { data } = await sendRequest(
        "get",
        `${process.env.REACT_APP_BACKEND_URL}/conversations/specificMembers/${id}`
      );

      if (data) {
        setChat(data);
        setMessages(data.messages);
      }
    } catch (err) {}
  };
  const openConvModal = () => {
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      {openModal && (
        <ConvModal
          setConv={setNewConv}
          friends={users}
          closeModal={closeModal}
        ></ConvModal>
      )}
      <Navbar></Navbar>

      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div>
              <input
                className="chatMenuInput"
                placeholder="Search for friends"
              ></input>
              {conversations.length > 0 && (
                <div className="conversationWrapper">
                  {conversations.map((conv, i) => {
                    const friend = conv.members.find(
                      (member) => member._id !== user._id
                    );

                    return (
                      <Conversations
                        onClick={chatHandler.bind(this, conv)}
                        photo={friend.photo}
                        friend={friend.username}
                        key={i}
                        deleteConv={deleteConv.bind(this, conv._id)}
                      ></Conversations>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <button
                onClick={openConvModal}
                type="button"
                className="newConvBtn"
              >
                Start new conversation
              </button>
            </div>
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {chat._id &&
                messages.length > 0 &&
                messages.map((msg, i) => {
                  return (
                    <div key={i} ref={scrollRef}>
                      <Message
                        key={i}
                        text={msg.text}
                        own={user._id === msg.sender ? "own" : ""}
                        img={
                          user._id === msg.sender
                            ? `${user.photo}`
                            : `${
                                chat.members.find(
                                  (member) => member._id !== user._id
                                ).photo
                              }`
                        }
                        date={format(msg.createdAt)}
                      ></Message>
                    </div>
                  );
                })}
              {!chat._id && (
                <div className="chatHeader">
                  <h3>Open a conversation to start a chat</h3>
                </div>
              )}
              {chat._id && messages.length === 0 && (
                <div className="chatHeader">
                  <h3>Send a message to start the communication</h3>
                </div>
              )}
            </div>
            <div className="chatBoxBottom">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="chatTextInput"
              ></textarea>
              <button
                onClick={handleSubmit}
                type="button"
                className="sendButton"
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {onlineFriends?.map((follower, i) => {
              return (
                <div key={i} onClick={() => setOnlineChat(follower._id)}>
                  <ChatOnline
                    img={follower.photo}
                    name={follower.username}
                  ></ChatOnline>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
