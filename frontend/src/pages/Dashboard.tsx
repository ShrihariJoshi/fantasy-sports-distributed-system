import React, { useState } from 'react';
import { useAuthStore } from '../store';
import { Button, Card, Input, Badge } from '../components/UI';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';

const DEMO_TEAM = {
  match_id: 'M001',
  players: [
    { player_id: 'p1', name: 'Virat Kohli', role: 'captain', multiplier: 2, points: 145 },
    { player_id: 'p2', name: 'Rohit Sharma', role: 'vice_captain', multiplier: 1.5, points: 120 },
    { player_id: 'p3', name: 'Hardik Pandya', role: 'normal', multiplier: 1, points: 85 },
    { player_id: 'p4', name: 'Jasprit Bumrah', role: 'normal', multiplier: 1, points: 62 },
  ],
  total_score: 412.5
};

export const Dashboard: React.FC = () => {
  const { username } = useAuthStore();
  const [teams] = useState([DEMO_TEAM]);
  const [selectedMatch, setSelectedMatch] = useState('M001');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back, {username}! Here's your fantasy cricket overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-2">Total Teams</p>
          <p className="text-4xl font-bold text-blue-400">{teams.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-2">Best Score</p>
          <p className="text-4xl font-bold text-purple-400">412.5</p>
        </Card>
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-2">Rank</p>
          <p className="text-4xl font-bold text-pink-400">#47</p>
        </Card>
      </div>

      {/* Teams Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-50">Your Teams</h2>
          <Button variant="primary">
            <Plus size={18} /> Create Team
          </Button>
        </div>

        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.match_id} className="border-slate-600 hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-50">Match {team.match_id}</h3>
                  <p className="text-slate-400 text-sm">{team.players.length} Players Selected</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-1">Total Score</p>
                  <p className="text-3xl font-bold text-green-400">{team.total_score}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {team.players.map((player) => (
                  <div key={player.player_id} className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-50">{player.name}</span>
                      <Badge variant={player.role === 'captain' ? 'danger' : player.role === 'vice_captain' ? 'warning' : 'default'}>
                        {player.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400">
                      <p>Points: <span className="text-slate-100">{player.points}</span></p>
                      <p>Multiplier: <span className="text-yellow-400">{player.multiplier}x</span></p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Edit2 size={16} /> Edit Team
                </Button>
                <Button variant="secondary" size="sm">
                  <Trophy size={16} /> View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
