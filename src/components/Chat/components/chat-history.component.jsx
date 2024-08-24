import React, { useEffect, useState } from "react";
import ChatUser from "./chat-user.componet";
import axios from 'axios'
import { useSelector } from "react-redux";


function ChatHistory({onConversationClick, receipt}) {
  const [userList, setUserList] = useState([])
  const {userDetails} = useSelector(state=>state?.login)

  
  useEffect(()=>{
    const fetchHistory = async () => {
      const response = await axios.get(`https://truck.truckmessage.com/get_conversation_history?user_id=${userDetails?.user_id}`)

      const usrList = response.data.filter(item=>item.person_id !== receipt?.id)

      setUserList(usrList) 
    }
    if(userDetails.user_id){
      fetchHistory()
    }
  },[userDetails.user_id])
  
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
      {receipt && userList.map((user) => (
        <ChatUser key={user.room_id} onClick={onConversationClick} user={user} />
      ))}
    </div>
  );
}

export default ChatHistory;
