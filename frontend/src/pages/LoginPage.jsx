import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // API call here
      console.log('Login attempt:', { email, password });
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-homoeo-gradient flex items-center justify-center p-4">
      {/* Animated background circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-homoeo-sky opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-homoeo-royal opacity-20 rounded-full blur-3xl animate-pulse" />
      
      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 animate-slideUp">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-homoeo-gradient rounded-xl mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-homoeo-dark">Homoeo Intel</h1>
          <p className="text-homoeo-text-light mt-2">AI-Powered Clinical Wisdom</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-homoeo-dark mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@homoeo-intel.com"
              className="w-full px-4 py-2 border-2 border-homoeo-border rounded-lg focus:border-homoeo-royal focus:outline-none focus:ring-2 focus:ring-homoeo-sky focus:ring-opacity-50 transition-smooth"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-homoeo-dark mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-homoeo-border rounded-lg focus:border-homoeo-royal focus:outline-none focus:ring-2 focus:ring-homoeo-sky focus:ring-opacity-50 transition-smooth"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-homoeo-royal rounded" />
              <span className="text-sm text-homoeo-text-light">Remember me</span>
            </label>
            <a href="#" className="text-sm text-homoeo-royal hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-homoeo-border text-center text-sm text-homoeo-text-light">
          Contact admin to create your account
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;