import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/navbar";
import AppRouter from "./router/app-router";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
