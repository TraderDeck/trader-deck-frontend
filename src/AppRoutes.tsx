import { featureFlags } from "./featureFlags/values";

import { Route, Link, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Picks from "./Picks";
import Agents from "./Agents";
import Login from "./Login";
import Register from "./Register";
import { UserDropdown } from "./components/UserDropdown";

interface AppRoutesProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
export function AppRoutes({ isLoggedIn, setIsLoggedIn }: AppRoutesProps) {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setIsLoggedIn(false);
      navigate("/");
    };
  
    return (
      <>
        <div className="bg-dark-green border-b-4 border-b-parchment shadow-md">
          <nav className="p-4 flex justify-between text-parchment">
            <Link to="/" className="font-bold text-lg ml-4">
              TraderDeck
            </Link>
            <div className="flex items-center">
              <Link to="/" className="mx-6 hover:text-white">
                Home
              </Link>
              {isLoggedIn && (
                <Link to="/picks" className="mx-6 hover:text-white">
                  Picks
                </Link>
              )}
              {isLoggedIn && (
                <Link to="/agents" className="mx-10 hover:text-white">
                  Agents
                </Link>
              )}
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="mx-2 hover:text-white mr-8 ml-8">
                    Register
                  </Link>
                  <Link to="/login" className="mx-2 hover:text-white mr-8 ml-8">
                    Login
                  </Link>
                </>
              ) : (
                <div className="mx-2 mr-8 ml-8">
                  <UserDropdown 
                  username={localStorage.getItem("username") || "xxxx"} 
                  userEmail={localStorage.getItem("userEmail") || "xxxx"}
                  onLogout={handleLogout} />
                </div>
              )}
            </div>
          </nav>
        </div>
  
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn && <Route path="/picks" element={<Picks />} />}
          {isLoggedIn && <Route path="/agents" element={<Agents />} />}
          {!isLoggedIn && <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />}
          {featureFlags.SHOW_REGISTER && !isLoggedIn &&  <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />}
        </Routes>
      </>
    );
  }
