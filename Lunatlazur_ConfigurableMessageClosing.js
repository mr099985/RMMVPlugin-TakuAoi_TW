//=============================================================================
// Lunatlazur_ConfigurableMessageClosing.js
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
 * @plugindesc [ ver.1.0.0 ] 持續顯示對話框
 * @author あおいたく( 翻譯 : ReIris )
 * @help 此插件使對話框視窗持續顯示，而不是在顯示消息後執行命令時自動關閉視窗。
 * 當您想在顯示的對話框視窗時進行顯示或移動圖片，此功能很有用。
 *
 * == 插件命令一覽 ==
 *
 * KEEP_MESSAGE_VISIBLE [ON|OFF]
 *
 * 例: KEEP_MESSAGE_VISIBLE ON
 *
 *   ON 防止對話框視窗自動關閉。
 *   OFF 如果沒有對話，則對話框視窗將立即關閉。
 *
 * CLOSE_MESSAGE
 *
 * 將會關閉對話框視窗。
 */
(function () {
    var pluginName = 'Lunatlazur_ConfigurableMessageClosing';
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        WindowAutoCloseManager.processPluginCommand(command, args);
    };
    var _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        if (WindowAutoCloseManager.isAutoCloseEnabled()) {
            _Window_Message_terminateMessage.call(this);
        }
        else {
            var indentWhenFaceVisible = this.newLineX();
            $gameMessage.clear();
            this.contents.clearRect(indentWhenFaceVisible, 0, this.contentsWidth() - indentWhenFaceVisible, this.contentsHeight());
        }
    };
    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function () {
        if (WindowAutoCloseManager.isForceClosing()) {
            _Window_Message_terminateMessage.call(this);
            WindowAutoCloseManager.cancelForceClose();
        }
        _Window_Message_update.call(this);
    };
    var WindowAutoCloseManager = /** @class */ (function () {
        function WindowAutoCloseManager() {
        }
        WindowAutoCloseManager.processPluginCommand = function (command, args) {
            switch ((command || '').toUpperCase()) {
                case 'KEEP_MESSAGE_VISIBLE':
                case 'メッセージの表示を継続':
                    var arg = (args[0] || '').toUpperCase();
                    if (arg === 'TRUE' || arg === 'ON') {
                        this.disableAutoClose();
                    }
                    else if (arg === 'FALSE' || arg === 'OFF') {
                        this.enableAutoClose();
                        if (!$gameMessage.hasText()) {
                            this.setForceClose();
                        }
                    }
                    break;
                case 'CLOSE_MESSAGE':
                case 'メッセージを閉じる':
                    this.setForceClose();
                    break;
                default:
                    break;
            }
        };
        WindowAutoCloseManager.enableAutoClose = function () {
            this._autoClose = true;
        };
        WindowAutoCloseManager.disableAutoClose = function () {
            this._autoClose = false;
        };
        WindowAutoCloseManager.isAutoCloseEnabled = function () {
            return this._autoClose;
        };
        WindowAutoCloseManager.setForceClose = function () {
            this._forceClose = true;
        };
        WindowAutoCloseManager.cancelForceClose = function () {
            this._forceClose = false;
        };
        WindowAutoCloseManager.isForceClosing = function () {
            return this._forceClose;
        };
        WindowAutoCloseManager._autoClose = true;
        WindowAutoCloseManager._forceClose = false;
        return WindowAutoCloseManager;
    }());
})();
