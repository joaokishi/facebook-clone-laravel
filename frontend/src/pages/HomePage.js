// src/pages/HomePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { getPosts, getFriendsPosts } from '../services/api'; // <-- Import getFriendsPosts
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // --- NEW STATE FOR TABS ---
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'friends'

    // Use useCallback to prevent re-creating the function on every render
    const fetchPosts = useCallback(async (tab, pageNum) => {
        setLoading(true);
        setError(null);
        
        // Choose which API function to call based on the active tab
        const apiCall = tab === 'all' ? getPosts(pageNum) : getFriendsPosts(pageNum);

        try {
            const response = await apiCall;
            // If it's the first page, replace the posts. Otherwise, append them.
            if (pageNum === 1) {
                setPosts(response.data.data);
            } else {
                setPosts(prevPosts => [...prevPosts, ...response.data.data]);
            }
            setHasMore(response.data.links.next !== null);
        } catch (err) {
            setError('Failed to fetch posts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch posts when the component mounts or the active tab changes
    useEffect(() => {
        setPage(1); // Reset to page 1 when switching tabs
        fetchPosts(activeTab, 1);
    }, [activeTab, fetchPosts]);

    const handleTabChange = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };

    const loadMorePosts = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(activeTab, nextPage); // Fetch more for the current active tab
        }
    };

    const handlePostCreated = (newPost) => {
        // Add new post to the top of the list, works for both feeds
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => (p.id === updatedPost.id ? updatedPost : p)));
    };

    return (
        <div>
            <h1>Feed</h1>
            <PostForm onPostCreated={handlePostCreated} />

            {/* --- NEW TAB UI --- */}
            <div style={{ margin: '20px 0', borderBottom: '1px solid #ccc' }}>
                <button
                    onClick={() => handleTabChange('all')}
                    style={{
                        padding: '10px 15px',
                        border: 'none',
                        background: 'none',
                        fontWeight: activeTab === 'all' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'all' ? '2px solid blue' : 'none',
                    }}
                >
                    For You
                </button>
                <button
                    onClick={() => handleTabChange('friends')}
                    style={{
                        padding: '10px 15px',
                        border: 'none',
                        background: 'none',
                        fontWeight: activeTab === 'friends' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'friends' ? '2px solid blue' : 'none',
                    }}
                >
                    Friends
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                />
            ))}

            {loading && <p>Loading posts...</p>}
            
            {!loading && posts.length === 0 && (
                <p>No posts to show in this feed.</p>
            )}

            {hasMore && !loading && (
                <button onClick={loadMorePosts} style={{ width: '100%', padding: '10px', marginTop: '20px' }}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default HomePage;