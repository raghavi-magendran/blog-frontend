import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth';

interface Post {
  title: string;
  author: string;
  description: string;
  body: string;
}

function EditPost() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:1116/blog/post/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError('Error fetching post for editing.');
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError('You must be logged in to edit a post.');
      return;
    }

    try {
      await axios.put(`http://localhost:1116/blog/edit`, post, {
        headers: { Authorization: `Bearer ${token}` },
        params: { postID: postId },
      });
      navigate(`/post/${postId}`);
    } catch (err: any) {
      setError('Error updating post: ' + (err.response?.data || err.message));
    }
  };

  if (error) return <p style={styles.error}>{error}</p>;
  if (!post) return <p style={styles.loading}>Loading post...</p>;

  return (
    <div style={styles.container}>
      <form onSubmit={handleEdit} style={styles.form}>
        <h2 style={styles.title}>Edit Post</h2>
        <label style={styles.label}>
          Title:
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Author:
          <input
            type="text"
            value={post.author}
            onChange={(e) => setPost({ ...post, author: e.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Description:
          <input
            type="text"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Body:
          <textarea
            value={post.body}
            onChange={(e) => setPost({ ...post, body: e.target.value })}
            style={styles.textarea}
          />
        </label>
        <button type="submit" style={styles.saveButton}>Save Changes</button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#000',
    padding: '2rem',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#333',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '0.5rem',
    minHeight: '150px',
  },
  saveButton: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1.5rem',
    transition: 'background-color 0.3s ease',
  },
  saveButtonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '1rem',
  },
  loading: {
    color: '#333',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
};

export default EditPost;
