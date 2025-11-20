import { Route, Routes } from "react-router-dom";
import Home from "./vault/home";

function App() {
  return (
    <div className="w-full min-h-screen bg-primary text-primary-foreground">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
