import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth';
import { useAuth } from '../contexts/authContext';

interface Post {
  _id: string;
  title: string;
  author: string;
  description: string;
  body: string;
}

function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:1116/blog/post/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError('Error fetching post details.');
        console.error('Error fetching post details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const token = getToken();
  
    try {
      await axios.delete(`http://localhost:1116/blog/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          postID: postId, 
        },
      });
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: any } };
        errorMessage = axiosError.response?.data?.message || JSON.stringify(axiosError.response?.data) || errorMessage;
      }
    
      setError('Error deleting post: ' + errorMessage);
      console.error('Error deleting post:', errorMessage);
    }
    
  };
  
  

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{post.title}</h1>
      <p style={styles.author}>Author: {post.author}</p>
      <p style={styles.description}>{post.description}</p>
      <p style={styles.body}>{post.body}</p>
      <div style={styles.actions}>
        {true && true && (
          <>
            <Link to={`/edit/${post._id}`} style={styles.editButton}>Edit</Link>
            <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#000',
    color: '#fff',
  },
  title: {
    fontSize: '2rem',
    color: '#007eF7',
    marginBottom: '1rem',
  },
  author: {
    fontSize: '1rem',
    color: '#b0b0b0',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.2rem',
    color: '#e0e0e0',
    marginBottom: '1rem',
  },
  body: {
    fontSize: '1rem',
    color: '#ddd',
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  editButton: {
    color: '#ffdd57',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    backgroundColor: '#444',
    borderRadius: '4px',
  },
  deleteButton: {
    color: '#ff4d4d',
    backgroundColor: 'transparent',
    border: '1px solid #ff4d4d',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default PostDetails;
