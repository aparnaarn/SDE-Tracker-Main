var app = angular.module('app', ['ngRoute', 'duScroll','ui.bootstrap']);

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

app.controller('mainController', function ($rootScope,$scope, $http,$location,$window) {	

	console.log($rootScope.coast,$rootScope.account,$rootScope.projectName,$rootScope.selectedWeek);
          
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

    $scope.submit = function () {
    	$scope.entry.weekOf = $rootScope.selectedWeek;
    	$scope.entry.cluster = $rootScope.coast;
    	$scope.entry.account = $rootScope.account;
    	$scope.entry.projectName = $rootScope.projectName;


    	console.log("posting to mongo");
    	//console.log("Entering SDE for: ",$rootScope.currentProject.teamdl);

        /*$http.post("/api/SDE", $scope.entry,$rootScope.currentProject.teamdl).success(function (response) {
			console.log(response);
 			$location.path('/login');
			window.location.reload();
		});*/
    };
});

app.controller('loginController', function ($scope,$rootScope,$window,$location,$http) {
	$rootScope.showBanner = true;
	$rootScope.currentProject = {};

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

	 $scope.changeView = function(profile){
	 	console.log($scope.allowedlogins);
	 	email = $scope.profile.getEmail();
		if($.inArray(email, $scope.allowedlogins) != -1){
			console.log("Email authorized")
			valid = 1;
			$scope.name = name;
			console.log($scope.name);	
	 		console.log("In changeView");
            $location.path('/main'); // path not hash
		}
		else{
			console.log("Email not authorized");
		}	
    }

    $scope.sendMail = function (){
    	$location.path('/sendmail');
    }    

});

app.controller('sendmailController', function ($scope,$rootScope,$window,$location,$http) {
	var res;
	console.log('send mail controller');
	$scope.getEntries = function(){		
		console.log('Getting Entries for ' + $rootScope.currentProject.team + ' - ' + $scope.entryWeek);
		$http.get("/api/getEntries", {params:{"param1": $rootScope.currentProject.team, "param2": $scope.entryWeek}}).success(function (response) {
			console.log(response);
			$scope.entries = [];
			for (i in response)
				$scope.entries.push(response[i]);
			for (i in $scope.entries)	
				console.log($scope.entries[i].deliverableName);
		});
	}
});

app.controller('pendingController', function ($scope) {
	
});
