import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Route, Link, Redirect, Switch  } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () =><p>Page not Found <Link to="/issues/2">走你</Link></p>;

const App = (props) => (
    <div>
        <div className="header">
            <h1>Issus Tracker</h1>
        </div>

        <div className="contents">
            
        </div>
        <div className="footer">
            Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">GitHub repository</a>
        </div>
    </div>
);

const Header = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand>Issue Tracker</Navbar.Brand>
        <Nav className="mr-auto"> 
            <LinkContainer to="/issues">
                <NavItem>
                    <Nav.Link href="/issues">Issues</Nav.Link>
                </NavItem>
            </LinkContainer>
            <LinkContainer to="/reports">
                <NavItem>
                    <Nav.Link href="/reports">Reports</Nav.Link>
                </NavItem>
            </LinkContainer>
        </Nav>
        <Nav className="justify-content-end" >
            {/* <NavItem ><Nav.Link href="javascript:void(0)"><ion-icon name="add"></ion-icon>Create Issue</Nav.Link> </NavItem> */}
            <IssueAddNavItem />
            <NavDropdown id="usere-dropdown" title="更多"  >
                <NavDropdown.Item>Logout</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    </Navbar>
    
)

/* 路由子组件 */
const RoutedApp = () => (
        <div>
            <Header />
            <div className="container-fluid">
                {/* <Redirect from="/" to="/"  /> */}
                {/* <div className="header">
                    <h1>Issus Tracker</h1>
                </div>   */}

                <div className="contents">
                    <Switch>
                        <Route exact path='/'  render={() => ( <Redirect to="/issues"/> )}/>
                        <Route exact path='/issues' component={withRouter(IssueList)}/>
                        <Route path="/issues/:id" component={IssueEdit} />
                        <Route  component={NoMatch} />
                    </Switch>
                </div>
                <div className="footer">
                    Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">GitHub repository</a>
                </div>
                {/* <Route exact path="/issues" component={IssueList} /> */}
            </div>
        </div>
)

ReactDOM.render(
    <Router >
        <RoutedApp/>
    </Router>
    , contentNode );

    
if(module.hot) {
    module.hot.accept();
}

App.prototypes = {
    children: PropTypes.object.isRequired
}

/* class IssueRow extends React.Component {
    render() {
        const borderedStyle = { border: "1px solid silver", padding: 4};
        return (
            <tr>
                <td style={borderedStyle}>{ this.props.issue_id }</td>
                <td style={borderedStyle}>{ this.props.children }</td>
            </tr>
        )
    }
} */

/* class IssueTable extends React.Component {
    render() {
        const borderedStyle = { border: "1px solid silver", padding: 6};

        return (
            <table style={{ borderCollapse:"collapse"}}>
                <thead>
                    <tr>
                        <th style={ borderedStyle }>Id</th>
                        <th style={ borderedStyle }>Title</th>
                    </tr>
                </thead>
                <tbody>
                    <IssueRow issue_id={1}>Error in console when clicking Add</IssueRow>
                    <IssueRow issue_id={2}>Missing bottom border on panel</IssueRow>
                </tbody>
            </table>
        );
    }
} */

/* class IssueRow extends React.Component {
    render() {
        const issue = this.props.issue;
        return (
            <tr>
                <td>{ issue.id }</td>
                <td>{ issue.status }</td>
                <td>{ issue.owner }</td>
                <td>{ issue.created.toDateString() }</td>
                <td>{ issue.effort }</td>
                <td>{ issue.completionDate ? issue.completionDate.toDateString() : '' }</td>
                <td>{ issue.title }</td>
            </tr>
        )
    }
} */


/* class IssueTable extends React.Component {
    render() {
        const issueRows = this.props.issues.map(issue => <IssueRow key={issue.id} issue={issue}/>);
        return (
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Created</th>
                        <th>Effort</th>
                        <th>Completion Date</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>{ issueRows }</tbody>
            </table>
        )
    }
} */



/* class IssueAdd extends React.Component {
    render() {
        return (
            <div>This is a placeholder for an Issue Add entry form.</div>
        );
    }
} */



/* const issues = [
    {
        id: 1, status: 'open', owner: 'Ravan',
        created: new Date('2019-03-27'), effort: 5, completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2019-03-27'), effort: 14,
        completionDate: new Date('2019-04-10'),
        title: 'Missing bottom border on panel',
    }
] */

/* class IssueList  extends React.Component {
    render() {
        return (
            <div>
                <h1>Issue Tracer</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable issues={issues}/>
                <hr/>
                <IssueAdd/>
            </div>
        );
    }
} */






