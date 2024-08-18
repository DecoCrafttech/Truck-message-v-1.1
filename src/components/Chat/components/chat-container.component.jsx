import React, { useEffect, useState } from "react";
import ChatFooter from "./chat-footer.component";
import ChatPanel from "./chat-panel.component";
import { useDispatch, useSelector } from "react-redux";
import { getSocket, disConnectSocket } from "../../../socket";
import { updateCurrentUserMessage, updateUserMessage } from "../../../Storage/Slices/chat-slice";
import axios from "axios";

function ChatContainer({ receipt }) {
  const messages = useSelector((state) => state?.chat);
  const { userDetails } = useSelector((state) => state.login);
  const [chatId, setChatId] = useState(null)
  const dispatch = useDispatch();
  const fetchConversation = async () => {
    const response = await axios.get(
      `https://truck.truckmessage.com/get_conversation?user_id=${userDetails?.id}&person_id=${receipt?.person_id}`
    );
    
   response?.data?.data.forEach(msg=>{
    console.log(msg);
    if(msg?.user_id === userDetails.id){
      dispatch(updateCurrentUserMessage({
        id:msg.id,
        role: "currentUser",
        message: msg?.message
      }))
    }else{
      dispatch(updateUserMessage({
        id:msg.id,
        role: "user",
        message: msg?.message
      }))
    }
   })
  };
  useEffect(() => {
    const socket = getSocket();
    socket.on("connect", function () {
      console.log("Connect");
    });
    if(receipt?.id && userDetails?.id){
      socket.emit("join_room", {
        person_id: receipt?.id,
        user_id: userDetails?.id,
      });
    }
   
    socket.on("message_response", (data) => {
      console.log(data);
      if(data?.chat_id){
        setChatId(data?.chat_id)
      }
      if (
        data?.data?.message &&
        data?.success &&
        data.data?.user_id.toString() !== userDetails?.id.toString()
      ) {
        console.log(
          data?.data?.message,
          data?.success,
          data.data?.user_id,
          userDetails?.id.toString()
        );
        dispatch(
          updateUserMessage({
            role: "user",
            message: data?.data?.message,
          })
        );
      }
    });
    return () => {
      disConnectSocket();
    };
  }, []);

  useEffect(() => {
    if (userDetails?.id && receipt.person_id) {
      fetchConversation();
    }
  }, [userDetails?.id ,receipt.person_id]);

  return (
    <div
      style={{
        height: "calc(100vh - 400px)",
      }}
      className="col-9 d-flex flex-column justify-content-end"
    >
      <ChatPanel messages={messages} />
      {chatId && <ChatFooter chatId={chatId} receipt={receipt} />}
    </div>
  );
}

export default ChatContainer;
