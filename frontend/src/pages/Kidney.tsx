
import { useState } from 'react';
import { Droplets, AlertCircle, TrendingUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const KidneyDisease = () => {
  // Model features in exact order as trained
  const [formData, setFormData] = useState({
    age: '',
    blood_pressure: '',
    specific_gravity: '',
    albumin: '',
    sugar: '',
    red_blood_cells: '',
    pus_cell: '',
    pus_cell_clumps: '',
    bacteria: '',
    blood_glucose_random: '',
    blood_urea: '',
    serum_creatinine: '',
    sodium: '',
    potassium: '',
    haemoglobin: '',
    packed_cell_volume: '',
    white_blood_cell_count: '',
    red_blood_cell_count: '',
    hypertension: '',
    diabetes_mellitus: '',
    coronary_artery_disease: '',
    appetite: '',
    peda_edema: '',
    aanemia: ''
  });

  // Enhanced patient information fields
  const [additionalInfo, setAdditionalInfo] = useState({
    patientName: '',
    hospitalName: '',
    familyHistory: '',
    symptoms: '',
    medications: '',
    duration: '',
    smokingStatus: '',
    alcoholConsumption: '',
    dietaryHabits: '',
    fluidIntake: '',
    exerciseHabits: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
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
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );
    return emptyFields.length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) {
      toast({
        title: 'Incomplete form',
        description: 'Please fill in all fields before prediction',
        variant: 'destructive'
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Unauthorized',
        description: 'Please log in to use this feature',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Send model features and additional info separately
      const payload = {
        input_data: formData,
        additional_info: additionalInfo
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/predict-kidney',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { result, confidence } = response.data;
      setResult(result);
      setConfidence(confidence);

      toast({
        title: 'Prediction Complete',
        description: `CKD Status: ${result} (${confidence}% confidence)`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error?.response?.data?.detail ||
          'Failed to connect or unauthorized request',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Model features in exact order - numeric fields
  const numericFields = [
    { key: 'age', label: 'Age of Patient', placeholder: 'Age of patient' },
    { key: 'blood_pressure', label: 'Blood Pressure', placeholder: 'BP in mm Hg' },
    { key: 'specific_gravity', label: 'Specific Gravity', placeholder: 'Urine specific gravity', step: '0.001' },
    { key: 'blood_glucose_random', label: 'Blood Glucose Random', placeholder: 'Random glucose level' },
    { key: 'blood_urea', label: 'Blood Urea', placeholder: 'Urea level' },
    { key: 'serum_creatinine', label: 'Serum Creatinine', placeholder: 'Creatinine level', step: '0.1' },
    { key: 'sodium', label: 'Sodium', placeholder: 'Sodium level' },
    { key: 'potassium', label: 'Potassium', placeholder: 'Potassium level', step: '0.1' },
    { key: 'haemoglobin', label: 'Haemoglobin', placeholder: 'Hemoglobin level', step: '0.1' },
    { key: 'packed_cell_volume', label: 'Packed Cell Volume', placeholder: 'Volume %' },
    { key: 'white_blood_cell_count', label: 'White Blood Cell Count', placeholder: 'Count' },
    { key: 'red_blood_cell_count', label: 'Red Blood Cell Count', placeholder: 'Count', step: '0.1' }
  ];

  // Model features in exact order - select fields
  const selectFields = [
    {
      key: 'albumin',
      label: 'Albumin (Protein in Urine)',
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'Level 1' },
        { value: '2', label: 'Level 2' },
        { value: '3', label: 'Level 3' },
        { value: '4', label: 'Level 4' }
      ]
    },
    {
      key: 'sugar',
      label: 'Sugar (Urine Sugar Level)',
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'Level 1' },
        { value: '2', label: 'Level 2' },
        { value: '3', label: 'Level 3' },
        { value: '4', label: 'Level 4' }
      ]
    },
    {
      key: 'red_blood_cells',
      label: 'Red Blood Cells',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'abnormal', label: 'Abnormal' }
      ]
    },
    {
      key: 'pus_cell',
      label: 'Pus Cell',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'abnormal', label: 'Abnormal' }
      ]
    },
    {
      key: 'pus_cell_clumps',
      label: 'Pus Cell Clumps',
      options: [
        { value: 'present', label: 'Present' },
        { value: 'notpresent', label: 'Not Present' }
      ]
    },
    {
      key: 'bacteria',
      label: 'Bacteria',
      options: [
        { value: 'present', label: 'Present' },
        { value: 'notpresent', label: 'Not Present' }
      ]
    },
    {
      key: 'hypertension',
      label: 'Hypertension',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      key: 'diabetes_mellitus',
      label: 'Diabetes Mellitus',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      key: 'coronary_artery_disease',
      label: 'Coronary Artery Disease',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      key: 'appetite',
      label: 'Appetite',
      options: [
        { value: 'good', label: 'Good' },
        { value: 'poor', label: 'Poor' }
      ]
    },
    {
      key: 'peda_edema',
      label: 'Pedal Edema',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      key: 'aanemia',
      label: 'Anemia',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
              <Droplets className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kidney Disease Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter comprehensive health parameters to assess chronic kidney disease risk using our advanced machine learning model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Patient Information Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Enter comprehensive patient details and lifestyle information for kidney health assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient's full name"
                      value={additionalInfo.patientName}
                      onChange={(e) => handleAdditionalInfoChange('patientName', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Name of the hospital"
                      value={additionalInfo.hospitalName}
                      onChange={(e) => handleAdditionalInfoChange('hospitalName', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyHistory">Family History</Label>
                    <Select
                      value={additionalInfo.familyHistory}
                      onValueChange={(value) => handleAdditionalInfoChange('familyHistory', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Family history of kidney disease?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No family history</SelectItem>
                        <SelectItem value="parents">Parents</SelectItem>
                        <SelectItem value="siblings">Siblings</SelectItem>
                        <SelectItem value="multiple">Multiple relatives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration of Symptoms</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 2 months, 1 year"
                      value={additionalInfo.duration}
                      onChange={(e) => handleAdditionalInfoChange('duration', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select
                      value={additionalInfo.smokingStatus}
                      onValueChange={(value) => handleAdditionalInfoChange('smokingStatus', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
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
                      value={additionalInfo.alcoholConsumption}
                      onValueChange={(value) => handleAdditionalInfoChange('alcoholConsumption', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
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
                    <Label htmlFor="dietaryHabits">Dietary Habits</Label>
                    <Select
                      value={additionalInfo.dietaryHabits}
                      onValueChange={(value) => handleAdditionalInfoChange('dietaryHabits', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Overall diet quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (high sodium/processed)</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="good">Good (balanced diet)</SelectItem>
                        <SelectItem value="excellent">Excellent (kidney-friendly)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fluidIntake">Daily Fluid Intake</Label>
                    <Select
                      value={additionalInfo.fluidIntake}
                      onValueChange={(value) => handleAdditionalInfoChange('fluidIntake', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Average daily fluid intake" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (&lt;1L/day)</SelectItem>
                        <SelectItem value="normal">Normal (1-2L/day)</SelectItem>
                        <SelectItem value="high">High (2-3L/day)</SelectItem>
                        <SelectItem value="excessive">Excessive (&gt;3L/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exerciseHabits">Exercise Habits</Label>
                    <Select
                      value={additionalInfo.exerciseHabits}
                      onValueChange={(value) => handleAdditionalInfoChange('exerciseHabits', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Input
                      id="symptoms"
                      placeholder="Describe symptoms (e.g., swelling, fatigue, frequent urination)"
                      value={additionalInfo.symptoms}
                      onChange={(e) => handleAdditionalInfoChange('symptoms', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input
                      id="medications"
                      placeholder="List current medications"
                      value={additionalInfo.medications}
                      onChange={(e) => handleAdditionalInfoChange('medications', e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Assessment Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-green-600" />
                  <span>Comprehensive Health Assessment</span>
                </CardTitle>
                <CardDescription>
                  Please fill in all health parameters for accurate kidney disease prediction (in exact model order)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Numeric Fields */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Values & Vital Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {numericFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          placeholder={field.placeholder}
                          step={field.step}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Fields */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Findings & Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">{field.label}</Label>
                        <Select
                          value={formData[field.key as keyof typeof formData]}
                          onValueChange={(value) => handleInputChange(field.key, value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select" />
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
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Kidney Function...</span>
                    </div>
                  ) : (
                    'Predict CKD Risk'
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
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <span>CKD Assessment</span>
                </CardTitle>
                <CardDescription>
                  Chronic kidney disease prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${
                      result === 'CKD' 
                        ? 'bg-red-50 border-2 border-red-200' 
                        : 'bg-green-50 border-2 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Status:</h3>
                        <Badge className={
                          result === 'CKD' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }>
                          {result === 'CKD' ? 'CKD Risk' : 'Normal'}
                        </Badge>
                      </div>
                      <p className={`text-lg font-bold ${
                        result === 'CKD' ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {result}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-semibold">{confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This prediction is for screening purposes only. Please consult a nephrologist for proper diagnosis and treatment.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Complete all fields to see your CKD risk assessment</p>
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

export default KidneyDisease;



