import React, { useState } from 'react';
import { createPost } from '../services/api';

function PostForm({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!content.trim()) {
            setError("Post content cannot be empty.");
            return;
        }
        try {
            const response = await createPost({ content });
            onPostCreated(response.data.data);
            setContent('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.');
            console.error(err.response?.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>Create a Post</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows="3"
                style={{ width: '100%', marginBottom: '10px' }}
                required
            />
            <button type="submit">Post</button>
        </form>
    );
}

export default PostForm;