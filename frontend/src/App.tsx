import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookList from "./BookList";
import Cart from "./Cart";
import AdminBooks from './AdminBooks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
