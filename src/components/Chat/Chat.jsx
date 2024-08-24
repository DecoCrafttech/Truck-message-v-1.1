import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import axios from "axios";
import ChatHistory from "./components/chat-history.component";
import ChatContainer from "./components/chat-container.component";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateChatUserDetails } from "../../Storage/Slices/LoginSlice";

// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ChatView() {
  const query = useQuery();
  const person_id = query?.get('person_id')
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    const fetchRecript = async () => {
      const response = await axios.post('https://truck.truckmessage.com/get_user_profile', {
        user_id: person_id
      })

      if (response.data.error_code === 0) {
        if (response.data.data) {
          setReceipt({
            name: response.data.data[1].name,
            id: response.data.data[1].user_id
          })
        }
      }
    }

    if (person_id) {
      fetchRecript()
    }
  }, [person_id])

  return (
    <div className="ltn__product-area ltn__product-gutter mb-50 mt-60 overflow-hidden">
      <div className="contianer">
        <div className="row p-5">
          <ChatHistory receipt={receipt} onConversationClick={(res) => setReceipt(res)} />
          {receipt && <ChatContainer receipt={receipt} onConversationClick={(res) => setReceipt(res)} />}
        </div>
      </div>
    </div>
  );
}

export default ChatView;
