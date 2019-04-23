import React from 'react';
import PropTypes from "prop-types";

export default class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.editFormat(props.value),  focused: false, valid: true };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /* 检查数据是否真的发生了变化 */
    componentWillReceiveProps(newProps) {
        if (newProps.value !== this.props.value) {
            this.setState({ value: this.editFormat(newProps.value)});
        }
    }
    onFocus() {
        this.setState({ focused: true });
    }
    /* 当输入框失去焦点时，检查数据的有效性 */
    onBlur(e) {
        const value = this.unFormat(this.state.value);
        const valid = this.state.value === '' || value != null;
        if(valid !== this.state.valid && this.props.onValidityChange) {
            this.props.onValidityChange(e, valid);
        }
        this.setState( { focused: false, valid });
        if(valid) this.props.onChange(e, value);
    }

    onChange(e) {
        if(e.target.value.match(/^[\d-]*$/)) {
            this.setState({ value: e.target.value });
        }
    }
    /* 显示有效的输入日期 */
    displayFormat(date) {
        return (date != null ) ? date.toString() : '';
    }
    /* 保存用户输入的有效或者无效输入数值 */
    editFormat(date) {
        return (date != null) ? date.toISOString().substr(0, 10) : '';
    }

    unFormat(str) {
        const val = new Date(str);
        return isNaN(val.getTime()) ? null : val;
    }
    render() {
        // const className = (!this.state.valid && !this.state.focused ) ? 'invalid' : '';
        const value = (this.state.focused || !this.state.valid) ?
        this.state.value : this.displayFormat(this.props.value);
        
        const childProps = Object.assign({}, this.props);
        delete childProps.onValidityChange;

        return (
            // <input type="text" size={20} name={this.props.name } className={className} value={value}
            //     placeholder={this.state.focused ? 'yyyy-mm-dd' : null} 
            //     onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange}
            // />
            <input type="text" {...childProps} value={value}
                placeholder={this.state.focused ? 'yyyy-mm-dd' : null} 
                onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange}
            />
        );
    }
}

DateInput.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onValidityChange: PropTypes.func,
    name: PropTypes.string.isRequired,
}

