import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppRoutes } from "./AppRoutes";
import { jwtDecode } from "jwt-decode";
import { PicksStateProvider } from './context/PicksContext';

interface DecodedToken {
  exp: number;
  username: string;
  email: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("decoded token..... is", decoded);
        console.log("now is......", Date.now());
        const isTokenExpired = decoded.exp * 1000 < Date.now();

        if (isTokenExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
      }
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <PicksStateProvider>
          <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </PicksStateProvider>
        <footer className="w-full bg-dark-green text-parchment py-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-2">
            <nav className="flex text-sm">
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </nav>
            <div className="text-center text-sm">
              © {new Date().getFullYear()} TraderDeck. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;