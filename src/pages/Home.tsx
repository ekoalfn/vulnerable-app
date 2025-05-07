import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Welcome to Vulnerable App</h1>
        <p>This application is intentionally vulnerable to XSS and CSRF attacks for educational purposes.</p>
        <p>Here are some features you can explore:</p>
        <ul>
          <li>Register and login to access protected resources</li>
          <li>Update your profile information</li>
          <li>Change your password</li>
        </ul>
        <div className="warning">
          <h3>Security Warning</h3>
          <p>This application contains intentional security vulnerabilities including:</p>
          <ul>
            <li>Cross-Site Scripting (XSS) - via unsanitized input</li>
            <li>Cross-Site Request Forgery (CSRF) - no CSRF tokens</li>
            <li>Insecure authentication token storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home; 