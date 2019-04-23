import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup,FormControl, FormLabel, InputGroup, ButtonToolbar, Button  } from 'react-bootstrap'

export default class IssueFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.initFilter.status || '',
            effort_gte: props.initFilter.effort_gte || '',
            effort_lte: props.initFilter.effort_lte || '',
            changed: false,
        }
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
        this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            status: newProps.initFilter.status || '',
            effort_gte: newProps.initFilter.effort_gte || '',
            effort_lte: newProps.initFilter.effort_lte || '',
            changed: false,
        });
    }

    resetFilter() {
        this.setState({
            status: this.props.initFilter.status || '',
            effort_gte: this.props.initFilter.effort_gte || '',
            effort_lte: this.props.initFilter.effort_lte || '',
            changed: false,
        });
    }
   /*  setFilterOpen(e) {
        e.preventDefault();
        this.props.setFilter( '?status=Open');
    }
    
    setFilterAssigned(e) {
        e.preventDefault();
        this.props.setFilter('?status=Assigned');
    }
    
    clearFilter(e) {
        e.preventDefault();
        this.props.setFilter('');
    } */
    // render() {
    //     const Separator = () => <span> | </span>;

    //     return (
    //         <div>This is a placeholder for the Issue Filter.
    //             {/* <Link to="/issues">All Issue</Link> */}
    //             <a href="#" onClick={ this.clearFilter}>All Issues</a>
    //             <Separator />
    //             {/* <Link to={{pathname: 'issues', search: '?status=Open', }}>
    //                 Open Issues
    //             </Link> */}
    //             <a href="#" onClick={ this.setFilterOpen}>Open Issues</a>
    //             <Separator />
    //             {/* <Link to="/issues?status=Assigned">Assigned Issues</Link> */}
    //             <a href="#" onClick={ this.setFilterAssigned}>Assigned Issues</a>
    //         </div>
    //     );
    // }

    onChangeStatus(e) {
        this.setState({ status: e.target.value, changed: true });
        // console.log('Status类型改变了，值为：' + e.target.value);
    }
    onChangeEffortGte(e) {
        const effortString = e.target.value;
        if(effortString.match(/^\d*$/)) {
            this.setState({ effort_gte: e.target.value, changed: true});
        }
    }

    onChangeEffortLte(e) {
        const effortString = e.target.value;
        if(effortString.match(/^\d*$/)) {       //忽略用户输入的非数字字符
            this.setState( { effort_lte: e.target.value, changed: true });
        }
    }
    applyFilter() {
        const newFilter = {};
        if(this.state.status) newFilter.status = this.state.status;
        // console.log('我想看看传过去的status值：' + this.state.status);
        if(this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
        if(this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
        this.props.setFilter(newFilter);
    }
    clearFilter() {
        this.props.setFilter({});
    }
    render(){
        return (
            <Row id="example-collapse-text" >
               
                <Col xs={6} sm={4} md={3} lg={2}>
                    <FormGroup >
                    <FormLabel>Status</FormLabel> 
                    <FormControl as="select" value={this.state.status} onChange={this.onChangeStatus} >
                        <option value="">(Any)</option>
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Verified">Verified</option>
                        <option value="Closed">Closed</option>
                    </FormControl>
                    </FormGroup>
                </Col>
                <Col xs={6} sm={4} md={3} lg={2} >
                    <FormGroup>
                        <FormLabel>
                            Effort
                        </FormLabel>
                        <InputGroup>
                            <Form.Control  value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
                            <InputGroup.Prepend>
                                 <InputGroup.Text id="btnGroupAddon">-</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col xs={6} sm={4} md={3} lg={2} >
                    <FormGroup>
                        <FormLabel>&nbsp;</FormLabel>
                        <ButtonToolbar >
                            <Button style={{margin:'auto .2em'}} variant="outline-primary"  onClick={this.applyFilter}>Apply</Button>
                            <Button style={{margin:'auto .2em'}} variant="outline-info" onClick={this.resetFilter} disabled={!this.state.changed} >Reset</Button>
                            <Button style={{margin:'auto .2em'}} variant="outline-dark" onClick={this.clearFilter}>Clear</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Col>
               {/*  &nbsp; between:
                <input size={5} value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
                &nbsp;-&nbsp;
                <input size={5} value={this.state.effort_lte} onChange={this.onChangeEffortLte}/>
                <button onClick={this.applyFilter}>Apply</button>
                <button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</button>
                <button onClick={this.clearFilter}>Clear</button> */}
            
            </Row>
        )
    }
}


IssueFilter.propTypes = {
    setFilter: PropTypes.func.isRequired,
    initFilter: PropTypes.object.isRequired,
  };
