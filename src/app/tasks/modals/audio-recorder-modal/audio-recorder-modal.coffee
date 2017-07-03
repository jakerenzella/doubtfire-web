angular.module("doubtfire.tasks.modals.audio-recorder-modal", [])

#
# View's the comments for a specific task, and allows new
# comments to be made on a task
#
.factory('AudioRecorderModal', ($modal) ->
  AudioRecorderModal = {}
  audio = -> {}
  AudioRecorderModal.show = ->
    $modal.open
      templateUrl: 'tasks/modals/audio-recorder-modal/audio-recorder-modal.tpl.html'
      controller: 'AudioRecorderModalCtrl'
      resolve:
        audio -> audio
  AudioRecorderModal
)

.controller('AudioRecorderModalCtrl', ($scope, $modalInstance, $log, taskService) ->
  $log.info($scope)
  $scope.ok = ->
    $modalInstance.close($scope.recorder)
  $scope.close = ->
    $modalInstance.dismiss()
)
