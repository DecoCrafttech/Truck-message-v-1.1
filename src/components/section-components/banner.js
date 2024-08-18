import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Banner = () => {

	let publicUrl = process.env.PUBLIC_URL + '/'
	let imagealt = 'image'

	useEffect(()=>{
		window.scrollTo(0,0)
	},[])

	return <div className="ltn__slider-area ltn__slider-3  section-bg-1 go-top">
		<div className="ltn__slide-one-active slick-slide-arrow-1 slick-slide-dots-1">
			<div className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal ltn__slide-item-3">
				<div className="ltn__slide-item-inner">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 align-self-end">
								<div className="slide-item-info w-100 h-100">
									<div className="slide-item-info-inner ltn__slide-animation">
										<h6 className="slide-sub-title white-color--- animated"><span><i className="fa-solid fa-truck"></i></span> All in one Truck Solution</h6>
										<h2 className="slide-title animated ">Optimize Your Trucking Operations with  Our <br /> All-in-One Solutions</h2>
										<div className="slide-brief animated">
											<p className='para'>"Experience seamless logistics management and maximize efficiency with our comprehensive suite of trucking solutions."</p>
										</div>
										<div className="btn-wrapper animated ">
											<Link to="/contact" className="btn btn-danger ps-4 pt-2 pb-2 pe-4	 go-top">Make An Enquiry</Link>				                  </div>
									</div>
								</div>
								<div className="slide-item-img">
									<img src={publicUrl + "assets/img/slider/21.jpg"} alt="#" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default Banner