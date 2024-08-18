import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class PortfolioV1 extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/'

		return <div className="ltn__gallery-area mb-120">
			<div className="container">
				{/* (ltn__gallery-info-hide) Class for 'ltn__gallery-item-info' not showing */}
				<div className="ltn__gallery-active row ltn__gallery-info-hide---">
					{/* gallery-item */}
					<div className="ltn__gallery-item filter_category_3 col-lg-4 col-sm-6 col-12">
						<div className="ltn__gallery-item-inner">
							<div className="ltn__gallery-item-img">
								<a href={publicUrl + "assets/img/gallery/1.jpg"} data-rel="lightcase:myCollection">
									<img src={publicUrl + "assets/img/gallery/1.jpg"} alt="Image" />
									
									<span className="ltn__gallery-action-icon">
										<i className="fas fa-search" />
									</span>
								</a>
							</div>
							<div className="ltn__gallery-item-info">
								<h4 className="go-top"><Link to="/portfolio-details">Portfolio Link </Link></h4>
								<p>Web Design &amp; Development, Branding</p>
							</div>
						</div>
					</div>
					
				</div>
				<div id="ltn__inline_description_1" style={{ display: 'none' }}>
					<h4 className="first">This content comes from a hidden element on that page</h4>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis mi eu elit tempor facilisis id et neque. Nulla sit amet sem sapien. Vestibulum imperdiet porta ante ac ornare. Nulla et lorem eu nibh adipiscing ultricies nec at lacus. Cras laoreet ultricies sem, at blandit mi eleifend aliquam. Nunc enim ipsum, vehicula non pretium varius, cursus ac tortor.</p>
					<p>Vivamus fringilla congue laoreet. Quisque ultrices sodales orci, quis rhoncus justo auctor in. Phasellus dui eros, bibendum eu feugiat ornare, faucibus eu mi. Nunc aliquet tempus sem, id aliquam diam varius ac. Maecenas nisl nunc, molestie vitae eleifend vel.</p>
				</div>
				<div className="btn-wrapper text-center">
					<Link to="#" className="btn btn-transparent btn-effect-3 btn-border">LOAD MORE +</Link>
				</div>
			</div>
		</div>
	}
}

export default PortfolioV1