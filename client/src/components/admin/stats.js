import React, { useState, useEffect } from "react";
import { getStatistics, getActivities } from "../../fetchRequests/admin/adminStat"; // Assurez-vous de mettre le bon chemin
import { Container, Card, Row, Col, ProgressBar } from "react-bootstrap";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export default function Stats() {
    const [stats, setStats] = useState(null);
    const [adminActivities, setAdminActivities] = useState([]);

    useEffect(() => {
        fetchStatistics();
        fetchAdminActivities();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem("Token");
            const statistics = await getStatistics(token);

            const totalUsers = statistics.users.total;
            const chefs = statistics.users.chefs;
            const adjoints = statistics.users.adjoints;
            const collaborateurs = statistics.users.collaborateurs;

            setStats({
                ...statistics,
                users: {
                    ...statistics.users,
                    chefs,
                    adjoints,
                    collaborateurs,
                },
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const fetchAdminActivities = async () => {
        try {
            const token = localStorage.getItem("Token");
            const activities = await getActivities(token);
            setAdminActivities(activities.reverse());
        } catch (error) {
            console.error("Error fetching admin activities:", error);
        }
    };

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
      <div className="pb-5">
        <Container fluid className="pb-5">
            <div className="d-flex align-items-center pt-1">
                <h4 className="ms-2">Utilisateurs</h4>
                <hr className="flex-grow-1 ms-2" />
            </div>
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>
                                    Total utilisateurs <PeopleAltIcon /> : {stats.users.total}
                                </Card.Title>
                                <Card.Title>
                                    Comptes actifs <CheckCircleIcon className="mb-1 active" />:{" "}
                                    {stats.users.active}
                                </Card.Title>
                                <Card.Title>
                                    Comptes inactifs <CancelIcon className=" mb-1 notActive" />:{" "}
                                    {stats.users.inactive}
                                </Card.Title>
                            </div>

                            <div className="d-flex justify-content-start align-items-center">
                                <div>
                                    <div>Chefs: {stats.users.chefs.toFixed(2)}%</div>
                                    <ProgressBar
                                        now={stats.users.chefs}
                                        className="custom-progress"
                                    />
                                </div>
                                <div className="ms-4">
                                    <div>Adjoints: {stats.users.adjoints.toFixed(2)}%</div>
                                    <ProgressBar
                                        now={stats.users.adjoints}
                                        className="custom-progress"
                                    />
                                </div>
                                <div className="ms-4">
                                    <div>
                                        Collaborateurs: {stats.users.collaborateurs.toFixed(2)}%
                                    </div>
                                    <ProgressBar
                                        now={stats.users.collaborateurs}
                                        className="custom-progress"
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex align-items-center pt-1">
                <h4 className="ms-2">Projets</h4>
                <hr className="flex-grow-1 ms-2" />
            </div>
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Total projets : {stats.projects.total}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>Projets publics : {stats.projects.public}</Card.Title>
                                <span className="custom-badge mb-auto">Public</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>Projets privés : {stats.projects.private}</Card.Title>
                                <span className="custom-badgeR mb-auto">Privé</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex align-items-center pt-1">
                <h4 className="ms-2">Signalements</h4>
                <hr className="flex-grow-1 ms-2" />
            </div>
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Total signalements : {stats.signals.total}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>
                                    Signalements enregistrés : {stats.signals.unanswered}
                                </Card.Title>
                                <HelpCenterIcon />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>Signalements traités : {stats.signals.answered}</Card.Title>
                                <CheckBoxIcon />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex align-items-center pt-1">
                <h4 className="ms-2">Activités des admins</h4>
                <hr className="flex-grow-1 ms-2" />
            </div>
            <Row>
                {adminActivities.map((activity, index) => (
                    <Col md={4} key={index}>
                        <Card className="mb-4" style={{minHeight:"200px"}}>
                            <Card.Body>
                                <Card.Title>{activity.action}</Card.Title>
                                <Card.Text>{activity.descActivity}</Card.Text>
                                <Card.Text>Admin: {activity.Admin.nomAdmin}</Card.Text>
                                <Card.Text>Date: {new Date(activity.createdAt).toLocaleString()}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    );
}
