import { useState } from 'react';
import { Droplets, AlertCircle, TrendingUp } from 'lucide-react';
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
      const response = await axios.post(
        'http://127.0.0.1:8000/predict-kidney',
        formData,
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

  const numericFields = [
    { key: 'age', label: 'Age' },
    { key: 'blood_pressure', label: 'Blood Pressure' },
    { key: 'specific_gravity', label: 'Specific Gravity', step: '0.001' },
    { key: 'blood_glucose_random', label: 'Random Blood Glucose' },
    { key: 'blood_urea', label: 'Blood Urea' },
    { key: 'serum_creatinine', label: 'Serum Creatinine', step: '0.1' },
    { key: 'sodium', label: 'Sodium' },
    { key: 'potassium', label: 'Potassium', step: '0.1' },
    { key: 'haemoglobin', label: 'Hemoglobin', step: '0.1' },
    { key: 'packed_cell_volume', label: 'Packed Cell Volume' },
    { key: 'white_blood_cell_count', label: 'WBC Count' },
    { key: 'red_blood_cell_count', label: 'RBC Count', step: '0.1' }
  ];

  const selectFields = [
    { key: 'albumin', label: 'Albumin', options: ['0', '1', '2', '3', '4'] },
    { key: 'sugar', label: 'Sugar', options: ['0', '1', '2', '3', '4'] },
    { key: 'red_blood_cells', label: 'Red Blood Cells', options: ['normal', 'abnormal'] },
    { key: 'pus_cell', label: 'Pus Cell', options: ['normal', 'abnormal'] },
    { key: 'pus_cell_clumps', label: 'Pus Cell Clumps', options: ['present', 'notpresent'] },
    { key: 'bacteria', label: 'Bacteria', options: ['present', 'notpresent'] },
    { key: 'hypertension', label: 'Hypertension', options: ['yes', 'no'] },
    { key: 'diabetes_mellitus', label: 'Diabetes Mellitus', options: ['yes', 'no'] },
    { key: 'coronary_artery_disease', label: 'Coronary Artery Disease', options: ['yes', 'no'] },
    { key: 'appetite', label: 'Appetite', options: ['good', 'poor'] },
    { key: 'peda_edema', label: 'Pedal Edema', options: ['yes', 'no'] },
    { key: 'aanemia', label: 'Anemia', options: ['yes', 'no'] }
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <Droplets className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Kidney Disease Predictor</h1>
          <p className="text-gray-600">Enter your health parameters to predict CKD risk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Fill all values accurately for best prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {numericFields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type="number"
                        placeholder={field.label}
                        step={field.step}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectFields.map((field) => (
                    <div key={field.key}>
                      <Label>{field.label}</Label>
                      <Select
                        value={formData[field.key as keyof typeof formData]}
                        onValueChange={(value) => handleInputChange(field.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Button onClick={handlePredict} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? 'Analyzing...' : 'Predict CKD Risk'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${result === 'CKD' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <Badge
                          variant="outline"
                          className={result === 'CKD' ? 'text-red-700' : 'text-green-700'}
                        >
                          {result}
                        </Badge>
                      </div>
                      <p className={`font-bold text-xl ${result === 'CKD' ? 'text-red-700' : 'text-green-700'}`}>
                        {result === 'CKD' ? 'CKD Detected' : 'Normal Kidney Function'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 rounded bg-green-600"
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm font-semibold">{confidence}%</p>
                    </div>
                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        For clinical use, consult a nephrologist. This is for educational purposes only.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    Fill the form and click predict to see results
                  </p>
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
