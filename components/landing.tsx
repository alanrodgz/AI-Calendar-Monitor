"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, Clock, Target, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to Motion AI!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Scheduling",
      description: "Let artificial intelligence optimize your calendar based on your goals and priorities."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal-Driven Planning",
      description: "Set meaningful goals and watch AI automatically break them down into actionable tasks."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Time Blocking",
      description: "Intelligent time allocation that adapts to your productivity patterns and energy levels."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Optimization",
      description: "Real-time schedule adjustments as your priorities change throughout the day."
    }
  ];

  const benefits = [
    "Increase productivity by up to 40%",
    "Reduce decision fatigue with automated planning",
    "Never miss important deadlines again",
    "Focus on high-impact work automatically",
    "Achieve work-life balance effortlessly"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Motion AI</h1>
          </div>
          <Button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-800 text-sm font-medium">AI-Powered Calendar Revolution</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI Assistant for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Productivity</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop juggling tasks manually. Motion AI intelligently schedules your day, 
            breaks down your goals, and adapts to changes in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg group disabled:opacity-50"
            >
              {isSigningIn ? "Signing In..." : "Get Started Free"}
              {!isSigningIn && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
            <p className="text-sm text-gray-500">No credit card required • 30-day free trial</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Why Motion AI Changes Everything
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the future of productivity with AI that understands your goals, 
            learns your patterns, and optimizes your schedule automatically.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Transform Your Productivity Today
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Calendar className="w-16 h-16 text-white mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-4">Ready to Get Started?</h4>
                <Button 
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 disabled:opacity-50"
                >
                  {isSigningIn ? "Signing In..." : "Start Your Free Trial"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500">
            © 2025 Motion AI. Intelligent scheduling for productive people.
          </p>
        </div>
      </footer>
    </div>
  );
}