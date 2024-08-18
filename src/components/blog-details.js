import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import BlogDetails from './blog-components/truckavailability';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';
import TruckAvailability from './blog-components/truckavailability';

const BlogDetailsPage = () => {
    return <div>
        {/* <PageHeader headertitle="News Details" /> */}
        <TruckAvailability />
        {/* <CallToActionV1 /> */}
    </div>
}

export default BlogDetailsPage

