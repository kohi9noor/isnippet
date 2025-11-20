import CreateNewVault from "../components/main/create-new-vault";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
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
};

export default Home;
