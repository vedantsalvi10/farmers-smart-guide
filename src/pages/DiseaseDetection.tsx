import { useEffect } from 'react';
import Header from '@/components/Header';
import DiseaseDetectionSection from '@/components/DiseaseDetectionSection';
import DiseaseDetectionList from '@/components/DiseaseDetectionList';
import { handleScrollAnimation } from '@/utils/animations';
import { Microscope, ChevronLeft, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

const DiseaseDetection = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const cleanupAnimation = handleScrollAnimation();
    return () => cleanupAnimation();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      {/* Page Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="flex items-center text-sm text-agri-neutral-600 hover:text-agri-green-dark transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-amber-100 rounded-full p-2">
              <Microscope className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-agri-neutral-900">
              Crop Disease Detection
            </h1>
          </div>
          <p className="text-agri-neutral-600 max-w-2xl">
            Upload images of your crops to quickly identify potential diseases and get treatment recommendations.
          </p>
        </div>
      </section>
      
      {/* Disease Detection Main Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto animate-on-scroll">
          <div className="max-w-2xl mx-auto">
            <DiseaseDetectionSection />
          </div>
        </div>
      </section>
      
      {/* Disease Detection History Section */}
      {currentUser && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="container mx-auto animate-on-scroll">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <History className="h-5 w-5 text-agri-blue" />
                <h2 className="text-xl font-semibold text-agri-neutral-900">
                  Your Detection History
                </h2>
              </div>
              <DiseaseDetectionList />
            </div>
          </div>
        </section>
      )}
      
      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-agri-neutral-100">
        <div className="container mx-auto py-12">
          <h2 className="text-xl font-semibold text-agri-neutral-900 mb-8 text-center animate-on-scroll">
            How Disease Detection Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-on-scroll">
            {[
              {
                step: 1,
                title: 'Upload Image',
                description: 'Take a clear photo of the affected plant part and upload it to our system.'
              },
              {
                step: 2,
                title: 'AI Analysis',
                description: 'Our AI model analyzes the image to identify diseases based on visual patterns.'
              },
              {
                step: 3,
                title: 'Get Recommendations',
                description: 'Receive diagnosis and recommended treatments specific to the detected issue.'
              }
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm relative">
                <div className="absolute -top-3 -left-3 bg-agri-green-dark text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium text-agri-neutral-900 mt-2 mb-3">{item.title}</h3>
                <p className="text-sm text-agri-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tips for Better Results */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto">
          <h2 className="text-xl font-semibold text-agri-neutral-900 mb-6 animate-on-scroll">
            Tips for Better Results
          </h2>
          
          <div className="bg-white border border-agri-neutral-200 rounded-xl p-6 shadow-sm animate-on-scroll">
            <ul className="space-y-4">
              {[
                'Take close-up photos of affected areas like leaves, stems, or fruits.',
                'Ensure good lighting to capture accurate colors and details.',
                'Include both healthy and affected parts for comparison.',
                'Take multiple images from different angles if needed.',
                'Avoid shadows or reflections that might obscure symptoms.'
              ].map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-agri-green-light text-agri-green-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-agri-neutral-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-agri-neutral-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-lg font-semibold text-agri-neutral-900">AgriCare</span>
              <span className="ml-2 text-xs text-agri-neutral-500 bg-agri-neutral-100 px-2 py-1 rounded">Beta</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-agri-neutral-500">© 2023 AgriCare. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiseaseDetection;
