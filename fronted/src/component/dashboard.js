import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom';

let socket;

const Dashboard = () => {
    const [users, setUsers] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null); 
    const [onlineUsers, setOnlineUsers] = useState([]); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/users'); 
                setUsers(res.data);
            } catch (err) {
                console.log('Error fetching users:', err);
            }
        };


        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('user');
            let result=JSON.parse(token)
            console.log("result", result)
            if (result.token) {
                setCurrentUser(result.data.name); 
            }
        };

        fetchUsers();
        fetchCurrentUser();

        // Initialize Socket.io connection
        socket = io('http://localhost:4000');

        if (currentUser) {
            socket.emit('join', currentUser);
        }

        socket.on('userOnline', (userId) => {
            setOnlineUsers((prev) => [...prev, userId]);
        });

        return () => {
            socket.disconnect();
        };
    }, [currentUser]);


    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (err) {
            console.log('Error logging out:', err);
        }
    };

    return (
        <div className="container mt-5">
           <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>
                <div>
                    <span className="btn btn-danger me-2">{currentUser}</span>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>


            <h3>Users</h3>
            <div className="list-group">
                {users.map((user) => (
                    <div key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">{user.name}</h5>
                            <p className="mb-0">{user.role}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className={`badge ${onlineUsers.includes(user.user_id) ? 'badge-success' : 'badge-secondary'} mr-3`}>
                                {onlineUsers.includes(user.user_id) ? 'Online' : 'Offline'}
                            </span>
                            <Link to={`/message/${user.user_id}`} className="btn btn-primary">Message</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
