import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
import { NavItem, Modal, Form, FormGroup, FormControl, FormLabel, Button, ButtonToolbar } from 'react-bootstrap';

import Toast from './Toast.jsx';

class IssueAddNavItem  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false, toastVisible: false, toastMessage: '', toastType: 'success',
            count: 0,
        };
        this.showModal = this.showModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.hideSubmitModal = this.hideSubmitModal.bind(this);
        this.submit = this.submit.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    showModal(e) {
        let addIssue = document.getElementById('add-issue');
        // console.log(e.target, addIssue);
        if(e.target !== addIssue) return;
        // e.stopPropagation(); 
        this.setState({ count: this.state.count + 1 });
        
        console.log(this.state.showing);
        // console.log('显示模态框', this.state.showing );
        console.log(this);
        this.setState({ showing: true});
        // console.log('更改后的模态框', this.state.showing );
    }
    handleClose(e) {
        console.log(this.state.showing);
        if (e && e.stopPropagation) {//非IE浏览器 
            e.stopPropagation(); 
        }else {
            window.event.cancelBubble = true; 
        }
        // e.stopPropagation();
        this.setState({ showing: false });
      }
    /* hideSubmitModal(e) {
        e.stopPropagation();
        setTimeout(this.setState({ showing: false }), 2000);
        // this.setState({ showing: false });
        console.log('取消失败', this.state.showing);
    } */
    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger'});
    }
    dismissToast() {
        this.setState({ toastVisible: false });
    }

    submit(e) {
        e.preventDefault();
        this.handleClose();
        const form = document.forms.issueAdd;
        console.log(form);
        const newIssue = {
            owner: form.owner.value, title: form.title.value,
            status: 'New', created: new Date(),
        };
        fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newIssue),
        }).then(response => {
            if(response.ok) {
                response.json().then(updatedIssue => {
                    this.props.history.push(`/issues/${ updatedIssue._id}`);
                });
            }else {
                response.json().then(error => {
                    this.showError(`Failed to add issue: ${ error.message }`);
                });
            }
        }).catch(err => {
            this.showError(`Error in sending data to server: ${err.message }`);
        });
    }

    render() {
        return (
            <NavItem id="add-issue" onClick={this.showModal}>
                <ion-icon name="add"></ion-icon>Create Issue
                <Modal show={this.state.showing} onHide={this.handleClose} >  
                    <Modal.Header closeButton>
                        <Modal.Title>Create Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form name="issueAdd" >
                            <FormGroup>
                                <FormLabel>
                                    Title
                                </FormLabel>
                                <FormControl name="title" autoFocus />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>
                                    Owner
                                </FormLabel>
                                <FormControl name="owner" />
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonToolbar>
                            <Button type="button" variant='outline-primary' onClick={this.submit}>Submit</Button>
                            <Button variant='light' onClick={this.handleClose} >Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
                <Toast  showing={this.state.toastVisible} message={this.state.toastMessage}
                    onClose={this.dismissToast} variant={this.state.toastType}    />
            </NavItem>
        );
    }
}

IssueAddNavItem.propTypes = {
    router: PropTypes.object,
};

export default withRouter(IssueAddNavItem);

