//Add bounce easing:
$.cssEase['bounce'] = 'cubic-bezier(0,1,0.5,1.2)';

angular.module('proposio', ['ngRoute', 'ngAnimate'])
    .config(function($routeProvider){
        $routeProvider
        .when('/', {
           templateUrl: 'templates/home.html',
            controller: 'DefaultCtrl'
         })
        .when('/proposals', {
            templateUrl: 'templates/proposals.html',
            controller: 'DefaultCtrl'
        })
        .when('/clients', {
            templateUrl: 'templates/clients.html',
            controller: 'DefaultCtrl'
        })
        .when('/templates', {
            templateUrl: 'templates/templates.html',
            controller: 'DefaultCtrl'
        })
        .when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'DefaultCtrl'
        })
        .otherwise({redirectTo: '/'});
    })
    .controller('DefaultCtrl', function($scope){
        
        $scope.getClass = function getClass(idx, list) {
            return list[idx].classes || '';
        };
        
        $scope.$on('data-insert', function(event, data){
            $scope.data.push({
                'client': data,
                'proposal': data,
                'template': data,
                'classes': 'animated bounceIn'
            });
        });
        
        //Some universally-typed reusable data:
        $scope.data = [{
            'client': 'John Doe',
            'proposal': 'Test Proposal',
            'template': 'Table Template'
        }, {
            'client': 'Phil Bob',
            'proposal': 'Nike Proposal',
            'template': 'Adjustable Fee Template'
        }, {
            'client': 'Red John',
            'proposal': 'Facebook Redesign',
            'template': 'Fillable Text Block Template'
        }, {
            'client': 'Alex',
            'proposal': 'Redevelop Intranet',
            'template': 'Core Update Table'
        }, {
            'client': 'Shawn',
            'proposal': 'CSS Tweak',
            'template': 'Technical Consulting Template'
        }, {
            'client': 'Kole Billy Bob',
            'proposal': 'Big Project 1',
            'template': 'Project Deadline Legal'
        }, {
            'client': 'Facebook',
            'proposal': 'Notkia refresh',
            'template': 'IP Clause'
        }, {
            'client': 'Twitter',
            'proposal': 'Centralize JS',
            'template': 'Reusable Pricing Table'
        }, {
            'client': 'Liabus',
            'proposal': 'Roundabout Estimate',
            'template': 'Signature Template'
        }, {
            'client': 'Demo Client',
            'proposal': 'Update Core',
            'template': 'Legal Block'
        }, {
            'client': 'Beagle Networks',
            'proposal': 'Major redesign for large company.',
            'template': 'Table Template'
        }, {
            'client': 'BuyPetStuff.com',
            'proposal': 'Proposal One',
            'template': 'Text Template'
        }];
    })
    .controller('HeaderCtrl', function($scope, $rootScope){
        
        //Request an insert to be, well, inserted:
        $scope.$on('request-insert', function(ev, name){
            if(name === 'profile'){
                $scope.loadProfile();
            }
        });
        
        $scope.loadProfile = function($event){
            var insert = {
                //Give it a name so that the sidebar-remove event is broadcast we can re-add the profile picture.
                'name': 'my-profile',
                //This ends up being generated in the next few lines:
                'html': null,
                //We want this to be inserted as an activated element:
                'activated': true,
                //Auto-route to profile:
                'route': '/profile'
            }
            
            //Force position relative:
            $('#profile-button').css('position', 'relative');
            $('#profile-button').transition({y: '-120px'});
            
            //Generate insertion HTML:
            var html = $('<li><span style="background-image: url(\'http://theoutsidescoop.net/wp-content/uploads/2011/10/poo.png\'); background-size: cover;"></span></li>');
            insert.html = html;
            
            //Insert it:
            $rootScope.$broadcast('sidebar-insert', insert);
        }
        
        $scope.$on('sidebar-remove', function(ev, name){
            if(name === 'my-profile'){
                console.log('removed');
                $('#profile-button').css('position', 'relative');
                $('#profile-button').transition({y: '0px', easing: 'bounce'});
            }
        })
        
    })
    .controller('SidebarCtrl', function($scope, $compile, $rootScope, $location) {
        $scope.last = 'home';
        
        function isDefault(name){
            if(name === 'home' || name === 'proposals' || name === 'clients' || name === 'templates'){
                return true;
            }
            return false;
        }
        
        //Activate a sidebar element on initial route:
        $scope.$on('$routeChangeSuccess', function(event, next, current) {
            
            var route = $location.path().split('/')[1] || '';
            
            //Deep routing on this layout isn't yet supported.
            if(isDefault(route) && route !== $scope.last){
                $scope.show(route);
            }else if($scope.last !== 'insert'){
                $rootScope.$broadcast('request-insert', route);
            }
        });

        $('.tooltip-enable').tooltip({
            delay: {
                show: 600
            } 
        });
        $('#menu-new-proposal').popover({
            animation: true,
            html: true,
            placement: 'right',
            content: $compile('<generator-input type="proposal"></generator-input>')($scope)
        });
        $('#menu-new-template').popover({
            animation: true,
            html: true,
            placement: 'right',
            content: $compile('<generator-input type="template"></generator-input>')($scope)
        });
        $('#menu-new-client').popover({
            animation: true,
            html: true,
            placement: 'right',
            content: $compile('<generator-input type="contact"></generator-input>')($scope)
        });
        $('.has-popover').on('show.bs.popover', function(){
           $scope.$broadcast('popover-shown', true); 
        });
        
        $scope.$on('sidebar-insert', function(ev, insert){
            $scope.insert(insert.name, insert.html, insert.route, insert.activated || false);
        });
        
        $scope.insert = function(name, struct, route, active){
            //struct = HTML element to insert.
            //route = the route location to redirect to once we insert the div. If set to a falsy value, no routing is performed.
            //Get jQuery reference:
            struct = $(struct);
            struct.addClass('springAll inserted');
            struct.css('left', '-100px');
            
            if(active){
                struct.addClass('active');
                struct.css('top', '-50px');
            }
            
            struct.css('margin-bottom', '-90px');
            $('#subnav').prepend(struct);
            //Animate in:
            struct.transition({'margin-bottom': ''});
            //struct.transition({'left': '0px', easing: 'easeInBack'});
            struct.transition({
                left: '0px',
                perspective: '100px',
                rotateY: '360deg',
                easing: 'bounce',
                duration: 1000
            });
            
            if(active){
                $('.navtype').transition({ opacity: 0 }).addClass('disable');
                $scope.last = 'insert';
                $scope.inserted = name;
                
                if(route){
                     $location.path(route);
                }
            }
        }


        //This function isn't as general as it should be, but it's easy this way:
        $scope.show = function(type){
            $('.has-popover').popover('hide');
            
            if($scope.last === 'insert'){
                $('#home-nav').find('.inserted').transition({
                    left: '-200px',
                }).transition({'margin-bottom': '-90px'}, function(){
                    $(this).remove();
                    $rootScope.$broadcast('sidebar-remove', $scope.inserted);
                })
            }
            
            
            if(type === 'home'){
                $('#home-nav').find('ul').removeClass('activated');
                $('#home-nav').find('li').removeClass('active');

                if($scope.last === 'proposals'){
                  $('#templates-nav').transition({ opacity: 1 }).removeClass('disable');
                  $('#clients-nav').transition({ opacity: 1 }).removeClass('disable');
                }else if($scope.last === 'clients'){
                  $('#templates-nav').transition({ opacity: 1 }).removeClass('disable');
                  $('#proposals-nav').transition({ opacity: 1 }).removeClass('disable');
                }else if($scope.last === 'templates'){
                  $('#clients-nav').transition({ opacity: 1 }).removeClass('disable');
                  $('#proposals-nav').transition({ opacity: 1 }).removeClass('disable');
                }else{
                    $('#clients-nav').transition({ opacity: 1 }).removeClass('disable');
                    $('#templates-nav').transition({ opacity: 1 }).removeClass('disable');
                    $('#proposals-nav').transition({ opacity: 1 }).removeClass('disable');
                }
            }else if(type === 'proposals'){
                $('#proposals-nav').addClass('active');
                $('#templates-nav').transition({ opacity: 0 }).addClass('disable');
                $('#clients-nav').transition({ opacity: 0 }).addClass('disable');
            }else if(type === 'templates'){
                $('#templates-nav').addClass('active');
                $('#proposals-nav').transition({ opacity: 0 }).addClass('disable');
                $('#clients-nav').transition({ opacity: 0 }).addClass('disable');
            }else if(type === 'clients'){
                $('#clients-nav').addClass('active');
                $('#templates-nav').transition({ opacity: 0 }).addClass('disable');
                $('#proposals-nav').transition({ opacity: 0 }).addClass('disable');
            }
            $scope.last = type;
        };
    })
    .directive('generatorInput', function($rootScope, $timeout) {
        return {
            restrict: 'E',
            scope: {
                type: '=type'
            },
            template: '<div class="input-group"><input type="text" style="width: 200px;" class="form-control" placeholder="Enter name..." ng-model="desire" ng-enter="create()" ng-escape="cancel()"><span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="create()">Create</button></span></div>',
            link: function(scope, element){
                scope.focus = function(){
                    $timeout(function(){
                        $(element).find('input').focus();
                    });
                }
                scope.cancel = function(){
                    scope.desire = '';
                    $(element).find('input').blur();
                    $('.has-popover').popover('hide');
                }
                scope.create = function(){
                    //Break off popover (display a loading bar?), move to middle of the screen, and then have it fly out.
                    
                    //Maybe say "Creating {{type}}" in a div with the input name and then actually animate it to the final position? (stretch). Could probably do this with a transition all and then by changing position from absolute to relative and removing top/left values.
                    
                    $rootScope.$broadcast('data-insert', scope.desire);
                    scope.desire = '';
                    $('.has-popover').popover('hide');
                    
                };
                scope.$on('popover-shown', function(ev, type){
                    //if(type === scope.type){
                        scope.focus();
                    //} 
                });
            }
        };
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('ngEscape', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEscape);
                    });

                    event.preventDefault();
                }
            });
        };
    });
