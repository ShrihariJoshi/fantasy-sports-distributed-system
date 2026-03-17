import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Button, Card } from '../components/UI';
import { Zap, Users, TrendingUp, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const features = [
    {
      icon: <Users size={32} />,
      title: 'Create Teams',
      description: 'Build your ultimate fantasy cricket team with strategic player selection',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Track Scores',
      description: 'Real-time scoring updates and performance tracking for your team',
    },
    {
      icon: <Zap size={32} />,
      title: 'Live Leaderboard',
      description: 'Compete with other players and climb the rankings in real-time',
    },
    {
      icon: <Shield size={32} />,
      title: 'Role Multipliers',
      description: 'Captain, Vice-Captain roles with strategic point multipliers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-5xl">
            🏏
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Fantasy Cricket
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Build your dream team, score points, and compete in real-time. Experience the ultimate fantasy cricket platform.
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-12">
          {isAuthenticated ? (
            <>
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/teams')}
              >
                View Teams
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-slate-50 mb-16">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="text-center hover:border-blue-500 transition-colors group">
              <div className="text-blue-400 mb-4 flex justify-center group-hover:text-purple-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center border-blue-500/50">
            <p className="text-4xl font-bold text-blue-400">10,000+</p>
            <p className="text-slate-400 mt-2">Active Players</p>
          </Card>
          <Card className="text-center border-purple-500/50">
            <p className="text-4xl font-bold text-purple-400">500+</p>
            <p className="text-slate-400 mt-2">Live Matches</p>
          </Card>
          <Card className="text-center border-pink-500/50">
            <p className="text-4xl font-bold text-pink-400">1M+</p>
            <p className="text-slate-400 mt-2">Total Points Scored</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Ready to Play?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Join thousands of players creating their fantasy teams and competing for glory.
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Your Journey
            </Button>
          </Card>
        </section>
      )}
    </div>
  );
};
