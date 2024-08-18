import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import PortfolioV1 from './section-components/portfolio-v2';
import CallToActonV2 from './section-components/call-to-action-v2';
import BlogSlider from './blog-components/blog-slider-v1';
import Sponsor from './section-components/sponsor-v2';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const PortfolioV2 = () => {
    return <div>
        <PageHeader headertitle="Our Portfolio" subheader="Portfolio" />
        <PortfolioV1 />
        <CallToActonV2 />
        <BlogSlider sectionclassName="pt-120" />
        <Sponsor />
        <CallToActionV1 />
    </div>
}

export default PortfolioV2

