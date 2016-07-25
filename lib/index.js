'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Skipper will help you to skip/drop tasks that old and no longer expected to be performed.
 * For example: it used to detect and drop outdated responses from asyncronious operations, promisified responses from services.
 * Use case: user making chaotic/fast navigation and in result the app will fire a lot of
 * requests to services, and only results of last call is valuable for the user.
 *
 *                    ________________________ 
 *                   /                        \
 *                  |    Hold that elevator!   |
 *                   \________________________/
 *  ___________      /
 * /       ___ \    /
 * |      (_O_) \  /
 * |             > 
 * |             |
 * |             |
 * |_____________|
 * |______}______}
 *
 *
 */
var defaultSkipperErrorCode = exports.defaultSkipperErrorCode = 'skipper.operation.skipped';

var Skipper = function () {
    /**
     * @param skipperErrorCode      Error code that you expect the Skipper instance to throw
     */
    function Skipper() {
        var skipperErrorCode = arguments.length <= 0 || arguments[0] === undefined ? defaultSkipperErrorCode : arguments[0];

        _classCallCheck(this, Skipper);

        this._uniqueMarkerCounter = 0;
        this._lastMarker = this._uniqueMarkerCounter;
        this._skipperErrorCode = skipperErrorCode;
    }

    /**
     * Put the marker before making request.
     * @return {Number} Unique marker that defines moment when async request has been made.
     */


    _createClass(Skipper, [{
        key: 'mark',
        value: function mark() {
            return this._lastMarker = ++this._uniqueMarkerCounter;
        }

        /**
         * @param  {Number}     marker      Marker that defines moment when async request has been made.
         * @param  {Function}   handler     Handler of async request that should be droped/skipped if results already autdated.
         * @return {Function}               Wrapper of original handler. It pass thru data to handler if results are still relevant.
         * @throws {Error}                  When original handler has not been called, because it is to late, we have more fresh responses to appear.
         */

    }, {
        key: 'do',
        value: function _do(marker, handler) {
            var _this = this;

            return function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (_this._lastMarker === marker) {
                    return handler.apply(_this, args);
                } else {
                    throw _this._skipperErrorCode;
                }
            };
        }

        /**
         * @param  {Number}     marker      Marker that defines moment when async request has been made.
         * @return {Function}               Pass thru data if results are still relevant.
         * @throws {Error}                  When original handler has not been called, because it is to late, we have more fresh responses to appear.
         */

    }, {
        key: 'check',
        value: function check(marker) {
            var _this2 = this;

            return function (data) {
                if (_this2._lastMarker === marker) {
                    return data;
                } else {
                    throw _this2._skipperErrorCode;
                }
            };
        }

        /**
         * @param  {Number}     marker      Marker that defines moment when async request has been made.
         * @return {Function}               It pass thru exception if results are still relevant.
         * @throws {Error}                  When original handler has to be notified about exception.
         */

    }, {
        key: 'catch',
        value: function _catch(marker) {
            var _this3 = this;

            return function (exception) {
                if (_this3._lastMarker === marker) {
                    throw exception;
                } else {
                    throw _this3._skipperErrorCode;
                }
            };
        }
    }]);

    return Skipper;
}();

exports.default = Skipper;