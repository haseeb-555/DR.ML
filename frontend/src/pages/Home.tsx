import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Brain, Droplets, ArrowRight, Stethoscope, Activity, Shield, Zap, Users, Star, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const diseases = [
    {
      name: 'Alzheimer Disease',
      description: 'Early detection through advanced MRI analysis',
      icon: Brain,
      path: '/alzheimer',
      gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      bgPattern: 'bg-indigo-50',
      accuracy: '94.2%'
    },
    {
      name: 'Brain Tumor',
      description: 'Precise tumor classification from brain scans',
      icon: Brain,
      path: '/brain', 
      gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
      bgPattern: 'bg-purple-50',
      accuracy: '96.8%'
    },
    {
      name: 'Heart Disease',
      description: 'Comprehensive cardiovascular risk assessment',
      icon: Heart,
      path: '/heart',
      gradient: 'bg-gradient-to-br from-rose-500 via-red-500 to-pink-500',
      bgPattern: 'bg-rose-50',
      accuracy: '92.7%'
    },
    {
      name: 'Kidney Disease',
      description: 'Chronic kidney disease early detection',
      icon: Droplets,
      path: '/kidney',
      gradient: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
      bgPattern: 'bg-emerald-50',
      accuracy: '91.5%'
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Neurologist, City Hospital",
      content: "DR.ML has revolutionized our early detection process. The accuracy is remarkable.",
      rating: 5
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Cardiologist, Heart Center",
      content: "This platform saves us hours of analysis time while providing incredibly reliable results.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Radiologist, Medical Institute",
      content: "The brain tumor detection feature has become an essential tool in our diagnostic workflow.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleStartAnalysis = () => {
    if (!user) {
      navigate('/auth');
    }
  };

  const handleDiseaseSelection = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Medical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 opacity-5">
          <Stethoscope className="w-full h-full text-blue-600" />
        </div>
        <div className="absolute bottom-20 left-10 w-80 h-80 opacity-5">
          <Activity className="w-full h-full text-teal-600" />
        </div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                AI Powered Healthcare
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold">
              We care for you and
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                your health.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Our registered medical care is among a healthy society through 
              AI-powered medical care services to people of all ages.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-full shadow-lg">
                      Start Analysis
                      <ChevronDown className="ml-2 w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2">
                    {diseases.map((disease) => {
                      const Icon = disease.icon;
                      return (
                        <DropdownMenuItem
                          key={disease.name}
                          onClick={() => handleDiseaseSelection(disease.path)}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg ${disease.gradient} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{disease.name}</div>
                            <div className="text-sm text-gray-500">{disease.accuracy} accuracy</div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleStartAnalysis}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-full shadow-lg"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
              
              <Link to="/about">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Medical Cards with Stethoscope */}
          <div className="relative">
            {/* Decorative Stethoscope around the cards */}
            <div className="absolute -inset-8 opacity-20 pointer-events-none">
              <svg 
                viewBox="0 0 400 500" 
                className="w-full h-full text-blue-600"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path 
                  d="M120 50 Q80 80 80 120 Q80 160 120 190 Q160 220 200 220 Q240 220 280 190 Q320 160 320 120 Q320 80 280 50"
                  className="animate-pulse"
                />
                <path 
                  d="M120 50 Q60 20 60 80 Q60 140 100 170 Q140 200 180 200"
                  className="animate-pulse"
                />
                <path 
                  d="M280 50 Q340 20 340 80 Q340 140 300 170 Q260 200 220 200"
                  className="animate-pulse"
                />
                
                <circle cx="60" cy="80" r="8" fill="currentColor" className="opacity-60" />
                <circle cx="340" cy="80" r="8" fill="currentColor" className="opacity-60" />
                
                <circle cx="200" cy="420" r="25" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-80" />
                <circle cx="200" cy="420" r="15" fill="currentColor" className="opacity-40" />
                
                <path 
                  d="M200 220 Q200 280 200 395"
                  strokeWidth="6"
                  className="opacity-60"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 gap-6 relative z-10">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Departments</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Neurology</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cardiology</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nephrology</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white border-0 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">AI Accuracy</h3>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">94.5%</div>
                  <div className="text-blue-100">Average prediction accuracy</div>
                  <div className="text-sm text-blue-100">50,000+ analyses completed</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our AI-Powered Services</h2>
            <p className="text-xl text-gray-600">Advanced medical prediction models for early detection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diseases.map((disease, index) => {
              const Icon = disease.icon;
              return (
                <Card key={disease.name} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${disease.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {disease.name}
                    </CardTitle>
                    <div className="inline-flex items-center bg-green-100 rounded-full px-3 py-1">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600 text-sm font-semibold">{disease.accuracy}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 text-base">
                      {disease.description}
                    </CardDescription>
                    <Link to={disease.path}>
                      <Button className={`w-full ${disease.gradient} hover:shadow-lg transition-all duration-300 text-white rounded-full`}>
                        Analyze Now
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

      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Appointment',
                description: 'Get instant AI-powered medical predictions without waiting for appointments.',
                time: '24/7 Available'
              },
              {
                icon: Users,
                title: 'Doctors',
                description: 'Our AI models are trained and validated by certified medical professionals.',
                time: '200+ Partners'
              },
              {
                icon: Activity,
                title: 'Emergency',
                description: 'Quick analysis for urgent medical screening and early detection needs.',
                time: 'Instant Results'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="bg-slate-800 text-white border-0 shadow-xl rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                  <div className="text-blue-400 font-semibold">{item.time}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">What Medical Professionals Say</h2>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl text-gray-800 mb-8 italic">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div className="font-semibold text-gray-900 text-lg mb-2">
              {testimonials[currentTestimonial].name}
            </div>
            <div className="text-gray-600">
              {testimonials[currentTestimonial].role}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;

