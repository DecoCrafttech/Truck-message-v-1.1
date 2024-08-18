import React, { useEffect, useState } from "react";
import ChatUser from "./chat-user.componet";
import axios from 'axios'
import { useSelector } from "react-redux";


function ChatHistory({onConversationClick, receipt}) {
  const [userList, setUserList] = useState([])
  const {userDetails} = useSelector(state=>state?.login)

  
  useEffect(()=>{
    const fetchHistory = async () => {
      const response = (await axios.get(`https://truck.truckmessage.com/get_conversation_history?user_id=${userDetails?.id}`)).data
      setUserList(response)
      console.log(response);
    }
    if(userDetails.id){
      fetchHistory()
    }
  },[userDetails.id])
  
  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        height: "calc(100vh - 400px)",
        overflow:"auto"
      }}
      className="col-3"
    >
      {receipt && <ChatUser  onClick={onConversationClick} user={receipt} />}
      {receipt && userList?.filter(item=>item.person_id !== receipt?.id).map((user) => (
        <ChatUser key={user.room_id} onClick={onConversationClick} user={user} />
      ))}
    </div>
  );
}

export default ChatHistory;
