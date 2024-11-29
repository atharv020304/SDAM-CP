
import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home.jsx';
import Jobs from './Pages/Jobs.jsx'; 
import Dashboard from './Pages/Dashboard.jsx';
import PostApplication from './Pages/PostApplication.jsx';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import NotFound from './Pages/NotFound.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { getUser } from './store/slices/userSlice.js';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/post/application/:jobId' element={<PostApplication />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position='bottom-right' theme='dark'/>
      </Router>
    </>
  );
}

export default App;
