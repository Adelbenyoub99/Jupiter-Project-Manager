import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { useNavigate } from "react-router-dom";
import FlagIcon from "@mui/icons-material/Flag";
import { getUserTask } from "../fetchRequests/user/calendar";

export default function Calendrier() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('Token');
      const data = await getUserTask(token);
      
      const formattedEvents = data.map(taskObj => {
        const task = taskObj.Tache;
        return {
          title: task.nomTache,
          start: task.dateDebut,
          end: task.dateFin,
          priority: task.priorite,
          project: task.Projet.nomProjet,
          status: task.statutTache,
          projetURL: task.Projet.URL,
          id: task.idTache // Adding task ID for identifying the task
        };
      });
      
      setEvents(formattedEvents);
      console.log('Tasks fetched successfully');
    } catch (error) {
      console.log('Error fetching tasks', error);
    }
  };

  const handleEventClick = (clickInfo) => {
    const task = clickInfo.event.extendedProps;
    if (task.projetURL) {
      navigate(`/gestionProjet/${task.projetURL}`);
    } else {
      console.log('No project URL found for this task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderEventContent = (eventInfo) => {
    const { priority, status, project } = eventInfo.event.extendedProps;

    let flagColor;
    if (priority === "Eleve") {
      flagColor = "red";
    } else if (priority === "Moyenne") {
      flagColor = "orange";
    } else {
      flagColor = "green";
    }

    return (
      <>
        <FlagIcon style={{ color: flagColor }} />
        <i>{eventInfo.event.title} ({status})</i>
        <br />
        <span>({project})</span>
      </>
    );
  };

  return (
    <div className="calendar-container mb-5 pb-5">
      <div className="calendar-content mb-5">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locales={[frLocale]}
          locale="fr"
          dayMaxEventRows={true}
          eventContent={renderEventContent}  // Custom event rendering
          eventClick={handleEventClick}  // Handle click events
        />
      </div>
    </div>
  );
}
