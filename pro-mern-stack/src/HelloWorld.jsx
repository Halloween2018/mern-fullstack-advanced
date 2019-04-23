import React from 'react';
import PropTypes from "prop-types";


export default class HelloWorld extends React.Component{
    constructor(props) {
        super(props);
        // console.log(this);
        this.state = Object.assign({}, this.props);
    }
    componentDidMount() {
        this.setState({ addressee: 'Universe'});
       
    }

    render() {
        return (
            <h1>Hello to graduate { this.state.addressee }!</h1>
        );
    }
}

HelloWorld.propTypes = {
    addressee: PropTypes.string,
}

HelloWorld.defaultProps = {
    addressee: '',
}