import React, { useEffect, useState } from 'react';
import '../cssStyle/projetpublics.css';
import MyNavbar from '../components/navbar';
import SearchForm from '../components/searchForm';
import Footer from '../components/footer';
import ProjetPublicCard from '../components/projetPublicCard';
import { useLocation } from 'react-router-dom';
import { getProjetsPublics, recherchProjet ,getUserPublicProject } from '../fetchRequests/projet/projetpublic';
import  {annulerDemande, createDemandeAdh} from '../fetchRequests/projet/demandAdh';
import { getUserDemandes } from '../fetchRequests/projet/demandAdh';
import { getRole } from '../fetchRequests/getRole';


export default function ProjetsPublics() {
  const [projetPublics, setProjetPublics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [DemandeUser, setDemandeUser] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('search') || '';
  const [role, setRole] = useState('');
  const [userPublicProjects, setuserPublicProjects] = useState([]);
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
    const fetchData = async () => {
        setLoading(true);
        setNoResults(false);
        try {
            if (localStorage.getItem('Token')) {
              const roleData = await getRole(); 
              setRole(roleData);
                const demandes = await getUserDemandes(localStorage.getItem('Token'));
                setDemandeUser(demandes);
                const projects=await getUserPublicProject(localStorage.getItem('Token'))
                setuserPublicProjects(projects)
               
            }
            if (initialSearchTerm) {
                const projets = await recherchProjet(initialSearchTerm);
                setProjetPublics(projets);
                setSearchTerm(initialSearchTerm);
                if (projets.length === 0) {
                    setNoResults(true);
                }
            } else {
                const projets = await getProjetsPublics();
                setProjetPublics(projets);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
  
    fetchData();
}, [initialSearchTerm]);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setNoResults(false);
    try {
      const projets = await recherchProjet(searchTerm);
      setProjetPublics(projets);
      setSearchTerm(searchTerm);
      if (projets.length === 0) {
        setNoResults(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des projets publics:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleEnvoyerDemande = async (idProjet) => {
    console.log('Project ID = ' + idProjet);
    try {
      if (localStorage.getItem('Token')) {
        await createDemandeAdh(idProjet, localStorage.getItem("Token"));
        // Update the demandeUser state after sending the request
        const updatedDemandeUser = await getUserDemandes(localStorage.getItem('Token'));
        setDemandeUser(updatedDemandeUser);
      } else {
        alert("Vous devez vous connecter pour envoyer une demande.");
      }
    } catch (error) {
      console.error('Error while sending the request:', error);
      alert("Une erreur s'est produite lors de l'envoi de la demande.");
    }
  }
  const handleAnnulerDemande=async(idDemande)=>{
    try {
      await annulerDemande(idDemande,localStorage.getItem('Token'))
      const demandes = await getUserDemandes(localStorage.getItem('Token'));
        setDemandeUser(demandes); 
    } catch (error) {
      console.error('Error while canceling the request:', error);
      alert("Une erreur s'est produite lors de l'annulation de la demande.");
    }
  }
  return (
    <div>
      <div className='main mainPP'>
        <MyNavbar role={role} validToken={validToken}/>
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <h1>Projets publics</h1>
          <SearchForm titre='Recherche projets' initialValue={initialSearchTerm} onSearch={handleSearch} />
          <div className="custom-shape-divider-bottom-1717149053PP">
            <svg data-name="Layer 1" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        {loading ? (
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 mb-4 d-flex align-items-stretch">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            {noResults ? (
              <div className="col-12">
                <h3 className="text-center noResultDiv" >Aucun résultat trouvé pour "{searchTerm}".</h3>
              </div>
            ) : (
              projetPublics.map(projet => (
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 mb-4 d-flex align-items-stretch" key={projet.idProjet}>
                  <ProjetPublicCard 
                  projet={projet} 
                  demandeUser={Array.isArray(DemandeUser) ? DemandeUser.find(demande => demande.idProjet === projet.idProjet) : null}
                  envoyerDemande={handleEnvoyerDemande}
                  annulerDemande={handleAnnulerDemande}
                  projectRole={userPublicProjects.find(userProj => userProj.idProjet === projet.idProjet)?.Membres[0].Participations.role || ''} 
                   />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
