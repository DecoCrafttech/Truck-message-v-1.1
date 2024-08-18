import React from 'react';
import Banner from './section-components/banner';
import Aboutv1 from './section-components/about-v1';
import Counter from './section-components/counter-v1';
import ServiceV5 from './section-components/service-v1';
import Testimonial from './section-components/testimonial-v1';
// import BlogSlider from './blog-components/blog-slider-v1';
import WhyChooseUs from './section-components/why-choose-us';


const Home_V1 = () => {

    return <>
        <Banner />
        {/* <SearchForm /> */}
        <Aboutv1 />
        <ServiceV5 />
        {/* <Category /> */}
        <Counter />
       
        <WhyChooseUs />
        <Testimonial />
        {/* <BlogSlider customclassName="section-subtitle-2" /> */}
        {/* <CallToActionV1 /> */}

    </>
}

export default Home_V1

