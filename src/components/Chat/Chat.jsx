// import React, { useEffect, useState } from "react";
// import { useLocation } from 'react-router-dom'
// import axios from "axios";
// import ChatHistory from "./components/chat-history.component";
// import ChatContainer from "./components/chat-container.component";
// import Cookies from "js-cookie";
// import { useDispatch } from "react-redux";
// import { updateChatUserDetails } from "../../Storage/Slices/LoginSlice";

// // the query string for you.
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// function ChatView() {
//   const query = useQuery();
//   const person_id = query?.get('person_id')
//   const [receipt, setReceipt] = useState(null)

//   useEffect(() => {
//     const fetchRecript = async () => {
//       const response = await axios.post('https://truck.truckmessage.com/get_user_profile', {
//         user_id: person_id
//       })

//       if (response.data.error_code === 0) {
//         console.log(response.data.data,"receipt")
//         if (response.data.data) {
//           setReceipt({
//             name: response.data.data[1].name,
//             id: response.data.data[1].user_id
//           })
//         }
//       }
//     }

//     if (person_id) {
//       fetchRecript()
//     }
//   }, [person_id])

//   return (
//     <div className="ltn__product-area ltn__product-gutter mb-50 mt-60 overflow-hidden">
//       <div className="contianer">
//         <div className="row p-5">
//           <ChatHistory receipt={receipt} onConversationClick={(res) => setReceipt(res)} />
//           {receipt && <ChatContainer receipt={receipt} onConversationClick={(res) => setReceipt(res)} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatView;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ChatView = () => {
  const query = useQuery();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState(Cookies.get("usrin")); // Set your user_id
  const [personId, setPersonId] = useState(query?.get('person_id')); // Will be set based on selected conversation
  const [userList, setUserList] = useState([])

  const getUserList = async () => {
    try {
      const response = await axios.post('https://truck.truckmessage.com/get_user_chat_list', {
        user_id: window.atob(userId),
      });

      if (response.data.error_code === 0) {
        setUserList(response.data.data)  
        
        const findUser = response.data.data.filter((findUSer)=>{
          return findUSer.person_id == personId
        }) 

        setPersonId(findUser.length >0 ? findUser[0].person_id : 0)
        fetchChatMessages(findUser.length >0 ? findUser[0].person_id : 0);
      }

    } catch (err) {
      console.error('Error getting user list:', err);
    }
  }


  const fetchChatMessages = async (personIdProps) => {
    try {
      const response = await axios.post('https://truck.truckmessage.com/get_user_chat_message_list', {
        user_id: window.atob(userId),
        person_id: personIdProps,
      });

      console.log(response, "response")
      if (response.data.error_code === 0) {
        // Reverse the messages to display the most recent at the bottom
        setMessages(response.data.data.reverse());
        handleSendMessage(personId)
      } else {
        console.error('Error fetching messages:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post('https://truck.truckmessage.com/user_chat_message', {
          user_id: window.atob(userId),
          person_id: personId,
          message: newMessage,
        });

        if (response.data.error_code === 0) {
          // Add sent message to the message list
          setMessages(prevMessages => [...prevMessages, { chat_id: userId, message: newMessage, updt: new Date().toUTCString() }]);
          setNewMessage('');
        } else {
          console.error('Error sending message:', response.data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Function to handle selecting a conversation
  const handleSelectConversation = (conversation, personId) => {
    setSelectedConversation(conversation);
    setPersonId(personId);
    fetchChatMessages(personId)
  };

  useEffect(() => {
    getUserList()
  }, [])

  return (
    <div className="container-fluid d-flex flex-column py-5">
      <div className="row flex-grow-1">
        {/* Conversation List */}
        <div className="col-md-4 border-end conversation-list">
          <div className="list-group">
            {
              userList.map((users, userIndex) => {
                return <button
                  className={`list-group-item list-group-item-action mb-2 ${users.person_id === personId ? 'active' : ''}`}
                  onClick={() => {
                    handleSelectConversation('Conversation 1', users.person_id)
                    handleSendMessage(users.person_id)
                  }} // Example: Conversation with person_id 5
                >
                  {users.profile_name}
                </button>
              })
            }

            {/* Add more conversations here */}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-md-8 d-flex flex-column">
          <div className="flex-grow-1 p-3 chat-window d-flex flex-column chat-messgae-min-height">
            {/* {selectedConversation ? ( */}
            {
              messages.map((msg, index) => { 
                return <div
                  key={index}
                  className={`message mb-3 ${msg.chat_id == window.atob(userId) ? 'text-end' : 'text-start'
                    }`}
                >
                  <div
                    className={`message-content p-2 rounded ${msg.chat_id == window.atob(userId) ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                  >
                    <div>{msg.message}</div>
                    <div className="small">{new Date(msg.updt).toLocaleString()}</div>
                  </div>
                </div>
              })
            }

            {/* ) : (
              <p>Select a conversation to start chatting.</p>
            )} */}
          </div>
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
