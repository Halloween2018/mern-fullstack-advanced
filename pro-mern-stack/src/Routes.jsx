import React from 'react';
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Route, Link, Redirect, Switch  } from 'react-router-dom';
import App from './App.jsx';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';


const NoMatch = () => <p>Page Not Found</p>;

export default (
    <Switch>
        <Route exact path='/'  render={() => ( <Redirect to="/issues"/> )}/>
        <Route exact path='/issues' component={withRouter(IssueList)}/>
        <Route path='/issues/:id' component={IssueEdit} />
        <Route path='*'  component={NoMatch} />
    </Switch>
)

