import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./Theme/ThemeContext";
import Home from "./pages/home/home";
import Login from "./pages/login/login";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
