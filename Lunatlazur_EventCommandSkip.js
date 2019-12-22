//=============================================================================
// Lunatlazur_EventCommandSkip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 Taku Aoi
// This plugin is released under the zlib/libpng License.
// http://zlib.net/zlib_license.html
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/04/01
// ----------------------------------------------------------------------------
// [Web]    : https://lunatlazur.com/
// [Twitter]: https://twitter.com/lunatlazur/
// [GitHub] : https://github.com/Lunatlazur/
//=============================================================================
/*:
 * @plugindesc [ ver.1.0.0 ] 事件命令略過
 * @author あおいたく( 翻譯 : ReIris )
 * @help 該插件可以透過按 Ctrl 鍵略過事件命令。
 *
 * 【插件命令一覽】
 *
 * 【開始略過】
 * スキップの開始
 * START_SKIP
 *
 * 　開始略過。
 *
 * 【略過中斷】
 * スキップの中断
 * CANCEL_SKIP
 *
 * 　略過中斷。
 *
 * 【切換略過】
 * スキップの切替
 * TOGGLE_SKIP
 *
 * 　如果現在狀態不略過則開始略過，現在為略過狀態則中斷略過。
 */
(function () {
    var pluginName = 'Lunatlazur_EventCommandSkip';
    var SkipManager = /** @class */ (function () {
        function SkipManager() {
        }
        SkipManager.isSkipping = function () {
            return this._skipping;
        };
        SkipManager.startSkip = function () {
            this._skipping = true;
        };
        SkipManager.cancelSkip = function () {
            this._skipping = false;
        };
        SkipManager.toggleSkip = function () {
            this._skipping = !this._skipping;
        };
        SkipManager._skipping = false;
        return SkipManager;
    }());
    function isSkipping() {
        return SkipManager.isSkipping() || Input.isPressed('control');
    }
    function isSkipInterrupting() {
        return (Input.isTriggered('ok') ||
            Input.isTriggered('cancel') ||
            TouchInput.isTriggered() ||
            TouchInput.isCancelled());
    }
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        switch ((command || '').toUpperCase()) {
            case 'START_SKIP':
            case 'スキップの開始':
                SkipManager.startSkip();
                break;
            case 'CANCEL_SKIP':
            case 'スキップの中断':
                SkipManager.cancelSkip();
                break;
            case 'TOGGLE_SKIP':
            case 'スキップの切替':
                SkipManager.toggleSkip();
                break;
        }
    };
    var showFast = false;
    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function () {
        if (!this.isClosed() && !$gameMessage.isChoice() && this.visible) {
            if (SkipManager.isSkipping() && isSkipInterrupting()) {
                SkipManager.cancelSkip();
                return true;
            }
            if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()) {
                this._showFast = true;
            }
            if (isSkipping()) {
                this._waitCount = 0;
            }
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };
    var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function () {
        return _Window_Message_isTriggered.apply(this, arguments) || isSkipping();
    };
    var _Game_Screen_movePicture = Game_Screen.prototype.movePicture;
    Game_Screen.prototype.movePicture = function (pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
        _Game_Screen_movePicture.call(this, pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, isSkipping() ? 2 : duration);
    };
    var _Game_Screen_startFadeIn = Game_Screen.prototype.startFadeIn;
    Game_Screen.prototype.startFadeIn = function (duration) {
        _Game_Screen_startFadeIn.call(this, isSkipping() ? 2 : duration);
    };
    var _Game_Screen_startFadeOut = Game_Screen.prototype.startFadeOut;
    Game_Screen.prototype.startFadeOut = function (duration) {
        _Game_Screen_startFadeOut.call(this, isSkipping() ? 2 : duration);
    };
    if (Game_Screen.prototype.startTransition) {
        var _Game_Screen_startTransition_1 = Game_Screen.prototype.startTransition;
        Game_Screen.prototype.startTransition = function (isFadingIn, isFilledWhite, name, duration) {
            _Game_Screen_startTransition_1.call(this, isFadingIn, isFilledWhite, name, isSkipping() ? 2 : duration);
        };
    }
    var _Game_Interpreter_wait = Game_Interpreter.prototype.wait;
    Game_Interpreter.prototype.wait = function (duration) {
        _Game_Interpreter_wait.call(this, isSkipping() ? 2 : duration);
    };
})();
