import { BrowserRouter as Router} from "react-router-dom";
import { useState, useEffect } from "react";
import { AppRoutes } from "./AppRoutes";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

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