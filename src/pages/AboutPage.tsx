import React, { useEffect } from 'react';
import { Goal, Map, Users, Heart, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title = 'About Us - EduHope India';
  }, []);

  const team = [
    {
      name: 'Uttam Bansal',
      role: 'Founder & Executive Director',
      bio: 'Former educator with 2+ years experience in child welfare programs across India.',
      image:
        'https://images.pexels.com/photos/32219360/pexels-photo-32219360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Saurabh Maurya',
      role: 'Chief Operations Officer',
      bio: 'Background in non-profit management with expertise in scaling community programs.',
      image:
        'https://images.pexels.com/photos/32220652/pexels-photo-32220652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Uday Raj Singh',
      role: 'Education Program Director',
      bio: 'Educational psychologist specializing in trauma-informed teaching approaches.',
      image:
        'https://images.pexels.com/photos/32220617/pexels-photo-32220617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Sumit Kanojiya',
      role: 'Finance Director',
      bio: 'Certified accountant with extensive experience in non-profit financial management.',
      image:
        'https://images.pexels.com/photos/32220364/pexels-photo-32220364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <>
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-secondary via-secondary-light to-orange-300 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About EduHope India</h1>
            <p className="text-xl mb-8">
              Founded in 2025, we're committed to breaking the cycle of poverty
              through education, nutrition, and family support for homeless
              children across India.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                EduHope India began when our founder, Uttam Bansal, witnessed
                firsthand the struggles of homeless children in Kanpur who were
                desperate to learn but lacked access to education.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small initiative teaching 15 children under a
                tree has grown into a comprehensive program serving thousands of
                children across multiple states in India.
              </p>
              <p className="text-gray-600">
                Our approach is holistic - we address not just educational
                needs, but also nutrition, healthcare, and family stability to
                create lasting change and break the cycle of poverty.
              </p>
            </div>
            <div>
              <img
                //src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg"
                src="https://images.pexels.com/photos/20556421/pexels-photo-20556421/free-photo-of-smiling-girl-and-boys-sitting-under-walls-with-letters-at-school.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Children in classroom"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe every child deserves the opportunity to learn, grow,
              and thrive regardless of their circumstances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Goal className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To empower homeless children in India through quality education,
                proper nutrition, healthcare, and family support, enabling them
                to break the cycle of poverty and build a brighter future.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                A future where every child in India, regardless of socioeconomic
                status, has access to quality education, adequate nutrition, and
                a supportive environment to reach their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every aspect of our work and
              decision-making.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10 text-white" />,
                title: 'Compassion',
                description:
                  'We approach our work with empathy and understanding for the unique challenges faced by each child and family.',
                color: 'bg-primary',
              },
              {
                icon: <Award className="w-10 h-10 text-white" />,
                title: 'Excellence',
                description:
                  'We strive for the highest standards in our programs, ensuring quality education and support services.',
                color: 'bg-secondary',
              },
              {
                icon: <Map className="w-10 h-10 text-white" />,
                title: 'Integrity',
                description:
                  'We operate with transparency and accountability in all our actions and financial practices.',
                color: 'bg-accent',
              },
              {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                title: 'Education',
                description:
                  'We believe education is the most powerful tool for transforming lives and communities.',
                color: 'bg-primary',
              },
              {
                icon: <Heart className="w-10 h-10 text-white" />,
                title: 'Dignity',
                description:
                  'We respect the inherent worth of every individual and work to restore dignity through our services.',
                color: 'bg-secondary',
              },
              {
                icon: <Users className="w-10 h-10 text-white" />,
                title: 'Community',
                description:
                  'We engage and involve local communities as essential partners in creating sustainable change.',
                color: 'bg-accent',
              },
            ].map((value, index) => (
              <div key={index} className="card transition-all hover:shadow-lg">
                <div className={`${value.color} p-6 flex justify-center`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/20">
                    {value.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who make our mission possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We collaborate with trusted organizations to maximize our impact.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg flex items-center justify-center h-24"
              >
                <div className="text-gray-400 font-bold text-lg">
                  Partner Logo
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether through donation, volunteering, or partnership, you can be
            part of transforming lives across India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/donate"
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Donate
            </Link>
            <a
              href="/contact"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
