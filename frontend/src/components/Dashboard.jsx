import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../api";
import { LogOut, Trophy, Calendar, MapPin, ChevronRight, RefreshCw } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem("username") || "Player";

    const fetchMatches = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMatches();
            setMatches(data);
        } catch (err) {
            console.error("Failed to fetch matches", err);
            setError(err.message || "Failed to load matches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h2>Fantasy League</h2>
                <div className="nav-actions">
                    <button className="nav-btn" onClick={() => navigate("/leaderboard")}>
                        <Trophy size={18} style={{ marginRight: '8px' }} />
                        Leaderboard
                    </button>
                    <button className="nav-btn logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1>Welcome back, {username}!</h1>
                    <p>Select an upcoming match to build your dream team and win big.</p>
                </section>

                {loading && (
                    <div className="loading-state">Loading matches...</div>
                )}

                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="nav-btn" onClick={fetchMatches}>
                            <RefreshCw size={16} style={{ marginRight: '6px' }} />
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && matches.length === 0 && (
                    <div className="loading-state">No upcoming matches available.</div>
                )}

                {!loading && !error && matches.length > 0 && (
                    <div className="match-grid">
                        {matches.map((match) => {
                            const matchId = match.match_id ?? match.id;
                            const status = match.status ?? "Upcoming";
                            return (
                                <div
                                    key={matchId}
                                    className="premium-card match-card animate-fade-in"
                                    onClick={() => navigate(`/add-team/${matchId}`)}
                                >
                                    <div className="match-card-header">
                                        <span className={`status-badge ${status.toLowerCase()}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <h3 className="match-title">{match.title ?? match.name}</h3>
                                    <div className="match-info">
                                        <div>
                                            <Calendar size={16} />
                                            {match.date}
                                        </div>
                                        <div>
                                            <MapPin size={16} />
                                            {match.venue}
                                        </div>
                                    </div>
                                    <button className="select-btn">
                                        Select Team <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;