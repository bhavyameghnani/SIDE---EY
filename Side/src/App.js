import "./App.css";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import LandingPage from "./Components/LandingPage/LandingPage";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;