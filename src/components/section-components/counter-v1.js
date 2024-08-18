import React, { Component } from 'react';
import FuelPrice from '../FuelPrice';
import { BsFillFuelPumpFill } from "react-icons/bs";


class CounterV1 extends Component {

	render() {


		return <div className=" pt-120 pb-70">
			<div className='container'>
				<div className="row">
					<div className="col-md-6 col-sm-6 align-self-center">
						<div>
							<h1>
							 
								<span className=" fuel_feature-icon p-3 border me-3"><   BsFillFuelPumpFill className="ltn__feature-icon fuel_feature-icon"/></span>
							Daily Fuel Price </h1>
						</div>
					</div>
					<div className="col-md-6 col-sm-6 align-self-center">
						<FuelPrice/>
					</div>
				</div>
			</div>
		</div>
	}
}

export default CounterV1