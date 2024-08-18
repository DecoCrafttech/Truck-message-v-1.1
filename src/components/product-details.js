import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import ProductSlider from './shop-components/product-slider-v1';
import ProductDetails from './shop-components/shop-details';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const Product_Details = () => {
    return <div>
        {/* <PageHeader headertitle="Product Details" customclassName="mb-0" /> */}
        {/* <ProductSlider /> */}
        <ProductDetails />
        {/* <CallToActionV1 /> */}
    </div>
}

export default Product_Details

