import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../slice/authSlice';

interface Post {
  _id: string;
  title: string;
  author: string;
  description: string;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  const token = useSelector(selectAuthToken);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:1116/blog/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:1116/blog/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Blog Posts</h1>
      <Link to="/create" style={styles.createLink}>Create New Post</Link>
      <div style={styles.postsContainer}>
        {posts.map(post => (
          <div key={post._id} style={styles.post}>
            <h3 style={styles.postTitle}>{post.title}</h3>
            <p style={styles.postDescription}>{post.description}</p>
            <p style={styles.postAuthor}>Author: {post.author}</p>
            <div style={styles.postActions}>
              <Link to={`/post/${post._id}`} style={styles.viewLink}>View</Link>
              {isAuthenticated && (
                <>
                  <Link to={`/edit/${post._id}`} style={styles.editLink}>Edit</Link>
                  <button onClick={() => deletePost(post._id)} style={styles.deleteButton}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#000', 
    color: '#fff', 
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
  },
  createLink: {
    color: '#007bff', 
    textDecoration: 'none',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    backgroundColor: '#333',
  },
  postsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '800px',
  },
  post: {
    backgroundColor: '#333', 
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  postTitle: {
    fontSize: '1.5rem',
    color: '#007eF7', 
    marginBottom: '0.5rem',
  },
  postDescription: {
    fontSize: '1rem',
    color: '#e0e0e0', 
    marginBottom: '1rem',
  },
  postAuthor: {
    fontSize: '0.9rem',
    color: '#b0b0b0', 
    marginBottom: '1rem',
  },
  postActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  viewLink: {
    color: '#00bfff', 
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.4rem 0.8rem',
    backgroundColor: '#222',
    borderRadius: '4px',
  },
  editLink: {
    color: '#ffdd57', 
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.4rem 0.8rem',
    backgroundColor: '#444',
    borderRadius: '4px',
  },
  deleteButton: {
    color: '#ff4d4d', 
    backgroundColor: 'transparent',
    border: '1px solid #ff4d4d',
    borderRadius: '4px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
  },
};

export default Home;
