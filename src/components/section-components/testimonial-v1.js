import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class Testimonial extends Component {
    render() {
        let publicUrl = process.env.PUBLIC_URL + '/';
        let imagealt = 'image';

        const testimonials = [
            { name: "Jacob William", designation: "Selling Agents", img: "1.jpg", text: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min veniam, quis nostrud Precious ips um dolor sit amet, consecte" },
            { name: "Kelian Anderson", designation: "Selling Agents", img: "2.jpg", text: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min veniam, quis nostrud Precious ips um dolor sit amet, consecte" },
            { name: "Adam Joseph", designation: "Selling Agents", img: "3.jpg", text: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min veniam, quis nostrud Precious ips um dolor sit amet, consecte" },
            { name: "James Carter", designation: "Selling Agents", img: "4.jpg", text: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min veniam, quis nostrud Precious ips um dolor sit amet, consecte" }
        ];

        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: false,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        return (
            <div className="ltn__testimonial-area section-bg-5 bg-image-top pt-115 pb-70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title-area ltn__section-title-2--- text-center">
                                <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Our Testimonial</h6>
                                <h1 className="section-title">Clients Feedback</h1>
                            </div>
                        </div>
                    </div>
                    <Slider {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index}>
                                <div className="ltn__testimonial-item ltn__testimonial-item-7">
                                    <div className="ltn__testimoni-info">
                                        <p><i className="flaticon-left-quote-1" /> {testimonial.text}</p>
                                        <div className="ltn__testimoni-info-inner">
                                            <div className="ltn__testimoni-img">
                                                <img src={`${publicUrl}assets/img/testimonial/${testimonial.img}`} alt={imagealt} />
                                            </div>
                                            <div className="ltn__testimoni-name-designation">
                                                <h5>{testimonial.name}</h5>
                                                <label>{testimonial.designation}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        );
    }
}

export default Testimonial;
