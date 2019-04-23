'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 'use strict';

var validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	closed: true
};

var issueFieldType = {
	status: 'required',
	owner: 'required',
	effort: 'optional',
	created: 'required',
	completionDate: 'optional',
	title: 'required'
};

function validateIssue(issue) {
	for (var field in issueFieldType) {
		var type = issueFieldType[field];
		if (!type) {
			//检测类型是否需要,这一步有点多余
			delete issue[field];
		} else if (type === 'required' && !issue[field]) {
			//检测输入的类型是否必要的且存在
			return field + ' is required.';
		}
	}

	if (!validIssueStatus[issue.status]) //判断列表的类型
		return issue.status + ' is not valid status. ';

	return null;
}

exports.default = {
	validateIssue: validateIssue
};
//# sourceMappingURL=issue.js.map