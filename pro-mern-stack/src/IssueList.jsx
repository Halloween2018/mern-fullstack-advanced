import React from 'react';
import 'whatwg-fetch';
import PropTypes from "prop-types";
import { Link }  from 'react-router-dom';
import { Button, Table,  Card,    } from 'react-bootstrap';
import Collapse from 'react-bootstrap/Collapse';

// import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';
import Toast from './Toast.jsx';

/* 无状态的组价 */
const IssueRow = (props) => {
    function onDeleteClick() {
        props.deleteIssue(props.issue._id);
    }
    return (
        <tr>
            <td>
                <Link to={`/issues/${props.issue._id}`}>
                { props.issue._id.substr(-4) }
                </Link>
            </td>
            <td>{ props.issue.status }</td>
            <td>{ props.issue.owner }</td>
            <td>{ props.issue.created.toDateString() }</td>
            <td>{ props.issue.effort }</td>
            <td>{ props.issue.completionDate ? props.issue.completionDate.toDateString() : '' }</td>
            <td>{ props.issue.title }</td>
            <td><Button size="sm" className="btn btn-light" onClick={onDeleteClick}><ion-icon name="trash"></ion-icon></Button></td>
        </tr>
    )
}

function IssueTable(props) {
    const issueRows = props.issues.map(issue => <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />);
    return (
        <Table bordered hover responsive>
        <thead>
            <tr>
                <th>Id</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Created</th>
                <th>Effort</th>
                <th>Completion Date</th>
                <th>Title</th>
                <th></th>
            </tr>
        </thead>
        <tbody>{ issueRows }</tbody>
    </Table>
    )
}

IssueTable.propTypes = {
    issues: PropTypes.array.isRequired,
    deleteIssue: PropTypes.func.isRequired,
}

export default class IssueList  extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { issues: [],  open: true,
            toastVisible: false, toastMessage: '', toastType: 'success',
        };
       


