/**
 * An Alloy widget to manage windows stack in same code for iOS and Android, with drawer support
 *
 * more https://github.com/HazemKhaled/TiWindowStack
 */
function WindowStack() {

    // The navigation object for iOS
    var navigationWindow = null,
        // Windows array for history pepuse
        windows = [],
        that = this,
        ANDROID = Ti.Platform.name === 'android',
        // Since iOS 10 Ti.Platform.name return 'iOS' instead of 'iPhone OS'
        // https://jira.appcelerator.org/browse/TIDOC-2611
        IOS = Ti.Platform.name === 'iPhone OS' || Ti.Platform.name === 'iOS';

    /**
     * Who am i?
     * @type {String}
     */
    this.apiName = 'ti-window-stack';

    /**
     * Constant to open the window into the center of the drawer
     * @type {Number}
     */
    this.CENTER_WINDOW = 101;

    /**
     * Constant to open the window into the right of the drawer
     * @type {Number}
     */
    this.RIGHT_WINDOW = 102;

    /**
     * Constant to open the window into the left of the drawer
     * @type {Number}
     */
    this.LEFT_WINDOW = 103;

    /**
     * Which side to open new window in the drawer, center is default
     * @type {NUMBER}
     */
    this.targetInDrawer = this.CENTER_WINDOW;

    /**
     * Set external created NavigationWindow
     * @param  {Ti.UI.NavigationWindow} _navigationWindow	NavigationWindow to set
     */
    this.setNavigationWindow = function(_navigationWindow) {
        navigationWindow = _navigationWindow;
    };

    /**
     * targetInDrawer setter
     * @param  {NUMBER}	targetInDrawer	WindowStack.CENTER_WINDOW, WindowStack.RIGHT_WINDOW or WindowStack.LEFT_WINDOW
     */
    this.setTargetInDrawer = function (targetInDrawer) {
        if ([that.CENTER_WINDOW, that.RIGHT_WINDOW, that.LEFT_WINDOW].indexOf(targetInDrawer) !== -1){
            this.targetInDrawer = targetInDrawer;
        }
    };

    /**
     * Open window into the stack, you can pass instance from nl.fokkezb.drawer to open this
     * window into drawer center window.
     *
     * nl.fokkezb.drawer require Ti.UI.View for Android and Window for iOS
     * @param  {Ti.UI.Window/Ti.UI.View}	_window			Window/View to open
     * @param  {nl.fokkezb.drawer}				drawer			nl.fokkezb.drawer instance
     * @return {VOID}
     */
    this.open = function(_window, drawer) {

        if (IOS) {

            console.warn(navigationWindow);
            // Create navigationWindow if we don't have, or if we have side menu
            if (navigationWindow === null || drawer) {
                navigationWindow = Ti.UI.iOS.createNavigationWindow({
                    window: _window
                });

                if (drawer) {
                    // Open the window in center, right or left?
                    var openIn = 'setCenterWindow';
                    if (that.targetInDrawer === that.RIGHT_WINDOW) {
                        openIn = 'setRightWindow';
                    } else if (that.targetInDrawer === that.LEFT_WINDOW) {
                        openIn = 'setLeftWindow';
                    }

                    // Open the window into the drawer
                    drawer[openIn](navigationWindow);
                } else {
                    navigationWindow.open();
                }

                // Reset our local stack refrance
                windows = [];
            } else {
                // Or just push new window to the stack
                navigationWindow.openWindow(_window);
                // Add this window to my stack refrance
                windows.push(_window);
            }
        } else {

            if (drawer) {
                // Extend some properties to drawer containner
                _.extend(drawer.window, _.pick(_window, ['title', 'keepScreenOn', 'exitOnClose']));

                // Since android center item is view not a window, we have to fire it ourselves
                _window.fireEvent('open');

                // Generate Android menu
                var activity = drawer.window.getActivity();

                activity.onCreateOptionsMenu = function(e) {
                    // Clean up all items from any other controller
                    e.menu.clear();

                    if (_window.hasOwnProperty('onCreateOptionsMenu')) {
                        _window.onCreateOptionsMenu(e);
                    }
                };

                // Try to refresh menus if the activity created
                try {
                    activity.invalidateOptionsMenu();
                } catch (e) {
                    Ti.API.warn('Maybe we still do not have activity to update the menu, it works now by the way');
                }

                // Open the window in center, right or left?
                var openIn = 'setCenterWindow';
                if (that.targetInDrawer === that.RIGHT_WINDOW) {
                    openIn = 'setRightWindow';
                } else if (that.targetInDrawer === that.LEFT_WINDOW) {
                    openIn = 'setLeftWindow';
                }

                // Open the window into the drawer
                drawer[openIn](_window);

                // Reset our local stack refrance
                windows = [];
            } else {
                _window.open();

                // Add this window to my stack refrance
                windows.push(_window);
            }
        }

        // On close the window update the windows array
        _window.addEventListener('close', function() {
            windows = _.without(windows, _window);
        });
    };

    this.size = function() {
        return windows.length;
    };

    /**
     * Pop window from the stack
     * @param  {Ti.UI.Window}/{Ti.UI.View}	_window	Window/View to open
     */
    this.close = function(_window) {

        if (IOS) {
            navigationWindow.closeWindow(_window);
        } else {
            _window.close();
        }
    };

    this.back = function() {
        // Get last window in the stack
        var _window = _.last(windows);

        // In case assign this function directly to UI item, this will pass to the UI item it self, better use that
        that.close(_window);
    };

    /**
     * By default, closes all the windows, one after the other, starting for the current window.
     * User sees all the windows getting closed.
     *
     * @param  bool _direct Closes all other windows except the last one (so users don't see the
     *                      other windows getting closed) and finally closes the current window.
     * @return void
     */
    this.home = function(_params) {
        _params = _params || { animated: true };

        var lastLength = windows.length,
            interval;

        if (_params.animated) {
            Alloy.Globals.homeInterval = interval = setInterval(function() {
                if (lastLength === windows.length) {
                    Alloy.Globals.windowStack.back();
                    lastLength--;

                    if (lastLength === 0 ||
                        // Center window is actually view on Android
                        windows[lastLength - 1].apiName === 'Ti.UI.View') {
                        clearInterval(Alloy.Globals.homeInterval);
                    }
                }
            }, 100);
        } else {
            var lastWindow = _.last(windows);
            var rest       = _.without(windows, lastWindow);

            rest.forEach(function(window, index){
                if (index === 0 && window.apiName === 'Ti.UI.View') {
                    return;
                }
                that.close(window);
            });
            that.close(lastWindow);
        }
    };

    /**
     * Close all Windows, close the navigationWindow or drawer
     * @param  {nl.fokkezb.drawer}	drawer        (Optional) Drwer to close
     * @param  {function}						closeCallBack (Optional) Will call it after close last screen
     */
    this.destroy = function(drawer, closeCallBack) {

        if (drawer) {
            if (closeCallBack) {
                IOS ? drawer.addEventListener('close', closeCallBack) : drawer.window.addEventListener('close', closeCallBack);
            }
            drawer.close();
        } else if (IOS) {
            closeCallBack && navigationWindow.addEventListener('close', closeCallBack);
            navigationWindow.close();
        } else {
            closeCallBack && _.last(windows).addEventListener('close', closeCallBack);

            _.each(windows, function(_window) {
                _window.close();
            });
        }
    };

}

/**
 * Create new instance
 * @return {WindowStack}	New instance of WindowStack
 */
exports.createWindowStack = function() {
    return new WindowStack();
};
