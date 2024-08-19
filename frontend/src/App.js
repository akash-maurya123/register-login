
import {BrowserRouter as Router , Route, Routes} from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route />
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
