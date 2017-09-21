var myApp = angular.module('MyApp', ['onsen', 'ui.router']);

// 遷移処理
myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('list', {
				url: '/list',
				templateUrl: 'list.html'
			})
			
	}]);

// メイン画面用コントローラ
myApp.controller('JSONController', ['$scope', '$state', '$rootScope', '$timeout', function($scope, $state, $rootScope, $timeout) {
		$scope.readJSON = function() {
	     	console.log("readJSON");
	     	
			// ローディングフラグON
			$rootScope.isLoading = true;
			
			// 2秒待ってから遷移する
			$timeout(function() {
				$state.go('list');
			}, 2000);
		}
	}]);

// リスト画面用コントローラ
myApp.controller('ListController', ['$scope', '$state', '$rootScope', 'JsonFlowerService', function($scope, $state, $rootScope, JsonFlowerService) {
		// Jsonデータ取得
		JsonFlowerService.run().then(
			function(resultList) {
				// 結果リストが取れたら、スコープに設定
				$scope.list = resultList;
			}, function(response) {
				ons.notification.alert({
					title: 'JSON取得失敗',
					message: response
				});
			}
		);
	}]);

// ローディングタグ
myApp.directive('myLoader', function() {
		return {
			restrict : 'E',
			replace: true,
			templateUrl: "loader.html"
		};
	});	
	
	
// 画面遷移タイミング処理
myApp.run(['$rootScope', '$transitions', '$state', function($rootScope, $transitions, $state){
	$transitions.onSuccess({to:'*'}, function(trans){
		// ページ読み込み成功
		
		// ローディングフラグOFF
		$rootScope.isLoading = false;
	});
	
}]);
		

// JSON読込サービス
myApp.service('JsonFlowerService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
     this.run = function () {
     	console.log("JsonFlowerService");
     	
		var deferred = $q.defer();
		
		$timeout(function(){
			$http({
				method: 'GET',
				url: 'flower.json'
			}).then(function successCallback(response) {				
				// 成功した場合、リストをまるごと返す
				deferred.resolve(response.data.list);
			}, function errorCallback(response) {
				// 失敗した場合
				var msg = "JsonFlowerService json取得失敗: "+ response.status;
				console.error(msg);
				deferred.reject(msg);
			});
		});
		
		return deferred.promise;
    };

}]);
        		