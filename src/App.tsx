import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage/Home";
import CreateForm from "./pages/CreateForm/CreateForm";
import PreviewForm from "./pages/PreviewForm/PreviewForm";
import MyForms from "./pages/MyForms/MyForms";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/preview" element={<PreviewForm />} />
        <Route path="/myforms" element={<MyForms />} />
      </Routes>
    </Router>
  );
}
