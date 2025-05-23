import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart,
  Users,
} from 'lucide-react';
import DonationCard from '../components/donation/DonationCard';
import ImpactCounter from '../components/impact/ImpactCounter';
import Testimonial from '../components/testimonial/Testimonial';

const HomePage: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title =
      'EduHope India - Empowering Homeless Children Through Education';
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <img
            //src="https://images.pexels.com/photos/8754960/pexels-photo-8754960.jpeg"
            src="https://media.istockphoto.com/id/1207168332/photo/adult-and-children-hands-holding-paper-family-cutout-family-home-foster-care-homeless-charity.webp?a=1&b=1&s=612x612&w=0&k=20&c=naLilpoWBWb-X5mC2Mi36NAZtAs9fN1ib64Xp52hHGY="
            alt="Children in classroom"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container-custom relative z-10 mt-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Empower Through{' '}
                <span className="text-secondary">Education</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg">
                Help us provide education, nutrition, and hope to homeless
                children in India. Your donation can transform a life forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/donate" className="btn btn-secondary">
                  Donate Now
                </Link>
                <Link
                  to="/impact"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-foreground"
                >
                  See Our Impact
                </Link>
              </div>
            </div>

            <div>
              <DonationCard />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              With your support, we've been able to make a real difference in
              the lives of homeless children across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 staggered-children">
            <ImpactCounter
              icon={<Users className="w-10 h-10 text-primary" />}
              count={5000}
              label="Children Supported"
            />
            <ImpactCounter
              icon={<GraduationCap className="w-10 h-10 text-primary" />}
              count={28}
              label="Schools Built"
            />
            <ImpactCounter
              icon={<Heart className="w-10 h-10 text-primary" />}
              count={12000}
              label="Meals Provided"
              suffix="+"
            />
            <ImpactCounter
              icon={<Sparkles className="w-10 h-10 text-primary" />}
              count={85}
              label="Success Rate"
              suffix="%"
            />
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our mission focuses on three key areas to create lasting change:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 staggered-children">
            {[
              {
                icon: <GraduationCap className="w-12 h-12 text-white" />,
                title: 'Education First',
                content:
                  'We provide quality education that empowers children to break the cycle of poverty.',
                color: 'bg-primary',
              },
              {
                icon: <Heart className="w-12 h-12 text-white" />,
                title: 'Nutrition & Health',
                content:
                  'We ensure children receive proper nutrition and healthcare for healthy development.',
                color: 'bg-secondary',
              },
              {
                icon: <Users className="w-12 h-12 text-white" />,
                title: 'Family Support',
                content:
                  'We help families gain financial stability for sustainable futures.',
                color: 'bg-accent',
              },
            ].map((item, index) => (
              <div key={index} className="card transition-all hover:shadow-lg">
                <div className={`${item.color} p-6 flex justify-center`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/20">
                    {item.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <Link
                    to="/about"
                    className="text-primary font-medium inline-flex items-center group"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of the children whose lives have been transformed
              through your support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 staggered-children">
            <Testimonial
              name="Rahul"
              age={8}
              image="https://images.pexels.com/photos/3070333/pexels-photo-3070333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              story="I can now read and write, and I dream of becoming a teacher to help others like me."
            />
            <Testimonial
              name="Priya"
              age={15}
              image="https://images.pexels.com/photos/14075587/pexels-photo-14075587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              story="I used to collect trash. Now I'm learning science and math. I want to be a doctor."
            />
            <Testimonial
              name="Ajay"
              age={10}
              image="https://images.pexels.com/photos/29807278/pexels-photo-29807278/free-photo-of-young-boy-in-a-field-portrait-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              story="The support helped my entire family. Now my parents have stable jobs, and I can focus on school."
            />
          </div>

          <div className="text-center mt-12">
            <Link to="/impact" className="btn btn-primary">
              See More Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of The Change</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your donation today can transform a child's future tomorrow. Every
            contribution makes a difference.
          </p>
          <Link
            to="/donate"
            className="btn bg-white text-secondary hover:bg-gray-100"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
