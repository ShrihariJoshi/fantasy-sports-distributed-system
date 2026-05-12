import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayers, addTeam } from "../api";
import { ChevronLeft, UserPlus, UserMinus, ShieldCheck, Star, Loader2 } from "lucide-react";
import "./AddTeam.css";

const AddTeam = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [captain, setCaptain] = useState(null);
    const [viceCaptain, setViceCaptain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getPlayers(matchId);
                setPlayers(data);
            } catch (err) {
                console.error("Failed to fetch players", err);
                alert("Could not load players. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [matchId]);

    const togglePlayer = (player) => {
        const isSelected = selected.some((p) => p.player_id === player.player_id);

        if (isSelected) {
            setSelected(selected.filter((p) => p.player_id !== player.player_id));
            if (captain?.player_id === player.player_id) setCaptain(null);
            if (viceCaptain?.player_id === player.player_id) setViceCaptain(null);
        } else {
            if (selected.length >= 11) {
                return alert("Maximum 11 players allowed.");
            }
            setSelected([...selected, player]);
        }
    };

    const handleRole = (player, role) => {
        if (!selected.some((p) => p.player_id === player.player_id)) return;

        if (role === 'C') {
            if (viceCaptain?.player_id === player.player_id) {
                setViceCaptain(null);
            }
            setCaptain(player);
        } else if (role === 'VC') {
            if (captain?.player_id === player.player_id) {
                setCaptain(null);
            }
            setViceCaptain(player);
        }
    };

    const handleSubmit = async () => {
        if (selected.length !== 11) return alert("Select exactly 11 players.");
        if (!captain || !viceCaptain) return alert("Assign Captain and Vice Captain.");

        const team = selected.map((p) => ({
            player_id: p.player_id,
            player_name: p.player_name,
            role: p.player_id === captain.player_id ? "captain" :
                p.player_id === viceCaptain.player_id ? "vice_captain" : "normal",
        }));

        try {
            setSubmitting(true);
            await addTeam(matchId, team);
            alert("Team submitted successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="team-container">
            <header className="team-header">
                <button className="nav-btn" onClick={() => navigate("/dashboard")}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="team-info">
                    <h2>Build Your Team</h2>
                    <p className="selection-counter">
                        Players: <span>{selected.length}</span>/11
                    </p>
                </div>
                <div className="role-status">
                    {captain && <span className="badge captain">C: {captain.player_name}</span>}
                    {viceCaptain && <span className="badge vice">VC: {viceCaptain.player_name}</span>}
                </div>
            </header>

            <main className="team-content">
                {loading ? (
                    <div className="loading-state">Loading players...</div>
                ) : (
                    <div className="players-grid">
                        {players.map((player) => {
                            const isSelected = selected.some(p => p.player_id === player.player_id);
                            const isCaptain = captain?.player_id === player.player_id;
                            const isViceCaptain = viceCaptain?.player_id === player.player_id;

                            return (
                                <div
                                    key={player.player_id}
                                    className={`premium-card player-card ${isSelected ? 'selected' : ''}`}
                                >
                                    <div className="player-main-info">
                                        <div>
                                            <div className="player-name">{player.player_name}</div>
                                            <div className="player-role">{player.team} • {player.role}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="role-selectors">
                                                <button
                                                    className={`role-btn ${isCaptain ? 'active captain' : ''}`}
                                                    onClick={() => handleRole(player, 'C')}
                                                    title="Captain"
                                                >
                                                    C
                                                </button>
                                                <button
                                                    className={`role-btn ${isViceCaptain ? 'active vice-captain' : ''}`}
                                                    onClick={() => handleRole(player, 'VC')}
                                                    title="Vice Captain"
                                                >
                                                    VC
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="player-actions">
                                        <button
                                            className={`toggle-player-btn ${isSelected ? 'remove' : 'add'}`}
                                            onClick={() => togglePlayer(player)}
                                        >
                                            {isSelected ? (
                                                <><UserMinus size={16} style={{ marginRight: '6px' }} /> Remove</>
                                            ) : (
                                                <><UserPlus size={16} style={{ marginRight: '6px' }} /> Add</>
                                            )}
                                        </button>

                                        {isCaptain && <ShieldCheck className="role-icon captain" size={20} color="var(--primary)" />}
                                        {isViceCaptain && <Star className="role-icon vice" size={20} color="var(--accent)" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <footer className="bottom-bar">
                <button
                    className="submit-team-btn"
                    onClick={handleSubmit}
                    disabled={selected.length !== 11 || !captain || !viceCaptain || submitting}
                >
                    {submitting ? (
                        <Loader2 className="spinner" size={20} />
                    ) : (
                        "Confirm Team"
                    )}
                </button>
            </footer>
        </div>
    );
};

export default AddTeam;