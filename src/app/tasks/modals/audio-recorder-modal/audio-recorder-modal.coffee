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
  options = {type: 'audio'}
  stream = new MediaStream


  mediaRecorder = new MediaRecorder(stream, options)
  mediaRecorder.ondataavailable = handleDataAvailable
  mediaRecorder.start()

  handleDataAvailable = (event) ->
    if event.data.size > 0
      recordedChunks.push event.data
    else
      # ...
    return

  $scope.play = ->
    superBuffer = new Blob(recordedChunks)
    videoElement.src = window.URL.createObjectURL(superBuffer)
    return

  $scope.stop = ->
    mediaRecorder.stop()

  $scope.ok = ->
    $modalInstance.close($scope.recorder)
  $scope.close = ->
    $modalInstance.dismiss()
)
