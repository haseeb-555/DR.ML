import { Heart, Brain, Droplets, Shield, Zap, Users, Award, Target, Eye, Lightbulb, Stethoscope, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const diseases = [
    {
      name: 'Alzheimer Disease',
      description: 'Early detection through advanced MRI analysis',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-600',
      accuracy: '94.2%'
    },
    {
      name: 'Brain Tumor',
      description: 'Precise tumor classification from brain scans',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      accuracy: '96.8%'
    },
    {
      name: 'Heart Disease',
      description: 'Comprehensive cardiovascular risk assessment',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      accuracy: '92.7%'
    },
    {
      name: 'Chronic Kidney Disease',
      description: 'Early detection of kidney function decline',
      icon: Droplets,
      gradient: 'from-emerald-500 to-teal-600',
      accuracy: '91.5%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Medical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 opacity-5">
          <Stethoscope className="w-full h-full text-blue-600" />
        </div>
        <div className="absolute bottom-20 left-10 w-80 h-80 opacity-5">
          <Activity className="w-full h-full text-teal-600" />
        </div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-8 py-4 mb-8 shadow-lg">
              <Award className="w-6 h-6 text-blue-600 mr-3" />
              <span className="text-blue-600 font-bold text-lg">About DR.ML</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                AI-Powered Medical
              </span>
              <br />
              <span className="text-gray-800">Diagnostics</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We develop cutting-edge machine learning models for early disease detection, 
              helping healthcare professionals make faster and more accurate diagnoses.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description: 'To make advanced medical AI accessible to healthcare providers worldwide, enabling early disease detection and saving lives.',
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: Eye,
                title: 'Our Vision',
                description: 'A world where AI assists every medical diagnosis, providing accurate predictions and improving patient outcomes globally.',
                gradient: 'from-purple-500 to-pink-600'
              },
              {
                icon: Lightbulb,
                title: 'Our Values',
                description: 'Innovation, accuracy, and accessibility. We believe in responsible AI that empowers medical professionals.',
                gradient: 'from-pink-500 to-red-600'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-xl text-center bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base md:text-lg leading-relaxed px-4">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disease Models */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Our AI Models</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Four specialized models trained on thousands of medical cases for accurate disease prediction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {diseases.map((disease, index) => {
              const Icon = disease.icon;
              
              return (
                <Card key={disease.name} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${disease.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                          {disease.name}
                        </CardTitle>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block shadow-lg">
                          {disease.accuracy} Accuracy
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 text-lg md:text-xl leading-relaxed px-4">
                      {disease.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Why Choose DR.ML?</h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Built with cutting-edge technology and validated by medical experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Lightning Fast',
                description: 'Get results in seconds. Our AI processes your data instantly with unmatched speed.',
                icon: Zap,
                gradient: 'from-yellow-400 via-orange-500 to-red-500'
              },
              {
                title: 'Secure & Private',
                description: 'Your medical data is encrypted and never shared. Complete privacy guaranteed.',
                icon: Shield,
                gradient: 'from-green-400 via-emerald-500 to-teal-500'
              },
              {
                title: 'Doctor Validated',
                description: 'Every model is trained and validated by certified medical professionals worldwide.',
                icon: Users,
                gradient: 'from-blue-400 via-purple-500 to-pink-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center group">
                  <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-sm mx-auto">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="relative py-20 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-8 border-yellow-500 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-800 mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-4" />
                Important Medical Disclaimer
              </h3>
              <p className="text-yellow-700 leading-relaxed text-lg md:text-xl">
                DR.ML is designed to assist healthcare professionals with medical screening and early detection. 
                Our AI predictions are supplementary tools and should never replace professional medical advice, 
                diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;

