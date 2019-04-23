import React from 'react';
import {Form, FormControl, Button, Col} from 'react-bootstrap'


/* 添加新项的组件 */
export default class IssueAdd extends React.Component{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.issueAdd;
        this.props.createIssue({
            owner: form.owner.value,
            title: form.title.value,
            status: 'New',
            created: new Date()
        });
        form.owner.value = ""; form.title.value = "";
    }

    render() {
        return(
            <div>
                <Form name="issueAdd" onSubmit={this.handleSubmit} >
                    <Form.Row>
                        <Col xs={12} md={4} lg={2} >
                        <Form.Control type="text" name="owner" placeholder="Owner" />
                        </Col>
                        <Col xs={12} md={4} lg={2}  >
                        <Form.Control type="text" name="title" placeholder="Title" />
                        </Col>
                        <Col xs={12} md={4} lg={2}>
                            <Button type="submit">Add</Button>
                        </Col>
                    </Form.Row>
                </Form>
               {/*  <form  name="issueAdd" onSubmit={this.handleSubmit}>
                    <input type="text" name="owner" placeholder="Owner" />
                    <input type="text" name="title" placeholder="Title"/>
                    <button>Add</button>
                </form> */}
            </div>
        )
    }
}
