import React, { Component } from 'react';
import { toast } from 'react-hot-toast'; // Import toast

class ContactForm extends Component {

	componentDidMount() {

		const $ = window.$;

		// Get the form.
		var form = $('#contact-form');

		// Set up an event listener for the contact form.
		$(form).submit(function(e) {
			// Stop the browser from submitting the form.
			e.preventDefault();

			// Serialize the form data.
			var formData = $(form).serialize();

			// Submit the form using AJAX.
			$.ajax({
				type: 'POST',
				url: $(form).attr('action'),
				data: formData
			})
			.done(function(response) {
				// Show success toast message
				toast.success('Submitted successfully!');

				// Clear the form.
				$('#contact-form input,#contact-form textarea').val('');
			})
			.fail(function(data) {
				// Show error toast message
				toast.error('Oops! An error occurred and your message could not be sent.');
			});
		});
	}

	render() {

		let publicUrl = process.env.PUBLIC_URL+'/';

		return (
			<div className="ltn__contact-message-area mb-5">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="ltn__form-box contact-form-box box-shadow white-bg">
								<h4 className="title-2">Contact Us</h4>
								<form id="contact-form" action={publicUrl+"mail.php"} method="post">
									<div className="row">
										<div className="col-md-6">
											<div className="input-item input-item-name ltn__custom-icon">
												<input type="text" name="name" placeholder="Enter your name" />
											</div>
										</div>
										<div className="col-md-6">
											<div className="input-item input-item-email ltn__custom-icon">
												<input type="email" name="email" placeholder="Enter email address" />
											</div>
										</div>
										<div className="col-md-6">
											<div className="input-item">
												<select className="nice-select" name="service">
													<option>Select Service Type</option>
													<option>Logistics</option>
													<option>Lorry Contractors</option>
													<option>Load Booking Agent</option>
													<option>Driver</option>
													<option>Lorry Buy & Sell Dealer/Owner</option>
												</select>
											</div>
										</div>
										<div className="col-md-6">
											<div className="input-item input-item-phone ltn__custom-icon">
												<input type="text" name="phone" placeholder="Enter phone number" />
											</div>
										</div>
									</div>
									<div className="input-item input-item-textarea ltn__custom-icon">
										<textarea name="message" placeholder="Enter message" defaultValue={""} />
									</div>
									<p>
										<label className="input-info-save mb-0">
											<input type="checkbox" name="agree" /> Save my name, email, and website in this browser for the next time I comment.
										</label>
									</p>
									<div className="mt-0">
										<button className="text-uppercase" type="submit">Submit</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ContactForm;
