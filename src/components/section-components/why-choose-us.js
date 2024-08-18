import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class WhyChooseUs extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'

    return  <div className="ltn__feature-area section-bg-2 pt-115 pb-90">
				<div className="container">
				<div className="row">
					<div className="col-lg-12">
					<div className="section-title-area ltn__section-title-2--- text-center">
						<h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Why Choose Truck Message</h6>
						<h1 className="section-title">The Benefits of Partnering with Us</h1>
					</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-xl-4 col-sm-6 col-12">
					<div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
						<div className="ltn__feature-icon-title">
						<div className="ltn__feature-icon">
							<span><i className="flaticon-house-4" /></span>
						</div>
						<h3>Comprehensive Services</h3>
						</div>
						<div className="ltn__feature-info">
						<p>From truck reselling to toll and mileage calculators, we cover all aspects of the trucking business.</p>
						</div>
					</div>
					</div>
					<div className="col-xl-4 col-sm-6 col-12">
					<div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
						<div className="ltn__feature-icon-title">
						<div className="ltn__feature-icon">
							<span><i className="icon-mechanic" /></span>
						</div>
						<h3>Expert Support</h3>
						</div>
						<div className="ltn__feature-info">
						<p>Our team offers expert guidance and support to help you make informed decisions.</p>
						</div>
					</div>
					</div>
					<div className="col-xl-4 col-sm-6 col-12">
					<div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
						<div className="ltn__feature-icon-title">
						<div className="ltn__feature-icon">
							<span><i className="icon-repair-1" /></span>
						</div>
						<h3>User-Friendly Platform</h3>
						</div>
						<div className="ltn__feature-info">
						<p>Our platform is designed for ease of use, ensuring a seamless experience.</p>
						</div>
					</div>
					</div>
					<div className="col-xl-4 col-sm-6 col-12">
					<div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
						<div className="ltn__feature-icon-title">
						<div className="ltn__feature-icon">
							<span><i className="flaticon-house-2" /></span>
						</div>
						<h3>Trusted by Many</h3>
						</div>
						<div className="ltn__feature-info">
						<p>A track record of satisfied customers who trust us for their trucking needs.</p>
						</div>
					</div>
					</div>
				</div>
				</div>
			</div>
        }
}

export default WhyChooseUs