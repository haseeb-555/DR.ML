import { Heart, Brain, Droplets, Shield, Zap, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const diseases = [
    {
      name: 'Alzheimer Disease',
      description: 'Progressive neurodegenerative disorder that affects memory, thinking, and behavior. Early detection is crucial for better management and treatment planning.',
      symptoms: ['Memory loss', 'Confusion', 'Difficulty with familiar tasks', 'Changes in mood or personality'],
      icon: Brain,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Brain Tumor',
      description: 'Abnormal growth of cells within the brain. Our AI can classify different tumor types including glioma, meningioma, and pituitary tumors.',
      symptoms: ['Headaches', 'Seizures', 'Vision problems', 'Cognitive changes'],
      icon: Brain,
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Heart Disease',
      description: 'Cardiovascular conditions that affect heart function. Early prediction helps prevent heart attacks and other serious complications.',
      symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Irregular heartbeat'],
      icon: Heart,
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'Chronic Kidney Disease',
      description: 'Gradual loss of kidney function over time. Early detection allows for interventions to slow progression and prevent complications.',
      symptoms: ['Fatigue', 'Swelling', 'Changes in urination', 'High blood pressure'],
      icon: Droplets,
      color: 'from-green-500 to-teal-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your medical data is encrypted and never shared with third parties.'
    },
    {
      icon: Zap,
      title: 'Fast & Accurate',
      description: 'Get instant predictions with high accuracy using advanced AI models.'
    },
    {
      icon: Users,
      title: 'Doctor Approved',
      description: 'Developed with medical professionals and validated on clinical data.'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-8 py-4 mb-8 shadow-lg">
              
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

        {/* Mission Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We believe that early detection saves lives. By combining cutting-edge artificial intelligence with medical expertise, 
                we're democratizing access to advanced diagnostic tools that were once only available in specialized medical centers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-medical-blue" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Diseases Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Conditions We Analyze</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI models are specifically trained to detect and predict four critical medical conditions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {diseases.map((disease, index) => {
              const Icon = disease.icon;
              return (
                <Card key={disease.name} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${disease.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {disease.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base mb-6 leading-relaxed">
                      {disease.description}
                    </CardDescription>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Common Symptoms:</h4>
                      <ul className="space-y-2">
                        {disease.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-medical-blue rounded-full mr-3"></div>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How DR.ML Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures you get accurate predictions quickly and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Select Condition',
                description: 'Choose the medical condition you want to analyze from our four specialized models.'
              },
              {
                step: '02', 
                title: 'Input Data',
                description: 'Provide the required medical data, either by uploading images or filling out health parameters.'
              },
              {
                step: '03',
                title: 'AI Analysis',
                description: 'Our trained machine learning models analyze your data using advanced algorithms.'
              },
              {
                step: '04',
                title: 'Get Results',
                description: 'Receive instant predictions with confidence scores and recommended next steps.'
              }
            ].map((step, index) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-medical-blue to-medical-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-medical-blue to-medical-purple opacity-30 -translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Important Medical Disclaimer
              </h3>
              <p className="text-yellow-700 leading-relaxed">
                DR.ML is designed to assist with medical screening and early detection. However, our predictions should not replace professional medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare professionals before making any medical decisions based on our results.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
