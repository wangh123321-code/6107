import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Configurator from "@/pages/Configurator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Configurator />} />
      </Routes>
    </Router>
  );
}
