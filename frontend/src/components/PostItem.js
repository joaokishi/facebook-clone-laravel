import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updatePost, deletePost, getCommentsForPost, addCommentToPost, deleteComment } from '../services/api';

// =========================================================================
// NEW: CommentSection Component
// This component handles everything related to comments for a single post.
// =========================================================================
function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch comments when the component mounts
    useEffect(() => {
        getCommentsForPost(postId)
            .then(response => {
                setComments(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch comments", error);
                setLoading(false);
            });
    }, [postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        addCommentToPost(postId, newComment)
            .then(response => {
                // Add the new comment to the top of the list for immediate feedback
                setComments([response.data.data, ...comments]);
                setNewComment(''); // Clear the input field
            })
            .catch(error => alert("Failed to add comment. You may only be able to comment on friends' posts."));
    };

    const handleCommentDelete = (commentId) => {
        deleteComment(commentId)
            .then(() => {
                setComments(comments.filter(c => c.id !== commentId));
            })
            .catch(error => alert("Failed to delete comment."));
    };

    if (loading) return <p style={{marginTop: '15px'}}>Loading comments...</p>;

    return (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={{ flexGrow: 1, marginRight: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type="submit" style={{ padding: '8px 12px', border: 'none', background: '#0d6efd', color: 'white', borderRadius: '4px' }}>Post</button>
            </form>
            <div>
                {comments.map(comment => (
                    <div key={comment.id} style={{ fontSize: '0.9em', marginBottom: '8px', padding: '5px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <strong style={{marginRight: '5px'}}>
                            <Link to={`/profile/${comment.user.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {comment.user.name}
                            </Link>
                        </strong>
                        {comment.content}
                        {comment.can_delete && (
                            <button onClick={() => handleCommentDelete(comment.id)} style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 5px', color: 'red', background: 'none', border: 'none' }}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


// =========================================================================
// UPDATED: PostItem Component
// Now includes state and UI for toggling the CommentSection.
// =========================================================================
function PostItem({ post, onPostDeleted, onPostUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [showComments, setShowComments] = useState(false); // <-- NEW state for toggling comments
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post.id);
                onPostDeleted(post.id);
            } catch (error) {
                console.error("Failed to delete post:", error);
                alert("Failed to delete post. " + (error.response?.data?.message || ""));
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await updatePost(post.id, { content: editedContent });
            onPostUpdated(response.data.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update post:", error);
            alert("Failed to update post. " + (error.response?.data?.message || ""));
        }
    };

    return (
        <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '5px', backgroundColor: 'white' }}>
            <p>
                <strong>
                    <Link to={`/profile/${post.user.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        {post.user.name}
                    </Link>
                </strong>
                {' '}
                <small style={{color: '#6c757d'}}>({new Date(post.created_at).toLocaleString()})</small>
            </p>

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows="3"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <p>{post.content}</p>
            )}

            {/* --- THIS IS THE UPDATED PART FOR ACTION BUTTONS --- */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {currentUser && post.can_delete && ( // Use can_delete from API if available
                    <>
                        {!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
                        <button onClick={handleDelete}>Delete</button>
                    </>
                )}
                {/* NEW button to show/hide comments */}
                <button onClick={() => setShowComments(!showComments)}>
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
            </div>

            {/* NEW: Conditionally render the CommentSection */}
            {showComments && <CommentSection postId={post.id} />}
        </div>
    );
}
export default PostItem;