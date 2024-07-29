import React  from 'react'
import MainHome from '../components/mainHome';
import Services from '../components/services';
import Footer from '../components/footer';
import { getRole } from '../fetchRequests/getRole';
import { useEffect,useState } from 'react';

export default function Home() {
  const [role, setRole] = useState('');
  const [validToken, setValidToken] = useState();
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Token is expired or not present. Redirecting to login page.");
      setValidToken(false)
    } else {
      setValidToken(true)
      const fetchRole = async () => {
        const roleData = await getRole(); 
        setRole(roleData);
      };
      fetchRole();
    }
  
  }, []);

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
  
  return (
    <div >
      
     <MainHome role={role} validToken={validToken}/>
     <Services/>
     <Footer/>
    </div>
  )
}
