import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeOld from "./HomeOld";
import About from "./About";
import Home from "./Home";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="about" Component={About} />
          <Route path="newCss" Component={HomeOld}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
