// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import parse from 'html-react-parser';

// class TeamV2 extends Component {

//     render() {

//         let publicUrl = process.env.PUBLIC_URL+'/'
//         let imagealt = 'image'

//     return <div className="ltn__team-area pt-110--- pb-90">
// 				<div className="container">
// 				<div className="row justify-content-center go-top">
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/4.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">Rosalina D. William</Link></h4>
// 						<h6 className="ltn__secondary-color">Real Estate Broker</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/2.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">Kelian Anderson</Link></h4>
// 						<h6 className="ltn__secondary-color">Selling Agents</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/3.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">Miranda H. Halim</Link></h4>
// 						<h6 className="ltn__secondary-color">Property Seller</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/1.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">Damble D. Browni.</Link></h4>
// 						<h6 className="ltn__secondary-color">Property Seller</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/5.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">Aiden Benjamin</Link></h4>
// 						<h6 className="ltn__secondary-color">Real Estate Broker</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 					<div className="col-lg-4 col-sm-6">
// 					<div className="ltn__team-item ltn__team-item-3---">
// 						<div className="team-img">
// 						<img src={publicUrl+"assets/img/team/6.jpg"} alt="Image" />
// 						</div>
// 						<div className="team-info">
// 						<h4><Link to="/team-details">James Carter</Link></h4>
// 						<h6 className="ltn__secondary-color">Selling Agents</h6>
// 						<div className="ltn__social-media">
// 							<ul>
// 							<li><a href="#"><i className="fab fa-facebook-f" /></a></li>
// 							<li><a href="#"><i className="fab fa-twitter" /></a></li>
// 							<li><a href="#"><i className="fab fa-linkedin" /></a></li>
// 							</ul>
// 						</div>
// 						</div>
// 					</div>
// 					</div>
// 				</div>
// 				</div>
// 			</div>
//         }
// }

// export default TeamV2




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeamV2 = () => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [tab, setTab] = useState('myEnquire');

//     const user_id = 6; // Example user ID
//     const person_id = 2; // Example person ID

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     const fetchMessages = async () => {
//         try {
//             const response = await axios.post('https://truck.truckmessage.com/get_user_chat_message_list', {
//                 user_id,
//                 person_id
//             });
//             setMessages(response.data.messages);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };

//     const sendMessage = async () => {
//         try {
//             const response = await axios.post('https://truck.truckmessage.com/user_chat_message', {
//                 user_id,
//                 person_id,
//                 message: newMessage
//             });
//             setMessages([...messages, response.data]);
//             setNewMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         sendMessage();
//     };

//     return (
//         <div className="chat-container">
//             <div className="tabs">
//                 <button onClick={() => setTab('myEnquire')}>My Enquire</button>
//                 <button onClick={() => setTab('enquires')}>Enquires</button>
//             </div>
//             <div className="chat-box">
//                 {messages.map((msg, index) => (
//                     <div key={index} className="chat-message">
//                         {msg.message}
//                     </div>
//                 ))}
//             </div>
//             <form onSubmit={handleSendMessage}>
//                 <input 
//                     type="text" 
//                     value={newMessage} 
//                     onChange={(e) => setNewMessage(e.target.value)} 
//                     placeholder="Type your message..." 
//                 />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     );
// };

// export default TeamV2;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamV2 = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [tab, setTab] = useState('myEnquire');

    const user_id = 6; // Example user ID
    const person_id = 2; // Example person ID

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.post('https://truck.truckmessage.com/get_user_chat_message_list', {
                user_id,
                person_id
            });
            if (response.data && response.data.messages) {
                setMessages(response.data.messages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    const sendMessage = async () => {
        try {
            const response = await axios.post('https://truck.truckmessage.com/user_chat_message', {
                user_id,
                person_id,
                message: newMessage
            });
            if (response.data) {
                setMessages([...messages, response.data]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="chat-container">
            <div className="tabs">
                <button onClick={() => setTab('myEnquire')}>My Enquire</button>
                <button onClick={() => setTab('enquires')}>Enquires</button>
            </div>
            <div className="chat-box">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            {msg.message}
                        </div>
                    ))
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
            <form onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default TeamV2;
