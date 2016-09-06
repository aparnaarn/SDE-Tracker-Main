var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var SDEEntry = mongoose.model('sdeweekly');
var teamdetail = mongoose.model('teamdetail');
var json2csv = require('json2csv');

router.post('/SDE', function (req, resp) {
	console.log("Saving to mongo");
    var input = req.body;
    var entry = new SDEEntry();
    console.log(input.deliverableName);
    entry.weekOf = input.weekOf;
    entry.cluster = input.cluster;
    entry.account = input.account;	
    entry.projectName = input.projectName;
    entry.serviceType = input.serviceType;
    entry.deliverableName = input.deliverableName;
    entry.noOfDeliverables = input.noOfDeliverables;
    entry.description = input.description;
    entry.totalIssues = input.totalIssues;
    entry.totalIssueComments = input.totalIssueComments;
    entry.criticalIssues = input.criticalIssues;
    entry.criticalIssueComments = input.criticalIssueComments;
    entry.presentationErrors = input.presentationErrors;
    entry.presentationErrorComments = input.presentationErrorComments;
    entry.communicationLapse = input.communicationLapse;
    entry.lapseComments = input.lapseComments;
    entry.deadlinesMissed = input.deadlinesMissed;
    entry.deadlineMissComments = input.deadlineMissComments;
    entry.docper = input.docper;
    entry.docComments = input.docComments;
    entry.findingsper = input.findingsper;
    entry.findings = input.findings;
    entry.noOfInsights = input.noOfInsights;
    entry.businessInsight = input.businessInsight;
    entry.businessMetric = input.businessMetric;
    entry.comments = input.comments;
    entry.dollarValue = input.dollarValue;
    entry.clientSatisfaction = input.clientSatisfaction;
    entry.negativeReviews = input.negativeReviews;
    entry.negativeFeedback = input.negativeFeedback;
    entry.generalComments = input.generalComments;
    entry.teamdl = input.teamdl;

    console.log('Entry: '+entry);

    entry.save(function (err, entry) {
        if (err) {
            return resp.send(500, err);
        }
        console.log('saved to mongo');
        return resp.json(entry);
    });

});

router.get('/getAccounts', function (req, res) {
	console.log("getting accounts");
	teamdetail.find(function (err, s) {
		if (err) {
            console.log(err);
			return console.error(err);
		}
        console.log(s);
		return res.send(s);
	});	
});

router.get('/getEntries',function(req,res){    
    console.log('in get entries');
    var params = req.query;

    var team = params.param1;
    var week = params.param2;

    SDEEntry.find({'projectName':team,'weekOf':week},function (err, s) {

        if (err) {
            console.log('Error getting data' + err);
        }
        console.log('inside find'+s);
        return res.send(s);
    }); 
});

router.post('/sendMail',function(req,res){    

    var input = req.body;
    console.log('inside sendmail');
    console.log(input);

    console.log(input[0].teamdl);
    sendmail = input[0].teamdl;

    var body = 'Please find attached the SDE entries for the week\n\n';

    for (i in input){
        body += "Deliverable" + (i+1) +"\n";
    }

    console.log('body'+body);

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sdeweekly@gmail.com', // Your email id
            pass: 'sdeweekly20' // Your password
        }
    });

    console.log('transporter created');

    var mailOptions = {
        from: 'sdeweekly@gmail.com', // sender address
        to: sendmail, // list of receivers
        subject: 'SDE Weekly Entry', // Subject line
        text: body //content
    };

    console.log('sending email');

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
            return res.send(info.response);
        };
    });
});

module.exports = router;
