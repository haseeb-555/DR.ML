
import { useState } from 'react';
import axios from 'axios';
import { Heart, Activity, AlertCircle, TrendingUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

  // Enhanced additional fields for comprehensive LLM summary
  const [additionalInfo, setAdditionalInfo] = useState({
    patientName: '',
    hospitalName: '',
    familyHistoryHeartDisease: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseHabits: '',
    dietaryHabits: '',
    stressLevels: '',
    currentMedications: '',
    chronicConditions: '',
    occupationalFactors: ''
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

  const handleAdditionalInfoChange = (field: string, value: string) => {
    setAdditionalInfo(prev => ({
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

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Not Authenticated",
        description: "Please login to make a prediction",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Combine both form data and additional info for the request
      const combinedData = {
        ...formData,
        ...additionalInfo
      };

      const response = await axios.post("http://127.0.0.1:8000/predict-heart", combinedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const { result, confidence } = response.data;

      setResult(result);
      setConfidence(confidence);

      toast({
        title: "Analysis Complete",
        description: `Heart Disease Risk: ${result} (${confidence}% confidence)`,
      });
    } catch (error: any) {
      toast({
        title: "Prediction Failed",
        description: error?.response?.data?.detail || "An error occurred during prediction",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formFields = [
    { key: 'age', label: 'Age', type: 'number', placeholder: 'Enter age in years' },
    { key: 'trestbps', label: 'Resting Blood Pressure', type: 'number', placeholder: 'mm Hg' },
    { key: 'chol', label: 'Serum Cholesterol', type: 'number', placeholder: 'mg/dl' },
    { key: 'thalach', label: 'Maximum Heart Rate', type: 'number', placeholder: 'BPM' },
    { key: 'oldpeak', label: 'ST Depression', type: 'number', placeholder: '0.0', step: '0.1' },
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Heart Disease Predictor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your cardiovascular health parameters to assess heart disease risk using our machine learning model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Patient Information Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-red-600" />
                  <span>Comprehensive Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Provide detailed patient information for comprehensive cardiovascular risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient's full name"
                        value={additionalInfo.patientName}
                        onChange={(e) => handleAdditionalInfoChange('patientName', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital Name</Label>
                      <Input
                        id="hospitalName"
                        placeholder="Name of the hospital"
                        value={additionalInfo.hospitalName}
                        onChange={(e) => handleAdditionalInfoChange('hospitalName', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical History & Risk Factors */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Medical History & Risk Factors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="familyHistoryHeartDisease">Family History of Heart Disease</Label>
                      <Select
                        value={additionalInfo.familyHistoryHeartDisease}
                        onValueChange={(value) => handleAdditionalInfoChange('familyHistoryHeartDisease', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Family history of heart disease?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No family history</SelectItem>
                          <SelectItem value="parents">Parents</SelectItem>
                          <SelectItem value="siblings">Siblings</SelectItem>
                          <SelectItem value="grandparents">Grandparents</SelectItem>
                          <SelectItem value="multiple">Multiple relatives</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smokingStatus">Smoking Status</Label>
                      <Select
                        value={additionalInfo.smokingStatus}
                        onValueChange={(value) => handleAdditionalInfoChange('smokingStatus', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select smoking status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never smoked</SelectItem>
                          <SelectItem value="former">Former smoker</SelectItem>
                          <SelectItem value="current">Current smoker</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                      <Select
                        value={additionalInfo.alcoholConsumption}
                        onValueChange={(value) => handleAdditionalInfoChange('alcoholConsumption', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No alcohol consumption</SelectItem>
                          <SelectItem value="light">Light (1-2 drinks/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (>7 drinks/week)</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exerciseHabits">Exercise Habits</Label>
                      <Select
                        value={additionalInfo.exerciseHabits}
                        onValueChange={(value) => handleAdditionalInfoChange('exerciseHabits', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select exercise habits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary lifestyle</SelectItem>
                          <SelectItem value="light">Light exercise (1-2 times/week)</SelectItem>
                          <SelectItem value="moderate">Moderate exercise (3-4 times/week)</SelectItem>
                          <SelectItem value="active">Very active (5+ times/week)</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stressLevels">Stress Levels</Label>
                      <Select
                        value={additionalInfo.stressLevels}
                        onValueChange={(value) => handleAdditionalInfoChange('stressLevels', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select stress levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low stress</SelectItem>
                          <SelectItem value="moderate">Moderate stress</SelectItem>
                          <SelectItem value="high">High stress</SelectItem>
                          <SelectItem value="severe">Severe stress</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupationalFactors">Occupational Factors</Label>
                      <Input
                        id="occupationalFactors"
                        placeholder="e.g., Sedentary work, Physical labor, High stress job"
                        value={additionalInfo.occupationalFactors}
                        onChange={(e) => handleAdditionalInfoChange('occupationalFactors', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle & Additional Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Lifestyle & Additional Information</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dietaryHabits">Dietary Habits</Label>
                      <Textarea
                        id="dietaryHabits"
                        placeholder="Describe dietary patterns (e.g., Mediterranean diet, high sodium, low fiber, etc.)"
                        value={additionalInfo.dietaryHabits}
                        onChange={(e) => handleAdditionalInfoChange('dietaryHabits', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chronicConditions">Other Chronic Conditions</Label>
                      <Textarea
                        id="chronicConditions"
                        placeholder="List any chronic conditions (e.g., diabetes, hypertension, obesity, etc.)"
                        value={additionalInfo.chronicConditions}
                        onChange={(e) => handleAdditionalInfoChange('chronicConditions', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">Current Medications</Label>
                      <Textarea
                        id="currentMedications"
                        placeholder="List current medications including dosages (especially heart-related medications)"
                        value={additionalInfo.currentMedications}
                        onChange={(e) => handleAdditionalInfoChange('currentMedications', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Parameters Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <span>Cardiovascular Health Parameters</span>
                </CardTitle>
                <CardDescription>Fill in your cardiovascular health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                <CardDescription>Heart disease prediction results</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${
                      result === 'Positive' ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Risk Status:</h3>
                        <Badge className={
                          result === 'Positive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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


