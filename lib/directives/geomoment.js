// Generated by CoffeeScript 1.6.3
var app, directions;

app = angular.module('geomoment');

directions = {
  before: 'isBefore',
  after: 'isAfter'
};

app.directive('geomoment', function($parse, geomoment) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var attr, checker, direction, getParameters, getters, maskTime, momentFromString, name, _fn, _ref;
      getters = {};
      _ref = {
        geomoment: 'formats',
        'tzid': 'tzid',
        'masks': 'masks',
        'before': 'before',
        'after': 'after'
      };
      _fn = function(attr, name) {
        return getters[name] = (function() {
          try {
            return $parse(attrs[attr]);
          } catch (_error) {
            return function() {
              return attrs[attr];
            };
          }
        })();
      };
      for (attr in _ref) {
        name = _ref[attr];
        _fn(attr, name);
      }
      model.$parsers.unshift(function(value) {
        var checker, direction, moment, parameters, validator;
        parameters = getParameters(scope);
        if ((value == null) || value.trim().length === 0) {
          model.$setValidity('invalidGeomoment', true);
          model.$setValidity('beforeGeomoment', true);
          model.$setValidity('afterGeomoment', true);
          return null;
        }
        moment = momentFromString(value, parameters);
        if (!moment.isValid()) {
          model.$setValidity('invalidGeomoment', false);
          return model.$modelValue;
        }
        model.$setValidity('invalidGeomoment', true);
        moment = maskTime(moment, parameters);
        for (direction in directions) {
          checker = directions[direction];
          if (parameters[direction] != null) {
            validator = "" + direction + "Geomoment";
            if (moment[checker](maskTime(geomoment(parameters[direction]), parameters))) {
              model.$setValidity(validator, true);
            } else {
              model.$setValidity(validator, false);
            }
          }
        }
        return moment.toDate();
      });
      model.$formatters.unshift(function(value) {
        var moment, parameters;
        if (value == null) {
          return;
        }
        parameters = getParameters(scope);
        moment = geomoment(value);
        if (parameters.tzid != null) {
          moment = moment.tz(parameters.tzid);
        }
        return moment.format([].concat(parameters.formats)[0]);
      });
      if (attrs.placeholder == null) {
        scope.$watch(getters.formats, function(formats) {
          return attrs.$set('placeholder', [].concat(formats)[0]);
        });
      }
      for (direction in directions) {
        checker = directions[direction];
        if (attrs[direction] != null) {
          (function(direction, checker) {
            var validator;
            validator = "" + direction + "Geomoment";
            return scope.$watch(getters[direction], function(value) {
              var result;
              if (!(value && model.$modelValue)) {
                return;
              }
              result = geomoment(model.$modelValue)[checker](value);
              if (result) {
                return model.$setValidity(validator, true);
              } else {
                return model.$setValidity(validator, false);
              }
            });
          })(direction, checker);
        }
      }
      elm.on('blur', function() {
        var formattedTime, moment, parameters, _ref1;
        if (!((_ref1 = model.$viewValue) != null ? _ref1.trim().length : void 0)) {
          return;
        }
        parameters = getParameters(scope);
        moment = momentFromString(model.$viewValue, parameters);
        if (parameters.tzid != null) {
          moment = moment.tz(parameters.tzid);
        }
        formattedTime = moment.format([].concat(parameters.formats)[0]);
        if (moment.isValid() && model.$viewValue !== formattedTime) {
          return elm.val(formattedTime);
        }
      });
      getParameters = function(scope) {
        var getter, parameters;
        parameters = {};
        for (attr in getters) {
          getter = getters[attr];
          parameters[attr] = getter(scope);
        }
        return parameters;
      };
      momentFromString = function(timeString, _arg) {
        var formats, tzid;
        formats = _arg.formats, tzid = _arg.tzid;
        if (tzid != null) {
          return geomoment.tz(timeString, formats, tzid);
        } else {
          return geomoment(timeString, formats);
        }
      };
      return maskTime = function(inMoment, _arg) {
        var mask, masks, outMoment, tzid, _i, _len;
        masks = _arg.masks, tzid = _arg.tzid;
        if (masks == null) {
          return inMoment;
        }
        if (typeof masks !== 'array') {
          masks = masks.split(',');
        }
        outMoment = geomoment(model.$modelValue).tz(tzid);
        for (_i = 0, _len = masks.length; _i < _len; _i++) {
          mask = masks[_i];
          outMoment[mask](inMoment[mask]());
        }
        return outMoment;
      };
    }
  };
});
