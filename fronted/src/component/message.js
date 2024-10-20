import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
let socket;

const Message = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const response = localStorage.getItem('user');
    let result= JSON.parse(response)
    const [token, setToken]= useState(result.token)


    const fetchReceiver = async () => {
        try {
            const res = await axios.get(`/users/${userId}`);
            setReceiver(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/api/message/getMessages/${userId}`, {
                headers: {
                  Authorization: token,
                },
            });
    
            setMessages(res.data);
          } catch (err) {
            console.error("Error fetching messages:", err);
          } 
    };

    const fetchCurrentToken = () => {
        const response = localStorage.getItem('user');
        let result= JSON.parse(response)
        let tokenDetail=result.token;
        setToken(tokenDetail)
        setCurrentUser(result.data.name)
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            const response = localStorage.getItem('user');
            let result = JSON.parse(response);
            let token = result.token;

            let option = {
                receiver_id: userId,
                content,
                sender_id: result.data.user_id
            };
    
            const res = await axios.post('/api/message/sendMessage', option, {
                headers: {
                    'Authorization': `${token}`,  // Ensure Bearer token format
                },
            });

            setMessages(res.data)
            fetchMessages();
            setContent('');
            socket.emit('newMessage', res.data);
        } catch (err) {
            console.error(err);
        }
    };
    

    useEffect(() => {
        fetchCurrentToken()
        fetchReceiver();
        fetchMessages();

        // Initialize Socket.io
        socket = io('http://localhost:5000');

        if (currentUser) {
            socket.emit('join', currentUser);
        }

        socket.on('newMessage', (message) => {
            if (
                (message.sender_id === userId && message.receiver_id === currentUser) ||
                (message.sender_id === currentUser && message.receiver_id === userId)
            ) {
                setMessages((prevMessages) => [...(prevMessages || []), message]);  // Correct usage of prevMessages
            }
        });
        

        return () => {
            socket.disconnect();
        };
    }, [userId, currentUser]);

    
    useEffect(() => {
        if (currentUser) {
            socket.emit('join', currentUser);
        }
    }, [currentUser]);

    return (
        <div>
            <h2>Messaging with {receiver ? receiver.name : '...'}</h2>
            <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll' }}>
                {console.log("currentUser,......", currentUser)}
                {messages.data?.map(msg => (
                    <div key={msg.id} style={{ textAlign: msg.sender_id === currentUser ? 'left' : 'right' }}>
                        <p><strong>{msg.sender_id === currentUser ? 'You' : currentUser}:</strong> {msg.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend}>
                <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Type a message" required />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Message;
