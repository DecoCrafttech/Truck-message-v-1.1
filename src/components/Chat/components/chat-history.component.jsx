import React, { useEffect, useState } from "react";
import ChatUser from "./chat-user.componet";
import axios from 'axios'
import Cookies from 'js-cookie'


function ChatHistory({onConversationClick, receipt}) {
  const [userList, setUserList] = useState([])
  const userDetails = Cookies.get('usrin') ? window.atob(Cookies.get('usrin')) : '';

  
  useEffect(()=>{
    const fetchHistory = async () => {
      const response = await axios.get(`https://truck.truckmessage.com/get_conversation_history?user_id=${userDetails}`)

      const usrList = response.data.filter(item=>item.person_id !== receipt?.id)

      setUserList(usrList) 
      console.log(response.data)
    }
    if(userDetails){
      fetchHistory()
    }
  },[userDetails])
  
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
