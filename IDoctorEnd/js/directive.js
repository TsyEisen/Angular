(function (angular) {
    var app = angular.module('directiveApp', []);
    //时间插件的基础配置
    app.directive('timebase', function () {
        return {
            restrict: 'AE',
            scope: {
                placeholder: '=placeholder',
                time: '=time',
                dateOptions:'=dateOptions'
            },
            template: '<div class="input-group"><input type="text" placeholder="{{placeholder}}" class="form-control" uib-datepicker-popup="{{format}}" ' +
            'ng-model="time" is-open="popUpOpened"' +
            'datepicker-options="dateOptions"' +
            'close-text="关闭" current-text="今天" clear-text="清除"' +
            'ng-click="open()"/>',
             controller: function ($scope) {
                $scope.open = function () {
                    $scope.popUpOpened = true;
                };
            }
        }
    });


    app.directive('heightSize', function ($window) {
        return {
            restrict: 'AE',
            scope: {},
            link: function (scope, element, attrs) {
                scope.body = angular.element("#doctorBody");
                scope.win = angular.element($window);
                scope.changeSize = function () {
                    if (scope.body.height() < scope.win.height()) {
                        element.css('height', scope.win.height() - 60 + 'px');
                    } else {
                        element.css('height', scope.body.height() - 60 + 'px');
                    }
                };

            }
        }
    });


    app.directive('autoheight', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            var con = angular.element("#rightTable");
            scope.getContentDimensions = function () {
                if(w.height()>=con.height()){
                    return { 'h': w.height()-60};
                }else{
                    return { 'h': con.height()};
                }

            };
            scope.$watch(scope.getContentDimensions, function (newValue, oldValue) {
                scope.style = function () {
                    return {
                        'height': (newValue.h) + 'px'
                    };
                };

            }, true);

            w.bind('autoheight', function () {
                scope.$apply();
            });
            con.bind('autoheight', function () {
                scope.$apply();
            });
        }
    });




    app.directive('widthSize', function ($window) {
        return {
            restrict: 'AE',
            scope: {},
            link: function (scope, element, attrs) {
                var win = angular.element($window);
                element.css('width', win.width()+ 'px');
            }
        }
    });

    //登录页的背景高度
    app.directive('winHeight', function ($window) {
        return {
            restrict: 'AE',
            scope: {},
            link: function (scope, element, attrs) {
                var win = angular.element($window);
                element.css('height', win.height()+ 'px');
            }
        }
    });

    //影像缩略图请求报错时显示图片
    app.directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    });

    //app.directive('test',function(){
    //    return {
    //        restrict:'AE',
    //        link:function(scope,element,attrs){
    //           console.log("attrs",attrs.class);
    //            if (attrs.class == "modal-open") {
    //                alert("success")
    //            }
    //            if (attrs.class == undefined) {
    //                alert("error")
    //            }
    //        }
    //    }
    //})
    // app.directive('deleteicon', function () {
    //     return {
    //         restrict: 'AE',
    //         scope: {
    //             placeholder: '=placeholder',
    //             time: '=time',
    //             dateOptions:'=dateOptions'
    //         },
    //         template: '',
    //         controller: function ($scope) {
    //             $scope.open = function () {
    //                 $scope.popUpOpened = true;
    //             };
    //         }
    //     }
    // });

})(angular);