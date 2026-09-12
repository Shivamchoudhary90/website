import Login from "./components/Login"
import Registration from "./components/Registration"
import Header from "./components/Header"
import {BrowserRouter,Routes,Route,Link} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact  from  "./pages/Contact"
import Exams from "./pages/Exams"
import Notices from "./pages/Notices"
import Results from "./pages/Results"
import Student from "./pages/Student"
import "./pages/Navbar.css";
function App(){
    return(
        <BrowserRouter>
        <Header/>

          <nav className="navbar">

      <Link to="/home" className="nav-link">
        <span>🏠</span> HOME </Link>

      <Link to="/about" className="nav-link">
        <span>ℹ️</span> ABOUT US
      </Link>

      <Link to="/exams" className="nav-link">
        <span>📋</span> EXAMS
      </Link>

      <Link to="/student-zone" className="nav-link">
        <span>👤</span> STUDENT ZONE
      </Link>

      <Link to="/results" className="nav-link">
        <span>🏆</span> RESULTS
      </Link>


      <Link to="/notices" className="nav-link">
        <span>🔔</span> NOTICES
      </Link>

      <Link to="/contact" className="nav-link">
        <span>📞</span> CONTACT US
      </Link>
   </nav>


   <Routes>

<Route path="/" element={<Home/>}/>
<Route path="/home" element={<Home/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/exams" element={<Exams/>}/>
<Route path="/student-zone" element={<Student/>}/>
<Route path="/results" element={<Results/>}/>
<Route path="/notices" element={<Notices/>}/>
<Route path="/contact" element={<Contact/>}/>


    
      

        </Routes>
        </BrowserRouter>
    );
}
export default App;