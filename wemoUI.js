angular.module('sprockets.plugin.wemo', ['sprockets', 'ui.bootstrap']);

angular.module('sprockets.plugin.wemo').controller('wemoConfigController', function($scope, pluginService) {
    $scope.validation.add('config.id', 'id', $scope.services.required);
    $scope.availableDevices = [];
    var loadData = function() {
        pluginService.getConfigData($scope.plugin, {}).then(function (response) {
            $scope.availableDevices = response.availableDevices;
            if ($scope.availableDevices.length > 0) {
                $scope.config.device = $scope.availableDevices[0].id;
            }
        });
    };
    loadData();
    $scope.refresh = function() {
        loadData();
    };
});
