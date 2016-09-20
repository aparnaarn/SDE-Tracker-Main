var app = angular.module('app', ['ngRoute', 'duScroll']);

app.config(function ($routeProvider) {
	$routeProvider
		//go to main page
		.when('/main', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		.when('/login', {
			templateUrl: 'filterlogin.html',
			controller: 'loginController'
		})
		.when('/land', {
			templateUrl: 'landingPage.html',
			controller: 'mainController'
		})
        //go to pendingWeeks page
		.when('/pendingWeeks', {
			templateUrl: 'pendingWeeks.html',
			controller: 'pendingController'
		})
		.when('/chooseTeam', {
			templateUrl: 'chooseTeam.html',
		})
		.when('/sendmail', {
			templateUrl: 'sendmail.html',
			controller: 'sendmailController'
		});
});

app.controller('mainController', function ($rootScope,$scope, $http,$location,$window,$timeout) {	

	console.log($rootScope.coast,$rootScope.account,$rootScope.projectName,$rootScope.selectedWeek);

	$('.btn-number').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {
    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    
    
});
$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

	$rootScope.preview = {};
          
    $scope.clientSatisfaction = {
        satisfaction: {id: '1', name: 'Extremely Satisfied'},
        availableOptions: [
            {id: '1', name: 'Extremely Satisfied'},
            {id: '2', name: 'Satisfied'},
            {id: '3', name: 'Neither Satisfied not dissatisfied'},
            {id: '4', name: 'Disatisfied'},
            {id: '5', name: 'Extremely Disatisfied'},
            {id: '6', name: 'Not Available'}
        ]
    };
	
    
    $scope.serviceType = {
        service: {id: '1', name: 'Milestone-High Visibilty'},
        availableOptions: [
            {id: '1', name: 'Milestone-High Visibilty'},
            {id: '2', name: 'Recurring-High Visibility'},
            {id: '3', name: 'Milestone'},
            {id: '4', name: 'Recurring'}
        ]
    };
   
    $scope.entry = {
    weekOf: '',
	cluster: '',
	account: '',
    projectName: '',
    serviceType: '',
    deliverableName: '',
    noOfDeliverables: '',
    description: '',
	totalIssues: '',
	totalIssueComments: '',
	criticalIssues: '',
	criticalIssueComments: '',
	presentationErrors: '',	
	presentationErrorComments: '',
	communicationLapse: '',
	lapseComments: '',
	deadlinesMissed: '',
	deadlineMissComments: '',
	docper: '',
	docComments: '',
	findingsper: '',
	findings: '',
	noOfInsights: '',
	businessInsight: '',
	businessMetric: '',
	comments: '',
	dollarValue: '',
    clientSatisfaction: '',
	negativeReviews: '',
	negativeFeedback: '',
	generalComments: '',
	teamdl: ''
    };


    $scope.preview = function () {


	    $scope.entry.weekOf = $rootScope.selectedWeek;
	    $scope.entry.cluster = $rootScope.coast;
	    $scope.entry.account = $rootScope.account;
	    $scope.entry.projectName = $rootScope.projectName;
	    $scope.entry.teamdl = $rootScope.currentProject.teamdl;
    	
    	console.log('In submit' + $scope.entry.teamdl)

    	$rootScope.preview = $scope.entry;	

    };

    $scope.submit = function () {

    	console.log("posting to mongo");

    	console.log("Entering SDE for: ",$rootScope.currentProject.teamdl);

        $http.post("/api/SDE", $scope.entry).success(function (response) {
			console.log(response);
 			$location.path('/login');
			window.location.reload();
		});
    }
});

