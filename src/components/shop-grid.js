import React from 'react';
import PageHeader from './global-components/page-header';
import ShogGrid from './shop-components/shop-grid-v1';
import CallToActionV1 from './section-components/call-to-action-v1';

const ShopGrid_V1 = () => {
    return <div>
        <PageHeader headertitle="Shop Grid" />
        <ShogGrid />
        <CallToActionV1 />
    </div>
}

export default ShopGrid_V1

