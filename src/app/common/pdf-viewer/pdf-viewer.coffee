angular.module("doubtfire.common.pdf-viewer", [])
#
# Basic PDF viewer
#
.directive('pdfViewer', ->
  restrict: 'E'
  templateUrl: 'common/pdf-viewer/pdf-viewer.tpl.html'
  scope:
    pdfUrl: '='
  controller: ($scope, $element) ->

    iOSversion = ->
      if /iP(hone|od|ad)/.test(navigator.platform)
        # supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
        return [
          parseInt(v[1], 10)
          parseInt(v[2], 10)
          parseInt(v[3] or 0, 10)
        ]
      return
)
