import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import BlogRightSidebar from './blog-components/blog-right-sidebar';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const BlogRightSidebarPage = () => {
    return <div>
        <PageHeader headertitle="Blog Right Sidebar" subheader="Blog" />
        <BlogRightSidebar />
        <CallToActionV1 />
    </div>
}

export default BlogRightSidebarPage

