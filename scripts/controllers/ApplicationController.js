App.controller('AppCtrl', function AppCtrl($scope, highscore) {
	$scope.tile_dimension = 80; // width and height of a tile
	$scope.tiles = [];
	$scope.game_size = 4;
	
	$scope.init = function() {
		document.onkeydown = $scope.keyDown;
		$scope.$on("$destroy", $scope.destroy);
		$scope.create();
	}

	$scope.destroy = function() {
		document.onkeydown = null;
	}
	
	$scope.create = function() {
		if ($scope.game_size < 2 || $scope.game_size > 4) {
			alert("Game board must be between 2 and 4");
			return;
		}
		
		$scope.tiles = [];
		$scope.tile_length = Math.pow($scope.game_size, 2);
		
		for (var y=0;y<$scope.game_size;y++) {
			$scope.tiles[y] = [];
			
			for (var x=0;x<$scope.game_size;x++) {
				$scope.tiles[y].push({
					x:x,
					y:y,
					id:y * $scope.game_size + x + 1
				});
			}
		}
		
		$scope.blank_tile = {
			x:$scope.game_size-1,
			y:$scope.game_size-1
		}
		
		$scope.score = 0;
		$scope.shuffle_current = 0;
		$scope.last_shuffle = 0;
		$scope.shuffle();
	}
	
	$scope.getTileRowStyle = function() {
		return {
			width: ($scope.tiles.length * $scope.tile_dimension) + "px",
			height: $scope.tile_dimension + "px"
		}
	}
	
	$scope.getTileStyle = function() {
		return {
			width: $scope.tile_dimension + "px",
			height: $scope.tile_dimension + "px",
			float: "left"
		}
	}
	
	$scope.getTileClass = function(x, y) {
		var tile = $scope.tiles[y][x];
		return "tile-" + (!($scope.isBlank(x, y)) ? $scope.tiles[y][x].id : "blank");
	}
	
	$scope.isBlank = function(x, y) {
		return $scope.tiles[y][x].id == $scope.tile_length;
	}
	
	$scope.checkWin = function() {
		if ($scope.state == "playing") {
			for (var y=0;y<$scope.tiles.length;y++) {
				for (var x=0;x<$scope.tiles.length;x++) {
					if ($scope.tiles[y][x].id != y * $scope.tiles.length + x + 1) {
						return "NO WIN";
					}
				}
			}
			
			$scope.state = "finished";
			
			if (highscore.check($scope.score)) {
				$scope.name = prompt("Enter your name for the highscore:", "");
				if ($scope.name) {
					highscore.set($scope.name, $scope.score);
				}
			}
			
			return "WIN";
		}
		
		return "";
	}
	
	/*
		Swaps the tile ids, and sets a new blank tile position
		Note: could possibly optimize the "if" clause
	*/
	$scope.swap = function(x, y, countMove) {
		if ($scope.blank_tile.x + x >= 0 && $scope.blank_tile.x + x < $scope.tiles.length && $scope.blank_tile.y + y >= 0 && $scope.blank_tile.y + y < $scope.tiles.length) {
			var dest_tile = $scope.tiles[$scope.blank_tile.y+y][$scope.blank_tile.x+x];
			$scope.tiles[$scope.blank_tile.y][$scope.blank_tile.x].id = dest_tile.id;
			$scope.tiles[$scope.blank_tile.y+y][$scope.blank_tile.x+x].id = $scope.tile_length;
			
			$scope.blank_tile.x += x;
			$scope.blank_tile.y += y;
			
			if ($scope.state == "playing")
				$scope.score++;
		}
	}
	
	/*
		Solvable shuffle only
		Since half of the games are unsolvable using true random shuffle,
		I shuffle from the empty tile only, making sure it's solvable.
	*/
	$scope.shuffle_iterations = 10;
	$scope.shuffle_current = 0;
	$scope.last_shuffle = 0;
	$scope.shuffle = function() {
		$scope.state = "shuffling";
		
		var rand_key = (37 + Math.floor(Math.random()*4));
		if ($scope.last_shuffle == rand_key || Math.abs($scope.last_shuffle - rand_key) == 2) {
			return $scope.shuffle();
		}
		
		$scope.last_shuffle = rand_key;
		$scope.keyPress(rand_key);
		$scope.shuffle_current++;
		if ($scope.shuffle_current < $scope.shuffle_iterations) {
			setTimeout($scope.shuffle, 10);
		}
		else {
			$scope.state = "playing";
		}
	}
	
	$scope.keyPress = function(keyCode) {
		if ($scope.state == "shuffling" || $scope.state == "playing") {
			switch(keyCode) {
				case 37:
					$scope.swap(-1, 0);
					break;
				case 38:
					$scope.swap(0, -1);
					break;
				case 39:
					$scope.swap(1, 0);
					break;
				case 40:
					$scope.swap(0, 1);
					break;
			}
			$scope.$applyAsync();
		}
	}
	
	$scope.keyDown = function(e) {
		$scope.keyPress(e.keyCode);
	}
	
	$scope.init();
	$scope.create();
});