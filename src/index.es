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
export const defaultSkipperErrorCode = 'skipper.operation.skipped';

export default class Skipper {
    /**
     * @param skipperErrorCode      Error code that you expect the Skipper instance to throw
     */
    constructor(skipperErrorCode = defaultSkipperErrorCode) {
        this._lastMarker = {};
        this._skipperErrorCode = skipperErrorCode;
    }

    /**
     * Put the marker before making request.
     * @param           marker      Your custom marker (if you want) that defines moment when async request has been made.
     * @return {Number} Unique marker that defines moment when async request has been made.
     */
    mark(marker = {}) {
        return this._lastMarker = marker;
    }

    /**
     * @param  {Number}     marker      Marker that defines moment when async request has been made.
     * @param  {Function}   handler     Handler of async request that should be droped/skipped if results already autdated.
     * @return {Function}               Wrapper of original handler. It pass thru data to handler if results are still relevant.
     * @throws {Error}                  When original handler has not been called, because it is to late, we have more fresh responses to appear.
     */
    do(marker, handler) {
        return (...args) => {
            if (this._lastMarker === marker) {
                return handler.apply(this, args);
            } else {
                throw this._skipperErrorCode;
            }
        };
    }

    /**
     * @param  {Number}     marker      Marker that defines moment when async request has been made.
     * @return {Function}               Pass thru data if results are still relevant.
     * @throws {Error}                  When original handler has not been called, because it is to late, we have more fresh responses to appear.
     */
    check(marker) {
        return (data) => {
            if (this._lastMarker === marker) {
                return data;
            } else {
                throw this._skipperErrorCode;
            }
        };
    }

    /**
     * @param  {Number}     marker      Marker that defines moment when async request has been made.
     * @return {Function}               It pass thru exception if results are still relevant.
     * @throws {Error}                  When original handler has to be notified about exception.
     */
    catch(marker) {
        return (exception) => {
            if (this._lastMarker === marker) {
                throw exception;
            } else {
                throw this._skipperErrorCode;
            }
        };
    }
}
