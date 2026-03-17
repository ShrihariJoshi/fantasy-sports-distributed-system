import React, { useState } from 'react';
import { Button, Card, Badge } from '../components/UI';
import { TrendingUp, Trophy, Medal } from 'lucide-react';

const DEMO_LEADERBOARD = [
  { rank: 1, username: 'CricketMaster', score: 512.5, teams: 3, badge: 'Champion' },
  { rank: 2, username: 'FantasyKing', score: 498.2, teams: 2, badge: 'Elite' },
  { rank: 3, username: 'BowlerStrike', score: 487.8, teams: 4, badge: 'Master' },
  { rank: 4, username: 'BattingAce', score: 465.3, teams: 2, badge: 'Expert' },
  { rank: 5, username: 'YourselfUser', score: 412.5, teams: 1, badge: 'Pro' },
  { rank: 6, username: 'MatchWinner', score: 398.7, teams: 3, badge: 'Advanced' },
  { rank: 7, username: 'SixHitter', score: 385.2, teams: 2, badge: 'Intermediate' },
  { rank: 8, username: 'RunChaser', score: 372.1, teams: 1, badge: 'Intermediate' },
  { rank: 9, username: 'BowlMaster', score: 361.0, teams: 2, badge: 'Beginner' },
  { rank: 10, username: 'FieldingPro', score: 349.8, teams: 1, badge: 'Beginner' },
];

export const Leaderboard: React.FC = () => {
  const [leaderboard] = useState(DEMO_LEADERBOARD);
  const [filter, setFilter] = useState('overall');

  const rankVariant = (rank: number) => {
    if (rank === 1) return 'danger';
    if (rank === 2) return 'warning';
    return 'default';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Leaderboard</h1>
        <p className="text-slate-400">Compete with players worldwide and climb the ranks</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        {['overall', 'weekly', 'monthly'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Username</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Teams</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Badge</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                    entry.rank <= 3 ? 'bg-slate-800/50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {entry.rank === 1 && <Trophy size={20} className="text-yellow-500" />}
                      {entry.rank === 2 && <Medal size={20} className="text-slate-300" />}
                      {entry.rank === 3 && <Medal size={20} className="text-orange-600" />}
                      <span className="font-bold text-slate-50 text-lg">#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-50">{entry.username}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="font-bold text-slate-50">{entry.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{entry.teams} Teams</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={entry.badge === 'Champion' ? 'danger' : 'success'}>
                      {entry.badge}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="secondary" size="sm">
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Your Position Highlight */}
      <Card className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Your Current Rank</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-blue-400">#5</p>
              <div>
                <p className="text-slate-50 font-semibold">YourselfUser</p>
                <p className="text-slate-400 text-sm">412.5 Points • 1 Team</p>
              </div>
            </div>
          </div>
          <Button>Your Profile</Button>
        </div>
      </Card>
    </div>
  );
};
