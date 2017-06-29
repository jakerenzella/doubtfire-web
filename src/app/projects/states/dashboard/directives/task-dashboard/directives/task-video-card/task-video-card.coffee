angular.module('doubtfire.projects.states.dashboard.directives.task-dashboard.directives.task-video-card', [])
#
# plagiarism of task information
#
.directive('taskVideoCard', ->
  restrict: 'E'
  templateUrl: 'projects/states/dashboard/directives/task-dashboard/directives/task-video-card/task-video-card.tpl.html'
  scope:
    task: '='
    videoConfig: '=?'
  controller: ($scope, $sce, listenerService) ->
    # Cleanup
    listeners = listenerService.listenTo($scope)
    listeners.push $scope.$watch('task.id', ->
      return unless $scope.task?
      # Resource download URLs
      $scope.videoConfig = {
        preload: "none",
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
        ],
        theme: {
          url: "https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css"
        }
      }
    )
)
