import { useState } from "react";
import Input from "./components/ui/input";
import Button from "./components/ui/button";
import CreateNewVault from "./components/main/create-new-vault";

function App() {
  return (
    <div className="w-full min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-wide">isnippet</h1>
          <p className="text-xs text-muted font-light tracking-widest uppercase">
            Where your snippets make sense
          </p>
        </div>

        <div className="w-72">
          <CreateNewVault />
        </div>
      </div>
    </div>
  );
}

export default App;
