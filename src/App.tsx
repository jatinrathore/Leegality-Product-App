import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/navbar";
import AppRouter from "./router/app-router";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
