import React, { useState } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";

const App = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      {showSignup ? (
        <Signup />
      ) : (
        <Login />
      )}

      <button onClick={() => setShowSignup(!showSignup)}>
        {showSignup ? "Go to Login" : "Go to Signup"}
      </button>
    </div>
  );
};

export default App;
