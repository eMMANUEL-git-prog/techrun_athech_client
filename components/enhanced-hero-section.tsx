import React, { useState, useEffect } from 'react';
import { Activity, Shield, Zap, TrendingUp } from 'lucide-react';

const EnhancedHeroSection = () => {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Simulated auth state - replace with your actual auth
  const isAuthenticated = false;
  
  const images = [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80'
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Activity, text: 'Real-time Biomechanics', delay: '0ms' },
    { icon: Shield, text: 'AI Injury Prevention', delay: '100ms' },
    { icon: Zap, text: 'Live Risk Alerts', delay: '200ms' },
    { icon: TrendingUp, text: 'Performance Insights', delay: '300ms' }
  ];

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
      {/* Animated background slideshow */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ 
          backgroundImage: `url(${images[index]})`,
          animation: 'subtle-zoom 20s ease-in-out infinite'
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.2)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 py-20 max-w-6xl mx-auto">
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <Zap className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-400">AI-Powered Biomechanics Platform</span>
        </div>

        {/* Main headline */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Prevent Injuries
          <br />
          <span className="text-green-500">
            Before They Happen
          </span>
        </h1>

        {/* Subheadline */}
        <p 
          className={`text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Smart insole sensors + AI analytics = Real-time injury risk prediction.
          <br />
          <span className="text-green-400 font-medium">Keep your athletes safe, strong, and performing at their peak.</span>
        </p>

        {/* Feature pills */}
        <div 
          className={`flex flex-wrap items-center justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-green-500/20 backdrop-blur-sm hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: feature.delay }}
            >
              <feature.icon className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-200">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        {!isAuthenticated && (
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <a
              href="/signup"
              className="group relative px-8 py-4 bg-green-500 text-black rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:bg-green-400 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Start Free Trial</span>
            </a>

            <a
              href="/login"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              Sign In
            </a>

            <a
              href="#demo"
              className="flex items-center gap-2 px-6 py-4 text-gray-300 hover:text-green-400 transition-colors duration-300"
            >
              <span className="text-sm font-medium">Watch Demo</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>
        )}

        {/* Stats bar */}
        <div 
          className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {[
            { value: '94%', label: 'Prediction Accuracy', color: 'green' },
            { value: '50%', label: 'Injury Reduction', color: 'green' },
            { value: '<100ms', label: 'Response Time', color: 'green' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4 rounded-xl bg-white/5 border border-green-500/20 backdrop-blur-sm hover:bg-green-500/5 hover:border-green-500/30 transition-all duration-300">
              <div className={`text-3xl font-bold text-${stat.color}-500 mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-green-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.6;
          }
        }
        
        @keyframes subtle-zoom {
          0%, 100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedHeroSection;