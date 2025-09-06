'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Webcam from 'react-webcam';

interface VisualAPIResponse {
  risk_label: string;
  confidence_score: number;
}

export default function VisualScreening() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisualAPIResponse | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      handleAnalysis(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalysis = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', blob, 'conjunctiva.jpg');

      const response = await fetch(process.env.NEXT_PUBLIC_VISUAL_API_URL!, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VisualAPIResponse = await response.json();
      console.log('Visual API Response:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraError('Unable to access camera. Please ensure camera permissions are granted and try again.');
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
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
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                <strong>Medical Disclaimer:</strong> This visual screening tool is for preliminary assessment only and not a substitute for professional medical advice. Consult a healthcare provider for diagnosis.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Anemia Screening</h1>
            <p className="text-gray-600">Camera-based conjunctiva analysis</p>
          </div>

          {/* Instructions */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Pull down your lower eyelid gently to expose the inner conjunctiva
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Look up while keeping the eyelid pulled down
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensure good lighting and center your eye in the frame
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Hold steady and click "Capture Image" when ready
              </li>
            </ul>
          </div>

          {/* Camera Section */}
          {!capturedImage && (
            <div className="mb-8">
              {cameraError ? (
                <div className="p-8 bg-red-50 border-2 border-dashed border-red-300 rounded-lg text-center">
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-700 font-medium">{cameraError}</p>
                  <button 
                    onClick={() => setCameraError(null)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg shadow-lg"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    onUserMediaError={handleUserMediaError}
                  />
                  
                  {/* Overlay Guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-32 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                      <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                        Center eye here
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {!cameraError && (
                <div className="text-center mt-6">
                  <button
                    onClick={capture}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && !result && !isLoading && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Captured Image:</h3>
              <img src={capturedImage} alt="Captured conjunctiva" className="w-full rounded-lg shadow-lg mb-4" />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={retakePhoto}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Retake Photo
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg text-gray-700">Analyzing image...</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">Error: {error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Results</h3>
              
              {capturedImage && (
                <div className="mb-6">
                  <img src={capturedImage} alt="Analyzed conjunctiva" className="w-32 h-24 object-cover rounded-lg mx-auto" />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Risk Level:</span>
                  <span className={`text-lg font-bold ${
                    result.risk_label.toLowerCase().includes('high') ? 'text-red-600' : 
                    result.risk_label.toLowerCase().includes('medium') ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {result.risk_label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Confidence Score:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {(result.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Additional context based on result */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Remember:</strong> This is a preliminary screening tool only. 
                  Please consult with a healthcare professional for proper diagnosis and treatment, 
                  especially if high risk is indicated.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={retakePhoto}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Take Another Photo
                </button>
                <Link
                  href="/cbc-test"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Try CBC Analysis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
