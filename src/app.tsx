import { useState } from "react";

function App() {
  const [createNewVault, setCreateNewVault] = useState(false);

  return (
    <div className=" w-full min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center">
      <div className=" container  mx-auto ">
        <div className=" py-8">
          <h1 className=" text-2xl font-bold text-center">Isnippet</h1>
          <p className=" text-center text-sm text-muted">
            Manage your secure vaults with ease.
          </p>
        </div>
        <div className=" flex flex-col gap-2 w-fit mx-auto">
          {!createNewVault ? (
            <div className=" flex flex-col gap-2">
              <button className="min-w-[148px] px-2 hover:bg-secondary/60 cursor-pointer text-sm  border-muted border flex flex-col items-center justify-center rounded-xl h-10 bg-secondary text-secondary-foreground">
                Select your existing vault
              </button>
              <button
                onClick={() => setCreateNewVault((prev) => !prev)}
                className="min-w-[148px] px-2 hover:bg-secondary/60 cursor-pointer text-sm  border-muted border flex flex-col items-center justify-center rounded-xl h-10 bg-secondary text-secondary-foreground"
              >
                Create a new vault
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
