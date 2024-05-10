import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import FoodMap from "./FoodMap";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/foodmap" Component={FoodMap} />
          <Route path="/" Component={Home} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
