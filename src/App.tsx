import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/foodmap" Component={Home} />
          <Route path="/" Component={About} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
