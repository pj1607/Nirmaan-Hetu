import React from 'react';
import HeroBanner from '../../components/homeComponents/HeroBanner.jsx';
import FeaturesSection from '../../components/homeComponents/FeaturesSection.jsx';
import WorkflowSteps from '../../components/homeComponents/WorkflowSteps.jsx';

const Home = () => {
  return (
    <>
      <HeroBanner />
      <FeaturesSection />
      <WorkflowSteps />
    </>
  );
};

export default Home;