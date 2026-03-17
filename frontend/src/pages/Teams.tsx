import React, { useState } from 'react';
import { Button, Card, Badge } from '../components/UI';
import { Users, RotateCcw, Plus } from 'lucide-react';

const DEMO_PLAYERS = [
  { id: 'p1', name: 'Virat Kohli', role: 'Batsman', team: 'India', selected: true, role_type: 'captain' },
  { id: 'p2', name: 'Rohit Sharma', role: 'Batsman', team: 'India', selected: true, role_type: 'vice_captain' },
  { id: 'p3', name: 'Hardik Pandya', role: 'All-rounder', team: 'India', selected: true, role_type: 'normal' },
  { id: 'p4', name: 'Jasprit Bumrah', role: 'Bowler', team: 'India', selected: true, role_type: 'normal' },
  { id: 'p5', name: 'KL Rahul', role: 'Batsman', team: 'India', selected: false },
  { id: 'p6', name: 'Ravindra Jadeja', role: 'All-rounder', team: 'India', selected: false },
  { id: 'p7', name: 'David Warner', role: 'Batsman', team: 'Australia', selected: false },
  { id: 'p8', name: 'Pat Cummins', role: 'Bowler', team: 'Australia', selected: false },
];

export const Teams: React.FC = () => {
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  const [selectedCount, setSelectedCount] = useState(players.filter(p => p.selected).length);
  const [matchId, setMatchId] = useState('M001');

  const handlePlayerSelect = (id: string) => {
    setPlayers((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      );
      setSelectedCount(updated.filter((p) => p.selected).length);
      return updated;
    });
  };

  const handleRoleChange = (id: string, role: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, role_type: role } : p))
    );
  };

  const selectedPlayers = players.filter((p) => p.selected);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Create Your Team</h1>
        <p className="text-slate-400">Select players and assign roles to build your winning fantasy cricket team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Players List */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                <Users size={20} /> Available Players
              </h2>
              <input
                type="text"
                placeholder="Search players..."
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>

          <div className="space-y-3">
            {players.map((player) => (
              <Card
                key={player.id}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                  player.selected
                    ? 'bg-slate-700 border-blue-500'
                    : 'hover:bg-slate-750 border-slate-700'
                }`}
                onClick={() => handlePlayerSelect(player.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={player.selected}
                    onChange={() => handlePlayerSelect(player.id)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <div>
                    <p className="font-semibold text-slate-50">{player.name}</p>
                    <p className="text-sm text-slate-400">{player.role} • {player.team}</p>
                  </div>
                </div>

                {player.selected && (
                  <div className="flex gap-2">
                    <select
                      value={player.role_type}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRoleChange(player.id, e.target.value);
                      }}
                      className="px-3 py-1 bg-slate-600 border border-slate-500 rounded text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="captain">Captain (2x)</option>
                      <option value="vice_captain">Vice-Captain (1.5x)</option>
                      <option value="normal">Normal (1x)</option>
                    </select>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Team Summary */}
        <div>
          <Card className="sticky top-24 border-blue-500/50">
            <h2 className="text-xl font-bold text-slate-50 mb-4">Team Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Match ID</p>
                <p className="text-lg font-semibold text-slate-50">{matchId}</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Players Selected</p>
                <p className="text-lg font-semibold text-blue-400">{selectedCount} / 11</p>
              </div>
            </div>

            <div className="mb-6 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-slate-400 mb-3">Selected Players:</p>
              <div className="space-y-2">
                {selectedPlayers.map((player) => (
                  <div key={player.id} className="text-sm p-2 bg-slate-900 rounded border border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-50">{player.name}</span>
                      <Badge variant={player.role_type === 'captain' ? 'danger' : player.role_type === 'vice_captain' ? 'warning' : 'default'}>
                        {player.role_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={selectedCount !== 11}
                size="lg"
              >
                <Plus size={18} /> Confirm Team
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setPlayers(DEMO_PLAYERS);
                  setSelectedCount(0);
                }}
              >
                <RotateCcw size={18} /> Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
