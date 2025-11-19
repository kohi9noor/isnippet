import { useState } from "react";

function App() {
  const [createNewVault, setCreateNewVault] = useState(false);

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
          {!createNewVault ? (
            <div className="space-y-2 flex flex-col">
              <button className="w-full px-4 py-3 text-sm font-light border border-muted/20 rounded-lg hover:bg-secondary/30 transition-all duration-300">
                Select vault
              </button>
              <button
                onClick={() => setCreateNewVault(true)}
                className="w-full px-4 py-3 text-sm font-light border border-muted/20 rounded-lg hover:bg-secondary/30 transition-all duration-300"
              >
                Create vault
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreateNewVault(false)}
              className="w-full px-4 py-3 text-sm font-light border border-muted/20 rounded-lg hover:bg-secondary/30 transition-all duration-300"
            >
              ← back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
