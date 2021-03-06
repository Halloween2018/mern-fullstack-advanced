// 'use strict';

const validIssueStatus = {
    New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	closed:  true,
};

const issueFieldType = {
	status: 'required',
	owner: 'required',
    effort: 'optional',
    created: 'required',
	completionDate: 'optional',
	title: 'required',
};

function cleanupIssue(issue) {
    const cleanedUpIssue = {};
    Object.keys(issue).forEach(field => {
        if(issueFieldType[field]) cleanedUpIssue[field] = issue[field];
    });
    return cleanedUpIssue;
}

function validateIssue(issue) {  
    const errors = [] ;
    Object.keys(issueFieldType).forEach(field => {
        if(issueFieldType[field] === 'required' && !issue[field]) {
            errors.push(`Missing mandatory field: ${field}`);
        }
    });

    if(!validIssueStatus[issue.status]) {
        errors.push(`${issue.status} is not a valid status.`);
    }

    return (errors.length ? errors.join('; ') : null);
	/* for (const field in issueFieldType) {
		const type = issueFieldType[field];
		if (!type) {	//检测类型是否需要,这一步有点多余
			delete issue[field];
		}else if (type === 'required' && !issue[field]) {		//检测输入的类型是否必要的且存在
			return `${field} is required.`;
		}
	}

	if( !validIssueStatus[issue.status])	//判断列表的类型
		return `${issue.status} is not valid status. ` ;

	return null; */
} 

function convertIssue(issue) {
    if(issue.created) issue.created = new Date(issue.created);
    if(issue.completionDate) issue.completionDate = new Date(issue.completionDate);
    return cleanupIssue(issue);
}

export default {
    validateIssue,
    cleanupIssue,
    convertIssue,
}

