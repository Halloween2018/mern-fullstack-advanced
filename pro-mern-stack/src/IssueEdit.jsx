import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // ES6
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';

import { Form, FormGroup, FormControl, FormLabel, ButtonToolbar, Button, Card, Col, Row, Alert} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Toast from './Toast.jsx';



export default class IssueEdit extends React.Component 
{
    constructor() {
        super();
        this.state = {
            issue: {
                _id: '',    title: '', status: '', owner: '', effort: null,
                completionDate: null, created: null,
            },
            invalidFields: {}, showingValidation: false,
            toastVisible: false, toastMessage: '', toastType: 'success',
        };
        this.dismissValidation = this.dismissValidation.bind(this);
        this.showValidation = this.showValidation.bind(this);

        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            this.loadData();
        }
    }

    onValidityChange(event, valid) {
        const invalidFields = Object.assign({}, this.state.invalidFields);
        if(!valid) {
            invalidFields[event.target.name] = true;
        }else {
            delete invalidFields[event.target.name];
        }
        this.setState({ invalidFields })
    }
    onChange(event, convertedValue) {
        const issue = Object.assign({}, this.state.issue);
        const value = (convertedValue !== undefined) ? convertedValue : event.target.value;
        // issue[event.target.name] = event.target.value;
        issue[event.target.name] = value;
        this.setState({ issue });
    }
    onSubmit(event) {
        event.preventDefault();
        this.showValidation();
        if(Object.keys(this.state.invalidFields).length !== 0) {
            return ;
        }
        fetch(`/api/issues/${this.props.match.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.issue),
        }).then(response => {
            if(response.ok) {
                response.json().then(updatedIssue => {
                    updatedIssue.created = new Date(updatedIssue.created);
                    if(updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    }
                    this.setState({issue: updatedIssue});
                    // alert('Updated issue successfully.');
                    this.showSuccess('Updated issue successfully.');
                });
            }else {
                response.json().then(error => {
                    // alert(`Failed to update issue:${error.message}`);
                    this.showError(`Failed to update issue:${error.message}`);
                });
            }
        }).catch(err => {
            // alert(`Error in sending data to servere:${err.message}`);
            this.showError(`Error in sending data to servere:${err.message}`);
        });
    }

    loadData() {
        fetch(`/api/issues/${this.props.match.params.id}`).then(response => {
            if(response.ok) {
                response.json().then(issue => {
                    // issue.created = new Date(issue.created).toDateString();
                    issue.created = new Date(issue.created);
                    issue.completionDate = issue.completionDate != null ? 
                        new Date(issue.completionDate) : null;
                    // issue.effort = issue.effort != null ? issue.effort.toString() : '';
                    this.setState({ issue });
                });
            } else {
                response.json().then(error => {
                    // alert(`Failed to fetch issue: ${error.message}`);
                    this.showError(`Failed to fetch issue: ${error.message}`);
                });
            }
        }).catch(err => {
            // alert(`Error in fetching data from server: ${err.message}`);
            this.showError(`Error in fetching data from server: ${err.message}`);
        });

    }

    showSuccess(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'success'});
    }
    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger'});
    }
    dismissToast() {
        this.setState({ toastVisible: false });
    }

    showValidation() {
        this.setState({ showingValidation: true});
    }
    dismissValidation() {
        this.setState({ showingValidation: false });
    }


    render() {
        const issue = this.state.issue;
       /*  const validationMessage = Object.keys(this.state.invalidFields)
            .length === 0 ? null : ('Please correct invalid fields before submitting.'); */
        let validationMessage = null;
        if(Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
            validationMessage = (
                <Alert variant="danger"  dismissible={true} onClose={this.dismissValidation} >
                    Please correct invalid fields before submitting.
                </Alert>
            )
        }
        return (
            <Card >
                <Card.Header>Edit Issue</Card.Header>
                <Card.Body>
                    <Form onSubmit={this.onSubmit}>
                       {/*  <Row className="justify-content-md-center">
                            <FormGroup></FormGroup>
                        </Row> */}
                          <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                                ID
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl plaintext readOnly defaultValue={issue._id}></FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Created
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl plaintext readOnly defaultValue={issue.created ? issue.created.toDateString() : ''}></FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Status
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl as="select" name="status" value={issue.status} onChange={this.onChange}>
                                    <option value="New">New</option>
                                    <option value="Open">Open</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Closed">Closed</option>
                                </FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Owner
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl name="owner" value={issue.owner} onChange={this.onChange}></FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Effort
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl as={NumInput} name="effort" value={issue.effort} onChange={this.onChange}  ></FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Completion Date
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl as={DateInput} name="completionDate" value={issue.completionDate} onChange={this.onChange} 
                                    onValidityChange={this.onValidityChange}  ></FormControl>
                               {/*  <Form.Control.Feedback type="invalid">
                               isInvalid={validationMessage === null ? false: true} 
                                    {validationMessage}
                                </Form.Control.Feedback> */}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <FormLabel column sm={2} md={{ span:2, offset:2}} lg={{ span:1, offset:3}} >
                            Title
                            </FormLabel>
                            <Col sm={10} md={8} lg={8}>
                                <FormControl  name="title"  value={issue.title} onChange={this.onChange}></FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} >
                            <Col sm={{ span:10, offset:2}} md={{ span:8, offset:4}} lg={{ span:8, offset:4}}>
                                {validationMessage}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-md-center">
                            <Col sm={{ span:10, offset:2}} md={{ span:8, offset:4}} lg={{ span:8, offset:4}}>
                                <ButtonToolbar >
                                    <Button style={{margin:'auto .4em'}} variant="outline-primary"  type="submit">Submit</Button>
                                    <LinkContainer to="/issues">
                                        <Button style={{margin:'auto .2em'}} variant="outline-info" >Back</Button>
                                    </LinkContainer>                                
                                </ButtonToolbar>
                            </Col>
                        </Form.Group>
                    </Form>
                   {/*  <Card.Text className="error" style={{textAlign:"center"}}>
                        {validationMessage}
                    </Card.Text> */}
                </Card.Body>
                <Toast showing={this.state.toastVisible} message={this.state.toastMessage} 
                    variant={this.state.toastType} onClose={this.dismissToast} />
            </Card>
            // <div>
            //     <form onSubmit={this.onSubmit}>
            //         ID: {issue._id}
            //         <br/>
            //         Created: {issue.created ? issue.created.toDateString() : ''}
            //         <br/>
            //         Status: <select name="status" value={issue.status} onChange={this.onChange}>
            //             <option value="New">New</option>
            //             <option value="Open">Open</option>
            //             <option value="Assigned">Assigned</option>
            //             <option value="Fixed">Fixed</option>
            //             <option value="Verified">Verified</option>
            //             <option value="Closed">Closed</option>
            //         </select>
            //         <br/>
            //         Owner: <input name="owner" value={issue.owner} onChange={this.onChange} />
            //         <br/>
            //         Effort: <NumInput size={5} name="effort" value={issue.effort} onChange={this.onChange} />
            //         <br/>
            //         Completion Date: <DateInput name="completionDate" value={issue.completionDate} onChange={this.onChange} 
            //         onValidityChange={this.onValidityChange} />
            //         <br/>
            //         Title: <input name="title" size={50} value={issue.title} onChange={this.onChange} />
            //         <br/>
            //         {validationMessage}
            //         <button type="submit" >Submit</button>
            //         <Link to="/issues">Back to issue List</Link>
            //     </form>
            //     {/* <p>This is a placeholder for editing issue {this.props.match.params.id}.</p> */}
            // </div>
        );
    }
}
IssueEdit.propTypes = {
    match: PropTypes.object.isRequired,
  };


/* IssueEdit.prototype = {
    match: PropTypes.object.isRequired,
} */