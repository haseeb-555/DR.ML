import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Droplets, ArrowRight, Stethoscope, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);

  const diseases = [
    {
      name: 'Alzheimer Disease',
      description: 'Early detection through MRI scan analysis',
      icon: Brain,
      path: '/alzheimer',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Brain Tumor',
      description: 'Classify tumor types from brain scans',
      icon: Brain,
      path: '/brain', 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Heart Disease',
      description: 'Predict cardiovascular risks using medical reports',
      icon: Heart,
      path: '/heart',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Kidney Disease',
      description: 'Chronic kidney disease assessment',
      icon: Droplets,
      path: '/kidney',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-medical-blue to-medical-purple rounded-full flex items-center justify-center shadow-2xl">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-medical-red rounded-full flex items-center justify-center animate-pulse-soft">
                  <Heart className="w-4 h-4 text-white animate-heartbeat" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-medical-blue via-medical-purple to-medical-red bg-clip-text text-transparent">
                DR.ML
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced Medical AI Platform for Disease Prediction and Early Detection
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Harness the power of machine learning to predict and analyze four critical medical conditions: 
              Alzheimer's, Brain Tumors, Heart Disease, and Kidney Disease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-medical-blue to-medical-purple hover:from-medical-blue/90 hover:to-medical-purple/90 text-white px-8 py-3 text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white">
                Learn More
              </Button>
            </div>
          </div>

          {/* Floating Animation Elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <Activity className={`w-16 h-16 text-medical-blue ${currentAnimation === 0 ? 'animate-bounce' : ''}`} />
          </div>
          <div className="absolute top-40 right-20 opacity-20">
            <Heart className={`w-12 h-12 text-medical-red ${currentAnimation === 1 ? 'animate-heartbeat' : ''}`} />
          </div>
          <div className="absolute bottom-20 left-20 opacity-20">
            <Brain className={`w-14 h-14 text-medical-purple ${currentAnimation === 2 ? 'animate-pulse-soft' : ''}`} />
          </div>
        </div>
      </section>

      {/* Disease Prediction Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Medical Predictions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our specialized prediction models to analyze your medical data and get instant insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diseases.map((disease, index) => {
              const Icon = disease.icon;
              return (
                <Card 
                  key={disease.name} 
                  className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg ${disease.bgColor} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${disease.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {disease.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 text-base">
                      {disease.description}
                    </CardDescription>
                    <Link to={disease.path}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${disease.color} hover:shadow-lg transition-all duration-300 text-white`}
                      >
                        Start Prediction
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose DR.ML?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise to provide accurate, fast, and reliable predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Advanced AI Models',
                description: 'State-of-the-art machine learning algorithms trained on extensive medical datasets',
                icon: '🧠'
              },
              {
                title: 'Instant Results',
                description: 'Get immediate predictions and insights within seconds of data submission',
                icon: '⚡'
              },
              {
                title: 'Secure & Private',
                description: 'Your medical data is encrypted and securely stored with complete privacy protection',
                icon: '🔒'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
