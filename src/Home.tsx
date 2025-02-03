
import { Button } from "./components/ui/Button";

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

export default Home; 