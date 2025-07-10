
import { useState } from 'react';
import axios from 'axios';
import { Brain, Upload, AlertCircle, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const BrainTumor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  // Enhanced patient information fields for comprehensive LLM summary
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    hospitalName: '',
    familyHistoryBrainTumor: '',
    currentMedications: '',
    neurologicalSymptoms: '',
    smokingStatus: '',
    alcoholConsumption: '',
    occupationalExposure: '',
    previousCancerHistory: '',
    radiationExposure: ''
  });

  const tumorTypes = {
    'No Tumor': {
      description: 'No tumor detected in the brain scan',
      color: 'bg-green-100 text-green-800',
      severity: 'Normal'
    },
    'Glioma': {
      description: 'A type of tumor that occurs in the brain and spinal cord',
      color: 'bg-red-100 text-red-800',
      severity: 'High Risk'
    },
    'Meningioma': {
      description: 'Tumor that arises from the meninges surrounding the brain',
      color: 'bg-orange-100 text-orange-800',
      severity: 'Medium Risk'
    },
    'Pituitary': {
      description: 'Tumor in the pituitary gland at the base of the brain',
      color: 'bg-blue-100 text-blue-800',
      severity: 'Low Risk'
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setResult(null);
        setConfidence(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
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
        title: "No file selected",
        description: "Please upload a brain MRI scan first",
        variant: "destructive",
      });
      return;
    }

    // Validate core patient information
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
      const token = localStorage.getItem("token");

      const formData = new FormData();
      
      // Model input data (the image file)
      formData.append("file", selectedFile);
      
      // Additional patient information (separate from model input)
      formData.append("additional_info", JSON.stringify(patientInfo));

      const response = await axios.post("http://127.0.0.1:8000/upload-brain-mri", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      const { tumor_type: predictedResult, confidence: predictedConfidence } = response.data;

      setResult(predictedResult);
      setConfidence(predictedConfidence);

      toast({
        title: "Analysis Complete",
        description: `Detected: ${predictedResult} (${predictedConfidence}% confidence)`,
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.response?.data?.detail || "Something went wrong during classification.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brain Tumor MRI Classifier
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a brain MRI scan to detect and classify tumor types using our advanced deep learning model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Information & Upload Section */}
          <div className="space-y-6">
            {/* Enhanced Patient Information Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <span>Comprehensive Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Provide detailed patient information for comprehensive analysis and personalized insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient's full name"
                        value={patientInfo.patientName}
                        onChange={(e) => handlePatientInfoChange('patientName', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={patientInfo.gender}
                        onValueChange={(value) => handlePatientInfoChange('gender', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical History & Risk Factors */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Medical History & Risk Factors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="familyHistoryBrainTumor">Family History of Brain Tumors</Label>
                      <Select
                        value={patientInfo.familyHistoryBrainTumor}
                        onValueChange={(value) => handlePatientInfoChange('familyHistoryBrainTumor', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select family history" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No family history</SelectItem>
                          <SelectItem value="parents">Parents</SelectItem>
                          <SelectItem value="siblings">Siblings</SelectItem>
                          <SelectItem value="multiple">Multiple relatives</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousCancerHistory">Previous Cancer History</Label>
                      <Select
                        value={patientInfo.previousCancerHistory}
                        onValueChange={(value) => handlePatientInfoChange('previousCancerHistory', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select cancer history" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No previous cancer</SelectItem>
                          <SelectItem value="brain">Previous brain cancer</SelectItem>
                          <SelectItem value="other">Other cancer types</SelectItem>
                          <SelectItem value="multiple">Multiple cancers</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiationExposure">Radiation Exposure History</Label>
                      <Select
                        value={patientInfo.radiationExposure}
                        onValueChange={(value) => handlePatientInfoChange('radiationExposure', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select radiation exposure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No significant exposure</SelectItem>
                          <SelectItem value="medical">Medical radiation (CT, X-rays)</SelectItem>
                          <SelectItem value="occupational">Occupational exposure</SelectItem>
                          <SelectItem value="treatment">Previous radiation treatment</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupationalExposure">Occupational Chemical Exposure</Label>
                      <Input
                        id="occupationalExposure"
                        placeholder="e.g., Petrochemicals, Solvents, None"
                        value={patientInfo.occupationalExposure}
                        onChange={(e) => handlePatientInfoChange('occupationalExposure', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smokingStatus">Smoking Status</Label>
                      <Select
                        value={patientInfo.smokingStatus}
                        onValueChange={(value) => handlePatientInfoChange('smokingStatus', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
                        value={patientInfo.alcoholConsumption}
                        onValueChange={(value) => handlePatientInfoChange('alcoholConsumption', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No alcohol consumption</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Medications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Current Symptoms & Medications</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="neurologicalSymptoms">Neurological Symptoms</Label>
                      <Textarea
                        id="neurologicalSymptoms"
                        placeholder="Describe any headaches, seizures, vision changes, motor weakness, speech difficulties, etc."
                        value={patientInfo.neurologicalSymptoms}
                        onChange={(e) => handlePatientInfoChange('neurologicalSymptoms', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">Current Medications</Label>
                      <Textarea
                        id="currentMedications"
                        placeholder="List all current medications including dosages and supplements"
                        value={patientInfo.currentMedications}
                        onChange={(e) => handlePatientInfoChange('currentMedications', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <span>Upload Brain MRI</span>
                </CardTitle>
                <CardDescription>
                  Select a brain MRI image for tumor detection and classification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="brain-upload"
                  />
                  <label htmlFor="brain-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload brain MRI</p>
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Brain Scan...</span>
                    </div>
                  ) : (
                    'Classify Tumor Type'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-pink-600" />
                <span>Classification Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered brain tumor detection and classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-lg border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Detected Type:</h3>
                      <Badge className={tumorTypes[result as keyof typeof tumorTypes].color}>
                        {tumorTypes[result as keyof typeof tumorTypes].severity}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{result}</p>
                    <p className="text-gray-600">
                      {tumorTypes[result as keyof typeof tumorTypes].description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence Level:</span>
                      <span className="font-semibold">{confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This classification is for screening purposes only. Please consult with a radiologist or oncologist for proper diagnosis and treatment planning.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
                  <p>Complete patient information and upload a brain MRI to see classification results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Brain Tumor Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(tumorTypes).map(([type, info]) => (
                <div key={type} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{type}</h4>
                    <Badge className={info.color}>{info.severity}</Badge>
                  </div>
                  <p className="text-gray-700 text-sm">{info.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
              <p className="text-blue-800 text-sm">
                Our deep learning model analyzes MRI brain scans using convolutional neural networks trained on thousands of medical images. 
                The model identifies patterns and features that distinguish between different tumor types and normal brain tissue.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrainTumor;

