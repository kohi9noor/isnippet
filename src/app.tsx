import { Route, Routes } from "react-router-dom";
import Home from "./vault/home";
import Dashboard from "./vault/dashboard";
import AppProvider from "./context/app.provider";

function App() {
  return (
    <AppProvider>
      <div className="w-full min-h-screen bg-primary text-primary-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
