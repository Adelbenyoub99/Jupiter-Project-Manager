import React,{useEffect,useState} from 'react'
import { DeconnectAdmin } from '../fetchRequests/admin/adminAccount'
import { useNavigate } from 'react-router-dom';
import MyNavbar from '../components/navbar';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminNav from '../components/admin/adminNav';
import Admins from '../components/admin/admins';
import Problems from '../components/admin/problems';
import Projects from '../components/admin/projects'
import Users from '../components/admin/users'
import Stats from '../components/admin/stats';
import { useLocation } from 'react-router-dom';
import { Container } from "react-bootstrap";
import '../cssStyle/admin.css'
export default function DashBoard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("stats");
  const location = useLocation();
  const [validToken, setValidToken] = useState(true);

  const isTokenValid = () => {
    const token = localStorage.getItem("Token");
    const expirationTime = localStorage.getItem("TokenExpiration");
  
    if (!token || !expirationTime) {
      return false;
    }
  
    const currentTime = new Date().getTime();
  
    if (currentTime > expirationTime) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Prenom");
      localStorage.removeItem("TokenExpiration");
      return false;
    }
  
    return true;
  };
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Token is expired or not present. Redirecting to login page.");
      setValidToken(false)
    }
    if (location.state && location.state.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location]);
  return (
  <>
  <div className="main mainPP">
        <div className="d-flex align-items-center ms-auto">
          <div className="w-100">
          <MyNavbar role={"admin"} dashBoard={true} validToken={validToken}/>
          </div>
           <button className='login' style={{maxWidth:'120px'}} onClick={() => { DeconnectAdmin(); navigate('/'); }}>Deconnecter</button>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center mx-5">
          <h1>Bienvenue, Admin  !</h1>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="custom-shape-divider-bottom-1717149053PP">
            <svg
              data-name="Layer 1"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>
        </div>
        </div>
        <Container fluid>
        <div className="m-0 contentContainer">
          {activeView === "stats" && <Stats/>}
          {activeView === "users" && <Users/>}
          {activeView === "projets" && <Projects/>}
          {activeView === "userhelp" && <Problems/>}
          {activeView === "admins" && <Admins/>}
      
        </div>
      </Container>
      
    <AdminNav setActiveView={setActiveView }  activeView={activeView} />
     
   
   
    </>
    
  )
}
