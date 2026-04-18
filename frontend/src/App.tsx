import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
