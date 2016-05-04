App.controller('HighscoreCtrl', function HighscoreCtrl($scope, highscore) {
	$scope.init = function() {
		$scope.get();
	}
	
	$scope.get = function() {
		$scope.scores = highscore.get();
	}
	
	$scope.clear = function(score) {
		highscore.clear();
		$scope.get();
	}
	
	$scope.init();
});