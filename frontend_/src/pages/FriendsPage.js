import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getFriends, 
    getPendingRequests, 
    acceptFriendRequest, 
    rejectFriendRequest 
} from '../services/api';

function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFriendsData = () => {
        setLoading(true);
        // Fetch friends and pending requests at the same time
        Promise.all([getFriends(), getPendingRequests()])
            .then(([friendsRes, pendingRes]) => {
                setFriends(friendsRes.data.data);
                setPendingRequests(pendingRes.data.data);
            })
            .catch(error => {
                console.error("Failed to fetch friends data", error);
                alert("Could not load your friends list.");
            })
            .finally(() => setLoading(false));
    };

    // Fetch data when the component first loads
    useEffect(() => {
        fetchFriendsData();
    }, []);

    const handleAccept = (userId) => {
        acceptFriendRequest(userId)
            .then(() => {
                // Refetch all data to update both lists
                fetchFriendsData();
            })
            .catch(() => alert("Failed to accept request."));
    };

    const handleReject = (userId) => {
        rejectFriendRequest(userId)
            .then(() => {
                // Just remove the request from the list without a full refetch
                setPendingRequests(prev => prev.filter(req => req.id !== userId));
            })
            .catch(() => alert("Failed to reject request."));
    };

    if (loading) {
        return <div>Loading your friends...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h2>Friend Requests</h2>
                {pendingRequests.length > 0 ? (
                    pendingRequests.map(user => (
                        <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <Link to={`/profile/${user.id}`}>{user.name}</Link>
                            <div>
                                <button onClick={() => handleAccept(user.id)} style={{ background: '#28a745', color: 'white' }}>Accept</button>
                                <button onClick={() => handleReject(user.id)} style={{ marginLeft: '10px' }}>Reject</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No new friend requests.</p>
                )}
            </div>

            <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h2>Your Friends</h2>
                {friends.length > 0 ? (
                    <ul>
                        {friends.map(user => (
                            <li key={user.id} style={{ marginBottom: '10px' }}>
                                <Link to={`/profile/${user.id}`}>{user.name}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You haven't added any friends yet.</p>
                )}
            </div>
        </div>
    );
}

export default FriendsPage;