import { getAllUsers, getAllParticipation } from "./adminUser";
import { getAllProjects } from "./adminProjet";
import { getAllSignals } from "./adminSignal";
import httpRequest from "../../httpRequest";

export const getStatistics = async (token) => {
  try {
    const [users, participations, projects, signals] = await Promise.all([
      getAllUsers(token),
      getAllParticipation(token),
      getAllProjects(token),
      getAllSignals(token)
    ]);

    // Calculer les statistiques des utilisateurs
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const chefs = participations.filter(p => p.role === 'ChefProjet').length;
    const adjoints = participations.filter(p => p.role === 'Adjoint').length;
    const collaborateurs = participations.filter(p => p.role === 'Collaborateur').length;

    const chefPercentage = (chefs / totalUsers) * 100;
    const adjointPercentage = (adjoints / totalUsers) * 100;
    const collaborateurPercentage = (collaborateurs / totalUsers) * 100;

    // Calculer les statistiques des projets
    const totalProjects = projects.length;
    const publicProjects = projects.filter(p => p.visibiliteProjet === 'Public').length;
    const privateProjects = totalProjects - publicProjects;

    // Calculer les statistiques des signalements
    const totalSignals = signals.length;
    const unansweredSignals = signals.filter(s => s.reponse === null).length;
    const answeredSignals = totalSignals - unansweredSignals;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        chefs: chefPercentage,
        adjoints: adjointPercentage,
        collaborateurs: collaborateurPercentage
      },
      projects: {
        total: totalProjects,
        public: publicProjects,
        private: privateProjects
      },
      signals: {
        total: totalSignals,
        unanswered: unansweredSignals,
        answered: answeredSignals
      }
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
export const getActivities=async(token)=>{
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    const activities=await httpRequest('/admin/activity','GET',null,headers)
    return activities
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error
  }}