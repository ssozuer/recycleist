import React, { useState, useEffect } from 'react';


// component imports
import Header from './Header';
import SectionWhy from './SectionWhy';
import SectionImages from './SectionImages';
import SectionRecycles from './SectionRecycles';
import SectionTestimonials from './SectionTestimonials'
import Footer from './Footer';
import SectionSteps from './SectionSteps';
import SectionContributions from './SectionContributions';


const App = () => {
    return (
        <div>
            <Header />
            <SectionWhy />
            <SectionImages />
            <SectionSteps />
            <SectionRecycles />
            <SectionContributions />
            <SectionTestimonials />
            <Footer />
        </div>
    );
};

export default App;