/*         this.createTestIssue = this.createTestIssue.bind(this);
        setTimeout(this.createTestIssue, 2000); */
        // this.createIssue = this.createIssue.bind(this);

        this.setFilter = this.setFilter.bind(this);
        this.deleteIssue = this.deleteIssue.bind(this);

        this.controlCollapse =  this.controlCollapse.bind(this);
        // this.controlCollapse();
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    setFilter(filter) {
        // console.log(filter);
        let query = '?';
        // console.log(query);
        /* if(!filter) {
            return;
        } */
        for(let propsAttr in filter) {
            // console.log(filter.propsAttr);
            if(query.length > 1) {
                query += '&' + propsAttr + '=' + filter[propsAttr];
            } else {
                query += propsAttr + '=' + filter[propsAttr];

            }
        }
        // console.log(query);
        // console.log(this.props.location.pathname);
        // console.log(this.props.location);
        this.props.history.push( {
            pathname: this.props.location.pathname,
            search: query === '?' ? '' : query ,
          });
        // this.props.history.push(this.props.location.pathname, query);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {

        // const prevSearch = prevProps.location.search;
        // const currentSearch = this.props.location.search;
        // console.log(typeof prevProps.location.search);
        const oldQuery = this.formatQuery(prevProps.location.search);
        const newQuery = this.formatQuery(this.props.location.search);
        // const oldQuery = prevSearch.substring(prevSearch.indexOf('=') + 1 );
        // const newQuery = currentSearch.substring(prevSearch.indexOf('=') + 1 );
        // console.log(newQuery);
        if(oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte 
            && oldQuery.effort_lte === newQuery.effort_lte ) {
            return ;
        }
        this.loadData();
    }

    formatQuery(search) {
        if(search.length === 0) return {};
        const realQuery = search.substring(1);
        let searchMap = realQuery.split('&');
        // console.log('我想看看searchMap的值：' + searchMap);
        const query = {};
        // console.log(searchMap);
        searchMap.map(queryAttr => {
            let combination = queryAttr.split('=');
            // console.log(combination);
            query[combination[0]] = combination[1];
        });
        return query;
    }
    loadData() {
        fetch(`/api/issues${this.props.location.search}`).then(response => {
            if(response.ok) {
                response.json().then(data => {
                    // console.log("Total count of records:", data._metadata.total_count);
                    // console.log("拿到的数据：", data.records);
                    data.records.forEach(issue => {
                        issue.created = new Date(issue.created);
                        if(issue.completionDate)
                            issue.completionDate = new Date(issue.completionDate);
                    });
                    this.setState( { issues: data.records })
                });
            }else {
                response.json().then(error => {
                    // alert("Failed to fetch issues:" + error.message);
                    this.showError("Failed to fetch issues:" + error.message);
                })
            }
        }).catch(err => {
            // alert("Error in fetching data from server:", err);
            this.showError("Error in fetching data from server:", err);
        });
    }

    // createIssue(newIssue) {
    //    /*  const newIssues = this.state.issues.slice();
    //     newIssue.id = this.state.issues.length + 1;
    //     newIssues.push(newIssue);
    //     this.setState({ issues: newIssues }); */
    //     fetch('/api/issues', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json'},
    //         body:JSON.stringify(newIssue),
    //     }).then(response => {
    //         /* 错误捕获没办法检测未成功的状态码，需要自行判断  */
    //         if(response.ok) {
    //             response.json()
    //             .then(updatedIssue => {
    //                 updatedIssue.created = new Date(updatedIssue.created);
    //                 if(updatedIssue.completionDate)
    //                     updatedIssue.completionDate = new Date(updatedIssue.completionDate);
    //                 const newIssues = this.state.issues.concat(updatedIssue);
    //                 this.setState({ issues: newIssues});
    //             })
    //         }else {
    //             response.json().then(error => {
    //                 this.showError(`Failed to add issue:${error.message}`)
    //             })
    //         }        
    //     }      
    //     ).catch( err => {
    //         // alert("Error in sending data to server: " + err.message);
    //         this.showError("Error in sending data to server: " + err.message);
    //     })
    // }

   /*  createTestIssue() {
        this.createIssue({
            status: 'New', owner: 'Pieta', created: new Date(),
            title: 'Completion date should be optional'
        });
    } */

    deleteIssue(id) {
        fetch(`/api/issues/${id}`, {method:'DELETE'}).then(response => {
            if(!response.ok) alert('Failed to delete issue');
            else this.loadData();
        })
    }

    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger'});
    }
    dismissToast() {
        this.setState({ toastVisible: false });
    }

    controlCollapse(){
        const filterPanel = document.getElementById('example-collapse-text'); 
        if(!this.state.open)
        { 
            // filterPanel.style.height = 'auto';
            // filterPanel.style.opacity = '1';
            // filterPanel.style.display = 'block';
        }
        else {
            // filterPanel.style.height = '0';
            // filterPanel.style.opacity = '0';
            // filterPanel.style.display = "none";
        }
       
    }
    

    render() {
        // let { open } = this.state.open;
        return (
            <div>
                {/* <Button
                    onClick={ ()=> {
                        this.setState({ open: !this.state.open });
                        // console.log('状态没变', this.state.open);

                        // setTimeout(console.log('二次状态测试', this.state.open), 1000);
                        this.controlCollapse();
                    }}
                    aria-controls="example-fade-text"
                    aria-expanded={this.state.open}>
                    筛选
                </Button> */}
               {/*  <h1>Issue Tracker</h1> */}
               <br/>
               <Card >

                    <Card.Header style={{cursor:'pointer'}} onClick={ ()=> {
                        this.setState({ open: !this.state.open });
                        // console.log('状态没变', this.state.open);

                        // setTimeout(console.log('二次状态测试', this.state.open), 1000);
                        this.controlCollapse();
                    }}
                    aria-controls="example-fade-text"
                    aria-expanded={this.state.open} >
                    Filter Issue
                    </Card.Header>
                    <Collapse in={this.state.open} >
                        <Card.Body>
                            <IssueFilter   setFilter={this.setFilter}
                            initFilter={this.formatQuery(this.props.location.search)} />
                        </Card.Body>
                    </Collapse>
               </Card>
                
                <br/>
                <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
                {/* <button onClick={this.createTestIssue}>Add</button> */}
                {/* <IssueAdd createIssue={this.createIssue} /> */}
                <Toast showing={this.state.toastVisible} message={this.state.toastMessage} 
                    onClose={this.dismissToast} variant={this.state.toastType} />
            </div>
        )
    }
}

IssueRow.propTypes = {
    issue: PropTypes.object.isRequired,
    deleteIssue: PropTypes.func.isRequired,
}

IssueList.propTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object,
  };
