import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    getUserProfile,
    getUserPosts,
    getFriends,
    getPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriendUser
} from '../services/api';
import PostItem from '../components/PostItem';

function ProfilePage() {
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [friendshipStatus, setFriendshipStatus] = useState('loading');

    const { userId } = useParams();
    // --- FIX: Extract the primitive ID which is stable ---
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [profileRes, postsRes] = await Promise.all([
                getUserProfile(userId),
                getUserPosts(userId, 1)
            ]);

            const userProfile = profileRes.data.data;
            setProfileUser(userProfile);
            setPosts(postsRes.data.data);
            setPage(1);
            setHasMore(postsRes.data.links.next !== null);

            // Now, determine friendship status if not viewing your own profile
            if (currentUserId && currentUserId !== userProfile.id) {
                const [friendsRes, pendingRes] = await Promise.all([
                    getFriends(),
                    getPendingRequests()
                ]);

                const friends = friendsRes.data.data;
                const pending = pendingRes.data.data;

                if (friends.some(friend => friend.id === userProfile.id)) {
                    setFriendshipStatus('friends');
                } else if (pending.some(req => req.id === userProfile.id)) {
                    setFriendshipStatus('pending_received');
                } else {
                    setFriendshipStatus('none');
                }
            } else {
                setFriendshipStatus('self');
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to load profile. The user may not exist.');
            console.error(err);
        } finally {
            setLoading(false);
        }
        // --- FIX: Add the stable currentUserId to the dependency array ---
    }, [userId, currentUserId]); 

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const loadMorePosts = async () => {
        // ... (This function remains the same)
    };
    
    const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    const handleSendRequest = () => sendFriendRequest(userId).then(() => setFriendshipStatus('pending_sent')).catch(e => alert(e.response?.data?.message || 'Could not send request.'));
    const handleAcceptRequest = () => acceptFriendRequest(userId).then(fetchAllData);
    const handleRejectRequest = () => rejectFriendRequest(userId).then(fetchAllData);
    const handleUnfriend = () => {
        if (window.confirm("Are you sure you want to unfriend this user?")) {
            unfriendUser(userId).then(fetchAllData);
        }
    };

    if (loading && page === 1) return <div>Loading profile...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!profileUser) return <div>User not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: '30px', padding: '20px', background: '#e9ecef', borderRadius: '8px' }}>
                <h2>{profileUser.name}</h2>
                {profileUser.email && <p>Email: {profileUser.email}</p>}
                <p>Joined: {profileUser.joined_at}</p>

                <div style={{ marginTop: '15px' }}>
                    {friendshipStatus === 'none' && <button onClick={handleSendRequest}>Add Friend</button>}
                    {friendshipStatus === 'pending_sent' && <button disabled>Friend Request Sent</button>}
                    {friendshipStatus === 'friends' && <button onClick={handleUnfriend}>Unfriend</button>}
                    {friendshipStatus === 'pending_received' && (
                        <div>
                            <p>{profileUser.name} has sent you a friend request.</p>
                            <button onClick={handleAcceptRequest} style={{ background: '#28a745', color: 'white' }}>Accept Request</button>
                            <button onClick={handleRejectRequest} style={{ marginLeft: '10px' }}>Reject</button>
                        </div>
                    )}
                </div>
            </div>

            <h3>Posts by {profileUser.name}</h3>
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                />
            ))}
            
            {loading && page > 1 && <p>Loading more posts...</p>}
            
            {!loading && posts.length === 0 && <p>This user hasn't posted anything yet.</p>}

            {hasMore && !loading && (
                <button onClick={loadMorePosts}>Load More</button>
            )}
        </div>
    );
}

export default ProfilePage;