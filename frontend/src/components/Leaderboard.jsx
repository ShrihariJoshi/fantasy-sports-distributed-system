import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../api";
import { ChevronLeft, Trophy, Medal } from "lucide-react";
import "./Leaderboard.css";

const Leaderboard = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setPlayers(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header">
                <button className="nav-btn" onClick={() => navigate("/dashboard")}>
                    <ChevronLeft size={20} /> Back
                </button>
                <h2>Global Leaderboard</h2>
            </header>

            <main className="leaderboard-content">
                {loading ? (
                    <div className="loading-state">Calculating scores...</div>
                ) : (
                    <div className="leaderboard-table-container premium-card">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, index) => (
                                    <tr key={player.username} className={index < 3 ? `top-${index + 1}` : ''}>
                                        <td>
                                            <div className="rank-cell">
                                                {index < 3 ? <Medal size={18} className={`medal-${index + 1}`} /> : index + 1}
                                            </div>
                                        </td>
                                        <td>{player.username}</td>
                                        <td className="points-cell">{player.total_points || 0}</td>
                                    </tr>
                                ))}
                                {players.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No data available yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Leaderboard;
