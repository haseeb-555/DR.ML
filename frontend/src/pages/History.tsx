import { History, Calendar, Brain, Heart, Droplets, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePredictions } from '@/hooks/usePredictions';
import { useNavigate } from 'react-router-dom';
import { log } from 'console';

const HistoryPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { data: predictions = [], isLoading, error } = usePredictions();

  // If no token, show login prompt
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-medical-blue to-medical-purple rounded-full flex items-center justify-center shadow-xl mx-auto mb-8">
            <History className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Prediction History</h1>
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              Please log in to view your prediction history and access your medical reports.
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-6 bg-gradient-to-r from-medical-blue to-medical-purple"
            onClick={() => navigate('/auth')}
          >
            Login to View History
          </Button>
        </div>
      </div>
    );
  }

  const getIconForDisease = (diseaseType: string) => {
    switch (diseaseType) {
      case 'heart_disease': return Heart;
      case 'brain_tumor':
      case 'alzheimer': return Brain;
      case 'kidney_disease': return Droplets;
      default: return FileText;
    }
  };

  const getColorForDisease = (diseaseType: string) => {
    switch (diseaseType) {
      case 'heart_disease': return 'from-red-500 to-pink-600';
      case 'brain_tumor':
      case 'alzheimer': return 'from-purple-500 to-pink-600';
      case 'kidney_disease': return 'from-green-500 to-teal-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const formatDiseaseName = (diseaseType: string) => {
    return diseaseType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusBadge = (prediction: any) => {
    const result = prediction.prediction_result?.result || 'Unknown';
    if (result.toLowerCase().includes('negative') || result.toLowerCase().includes('normal') || result.toLowerCase().includes('no')) {
      return { color: 'bg-green-100 text-green-800', text: 'Normal' };
    }
    if (result.toLowerCase().includes('mild') || result.toLowerCase().includes('low')) {
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Mild Risk' };
    }
    return { color: 'bg-red-100 text-red-800', text: 'High Risk' };
  };

  const handleExportReport = (record: any) => {
    console.log('Exporting report for:', record);
    // TODO: Add export to PDF logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-medical-blue to-medical-purple rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse">
            <History className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">Loading your prediction history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Alert className="max-w-md mx-auto bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              Failed to load prediction history. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-medical-blue to-medical-purple rounded-full flex items-center justify-center shadow-xl">
              <History className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Prediction History</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your previous medical predictions and reports
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Predictions', value: predictions.length.toString(), icon: FileText, color: 'from-blue-500 to-purple-600' },
            { label: 'This Month', value: predictions.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length.toString(), icon: Calendar, color: 'from-green-500 to-teal-600' },
            { label: 'Heart Checks', value: predictions.filter(p => p.disease_type === 'heart_disease').length.toString(), icon: Heart, color: 'from-red-500 to-pink-600' },
            { label: 'Brain Scans', value: predictions.filter(p => ['brain_tumor', 'alzheimer'].includes(p.disease_type)).length.toString(), icon: Brain, color: 'from-purple-500 to-indigo-600' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* History Records */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Predictions</CardTitle>
            <CardDescription>
              Your medical prediction history with detailed results and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {predictions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
                <p className="text-gray-600 mb-6">Start by using one of our AI-powered medical prediction tools.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={() => navigate('/heart')} variant="outline" size="sm"><Heart className="w-4 h-4 mr-2" />Heart Disease</Button>
                  <Button onClick={() => navigate('/brain')} variant="outline" size="sm"><Brain className="w-4 h-4 mr-2" />Brain Tumor</Button>
                  <Button onClick={() => navigate('/alzheimer')} variant="outline" size="sm"><Brain className="w-4 h-4 mr-2" />Alzheimer</Button>
                  <Button onClick={() => navigate('/kidney')} variant="outline" size="sm"><Droplets className="w-4 h-4 mr-2" />Kidney Disease</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {predictions.map(pred => {
                  const Icon = getIconForDisease(pred.disease_type);
                  const colorClass = getColorForDisease(pred.disease_type);
                  const statusBadge = getStatusBadge(pred);
                  return (
                    <div key={pred.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{formatDiseaseName(pred.disease_type)}</h3>
                              <Badge className={statusBadge.color}>{statusBadge.text}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{new Date(pred.created_at).toLocaleDateString()} at {new Date(pred.created_at).toLocaleTimeString()}</span></div>
                              <div><span className="font-semibold">Result:</span> {pred.prediction_result?.result || 'Processing'}</div>
                              <div><span className="font-semibold">Confidence:</span> {pred.confidence_score ? `${Math.round(pred.confidence_score)}%` : 'N/A'}</div>
                            </div>
                            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                              <span>Input Type:</span>
                              <Badge variant="outline">{pred.image_url ? 'Medical Image' : 'Health Parameters'}</Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button onClick={() => handleExportReport(pred)} variant="outline" size="sm" className="flex items-center space-x-2">
                            <Download className="w-4 h-4" /><span>Export</span>
                          </Button>
                        </div>
                      </div>
                      {pred.confidence_score && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Prediction Confidence</span>
                            <span>{Math.round(pred.confidence_score)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`bg-gradient-to-r ${colorClass} h-2 rounded-full`} style={{ width: `${pred.confidence_score}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-8 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            <strong>Medical Disclaimer:</strong> All predictions are for screening purposes only and should not replace professional medical consultation.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default HistoryPage;
