import React, { useState, useEffect, ReactNode } from 'react';

interface ImpactCounterProps {
  icon: ReactNode;
  count: number;
  label: string;
  suffix?: string;
}

const ImpactCounter: React.FC<ImpactCounterProps> = ({ icon, count, label, suffix = '' }) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    const element = document.getElementById(`counter-${label.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [label]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const increment = count / 50; // Adjustment for animation speed
    const timer = setInterval(() => {
      start += increment;
      if (start >= count) {
        setCurrent(count);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [count, isVisible]);
  
  return (
    <div 
      id={`counter-${label.replace(/\s+/g, '-').toLowerCase()}`}
      className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-4xl font-bold mb-2 text-foreground">
        {current.toLocaleString()}{suffix}
      </h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default ImpactCounter;