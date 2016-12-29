(function (angular) {
    var app = angular.module('indexApp', ['ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            //登录路由
            .state("login", {
                url: "/login",
                templateUrl: "partialview/login.html"
            })
            //医生端路由
            .state("sidebar", {
                url: "/sidebar",
                templateUrl: "partialview/sidebar.html"
            })
            .state("sidebar.main", {
                url: "/main",
                templateUrl: "partialview/main.html"
            })
            .state("sidebar.image", {
                url: "/image",
                templateUrl: "partialview/image.html"
            })
            .state("sidebar.illnesscase", {
                url: "/illnesscase",
                templateUrl: "partialview/illnesscase.html"
            })
            .state("sidebar.share", {
                url: "/share",
                templateUrl: "partialview/share.html"
            })
            .state("sidebar.consult", {
                url: "/consult",
                templateUrl: "partialview/consult.html"
            })
            .state("sidebar.myfriend", {
                url: "/myfriend",
                templateUrl: "partialview/myfriend.html"
            })
            .state("sidebar.install", {
                url: "/install",
                templateUrl: "partialview/install.html"
            })
            .state("sidebar.addshare", {
                url: "/addshare",
                templateUrl: "partialview/addshare.html"
            })
            .state("sidebar.expertconsult", {
                url: "/expertconsult",
                templateUrl: "partialview/expertconsult.html",
                controller:"expertconsultController"
            });

        $urlRouterProvider.otherwise('/login');

    });


    app.controller('sideController', ['$scope', '$location', function ($scope, $location) {
        //侧边栏的tab栏切换
        $scope.tabs = [
            {
                title: '主页',
                url: 'main.html',
                path: '.main'
            }, {
                title: '我的影像',
                url: 'image.html',
                path: '.image'
            },
            {
                title: '我的病例',
                url: 'illnesscase.html',
                path: '.illnesscase'
            },
            {
                title: '我的分享',
                url: 'share.html',
                path: '.share'
            },
            {
                title: '我的咨询',
                url: 'consult.html',
                path: '.consult'
            },
            {
                title: '我的朋友圈',
                url: 'myfriend.html',
                path: '.myfriend'
            },
            {
                title: '设置',
                url: 'install.html',
                path: '.install'
            }
        ];
        //str获取url最后/后的参数为了初始化
        var str = $location.absUrl();
        var index = str.lastIndexOf("\/");
        var str = str.substring(index + 1, str.length) + ".html";
        //初始化
        if ($scope.currentTab == undefined) {
            $scope.currentTab = str;
        }
        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $scope.currentTab;
        };
        $scope.onClickTab = function (tab, index) {
            var a = index;
            $scope.currentTab = tab.url;
            $scope.item = a;
        };
        //每个不同的icon
        $scope.bgImg = [
            {"backgroundPosition": "-18px -16px"},
            {"backgroundPosition": "-73px -16px"},
            {"backgroundPosition": "-129px -16px"},
            {"backgroundPosition": "-183px -16px"},
            {"backgroundPosition": "-238px -16px"},
            {"backgroundPosition": "-294px -16px"},
            {"backgroundPosition": "-347px -16px"}
        ];

    }]);
    app.directive('resize', function ($window) {
        //侧边栏自适应后边高度
        return {
            restrict:'EA',
            link:function (scope, element) {
                var body = angular.element("#doctorBody");
                var win = angular.element($window);
                scope.getSideHeight = function () {
                    if (body.height() >= win.height()) {
                        return {'getHeight': body.height()};
                    } else {
                        return {'getHeight': win.height()};
                    }
                };
                scope.$watch(scope.getSideHeight, function (newValue, oldValue) {
                    scope.sideStyle = function () {
                        return {
                            'height': (newValue.getHeight) + 'px'
                        };
                    };

                }, true);

                win.bind('resize', function () {
                    scope.$apply();
                });
                body.bind('resize', function () {
                    scope.$apply();
                });
            }
        }
    });

})(angular);