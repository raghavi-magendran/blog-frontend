import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../../slice/authSlice';

function Create() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const token = useSelector(selectAuthToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:1116/blog/post',
        { title, author, description, body },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate('/');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Post</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            style={{ ...styles.input, ...styles.textarea }}
          />
        </div>
        <button type="submit" style={styles.button}>Submit Post</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000', 
    color: '#fff', 
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '100%',
    maxWidth: '500px',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    marginBottom: '0.5rem',
    display: 'block',
    color: '#e0e0e0', 
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #555', 
    backgroundColor: '#222', 
    color: '#fff', 
    fontSize: '1rem',
  },
  textarea: {
    minHeight: '100px', 
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    backgroundColor: '#007bff', 
    color: '#fff', 
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'center',
    marginTop: '1rem',
  },
};

export default Create;
