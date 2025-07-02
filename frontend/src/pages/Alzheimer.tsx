import { useState } from 'react';
import axios from 'axios';
import { Brain, Upload, AlertCircle, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Alzheimer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  // Patient information fields (separate from model input)
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    hospitalName: '',
    familyHistory: '',
    currentMedications: '',
    cognitiveSymptoms: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseHabits: '',
    educationLevel: '',
    livingArrangement: ''
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setResult(null);
        setConfidence(null);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPG, PNG, etc.)',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePatientInfoChange = (field: string, value: string) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload an MRI scan image first',
        variant: 'destructive',
      });
      return;
    }

    // Validate patient information
    if (!patientInfo.patientName || !patientInfo.age || !patientInfo.gender || !patientInfo.hospitalName) {
      toast({
        title: 'Incomplete patient information',
        description: 'Please fill in all required patient details',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      
      // Model input data (the image file)
      formData.append('file', selectedFile);
      
      // Additional patient information (separate from model input)
      formData.append('additional_info', JSON.stringify(patientInfo));

      const response = await axios.post('http://127.0.0.1:8000/upload-mri', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const { prediction: predictedResult, confidence: predictedConfidence } = response.data;

      setResult(predictedResult);
      setConfidence(predictedConfidence);

      toast({
        title: 'Analysis Complete',
        description: `Prediction: ${predictedResult} (${predictedConfidence}% confidence)`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (result: string) => {
    if (result.includes('No Dementia')) return 'text-green-600 bg-green-50';
    if (result.includes('Very Mild')) return 'text-yellow-600 bg-yellow-50';
    if (result.includes('Mild')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alzheimer Disease Prediction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an MRI brain scan to analyze and predict Alzheimer's disease progression using our advanced AI model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Information & Upload Section */}
          <div className="space-y-6">
            {/* Patient Information Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Enter comprehensive patient details for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient's full name"
                      value={patientInfo.patientName}
                      onChange={(e) => handlePatientInfoChange('patientName', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age in years"
                      value={patientInfo.age}
                      onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={patientInfo.gender}
                      onValueChange={(value) => handlePatientInfoChange('gender', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Name of the hospital"
                      value={patientInfo.hospitalName}
                      onChange={(e) => handlePatientInfoChange('hospitalName', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyHistory">Family History</Label>
                    <Select
                      value={patientInfo.familyHistory}
                      onValueChange={(value) => handlePatientInfoChange('familyHistory', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Family history of dementia?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No family history</SelectItem>
                        <SelectItem value="parents">Parents</SelectItem>
                        <SelectItem value="siblings">Siblings</SelectItem>
                        <SelectItem value="grandparents">Grandparents</SelectItem>
                        <SelectItem value="multiple">Multiple relatives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select
                      value={patientInfo.educationLevel}
                      onValueChange={(value) => handlePatientInfoChange('educationLevel', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Highest education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary</SelectItem>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                        <SelectItem value="graduate">Graduate Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Input
                      id="currentMedications"
                      placeholder="List current medications (especially neurological)"
                      value={patientInfo.currentMedications}
                      onChange={(e) => handlePatientInfoChange('currentMedications', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cognitiveSymptoms">Cognitive Symptoms</Label>
                    <Input
                      id="cognitiveSymptoms"
                      placeholder="Describe observed symptoms (e.g., memory loss, confusion, disorientation)"
                      value={patientInfo.cognitiveSymptoms}
                      onChange={(e) => handlePatientInfoChange('cognitiveSymptoms', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select
                      value={patientInfo.smokingStatus}
                      onValueChange={(value) => handlePatientInfoChange('smokingStatus', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                    <Select
                      value={patientInfo.alcoholConsumption}
                      onValueChange={(value) => handlePatientInfoChange('alcoholConsumption', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Alcohol consumption frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exerciseHabits">Exercise Habits</Label>
                    <Select
                      value={patientInfo.exerciseHabits}
                      onValueChange={(value) => handlePatientInfoChange('exerciseHabits', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Physical activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light activity</SelectItem>
                        <SelectItem value="moderate">Moderate activity</SelectItem>
                        <SelectItem value="vigorous">Vigorous activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="livingArrangement">Living Arrangement</Label>
                    <Select
                      value={patientInfo.livingArrangement}
                      onValueChange={(value) => handlePatientInfoChange('livingArrangement', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Current living situation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alone">Lives alone</SelectItem>
                        <SelectItem value="family">Lives with family</SelectItem>
                        <SelectItem value="assisted">Assisted living</SelectItem>
                        <SelectItem value="nursing">Nursing home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span>Upload MRI Scan</span>
                </CardTitle>
                <CardDescription>
                  Select a brain MRI image for Alzheimer's analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="mri-upload"
                  />
                  <label htmlFor="mri-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload MRI scan</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, DICOM formats</p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">{selectedFile.name}</span>
                  </div>
                )}

                <Button
                  onClick={handlePredict}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing MRI Scan...</span>
                    </div>
                  ) : (
                    'Predict Alzheimer Stage'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered Alzheimer's disease prediction results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${getSeverityColor(result)}`}>
                    <h3 className="font-semibold text-lg mb-2">Prediction Result:</h3>
                    <p className="text-xl font-bold">{result}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence Level:</span>
                      <span className="font-semibold">{confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This prediction is for screening purposes only. Please consult with a neurologist or medical professional for proper diagnosis and treatment planning.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
                  <p>Complete patient information and upload an MRI scan to see prediction results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding Alzheimer's Stages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  stage: 'No Dementia',
                  description: 'Normal cognitive function with no signs of dementia',
                  color: 'border-green-200 bg-green-50'
                },
                {
                  stage: 'Very Mild Dementia',
                  description: 'Slight cognitive decline that may be noticed by close family',
                  color: 'border-yellow-200 bg-yellow-50'
                },
                {
                  stage: 'Mild Dementia',
                  description: 'Noticeable memory and cognitive problems affecting daily activities',
                  color: 'border-orange-200 bg-orange-50'
                },
                {
                  stage: 'Moderate Dementia',
                  description: 'Significant cognitive decline requiring assistance with daily tasks',
                  color: 'border-red-200 bg-red-50'
                }
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${item.color}`}>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.stage}</h4>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alzheimer;


