import Login from "./pages/login";
import './cssStyle/app.css'
import Home from "./pages/home";
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Register from "./pages/register";
import WorkSpace from "./pages/workSpace";
import DashBoard from "./pages/dashBoard";
import ProjetsPublics from "./pages/projetPublic";
import Support from "./pages/support";
import GestionProjet from "./pages/gastionProjet";
import AcceptPartage from "./pages/acceptPartage";
import ForgotPassword from "./pages/ForgotPassword";
import ReserPassWord from "./pages/ReserPassWord";
import { NotificationProvider } from "./notificationContext";
function App() {
  return (
   <NotificationProvider>
    <Router>
    <div className="App m-0">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Admin" element={<Login role="admin" />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/WorkSpace" element={<WorkSpace/>}/>
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route path="/resetPSW/:token" element={<ReserPassWord/>}/>
        <Route path="/gestionProjet/:projectUrl" element={<GestionProjet/>}/>
        <Route path="/AdminDashBoard" element={<DashBoard/>}/>
        <Route path="/ProjetsPublics" element={<ProjetsPublics/>}/>
        <Route path="/Support" element={<Support/>}/>
        <Route path="/accepterpartage/:projectUrl" element={<AcceptPartage/>}/>
      </Routes>
    </div>
  </Router>
  </NotificationProvider>
  );
}

export default App;
