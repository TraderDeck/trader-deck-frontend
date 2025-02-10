import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./Home";
import Picks from "./Picks";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">

        <div className="bg-dark-green border-b-4 border-b-parchment shadow-md">
          <nav className="p-4 flex justify-between text-parchment">
            <Link to="/" className="font-bold text-lg ml-4">TraderDeck</Link>

            <div>
              <Link to="/" className="mx-2 hover:text-white">Home</Link>
              <Link to="/picks" className="mx-2 hover:text-white mr-8 ml-8">Picks</Link>
              <span  className="mx-2 hover:text-white mr-8 ml-8">Logout</span>

            </div>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/picks" element={<Picks />} />
        </Routes>


        <footer className="w-full bg-dark-green text-parchment py-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-2">
          
            <nav className="flex text-sm">
              <a href="#" className="hover:text-white">Contact Us</a>
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

