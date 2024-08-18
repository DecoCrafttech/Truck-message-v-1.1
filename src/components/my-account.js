import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import MyAccount from './shop-components/my-account';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const MyaccountV1 = () => {
    return <div>
        <PageHeader headertitle="My Account" />
        <MyAccount />
        <CallToActionV1 />
    </div>
}

export default MyaccountV1

