'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CBCFormData {
  Gender: string;
  Hemoglobin: number | '';
  MCV: number | '';
  MCH: number | '';
  MCHC: number | '';
}

interface APIResponse {
  label: string;
  prediction_class: number;
  confidence_scores: {
    anemic_probability: number;
    non_anemic_probability: number;
  };
}

export default function CBCAnalyzer() {
  const [formData, setFormData] = useState<CBCFormData>({
    Gender: '',
    Hemoglobin: '',
    MCV: '',
    MCH: '',
    MCHC: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<APIResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Gender' ? value : value === '' ? '' : parseFloat(value)
    }));
  };

  const validateForm = (): boolean => {
    return (
      formData.Gender !== '' &&
      formData.Hemoglobin !== '' &&
      formData.MCV !== '' &&
      formData.MCH !== '' &&
      formData.MCHC !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CBC_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Gender: formData.Gender,
          Hemoglobin: formData.Hemoglobin,
          MCH: formData.MCH,
          MCHC: formData.MCHC,
          MCV: formData.MCV,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      console.log('API Response:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Medical Disclaimer */}
        <div className="mb-8 p-4 bg-yellow-900 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-200 text-sm">{error}</p>
              <p className="text-sm text-yellow-200 font-medium">
                <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and not a substitute for professional medical advice. Consult a healthcare provider for diagnosis.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">CBC Analyzer</h1>
            <p className="text-gray-300">Complete Blood Count Analysis Tool</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Gender
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="gender-male"
                    name="Gender"
                    type="radio"
                    value="Male"
                    checked={formData.Gender === 'Male'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    required
                  />
                  <label htmlFor="gender-male" className="ml-3 block text-sm font-medium text-gray-300">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="gender-female"
                    name="Gender"
                    type="radio"
                    value="Female"
                    checked={formData.Gender === 'Female'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    required
                  />
                  <label htmlFor="gender-female" className="ml-3 block text-sm font-medium text-gray-300">
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Hemoglobin */}
            <div>
              <label htmlFor="Hemoglobin" className="block text-sm font-medium text-gray-300 mb-2">
                Hemoglobin (Hgb) - g/dL
              </label>
              <input
                type="number"
                id="Hemoglobin"
                name="Hemoglobin"
                value={formData.Hemoglobin}
                onChange={handleInputChange}
                min="5.0"
                max="20.0"
                step="0.1"
                placeholder="e.g., 12.5"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Range: 5.0 - 20.0 g/dL</p>
            </div>

            {/* MCV */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mean Corpuscular Volume (MCV) - fL
              </label>
              <input
                type="number"
                id="MCV"
                name="MCV"
                value={formData.MCV}
                onChange={handleInputChange}
                min="60"
                max="120"
                step="0.1"
                placeholder="e.g., 85.0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Range: 60 - 120 fL</p>
            </div>

            {/* MCH */}
            <div>
              <label htmlFor="MCH" className="block text-sm font-medium text-gray-300 mb-2">
                Mean Corpuscular Hemoglobin (MCH) - pg
              </label>
              <input
                type="number"
                id="MCH"
                name="MCH"
                value={formData.MCH}
                onChange={handleInputChange}
                min="20"
                max="40"
                step="0.1"
                placeholder="e.g., 28.0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Range: 20 - 40 pg</p>
            </div>

            {/* MCHC */}
            <div>
              <label htmlFor="MCHC" className="block text-sm font-medium text-gray-300 mb-2">
                Mean Corpuscular Hemoglobin Concentration (MCHC) - g/dL
              </label>
              <input
                type="number"
                id="MCHC"
                name="MCHC"
                value={formData.MCHC}
                onChange={handleInputChange}
                min="30"
                max="40"
                step="0.1"
                placeholder="e.g., 34.0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Range: 30 - 40 g/dL</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !validateForm()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                'Analyze CBC Results'
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900 border border-red-700 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Prediction:</span>
                  <span className={`text-lg font-bold ${
                    result.label === 'Anemic' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {result.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Anemic Probability:</span>
                  <span className="text-lg font-semibold text-white">
                    {(result.confidence_scores.anemic_probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Additional context based on result */}
              <div className="mb-6 p-4 bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Remember:</strong> These results are for screening purposes only. 
                  Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      Gender: '',
                      Hemoglobin: '',
                      MCV: '',
                      MCH: '',
                      MCHC: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Test Again
                </button>
                <Link 
                  href="/visual-test"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  Try Visual Screening
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
