
import { useEffect } from 'react';
import Header from '@/components/Header';
import EntryForm from '@/components/EntryForm';
import { handleScrollAnimation } from '@/utils/animations';
import { ClipboardList, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Entry = () => {
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
            <div className="bg-agri-blue-light rounded-full p-2">
              <ClipboardList className="h-6 w-6 text-agri-blue-dark" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-agri-neutral-900">
              Crop Data Entry
            </h1>
          </div>
          <p className="text-agri-neutral-600 max-w-2xl">
            Record your crop details, expenses, and expected yields to track profitability and make better farming decisions.
          </p>
        </div>
      </section>
      
      {/* Entry Form Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto animate-on-scroll">
          <EntryForm />
        </div>
      </section>
      
      {/* Tips Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-agri-neutral-100">
        <div className="container mx-auto py-12">
          <h2 className="text-xl font-semibold text-agri-neutral-900 mb-6 animate-on-scroll">
            Tips for Accurate Record Keeping
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
            {[
              {
                title: 'Track All Expenses',
                description: 'Include all costs such as seeds, fertilizers, labor, equipment, and other miscellaneous expenses.'
              },
              {
                title: 'Regular Updates',
                description: 'Update your records regularly, preferably weekly, to maintain accuracy and catch any issues early.'
              },
              {
                title: 'Be Realistic',
                description: 'Use realistic estimates for yields and prices based on historical data and current market trends.'
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-agri-neutral-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-agri-neutral-600">{tip.description}</p>
              </div>
            ))}
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

export default Entry;
