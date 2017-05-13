# TiWidowStack

Manage iPhone and Android windows in same code base.

## Get it [![gitTio](http://gitt.io/badge.svg)](http://gitt.io/component/ti-window-stack)

Download the latest distribution [ZIP-file](https://github.com/HazemKhaled/TiWidowStack/releases) and consult the [Titanium Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) on how install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install ti-window-stack`

## Examples

### [Example #1](https://github.com/HazemKhaled/SideMenu-with-NavigationWindow-for-Titanium)

Side menu example using [Fokke Drawer Widget](http://gitt.io/component/nl.fokkezb.drawer) over [NappDrawer](http://gitt.io/component/dk.napp.drawer) or [DrawerLayout](https://github.com/manumaticx/Ti.DrawerLayout) ![gif](https://raw.githubusercontent.com/hazemkhaled/SideMenu-with-NavigationWindow-for-Titanium/master/screens/iphone.gif) ![gif](https://raw.githubusercontent.com/hazemkhaled/SideMenu-with-NavigationWindow-for-Titanium/master/screens/android.gif)

### [Example #2](https://github.com/HazemKhaled/TiTODOs)

Simple Todo app

![gif](https://raw.githubusercontent.com/hazemkhaled/TiTODOs/master/screen.gif)

## How to

Check [#Examples](#examples) for now

## Contributions

Your issues and pull requests are most welcome.

### Changelog

**v1.1.4**

* Untabify (using 4 spaces tabs).
* Adding public function `size()`.
* Change the order we interact with the stack before opening a new window.
* Linting + documentation.

**v1.1.3**

* Fix back compatibility with iOS 9.3.

**v1.1.2**

* Now home function can work without the noisy effect, thanks [@Claymm](https://github.com/Claymm).
* Fix bug with Titanium SDK 5.5.0.GA.

**v1.1.1**

* Fix destroy on Android can't call callback function.

**v1.1.0**

* Allow to manage right or left side menus window stack, [related issue](https://github.com/viezel/NappDrawer/issues/188): `windowStack.setTargetInDrawer(windowStack.LEFT_WINDOW);`.

**v1.0.4**

* Fix window can't close on Android.

**v1.0.3**

* Better implementation for home method.

**v1.0.2**

* Small fix for center window menu in Android.

**v1.0.1**

* Now you can modify Android menu of the drawer container window directly from your center view.

**v1.0.0**

* First version with home, back and destroy methods.
