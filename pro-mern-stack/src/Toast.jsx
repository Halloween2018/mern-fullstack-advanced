import React from 'react';
import { Alert, Collapse } from 'react-bootstrap';
import PropTypes from "prop-types";


export default class Toast extends React.Component {
    componentDidUpdate() {
        if(this.props.showing) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = setTimeout(this.props.onClose, 5000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.dismissTimer);
      }

    render() {
        return (
            <Collapse in={this.props.showing}>
                <div style={{ position: 'fixed', top: 30, left: 0, right: 0, zIndex: 10, textAlign: 'center' }}>
                    <Alert dismissible style={{ display: 'inline-block', width: 500, }} variant={this.props.variant} onClose={this.props.onClose}>
                        {this.props.message}
                    </Alert>
                </div>
            </Collapse>
        )
    }
}

Toast.propTypes = {
    showing: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    variant: PropTypes.string,
    message: PropTypes.any.isRequired,
}

Toast.defaultProps = {
    variant: 'success',
}