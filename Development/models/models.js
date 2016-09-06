var mongoose = require('mongoose');

var sdeSchema = new mongoose.Schema({
	weekOf: Date,
	cluster: String,
	account: String,
    projectName: String,
    serviceType: String,
    deliverableName: String,
    noOfDeliverables: Number,
    description: String,
	totalIssues: Number,
	totalIssueComments: String,
	criticalIssues: Number,
	criticalIssueComments: String,
	presentationErrors: Number,	
	presentationErrorComments: String,
	communicationLapse: Number,
	lapseComments: String,
	deadlinesMissed: Number,
	deadlineMissComments: String,
	docper: Number,
	docComments: String,
	findingsper: Number,
	findings: String,
	noOfInsights: Number,
	businessInsight: String,
	businessMetric: String,
	comments: String,
	dollarValue: Number,
    clientSatisfaction: String,
	negativeReviews: Number,
	negativeFeedback: String,
	generalComments: String,
	teamdl: String
});

var accountSchema = new mongoose.Schema({

	cluster: String,
	account: String,
	team: String,
	sponsor: String,
	sapid: String,
	status: String,
	onsiteoroffshore: String,
	sowandinvoice: String,
	offshoremanger: String,
	offshorelead: String,
	onsitelead: String,
	teamdl: String,
	aaa1: String,
	aaa2: String,
	oaa: String
});

mongoose.model('sdeweekly', sdeSchema);
mongoose.model('teamdetail', accountSchema);
