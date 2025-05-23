import React, { useEffect } from 'react';
import { Users, BookOpen, Utensils, Home, Award } from 'lucide-react';
import DonationCard from '../components/donation/DonationCard';

const DonationPage: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title = 'Donate - EduHope India';
  }, []);

  const impactItems = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      amount: "₹500",
      description: "Provides school supplies for one child for a month"
    },
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      amount: "₹1,000",
      description: "Feeds a child nutritious meals for a month"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      amount: "₹2,500",
      description: "Supports a teacher's salary for a week"
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      amount: "₹5,000",
      description: "Helps a family with housing assistance for a month"
    }
  ];

  return (
    <>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Make a Difference Today</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your donation helps provide education, nutrition, and support to homeless children across India. Every contribution, no matter the size, creates lasting impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Impact</h2>
              
              <div className="space-y-6 mb-8">
                {impactItems.map((item, index) => (
                  <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.amount}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Donation Certificate</h3>
                    <p className="text-sm text-gray-600">
                      All donors receive a digital certificate that can be used for tax deduction purposes under Section 80G.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <DonationCard />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Is my donation tax-deductible?",
                  answer: "Yes, all donations to EduHope India are eligible for tax deduction under Section 80G of the Income Tax Act in India."
                },
                {
                  question: "How is my donation used?",
                  answer: "Your donation directly supports educational programs, nutrition, healthcare, and family support services for homeless children in India. We ensure at least 85% of all donations go directly to our programs."
                },
                {
                  question: "Can I make a recurring donation?",
                  answer: "Yes, you can set up monthly, quarterly, or annual recurring donations through our platform. This helps us plan and sustain our programs over time."
                },
                {
                  question: "Will I receive updates about how my donation is being used?",
                  answer: "Yes, all donors receive quarterly impact reports and stories about the children and families benefiting from our programs."
                },
                {
                  question: "Can I donate items instead of money?",
                  answer: "While financial contributions are most effective, we do accept in-kind donations such as books, school supplies, and clothing. Please contact us directly to arrange this."
                }
              ].map((faq, index) => (
                <details 
                  key={index} 
                  className="border rounded-lg p-4 group"
                >
                  <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Corporate Partnerships</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We partner with businesses committed to social responsibility. Contact us to discuss how your organization can make a significant impact.
          </p>
          <a href="mailto:partnerships@eduhopeindia.org" className="btn bg-white text-primary hover:bg-gray-100">
            Partner With Us
          </a>
        </div>
      </section>
    </>
  );
};

export default DonationPage;