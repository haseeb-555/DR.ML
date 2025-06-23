
import { useState } from 'react';
import { Heart, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const HeartDisease = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    return emptyFields.length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all fields before prediction",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call - Replace with actual ML model integration
    setTimeout(() => {
      const predictions = ['Negative', 'Positive'];
      const randomResult = predictions[Math.floor(Math.random() * predictions.length)];
      const randomConfidence = Math.floor(Math.random() * 20) + 75; // 75-94% confidence
      
      setResult(randomResult);
      setConfidence(randomConfidence);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Heart Disease Risk: ${randomResult} (${randomConfidence}% confidence)`,
      });
    }, 3000);
  };

  const formFields = [
    { key: 'age', label: 'Age', type: 'number', placeholder: 'Enter age in years' },
    { key: 'trestbps', label: 'Resting Blood Pressure', type: 'number', placeholder: 'mm Hg' },
    { key: 'chol', label: 'Serum Cholesterol', type: 'number', placeholder: 'mg/dl' },
    { key: 'thalach', label: 'Maximum Heart Rate', type: 'number', placeholder: 'Beats per minute' },
    { key: 'oldpeak', label: 'ST Depression', type: 'number', placeholder: 'Exercise induced', step: '0.1' }
  ];

  const selectFields = [
    {
      key: 'sex',
      label: 'Gender',
      options: [
        { value: '0', label: 'Male' },
        { value: '1', label: 'Female' }
      ]
    },
    {
      key: 'cp',
      label: 'Chest Pain Type',
      options: [
        { value: '0', label: 'Typical Angina' },
        { value: '1', label: 'Atypical Angina' },
        { value: '2', label: 'Non-anginal Pain' },
        { value: '3', label: 'Asymptomatic' }
      ]
    },
    {
      key: 'fbs',
      label: 'Fasting Blood Sugar > 120 mg/dl',
      options: [
        { value: '0', label: 'False' },
        { value: '1', label: 'True' }
      ]
    },
    {
      key: 'restecg',
      label: 'Resting ECG Results',
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'ST-T Abnormality' },
        { value: '2', label: 'Left Ventricular Hypertrophy' }
      ]
    },
    {
      key: 'exang',
      label: 'Exercise Induced Angina',
      options: [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes' }
      ]
    },
    {
      key: 'slope',
      label: 'Slope of Peak Exercise ST Segment',
      options: [
        { value: '0', label: 'Upsloping' },
        { value: '1', label: 'Flat' },
        { value: '2', label: 'Downsloping' }
      ]
    },
    {
      key: 'ca',
      label: 'Major Vessels (0-4)',
      options: [
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
      ]
    },
    {
      key: 'thal',
      label: 'Thallium Stress Test',
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'Fixed Defect' },
        { value: '2', label: 'Reversible Defect' },
        { value: '3', label: 'Unknown' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
              <Heart className="w-10 h-10 text-white animate-heartbeat" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Heart Disease Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your cardiovascular health parameters to assess heart disease risk using our machine learning model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <span>Health Parameters</span>
                </CardTitle>
                <CardDescription>
                  Fill in your cardiovascular health information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Number Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.placeholder}
                        step={field.step}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Select Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Select
                        value={formData[field.key as keyof typeof formData]}
                        onValueChange={(value) => handleInputChange(field.key, value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Risk Factors...</span>
                    </div>
                  ) : (
                    'Predict Heart Disease Risk'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                  <span>Risk Assessment</span>
                </CardTitle>
                <CardDescription>
                  Heart disease prediction results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${
                      result === 'Positive' 
                        ? 'bg-red-50 border-2 border-red-200' 
                        : 'bg-green-50 border-2 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Risk Status:</h3>
                        <Badge className={
                          result === 'Positive' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }>
                          {result === 'Positive' ? 'High Risk' : 'Low Risk'}
                        </Badge>
                      </div>
                      <p className={`text-xl font-bold ${
                        result === 'Positive' ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {result === 'Positive' ? 'Heart Disease Detected' : 'No Heart Disease Detected'}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-semibold">{confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-pink-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This prediction is for screening only. Consult a cardiologist for proper diagnosis and treatment.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-50" />
                    <p>Complete the form to see your heart disease risk assessment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartDisease;
