import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import Checkout from './shop-components/checkout';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const CheckOuttV1 = () => {
    return <div>
        <PageHeader headertitle="Checkout" />
        <Checkout />
        <CallToActionV1 />
    </div>
}

export default CheckOuttV1

