import React, { useEffect, useState } from 'react';
import { Pi as Pie } from 'lucide-react';
import Testimonial from '../components/testimonial/Testimonial';
import ImpactCounter from '../components/impact/ImpactCounter';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ImpactPage: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title = 'Our Impact - EduHope India';
  }, []);

  const [activeTab, setActiveTab] = useState('stories');

  const renderStories = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 staggered-children">
      <Testimonial
        name="Rahul"
        age={8}
        image="https://images.pexels.com/photos/3070333/pexels-photo-3070333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="I used to beg on the streets with my family. Now I go to school every day and can read books. I want to be a teacher when I grow up."
      />
      <Testimonial
        name="Priya"
        age={10}
        image="https://images.pexels.com/photos/14075587/pexels-photo-14075587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="My parents couldn't afford school. Now I'm top of my class in mathematics and science. I dream of becoming a doctor to help others."
      />
      <Testimonial
        name="Ajay"
        age={10}
        image="https://images.pexels.com/photos/29807278/pexels-photo-29807278/free-photo-of-young-boy-in-a-field-portrait-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="The support helped my entire family. My parents now have stable jobs, and I can focus on my education instead of working. I'm learning computer skills."
      />
      <Testimonial
        name="Meena"
        age={9}
        image="https://images.pexels.com/photos/14049052/pexels-photo-14049052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="I used to be afraid of going to school because other kids would make fun of my clothes. Now I have a uniform and books like everyone else."
      />
      <Testimonial
        name="Vikram"
        age={14}
        image="https://images.pexels.com/photos/13566214/pexels-photo-13566214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="I've been in the program for three years. I'm now helping younger kids with their homework. I want to study engineering in the future."
      />
      <Testimonial
        name="Ananya"
        age={11}
        image="https://images.pexels.com/photos/28939325/pexels-photo-28939325/free-photo-of-street-portrait-of-a-child-in-ludhiana-market.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        story="I love the art classes the most. I've never had colors and paper before. Now I can express myself through drawing and painting."
      />
    </div>
  );

  const renderStats = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <ImpactCounter
          icon={<Pie className="w-10 h-10 text-primary" />}
          count={5000}
          label="Children Supported"
        />
        <ImpactCounter
          icon={<Pie className="w-10 h-10 text-primary" />}
          count={28}
          label="Schools Built"
        />
        <ImpactCounter
          icon={<Pie className="w-10 h-10 text-primary" />}
          count={12000}
          label="Meals Provided"
        />
        <ImpactCounter
          icon={<Pie className="w-10 h-10 text-primary" />}
          count={85}
          label="Success Rate"
          suffix="%"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Program Breakdown</h3>
        <div className="space-y-4">
          {[
            {
              label: 'Education Programs',
              percentage: 45,
              color: 'bg-primary',
            },
            {
              label: 'Nutrition & Health',
              percentage: 25,
              color: 'bg-secondary',
            },
            { label: 'Family Support', 
              percentage: 20, 
              color: 'bg-accent' 
            },
            { label: 'Administration', 
              percentage: 10, 
              color: 'bg-gray-500' 
            },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{item.label}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${item.color} h-2.5 rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Annual Growth</h3>
        <div className="h-80 flex items-end space-x-4">
          {[
            { year: 2020, value: 15 },
            { year: 2021, value: 30 },
            { year: 2022, value: 55 },
            { year: 2023, value: 75 },
            { year: 2024, value: 90 },
          ].map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div className="w-full bg-gray-200 rounded-t-lg h-full flex items-end justify-center relative overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value * 3}px` }} // Convert % to pixels (scale factor = 3 for 90 = 270px)
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="w-full bg-blue-500"
                >
                  <motion.span
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs text-blue-700 font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.6 }}
                  >
                    {item.value}%
                  </motion.span>
                </motion.div>
              </div>
              <div className="text-sm mt-2">{item.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <p className="text-gray-600 mb-8">
        Transparency is core to our mission. Below are our annual impact reports
        that detail our programs, successes, and financial allocation.
      </p>

      {[
        { year: 2023, title: 'Annual Impact Report 2023', pages: 42 },
        { year: 2022, title: 'Annual Impact Report 2022', pages: 38 },
        { year: 2021, title: 'Annual Impact Report 2021', pages: 35 },
        { year: 2020, title: 'Annual Impact Report 2020', pages: 30 },
      ].map((report, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-lg">{report.title}</h3>
            <p className="text-gray-600">{report.pages} pages</p>
          </div>
          <a
            href="#"
            className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
          >
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-light to-blue-400 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl mb-8">
              See how your generous support is transforming lives across India,
              creating lasting change for homeless children and their families.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex border-b border-gray-200 mb-10">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'stories'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('stories')}
            >
              Success Stories
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'stats'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Impact Statistics
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'reports'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Annual Reports
            </button>
          </div>

          {activeTab === 'stories' && renderStories()}
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/18012456/pexels-photo-18012456/free-photo-of-children-sitting-in-a-classroom-with-desks-and-chairs.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Teachers and students in classroom"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Measuring Our Success</h2>
              <p className="text-gray-600 mb-4">
                We measure success not just in numbers, but in transformed
                lives. Our comprehensive approach ensures that we track both
                immediate impact and long-term outcomes.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  'Educational Achievement - We track academic progress, attendance, and graduation rates',
                  'Health & Wellbeing - We monitor nutrition, health metrics, and overall wellbeing',
                  'Family Stability - We assess housing stability, employment rates, and financial independence',
                  'Future Success - We follow up with program graduates to measure long-term outcomes',
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600">
                Every child deserves not just to survive, but to thrive. Our
                programs are continuously evaluated and improved to maximize
                impact and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of Our Story</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us in creating lasting change. Your support today contributes
            to a brighter tomorrow for countless children.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/donate"
              className="btn bg-white text-secondary hover:bg-gray-100"
            >
              Donate Now
            </Link>
            <a
              href="/volunteer"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary"
            >
              Volunteer With Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImpactPage;
