import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./Home";
import Picks from "./Picks";


function App() {
  return (
    <Router>
      <div className="bg-dark-green shadow-md">
        <nav className="p-4 flex justify-between">
          <Link to="/" className="text-white font-bold text-lg">TraderDeck</Link>
          <div>
            <Link to="/" className="mx-2 text-white hover:text-yellow-green">Home</Link>
            <Link to="/picks" className="mx-2 text-white hover:text-yellow-green">Picks</Link>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/picks" element={<Picks />} />
      </Routes>
    </Router>
  );
}

export default App;

