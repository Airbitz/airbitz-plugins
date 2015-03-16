(function() {
  'use strict';

  angular
    .module('app.history', ['app.dataFactory'])
    .run(['$rootScope', '$window', '$location', 'UserFactory', history]);

  /* TODO: remove match(//) regexp and replace with state lookups */
  function history($rootScope, $window, $location, UserFactory) {
    var history = [];
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if (!UserFactory.isRegistered() && !next.match(/signup.html/)) {
        console.log('Not registered. Redirecting to registration form.');
        $location.path('/signup/');
        return;
      }
      if (history.length == 0) {
        history.push(current);
      }
      // if we are on the dashboard screen, empty history
      if (next.match(/\.html#\/exchange\/$/)
        || next.match(/\.html#\/signup\/$/)) {
        history.length = 0;
        Airbitz.ui.navStackClear();
      }
      history.push(next);
      Airbitz.ui.navStackPush(next);
    });
    Airbitz._bridge.back = function() {
      var el = history.pop();
      Airbitz.ui.navStackPop();
      if (history.length == 0) {
        Airbitz._bridge.exit();
      } else {
        $window.history.back();
      }
    };
  };
})();
