import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class ContactInfo extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/'

		return <div className="ltn__contact-address-area mb-5 mt-5">
			<div className="container">
				<div className="section-title-area ltn__section-title-2--- mb-20">
					<h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Get in Touch with Us</h6>
					<h1 className="section-title">We're Here to <span>Help You</span></h1>
					<p className='para'>We value your questions, feedback, and inquiries. Whether you're looking for more information about our services or need assistance, our dedicated team is here to support you. Reach out to us through any of the following methods, and we'll get back to you promptly.</p>
				</div>
				<div className="row">
					<div className="col-lg-4 ">
						<div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow h-100">
							<div className="ltn__contact-address-icon">
								<img src={publicUrl + "assets/img/icons/10.png"} alt="Icon Image" />
							</div>
							<h3 className='mb-2'>Email Address</h3>
							<a href="mailto:example@example.com" >example@example.com</a> <br />
							<a href="mailto:example@example.com" >example@example.com</a>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow h-100">
							<div className="ltn__contact-address-icon">
								<img src={publicUrl + "assets/img/icons/11.png"} alt="Icon Image" />
							</div>
							<h3 className="ltn__contact-address-icon mb-2">Phone Number</h3>
							<a href="tel:+0123-456789" >+0123-456789</a>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow h-100">
							<div className="ltn__contact-address-icon">
								<img src={publicUrl + "assets/img/icons/12.png"} alt="Icon Image" />
							</div>
							<h3 className='mb-2'>Office Address</h3>
							<p>18/A, New Born Town Hall <br />
								New York, US</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}

export default ContactInfo