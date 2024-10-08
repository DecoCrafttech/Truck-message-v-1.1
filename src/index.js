import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Provider} from 'react-redux';
import App from './App';
import Store from './Storage/Store';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Root = () =>{

    return(
        <Provider store={Store}>
            <App/>
        </Provider>
    )
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('quarter'));