app.controller('loginController', function ($scope,$rootScope,$window,$location,$http) {
	$rootScope.showBanner = true;
	$rootScope.currentProject = {};

	$rootScope.coast = "";
	$rootScope.account = "";
	$rootScope.projectName = "";

	$scope.clusters = ['WC','EC','PP'];

	$scope.allowedlogins = [];

	$http.get("/api/getAccounts").success(function (response) {

		$scope.allaccounts = [];
		for(x in response)
			$scope.allaccounts.push(response[x]);
		console.log($scope.allaccounts[0]);
	});		

	$scope.unique = function (list) {
		var result = [];
	    $.each(list, function(i, e) {
	        if ($.inArray(e, result) == -1) result.push(e);
	    });
	    return result;
	}
	
	$scope.getAccounts = function () {
		$scope.accounts = [];
		$scope.accountNames = [];

		console.log($scope.coast);

		for(x in $scope.allaccounts){
			if($scope.coast == $scope.allaccounts[x].cluster)
				$scope.accounts.push($scope.allaccounts[x].account);
				$scope.accounts = $scope.unique($scope.accounts);
		}
		console.log($scope.accounts);
	};

	$scope.getProjects = function () {
		$scope.projects = [];

		console.log($scope.account);

		for(x in $scope.allaccounts){
			if($scope.account == $scope.allaccounts[x].account)
				$scope.projects.push($scope.allaccounts[x].team);
		}
		console.log($scope.projects);
	};

	$scope.setlogins = function () {

		$scope.allowedlogins = [];

		for(x in $scope.allaccounts){
			if($scope.projectName == $scope.allaccounts[x].team){
				$rootScope.currentProject = $scope.allaccounts[x];
				$scope.allowedlogins.push($scope.allaccounts[x].aaa1);
				$scope.allowedlogins.push($scope.allaccounts[x].aaa2);
				$scope.allowedlogins.push($scope.allaccounts[x].oaa);
			}
		}

	}

	$scope.setProfile = function(profile){
		$scope.profile = profile;
	}

	 $scope.changeView = function(){
	 	if($scope.allowedlogins.length == 0){
    		console.log('team not selected');
    		$('#alertmsg1').remove();
    		$('<div id="alertmsg1" class="alert alert-danger" style="margin-top:2ex">Please select the team first.</div>').hide().appendTo("#innerWrap");
    		$('#alertmsg1').fadeIn('slow').delay(5000).fadeOut('slow');
    		return;
    	}
	 	email = $scope.profile.getEmail();
		if($.inArray(email, $scope.allowedlogins) != -1){
			console.log("Email authorized")
			$scope.name = name;
			console.log($scope.name);	
	 		console.log("In changeView");
            $location.path('/main'); // path not hash
		}
		else{
			console.log("Email not authorized");
    		$('#alertmsg2').remove();
    		$('<div id="alertmsg2" class="alert alert-danger" style="margin-top:2ex">Please use an authorized email.</div>').hide().appendTo("#innerWrap");
    		$('#alertmsg2').fadeIn('slow').delay(5000).fadeOut('slow');
    		return;
		}	
    }

    $scope.sendMail = function (){
    	if($scope.allowedlogins.length == 0){
    		console.log('team not selected');
    		$('#alertmsg1').remove();
    		$('<div id="alertmsg1" class="alert alert-danger" style="margin-top:2ex">Please select the team first.</div>').hide().appendTo("#innerWrap");
    		$('#alertmsg1').fadeIn('slow').delay(3000).fadeOut('slow');
    		return;
    	}
    	email = $scope.profile.getEmail();
    	if($.inArray(email, $scope.allowedlogins) != -1){
			console.log("Email authorized")
			$scope.name = name;
			console.log($scope.name);
    		$location.path('/sendmail');
		}
		else{
			console.log("Email not authorized");
    		$('#alertmsg2').remove();
    		$('<div id="alertmsg2" class="alert alert-danger" style="margin-top:2ex">Please use an authorized email.</div>').hide().appendTo("#innerWrap");
    		$('#alertmsg2').fadeIn('slow').delay(5000).fadeOut('slow');
    		return;
		}
    }

    $scope.signout = function(){}

    $scope.remind = function(){

    }    

});

app.controller('sendmailController', function ($scope,$rootScope,$window,$location,$http) {
	var res;
	console.log('send mail controller');
	$scope.entries;

	$scope.getEntries = function(){
		$scope.entries = [];	
		console.log('Getting Entries for ' + $rootScope.currentProject.team + ' - ' + $scope.entryWeek);
		$http.get("/api/getEntries", {params:{"param1": $rootScope.currentProject.team, "param2": $scope.entryWeek}}).success(function (response) {
			console.log(response);
			for (i in response)
				$scope.entries.push(response[i]);
			for (i in $scope.entries)
				console.log(i);
		});
	}

	$scope.sendmail = function (){
		$http.post("/api/sendMail",$scope.entries).success(function(){
			console.log("sentmail");
			$location.path('/login');
			window.location.reload();
		});

	}
});

app.controller('pendingController', function ($scope) {
	
});
