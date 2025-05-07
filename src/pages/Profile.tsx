import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile: React.FC = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Array<{ id: number; text: string }>>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setWebsite(user.website || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile({ bio, website });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      const newId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
      setComments([...comments, { id: newId, text: newComment }]);
      setNewComment('');
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>User Profile</h1>
        
        <div className="profile-section">
          <h2>Basic Information</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Edit Profile</h2>
          {message && <div className="message">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Your website URL"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h2>Comments</h2>
          <div className="comments-section">
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={addComment}>Post Comment</button>
            </div>
            
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    {/* XSS Vulnerability: Directly rendering user input without sanitization */}
                    <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Bio Preview</h2>
          {/* XSS Vulnerability: Directly rendering user input without sanitization */}
          <div className="bio-preview" dangerouslySetInnerHTML={{ __html: bio }} />
        </div>
      </div>
    </div>
  );
};

export default Profile; 