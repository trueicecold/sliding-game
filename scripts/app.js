var App = angular.module('sliding', ['ngRoute']);

App.service('highscore', function() {
	this.get = function() {
		return JSON.parse(window.localStorage.getItem("scores")) || [];
	}

	this.set = function(name, score) {
		this.scores.push({
			name:name,
			score:score
		});
		
		this.scores.sort(this.highscoreSortFunc);
		this.scores = this.scores.splice(0, this.score_limit);
		window.localStorage.setItem("scores", JSON.stringify(this.scores));
	}
	
	this.highscoreSortFunc = function(a,b) {
		if (a.score < b.score)
			return -1;
		else if (a.score > b.score)
			return 1;
		else 
			return 0;
	}
	
	this.check = function(score) {
		if (this.scores.length == this.score_limit) {
			if (score < this.scores[this.scores.length-1].score)
				return true;
			return false;
		}
		else {
			return true;
		}
	}
	
	this.clear = function() {
		window.localStorage.removeItem("scores");
		this.scores = [];
	}
	
	this.scores = this.get();
	this.score_limit = 10;
});

App.directive('scoreList', function() {
  return {
    restrict:"A",
	replace:true,
	scope:{
		scores:"="
	},
	templateUrl: "templates/directives/score.html"
  };
});

App.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/highscore', {
				templateUrl: 'templates/highscore.html',
				controller: 'HighscoreCtrl'
			}).
			when('/index', {
				templateUrl: 'templates/game.html',
				controller: 'AppCtrl'
			}).
			otherwise({
				redirectTo: '/index'
		});
	}]);