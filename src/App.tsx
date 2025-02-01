import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-black bg-white">
      <header className="text-3xl font-bold text-dark-green mb-8">Welcome to TraderDeck</header>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl">
        Streamline your trading strategies and manage your stock picks like a pro. 
        Explore, analyze, and track your trading progress all in one place.
      </p>
      <Button className="bg-kelly-green text-white px-4 py-2 rounded-md">
        Get Started
      </Button>
    </div>
  );
}

function Picks() {
  return (
    <div className="min-h-screen p-6 text-black bg-white">
      <header className="text-2xl font-semibold text-bittersweet-shimmer mb-4">Your Stock Picks</header>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-parchment">
          <CardContent className="p-4">
            <h2 className="font-bold text-xl mb-2 text-yellow-green">Stock: AAPL</h2>
            <p className="text-sm text-black">Category: Interesting</p>
          </CardContent>
        </Card>
        <Card className="bg-parchment">
          <CardContent className="p-4">
            <h2 className="font-bold text-xl mb-2 text-yellow-green">Stock: TSLA</h2>
            <p className="text-sm text-black">Category: Pending Confirmation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

