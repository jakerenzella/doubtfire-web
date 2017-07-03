angular.module("doubtfire.tasks.audio-comment-recorder", [])

#
# View's the comments for a specific task, and allows new
# comments to be made on a task
#
.directive('audioCommentRecorder', ->
  restrict: 'E'
  templateUrl: 'tasks/audio-comment-recorder/audio-comment-recorder.tpl.html'
  scope:
    timeLimit: '='
  controller: ($scope, $timeout) ->
    $scope.timeLimit = 10

    recorderServiceProvider = ->
      recorderServiceProvider
        .forceSwf(false)
        .withMp3Conversion(true)
)
