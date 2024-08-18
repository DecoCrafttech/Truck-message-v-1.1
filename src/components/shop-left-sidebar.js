import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import ShopLeftSidebar from './shop-components/shop-left-sidebar';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const ShopLeftSidebarPage = () => {
    return <div>
        <PageHeader headertitle="Shop Left Sidebar" />
        <ShopLeftSidebar />
        <CallToActionV1 />
    </div>
}

export default ShopLeftSidebarPage

