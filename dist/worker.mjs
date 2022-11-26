var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/history/umd/history.development.js
var require_history_development = __commonJS({
  "node_modules/history/umd/history.development.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.HistoryLibrary = {}));
    })(exports, function(exports2) {
      "use strict";
      function _extends2() {
        _extends2 = Object.assign || function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends2.apply(this, arguments);
      }
      exports2.Action = void 0;
      (function(Action3) {
        Action3["Pop"] = "POP";
        Action3["Push"] = "PUSH";
        Action3["Replace"] = "REPLACE";
      })(exports2.Action || (exports2.Action = {}));
      var readOnly = function(obj) {
        return Object.freeze(obj);
      };
      function warning(cond, message) {
        if (!cond) {
          if (typeof console !== "undefined")
            console.warn(message);
          try {
            throw new Error(message);
          } catch (e) {
          }
        }
      }
      var BeforeUnloadEventType = "beforeunload";
      var HashChangeEventType = "hashchange";
      var PopStateEventType = "popstate";
      function createBrowserHistory(options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, _options$window = _options.window, window2 = _options$window === void 0 ? document.defaultView : _options$window;
        var globalHistory = window2.history;
        function getIndexAndLocation() {
          var _window$location = window2.location, pathname = _window$location.pathname, search = _window$location.search, hash = _window$location.hash;
          var state = globalHistory.state || {};
          return [state.idx, readOnly({
            pathname,
            search,
            hash,
            state: state.usr || null,
            key: state.key || "default"
          })];
        }
        var blockedPopTx = null;
        function handlePop() {
          if (blockedPopTx) {
            blockers.call(blockedPopTx);
            blockedPopTx = null;
          } else {
            var nextAction = exports2.Action.Pop;
            var _getIndexAndLocation = getIndexAndLocation(), nextIndex = _getIndexAndLocation[0], nextLocation = _getIndexAndLocation[1];
            if (blockers.length) {
              if (nextIndex != null) {
                var delta = index - nextIndex;
                if (delta) {
                  blockedPopTx = {
                    action: nextAction,
                    location: nextLocation,
                    retry: function retry() {
                      go(delta * -1);
                    }
                  };
                  go(delta);
                }
              } else {
                warning(
                  false,
                  "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation."
                );
              }
            } else {
              applyTx(nextAction);
            }
          }
        }
        window2.addEventListener(PopStateEventType, handlePop);
        var action = exports2.Action.Pop;
        var _getIndexAndLocation2 = getIndexAndLocation(), index = _getIndexAndLocation2[0], location = _getIndexAndLocation2[1];
        var listeners = createEvents();
        var blockers = createEvents();
        if (index == null) {
          index = 0;
          globalHistory.replaceState(_extends2({}, globalHistory.state, {
            idx: index
          }), "");
        }
        function createHref2(to) {
          return typeof to === "string" ? to : createPath3(to);
        }
        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }
          return readOnly(_extends2({
            pathname: location.pathname,
            hash: "",
            search: ""
          }, typeof to === "string" ? parsePath2(to) : to, {
            state,
            key: createKey()
          }));
        }
        function getHistoryStateAndUrl(nextLocation, index2) {
          return [{
            usr: nextLocation.state,
            key: nextLocation.key,
            idx: index2
          }, createHref2(nextLocation)];
        }
        function allowTx(action2, location2, retry) {
          return !blockers.length || (blockers.call({
            action: action2,
            location: location2,
            retry
          }), false);
        }
        function applyTx(nextAction) {
          action = nextAction;
          var _getIndexAndLocation3 = getIndexAndLocation();
          index = _getIndexAndLocation3[0];
          location = _getIndexAndLocation3[1];
          listeners.call({
            action,
            location
          });
        }
        function push(to, state) {
          var nextAction = exports2.Action.Push;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            push(to, state);
          }
          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr[0], url = _getHistoryStateAndUr[1];
            try {
              globalHistory.pushState(historyState, "", url);
            } catch (error) {
              window2.location.assign(url);
            }
            applyTx(nextAction);
          }
        }
        function replace(to, state) {
          var nextAction = exports2.Action.Replace;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            replace(to, state);
          }
          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr2[0], url = _getHistoryStateAndUr2[1];
            globalHistory.replaceState(historyState, "", url);
            applyTx(nextAction);
          }
        }
        function go(delta) {
          globalHistory.go(delta);
        }
        var history = {
          get action() {
            return action;
          },
          get location() {
            return location;
          },
          createHref: createHref2,
          push,
          replace,
          go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            var unblock = blockers.push(blocker);
            if (blockers.length === 1) {
              window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
            }
            return function() {
              unblock();
              if (!blockers.length) {
                window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
              }
            };
          }
        };
        return history;
      }
      function createHashHistory(options) {
        if (options === void 0) {
          options = {};
        }
        var _options2 = options, _options2$window = _options2.window, window2 = _options2$window === void 0 ? document.defaultView : _options2$window;
        var globalHistory = window2.history;
        function getIndexAndLocation() {
          var _parsePath = parsePath2(window2.location.hash.substr(1)), _parsePath$pathname = _parsePath.pathname, pathname = _parsePath$pathname === void 0 ? "/" : _parsePath$pathname, _parsePath$search = _parsePath.search, search = _parsePath$search === void 0 ? "" : _parsePath$search, _parsePath$hash = _parsePath.hash, hash = _parsePath$hash === void 0 ? "" : _parsePath$hash;
          var state = globalHistory.state || {};
          return [state.idx, readOnly({
            pathname,
            search,
            hash,
            state: state.usr || null,
            key: state.key || "default"
          })];
        }
        var blockedPopTx = null;
        function handlePop() {
          if (blockedPopTx) {
            blockers.call(blockedPopTx);
            blockedPopTx = null;
          } else {
            var nextAction = exports2.Action.Pop;
            var _getIndexAndLocation4 = getIndexAndLocation(), nextIndex = _getIndexAndLocation4[0], nextLocation = _getIndexAndLocation4[1];
            if (blockers.length) {
              if (nextIndex != null) {
                var delta = index - nextIndex;
                if (delta) {
                  blockedPopTx = {
                    action: nextAction,
                    location: nextLocation,
                    retry: function retry() {
                      go(delta * -1);
                    }
                  };
                  go(delta);
                }
              } else {
                warning(
                  false,
                  "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation."
                );
              }
            } else {
              applyTx(nextAction);
            }
          }
        }
        window2.addEventListener(PopStateEventType, handlePop);
        window2.addEventListener(HashChangeEventType, function() {
          var _getIndexAndLocation5 = getIndexAndLocation(), nextLocation = _getIndexAndLocation5[1];
          if (createPath3(nextLocation) !== createPath3(location)) {
            handlePop();
          }
        });
        var action = exports2.Action.Pop;
        var _getIndexAndLocation6 = getIndexAndLocation(), index = _getIndexAndLocation6[0], location = _getIndexAndLocation6[1];
        var listeners = createEvents();
        var blockers = createEvents();
        if (index == null) {
          index = 0;
          globalHistory.replaceState(_extends2({}, globalHistory.state, {
            idx: index
          }), "");
        }
        function getBaseHref() {
          var base = document.querySelector("base");
          var href = "";
          if (base && base.getAttribute("href")) {
            var url = window2.location.href;
            var hashIndex = url.indexOf("#");
            href = hashIndex === -1 ? url : url.slice(0, hashIndex);
          }
          return href;
        }
        function createHref2(to) {
          return getBaseHref() + "#" + (typeof to === "string" ? to : createPath3(to));
        }
        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }
          return readOnly(_extends2({
            pathname: location.pathname,
            hash: "",
            search: ""
          }, typeof to === "string" ? parsePath2(to) : to, {
            state,
            key: createKey()
          }));
        }
        function getHistoryStateAndUrl(nextLocation, index2) {
          return [{
            usr: nextLocation.state,
            key: nextLocation.key,
            idx: index2
          }, createHref2(nextLocation)];
        }
        function allowTx(action2, location2, retry) {
          return !blockers.length || (blockers.call({
            action: action2,
            location: location2,
            retry
          }), false);
        }
        function applyTx(nextAction) {
          action = nextAction;
          var _getIndexAndLocation7 = getIndexAndLocation();
          index = _getIndexAndLocation7[0];
          location = _getIndexAndLocation7[1];
          listeners.call({
            action,
            location
          });
        }
        function push(to, state) {
          var nextAction = exports2.Action.Push;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            push(to, state);
          }
          warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr3[0], url = _getHistoryStateAndUr3[1];
            try {
              globalHistory.pushState(historyState, "", url);
            } catch (error) {
              window2.location.assign(url);
            }
            applyTx(nextAction);
          }
        }
        function replace(to, state) {
          var nextAction = exports2.Action.Replace;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            replace(to, state);
          }
          warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")");
          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr4[0], url = _getHistoryStateAndUr4[1];
            globalHistory.replaceState(historyState, "", url);
            applyTx(nextAction);
          }
        }
        function go(delta) {
          globalHistory.go(delta);
        }
        var history = {
          get action() {
            return action;
          },
          get location() {
            return location;
          },
          createHref: createHref2,
          push,
          replace,
          go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            var unblock = blockers.push(blocker);
            if (blockers.length === 1) {
              window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
            }
            return function() {
              unblock();
              if (!blockers.length) {
                window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
              }
            };
          }
        };
        return history;
      }
      function createMemoryHistory(options) {
        if (options === void 0) {
          options = {};
        }
        var _options3 = options, _options3$initialEntr = _options3.initialEntries, initialEntries = _options3$initialEntr === void 0 ? ["/"] : _options3$initialEntr, initialIndex = _options3.initialIndex;
        var entries = initialEntries.map(function(entry2) {
          var location2 = readOnly(_extends2({
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: createKey()
          }, typeof entry2 === "string" ? parsePath2(entry2) : entry2));
          warning(location2.pathname.charAt(0) === "/", "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(entry2) + ")");
          return location2;
        });
        var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
        var action = exports2.Action.Pop;
        var location = entries[index];
        var listeners = createEvents();
        var blockers = createEvents();
        function createHref2(to) {
          return typeof to === "string" ? to : createPath3(to);
        }
        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }
          return readOnly(_extends2({
            pathname: location.pathname,
            search: "",
            hash: ""
          }, typeof to === "string" ? parsePath2(to) : to, {
            state,
            key: createKey()
          }));
        }
        function allowTx(action2, location2, retry) {
          return !blockers.length || (blockers.call({
            action: action2,
            location: location2,
            retry
          }), false);
        }
        function applyTx(nextAction, nextLocation) {
          action = nextAction;
          location = nextLocation;
          listeners.call({
            action,
            location
          });
        }
        function push(to, state) {
          var nextAction = exports2.Action.Push;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            push(to, state);
          }
          warning(location.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.push(" + JSON.stringify(to) + ")");
          if (allowTx(nextAction, nextLocation, retry)) {
            index += 1;
            entries.splice(index, entries.length, nextLocation);
            applyTx(nextAction, nextLocation);
          }
        }
        function replace(to, state) {
          var nextAction = exports2.Action.Replace;
          var nextLocation = getNextLocation(to, state);
          function retry() {
            replace(to, state);
          }
          warning(location.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(to) + ")");
          if (allowTx(nextAction, nextLocation, retry)) {
            entries[index] = nextLocation;
            applyTx(nextAction, nextLocation);
          }
        }
        function go(delta) {
          var nextIndex = clamp(index + delta, 0, entries.length - 1);
          var nextAction = exports2.Action.Pop;
          var nextLocation = entries[nextIndex];
          function retry() {
            go(delta);
          }
          if (allowTx(nextAction, nextLocation, retry)) {
            index = nextIndex;
            applyTx(nextAction, nextLocation);
          }
        }
        var history = {
          get index() {
            return index;
          },
          get action() {
            return action;
          },
          get location() {
            return location;
          },
          createHref: createHref2,
          push,
          replace,
          go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            return blockers.push(blocker);
          }
        };
        return history;
      }
      function clamp(n, lowerBound, upperBound) {
        return Math.min(Math.max(n, lowerBound), upperBound);
      }
      function promptBeforeUnload(event) {
        event.preventDefault();
        event.returnValue = "";
      }
      function createEvents() {
        var handlers = [];
        return {
          get length() {
            return handlers.length;
          },
          push: function push(fn) {
            handlers.push(fn);
            return function() {
              handlers = handlers.filter(function(handler) {
                return handler !== fn;
              });
            };
          },
          call: function call(arg) {
            handlers.forEach(function(fn) {
              return fn && fn(arg);
            });
          }
        };
      }
      function createKey() {
        return Math.random().toString(36).substr(2, 8);
      }
      function createPath3(_ref) {
        var _ref$pathname = _ref.pathname, pathname = _ref$pathname === void 0 ? "/" : _ref$pathname, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? "" : _ref$hash;
        if (search && search !== "?")
          pathname += search.charAt(0) === "?" ? search : "?" + search;
        if (hash && hash !== "#")
          pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
        return pathname;
      }
      function parsePath2(path) {
        var parsedPath = {};
        if (path) {
          var hashIndex = path.indexOf("#");
          if (hashIndex >= 0) {
            parsedPath.hash = path.substr(hashIndex);
            path = path.substr(0, hashIndex);
          }
          var searchIndex = path.indexOf("?");
          if (searchIndex >= 0) {
            parsedPath.search = path.substr(searchIndex);
            path = path.substr(0, searchIndex);
          }
          if (path) {
            parsedPath.pathname = path;
          }
        }
        return parsedPath;
      }
      exports2.createBrowserHistory = createBrowserHistory;
      exports2.createHashHistory = createHashHistory;
      exports2.createMemoryHistory = createMemoryHistory;
      exports2.createPath = createPath3;
      exports2.parsePath = parsePath2;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/history/main.js
var require_main = __commonJS({
  "node_modules/history/main.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_history_development();
    }
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.2.0";
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          isMounted: function(publicInstance) {
            return false;
          },
          enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function(type, key, ref, self2, source, owner, props) {
          var element = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            ref,
            props,
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement5(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self2 = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self2 = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self2 = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self2, source, owner, props);
        }
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape2(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex, function(match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape2("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                return c;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  escapedPrefix + (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? escapeUserProvidedKey("" + mappedChild.key) + "/" : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        function createContext2(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                },
                set: function(_Provider) {
                  context.Provider = _Provider;
                }
              },
              _currentValue: {
                get: function() {
                  return context._currentValue;
                },
                set: function(_currentValue) {
                  context._currentValue = _currentValue;
                }
              },
              _currentValue2: {
                get: function() {
                  return context._currentValue2;
                },
                set: function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }
              },
              _threadCount: {
                get: function() {
                  return context._threadCount;
                },
                set: function(_threadCount) {
                  context._threadCount = _threadCount;
                }
              },
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }
              },
              displayName: {
                get: function() {
                  return context.displayName;
                },
                set: function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function() {
                  return defaultProps;
                },
                set: function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }
              },
              propTypes: {
                configurable: true,
                get: function() {
                  return propTypes;
                },
                set: function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }
              }
            });
          }
          return lazyType;
        }
        function forwardRef2(render) {
          {
            if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render !== "function") {
              error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
            } else {
              if (render.length !== 0 && render.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render != null) {
              if (render.defaultProps != null || render.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!render.name && !render.displayName) {
                  render.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        function useContext3(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        function useState2(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef3(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect4(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        function useInsertionEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create, deps);
        }
        function useLayoutEffect2(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        function useCallback3(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo2(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        function useTransition2() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement5.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module && module[requireString];
              enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          }
          return enqueueTaskImpl(task);
        }
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: function(resolve, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                    } else {
                      resolve(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: function(resolve, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    } else {
                      resolve(returnValue);
                    }
                  }
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: function(resolve, reject) {
                    resolve(returnValue);
                  }
                };
                return _thenable2;
              }
            }
          }
        }
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve(returnValue);
            }
          }
        }
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i = 0;
              try {
                for (; i < queue.length; i++) {
                  var callback = queue[i];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports.Children = Children;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports.cloneElement = cloneElement$1;
        exports.createContext = createContext2;
        exports.createElement = createElement$1;
        exports.createFactory = createFactory;
        exports.createRef = createRef;
        exports.forwardRef = forwardRef2;
        exports.isValidElement = isValidElement;
        exports.lazy = lazy;
        exports.memo = memo;
        exports.startTransition = startTransition;
        exports.unstable_act = act;
        exports.useCallback = useCallback3;
        exports.useContext = useContext3;
        exports.useDebugValue = useDebugValue;
        exports.useDeferredValue = useDeferredValue;
        exports.useEffect = useEffect4;
        exports.useId = useId;
        exports.useImperativeHandle = useImperativeHandle;
        exports.useInsertionEffect = useInsertionEffect;
        exports.useLayoutEffect = useLayoutEffect2;
        exports.useMemo = useMemo2;
        exports.useReducer = useReducer;
        exports.useRef = useRef3;
        exports.useState = useState2;
        exports.useSyncExternalStore = useSyncExternalStore;
        exports.useTransition = useTransition2;
        exports.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react-router/umd/react-router.development.js
var require_react_router_development = __commonJS({
  "node_modules/react-router/umd/react-router.development.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_main(), require_react()) : typeof define === "function" && define.amd ? define(["exports", "history", "react"], factory) : (global = global || self, factory(global.ReactRouter = {}, global.HistoryLibrary, global.React));
    })(exports, function(exports2, history, React5) {
      "use strict";
      const NavigationContext = /* @__PURE__ */ React5.createContext(null);
      {
        NavigationContext.displayName = "Navigation";
      }
      const LocationContext = /* @__PURE__ */ React5.createContext(null);
      {
        LocationContext.displayName = "Location";
      }
      const RouteContext = /* @__PURE__ */ React5.createContext({
        outlet: null,
        matches: []
      });
      {
        RouteContext.displayName = "Route";
      }
      function invariant2(cond, message) {
        if (!cond)
          throw new Error(message);
      }
      function warning(cond, message) {
        if (!cond) {
          if (typeof console !== "undefined")
            console.warn(message);
          try {
            throw new Error(message);
          } catch (e) {
          }
        }
      }
      const alreadyWarned = {};
      function warningOnce(key, cond, message) {
        if (!cond && !alreadyWarned[key]) {
          alreadyWarned[key] = true;
          warning(false, message);
        }
      }
      function generatePath(path, params) {
        if (params === void 0) {
          params = {};
        }
        return path.replace(/:(\w+)/g, (_, key) => {
          !(params[key] != null) ? invariant2(false, 'Missing ":' + key + '" param') : void 0;
          return params[key];
        }).replace(/\/*\*$/, (_) => params["*"] == null ? "" : params["*"].replace(/^\/*/, "/"));
      }
      function matchRoutes2(routes2, locationArg, basename) {
        if (basename === void 0) {
          basename = "/";
        }
        let location = typeof locationArg === "string" ? history.parsePath(locationArg) : locationArg;
        let pathname = stripBasename(location.pathname || "/", basename);
        if (pathname == null) {
          return null;
        }
        let branches = flattenRoutes(routes2);
        rankRouteBranches(branches);
        let matches = null;
        for (let i = 0; matches == null && i < branches.length; ++i) {
          matches = matchRouteBranch(branches[i], pathname);
        }
        return matches;
      }
      function flattenRoutes(routes2, branches, parentsMeta, parentPath) {
        if (branches === void 0) {
          branches = [];
        }
        if (parentsMeta === void 0) {
          parentsMeta = [];
        }
        if (parentPath === void 0) {
          parentPath = "";
        }
        routes2.forEach((route, index) => {
          let meta3 = {
            relativePath: route.path || "",
            caseSensitive: route.caseSensitive === true,
            childrenIndex: index,
            route
          };
          if (meta3.relativePath.startsWith("/")) {
            !meta3.relativePath.startsWith(parentPath) ? invariant2(false, 'Absolute route path "' + meta3.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.") : void 0;
            meta3.relativePath = meta3.relativePath.slice(parentPath.length);
          }
          let path = joinPaths([parentPath, meta3.relativePath]);
          let routesMeta = parentsMeta.concat(meta3);
          if (route.children && route.children.length > 0) {
            !(route.index !== true) ? invariant2(false, "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')) : void 0;
            flattenRoutes(route.children, branches, routesMeta, path);
          }
          if (route.path == null && !route.index) {
            return;
          }
          branches.push({
            path,
            score: computeScore(path, route.index),
            routesMeta
          });
        });
        return branches;
      }
      function rankRouteBranches(branches) {
        branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta3) => meta3.childrenIndex), b.routesMeta.map((meta3) => meta3.childrenIndex)));
      }
      const paramRe = /^:\w+$/;
      const dynamicSegmentValue = 3;
      const indexRouteValue = 2;
      const emptySegmentValue = 1;
      const staticSegmentValue = 10;
      const splatPenalty = -2;
      const isSplat = (s) => s === "*";
      function computeScore(path, index) {
        let segments = path.split("/");
        let initialScore = segments.length;
        if (segments.some(isSplat)) {
          initialScore += splatPenalty;
        }
        if (index) {
          initialScore += indexRouteValue;
        }
        return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
      }
      function compareIndexes(a, b) {
        let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
        return siblings ? a[a.length - 1] - b[b.length - 1] : 0;
      }
      function matchRouteBranch(branch, pathname) {
        let {
          routesMeta
        } = branch;
        let matchedParams = {};
        let matchedPathname = "/";
        let matches = [];
        for (let i = 0; i < routesMeta.length; ++i) {
          let meta3 = routesMeta[i];
          let end = i === routesMeta.length - 1;
          let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
          let match = matchPath({
            path: meta3.relativePath,
            caseSensitive: meta3.caseSensitive,
            end
          }, remainingPathname);
          if (!match)
            return null;
          Object.assign(matchedParams, match.params);
          let route = meta3.route;
          matches.push({
            params: matchedParams,
            pathname: joinPaths([matchedPathname, match.pathname]),
            pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
            route
          });
          if (match.pathnameBase !== "/") {
            matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
          }
        }
        return matches;
      }
      function matchPath(pattern, pathname) {
        if (typeof pattern === "string") {
          pattern = {
            path: pattern,
            caseSensitive: false,
            end: true
          };
        }
        let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
        let match = pathname.match(matcher);
        if (!match)
          return null;
        let matchedPathname = match[0];
        let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
        let captureGroups = match.slice(1);
        let params = paramNames.reduce((memo, paramName, index) => {
          if (paramName === "*") {
            let splatValue = captureGroups[index] || "";
            pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
          }
          memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
          return memo;
        }, {});
        return {
          params,
          pathname: matchedPathname,
          pathnameBase,
          pattern
        };
      }
      function compilePath(path, caseSensitive, end) {
        if (caseSensitive === void 0) {
          caseSensitive = false;
        }
        if (end === void 0) {
          end = true;
        }
        warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
        let paramNames = [];
        let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/:(\w+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return "([^\\/]+)";
        });
        if (path.endsWith("*")) {
          paramNames.push("*");
          regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
        } else {
          regexpSource += end ? "\\/*$" : "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)";
        }
        let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
        return [matcher, paramNames];
      }
      function safelyDecodeURIComponent(value, paramName) {
        try {
          return decodeURIComponent(value);
        } catch (error) {
          warning(false, 'The value for the URL param "' + paramName + '" will not be decoded because' + (' the string "' + value + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + error + ")."));
          return value;
        }
      }
      function resolvePath(to, fromPathname) {
        if (fromPathname === void 0) {
          fromPathname = "/";
        }
        let {
          pathname: toPathname,
          search = "",
          hash = ""
        } = typeof to === "string" ? history.parsePath(to) : to;
        let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
        return {
          pathname,
          search: normalizeSearch(search),
          hash: normalizeHash(hash)
        };
      }
      function resolvePathname(relativePath, fromPathname) {
        let segments = fromPathname.replace(/\/+$/, "").split("/");
        let relativeSegments = relativePath.split("/");
        relativeSegments.forEach((segment) => {
          if (segment === "..") {
            if (segments.length > 1)
              segments.pop();
          } else if (segment !== ".") {
            segments.push(segment);
          }
        });
        return segments.length > 1 ? segments.join("/") : "/";
      }
      function resolveTo(toArg, routePathnames, locationPathname) {
        let to = typeof toArg === "string" ? history.parsePath(toArg) : toArg;
        let toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname;
        let from;
        if (toPathname == null) {
          from = locationPathname;
        } else {
          let routePathnameIndex = routePathnames.length - 1;
          if (toPathname.startsWith("..")) {
            let toSegments = toPathname.split("/");
            while (toSegments[0] === "..") {
              toSegments.shift();
              routePathnameIndex -= 1;
            }
            to.pathname = toSegments.join("/");
          }
          from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
        }
        let path = resolvePath(to, from);
        if (toPathname && toPathname !== "/" && toPathname.endsWith("/") && !path.pathname.endsWith("/")) {
          path.pathname += "/";
        }
        return path;
      }
      function getToPathname(to) {
        return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? history.parsePath(to).pathname : to.pathname;
      }
      function stripBasename(pathname, basename) {
        if (basename === "/")
          return pathname;
        if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
          return null;
        }
        let nextChar = pathname.charAt(basename.length);
        if (nextChar && nextChar !== "/") {
          return null;
        }
        return pathname.slice(basename.length) || "/";
      }
      const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
      const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
      const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
      const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
      function useHref3(to) {
        !useInRouterContext() ? invariant2(
          false,
          "useHref() may be used only in the context of a <Router> component."
        ) : void 0;
        let {
          basename,
          navigator
        } = React5.useContext(NavigationContext);
        let {
          hash,
          pathname,
          search
        } = useResolvedPath3(to);
        let joinedPathname = pathname;
        if (basename !== "/") {
          let toPathname = getToPathname(to);
          let endsWithSlash = toPathname != null && toPathname.endsWith("/");
          joinedPathname = pathname === "/" ? basename + (endsWithSlash ? "/" : "") : joinPaths([basename, pathname]);
        }
        return navigator.createHref({
          pathname: joinedPathname,
          search,
          hash
        });
      }
      function useInRouterContext() {
        return React5.useContext(LocationContext) != null;
      }
      function useLocation4() {
        !useInRouterContext() ? invariant2(
          false,
          "useLocation() may be used only in the context of a <Router> component."
        ) : void 0;
        return React5.useContext(LocationContext).location;
      }
      function useNavigationType2() {
        return React5.useContext(LocationContext).navigationType;
      }
      function useMatch(pattern) {
        !useInRouterContext() ? invariant2(
          false,
          "useMatch() may be used only in the context of a <Router> component."
        ) : void 0;
        let {
          pathname
        } = useLocation4();
        return React5.useMemo(() => matchPath(pattern, pathname), [pathname, pattern]);
      }
      function useNavigate3() {
        !useInRouterContext() ? invariant2(
          false,
          "useNavigate() may be used only in the context of a <Router> component."
        ) : void 0;
        let {
          basename,
          navigator
        } = React5.useContext(NavigationContext);
        let {
          matches
        } = React5.useContext(RouteContext);
        let {
          pathname: locationPathname
        } = useLocation4();
        let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));
        let activeRef = React5.useRef(false);
        React5.useEffect(() => {
          activeRef.current = true;
        });
        let navigate = React5.useCallback(function(to, options) {
          if (options === void 0) {
            options = {};
          }
          warning(activeRef.current, "You should call navigate() in a React.useEffect(), not when your component is first rendered.");
          if (!activeRef.current)
            return;
          if (typeof to === "number") {
            navigator.go(to);
            return;
          }
          let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname);
          if (basename !== "/") {
            path.pathname = joinPaths([basename, path.pathname]);
          }
          (!!options.replace ? navigator.replace : navigator.push)(path, options.state);
        }, [basename, navigator, routePathnamesJson, locationPathname]);
        return navigate;
      }
      const OutletContext = /* @__PURE__ */ React5.createContext(null);
      function useOutletContext2() {
        return React5.useContext(OutletContext);
      }
      function useOutlet2(context) {
        let outlet = React5.useContext(RouteContext).outlet;
        if (outlet) {
          return /* @__PURE__ */ React5.createElement(OutletContext.Provider, {
            value: context
          }, outlet);
        }
        return outlet;
      }
      function useParams2() {
        let {
          matches
        } = React5.useContext(RouteContext);
        let routeMatch = matches[matches.length - 1];
        return routeMatch ? routeMatch.params : {};
      }
      function useResolvedPath3(to) {
        let {
          matches
        } = React5.useContext(RouteContext);
        let {
          pathname: locationPathname
        } = useLocation4();
        let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));
        return React5.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname), [to, routePathnamesJson, locationPathname]);
      }
      function useRoutes2(routes2, locationArg) {
        !useInRouterContext() ? invariant2(
          false,
          "useRoutes() may be used only in the context of a <Router> component."
        ) : void 0;
        let {
          matches: parentMatches
        } = React5.useContext(RouteContext);
        let routeMatch = parentMatches[parentMatches.length - 1];
        let parentParams = routeMatch ? routeMatch.params : {};
        let parentPathname = routeMatch ? routeMatch.pathname : "/";
        let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
        let parentRoute = routeMatch && routeMatch.route;
        {
          let parentPath = parentRoute && parentRoute.path || "";
          warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + (parentPath === "/" ? "*" : parentPath + "/*") + '">.'));
        }
        let locationFromContext = useLocation4();
        let location;
        if (locationArg) {
          var _parsedLocationArg$pa;
          let parsedLocationArg = typeof locationArg === "string" ? history.parsePath(locationArg) : locationArg;
          !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant2(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')) : void 0;
          location = parsedLocationArg;
        } else {
          location = locationFromContext;
        }
        let pathname = location.pathname || "/";
        let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
        let matches = matchRoutes2(routes2, {
          pathname: remainingPathname
        });
        {
          warning(parentRoute || matches != null, 'No routes matched location "' + location.pathname + location.search + location.hash + '" ');
          warning(matches == null || matches[matches.length - 1].route.element !== void 0, 'Matched leaf route at location "' + location.pathname + location.search + location.hash + '" does not have an element. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.');
        }
        return _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase])
        })), parentMatches);
      }
      function _renderMatches(matches, parentMatches) {
        if (parentMatches === void 0) {
          parentMatches = [];
        }
        if (matches == null)
          return null;
        return matches.reduceRight((outlet, match, index) => {
          return /* @__PURE__ */ React5.createElement(RouteContext.Provider, {
            children: match.route.element !== void 0 ? match.route.element : outlet,
            value: {
              outlet,
              matches: parentMatches.concat(matches.slice(0, index + 1))
            }
          });
        }, null);
      }
      function MemoryRouter(_ref) {
        let {
          basename,
          children,
          initialEntries,
          initialIndex
        } = _ref;
        let historyRef = React5.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createMemoryHistory({
            initialEntries,
            initialIndex
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React5.useState({
          action: history$1.action,
          location: history$1.location
        });
        React5.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React5.createElement(Router2, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function Navigate(_ref2) {
        let {
          to,
          replace,
          state
        } = _ref2;
        !useInRouterContext() ? invariant2(
          false,
          "<Navigate> may be used only in the context of a <Router> component."
        ) : void 0;
        warning(!React5.useContext(NavigationContext).static, "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");
        let navigate = useNavigate3();
        React5.useEffect(() => {
          navigate(to, {
            replace,
            state
          });
        });
        return null;
      }
      function Outlet2(props) {
        return useOutlet2(props.context);
      }
      function Route(_props) {
        invariant2(false, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.");
      }
      function Router2(_ref3) {
        let {
          basename: basenameProp = "/",
          children = null,
          location: locationProp,
          navigationType = history.Action.Pop,
          navigator,
          static: staticProp = false
        } = _ref3;
        !!useInRouterContext() ? invariant2(false, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : void 0;
        let basename = normalizePathname(basenameProp);
        let navigationContext = React5.useMemo(() => ({
          basename,
          navigator,
          static: staticProp
        }), [basename, navigator, staticProp]);
        if (typeof locationProp === "string") {
          locationProp = history.parsePath(locationProp);
        }
        let {
          pathname = "/",
          search = "",
          hash = "",
          state = null,
          key = "default"
        } = locationProp;
        let location = React5.useMemo(() => {
          let trailingPathname = stripBasename(pathname, basename);
          if (trailingPathname == null) {
            return null;
          }
          return {
            pathname: trailingPathname,
            search,
            hash,
            state,
            key
          };
        }, [basename, pathname, search, hash, state, key]);
        warning(location != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything.");
        if (location == null) {
          return null;
        }
        return /* @__PURE__ */ React5.createElement(NavigationContext.Provider, {
          value: navigationContext
        }, /* @__PURE__ */ React5.createElement(LocationContext.Provider, {
          children,
          value: {
            location,
            navigationType
          }
        }));
      }
      function Routes2(_ref4) {
        let {
          children,
          location
        } = _ref4;
        return useRoutes2(createRoutesFromChildren(children), location);
      }
      function createRoutesFromChildren(children) {
        let routes2 = [];
        React5.Children.forEach(children, (element) => {
          if (!/* @__PURE__ */ React5.isValidElement(element)) {
            return;
          }
          if (element.type === React5.Fragment) {
            routes2.push.apply(routes2, createRoutesFromChildren(element.props.children));
            return;
          }
          !(element.type === Route) ? invariant2(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : void 0;
          let route = {
            caseSensitive: element.props.caseSensitive,
            element: element.props.element,
            index: element.props.index,
            path: element.props.path
          };
          if (element.props.children) {
            route.children = createRoutesFromChildren(element.props.children);
          }
          routes2.push(route);
        });
        return routes2;
      }
      function renderMatches(matches) {
        return _renderMatches(matches);
      }
      Object.defineProperty(exports2, "NavigationType", {
        enumerable: true,
        get: function() {
          return history.Action;
        }
      });
      Object.defineProperty(exports2, "createPath", {
        enumerable: true,
        get: function() {
          return history.createPath;
        }
      });
      Object.defineProperty(exports2, "parsePath", {
        enumerable: true,
        get: function() {
          return history.parsePath;
        }
      });
      exports2.MemoryRouter = MemoryRouter;
      exports2.Navigate = Navigate;
      exports2.Outlet = Outlet2;
      exports2.Route = Route;
      exports2.Router = Router2;
      exports2.Routes = Routes2;
      exports2.UNSAFE_LocationContext = LocationContext;
      exports2.UNSAFE_NavigationContext = NavigationContext;
      exports2.UNSAFE_RouteContext = RouteContext;
      exports2.createRoutesFromChildren = createRoutesFromChildren;
      exports2.generatePath = generatePath;
      exports2.matchPath = matchPath;
      exports2.matchRoutes = matchRoutes2;
      exports2.renderMatches = renderMatches;
      exports2.resolvePath = resolvePath;
      exports2.useHref = useHref3;
      exports2.useInRouterContext = useInRouterContext;
      exports2.useLocation = useLocation4;
      exports2.useMatch = useMatch;
      exports2.useNavigate = useNavigate3;
      exports2.useNavigationType = useNavigationType2;
      exports2.useOutlet = useOutlet2;
      exports2.useOutletContext = useOutletContext2;
      exports2.useParams = useParams2;
      exports2.useResolvedPath = useResolvedPath3;
      exports2.useRoutes = useRoutes2;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/react-router/main.js
var require_main2 = __commonJS({
  "node_modules/react-router/main.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_router_development();
    }
  }
});

// node_modules/react-router-dom/umd/react-router-dom.development.js
var require_react_router_dom_development = __commonJS({
  "node_modules/react-router-dom/umd/react-router-dom.development.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_react(), require_main(), require_main2()) : typeof define === "function" && define.amd ? define(["exports", "react", "history", "react-router"], factory) : (global = global || self, factory(global.ReactRouterDOM = {}, global.React, global.HistoryLibrary, global.ReactRouter));
    })(exports, function(exports2, React5, history, reactRouter) {
      "use strict";
      function _extends2() {
        _extends2 = Object.assign || function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends2.apply(this, arguments);
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0)
            continue;
          target[key] = source[key];
        }
        return target;
      }
      const _excluded = ["onClick", "reloadDocument", "replace", "state", "target", "to"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"];
      function warning(cond, message) {
        if (!cond) {
          if (typeof console !== "undefined")
            console.warn(message);
          try {
            throw new Error(message);
          } catch (e) {
          }
        }
      }
      function BrowserRouter(_ref) {
        let {
          basename,
          children,
          window: window2
        } = _ref;
        let historyRef = React5.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createBrowserHistory({
            window: window2
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React5.useState({
          action: history$1.action,
          location: history$1.location
        });
        React5.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React5.createElement(reactRouter.Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function HashRouter(_ref2) {
        let {
          basename,
          children,
          window: window2
        } = _ref2;
        let historyRef = React5.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createHashHistory({
            window: window2
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React5.useState({
          action: history$1.action,
          location: history$1.location
        });
        React5.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React5.createElement(reactRouter.Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function HistoryRouter(_ref3) {
        let {
          basename,
          children,
          history: history2
        } = _ref3;
        const [state, setState] = React5.useState({
          action: history2.action,
          location: history2.location
        });
        React5.useLayoutEffect(() => history2.listen(setState), [history2]);
        return /* @__PURE__ */ React5.createElement(reactRouter.Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history2
        });
      }
      {
        HistoryRouter.displayName = "unstable_HistoryRouter";
      }
      function isModifiedEvent(event) {
        return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
      }
      const Link2 = /* @__PURE__ */ React5.forwardRef(function LinkWithRef(_ref4, ref) {
        let {
          onClick,
          reloadDocument,
          replace = false,
          state,
          target,
          to
        } = _ref4, rest = _objectWithoutPropertiesLoose(_ref4, _excluded);
        let href = reactRouter.useHref(to);
        let internalOnClick = useLinkClickHandler(to, {
          replace,
          state,
          target
        });
        function handleClick(event) {
          if (onClick)
            onClick(event);
          if (!event.defaultPrevented && !reloadDocument) {
            internalOnClick(event);
          }
        }
        return /* @__PURE__ */ React5.createElement("a", _extends2({}, rest, {
          href,
          onClick: handleClick,
          ref,
          target
        }));
      });
      {
        Link2.displayName = "Link";
      }
      const NavLink2 = /* @__PURE__ */ React5.forwardRef(function NavLinkWithRef(_ref5, ref) {
        let {
          "aria-current": ariaCurrentProp = "page",
          caseSensitive = false,
          className: classNameProp = "",
          end = false,
          style: styleProp,
          to,
          children
        } = _ref5, rest = _objectWithoutPropertiesLoose(_ref5, _excluded2);
        let location = reactRouter.useLocation();
        let path = reactRouter.useResolvedPath(to);
        let locationPathname = location.pathname;
        let toPathname = path.pathname;
        if (!caseSensitive) {
          locationPathname = locationPathname.toLowerCase();
          toPathname = toPathname.toLowerCase();
        }
        let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
        let ariaCurrent = isActive ? ariaCurrentProp : void 0;
        let className;
        if (typeof classNameProp === "function") {
          className = classNameProp({
            isActive
          });
        } else {
          className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
        }
        let style = typeof styleProp === "function" ? styleProp({
          isActive
        }) : styleProp;
        return /* @__PURE__ */ React5.createElement(Link2, _extends2({}, rest, {
          "aria-current": ariaCurrent,
          className,
          ref,
          style,
          to
        }), typeof children === "function" ? children({
          isActive
        }) : children);
      });
      {
        NavLink2.displayName = "NavLink";
      }
      function useLinkClickHandler(to, _temp) {
        let {
          target,
          replace: replaceProp,
          state
        } = _temp === void 0 ? {} : _temp;
        let navigate = reactRouter.useNavigate();
        let location = reactRouter.useLocation();
        let path = reactRouter.useResolvedPath(to);
        return React5.useCallback((event) => {
          if (event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event)) {
            event.preventDefault();
            let replace = !!replaceProp || reactRouter.createPath(location) === reactRouter.createPath(path);
            navigate(to, {
              replace,
              state
            });
          }
        }, [location, navigate, path, replaceProp, state, target, to]);
      }
      function useSearchParams2(defaultInit) {
        warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params\n\nIf you're unsure how to load polyfills, we recommend you check out https://polyfill.io/v3/ which provides some recommendations about how to load polyfills only for users that need them, instead of for every user.");
        let defaultSearchParamsRef = React5.useRef(createSearchParams(defaultInit));
        let location = reactRouter.useLocation();
        let searchParams = React5.useMemo(() => {
          let searchParams2 = createSearchParams(location.search);
          for (let key of defaultSearchParamsRef.current.keys()) {
            if (!searchParams2.has(key)) {
              defaultSearchParamsRef.current.getAll(key).forEach((value) => {
                searchParams2.append(key, value);
              });
            }
          }
          return searchParams2;
        }, [location.search]);
        let navigate = reactRouter.useNavigate();
        let setSearchParams = React5.useCallback((nextInit, navigateOptions) => {
          navigate("?" + createSearchParams(nextInit), navigateOptions);
        }, [navigate]);
        return [searchParams, setSearchParams];
      }
      function createSearchParams(init) {
        if (init === void 0) {
          init = "";
        }
        return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
          let value = init[key];
          return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
        }, []));
      }
      Object.defineProperty(exports2, "MemoryRouter", {
        enumerable: true,
        get: function() {
          return reactRouter.MemoryRouter;
        }
      });
      Object.defineProperty(exports2, "Navigate", {
        enumerable: true,
        get: function() {
          return reactRouter.Navigate;
        }
      });
      Object.defineProperty(exports2, "NavigationType", {
        enumerable: true,
        get: function() {
          return reactRouter.NavigationType;
        }
      });
      Object.defineProperty(exports2, "Outlet", {
        enumerable: true,
        get: function() {
          return reactRouter.Outlet;
        }
      });
      Object.defineProperty(exports2, "Route", {
        enumerable: true,
        get: function() {
          return reactRouter.Route;
        }
      });
      Object.defineProperty(exports2, "Router", {
        enumerable: true,
        get: function() {
          return reactRouter.Router;
        }
      });
      Object.defineProperty(exports2, "Routes", {
        enumerable: true,
        get: function() {
          return reactRouter.Routes;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_LocationContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_LocationContext;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_NavigationContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_NavigationContext;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_RouteContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_RouteContext;
        }
      });
      Object.defineProperty(exports2, "createPath", {
        enumerable: true,
        get: function() {
          return reactRouter.createPath;
        }
      });
      Object.defineProperty(exports2, "createRoutesFromChildren", {
        enumerable: true,
        get: function() {
          return reactRouter.createRoutesFromChildren;
        }
      });
      Object.defineProperty(exports2, "generatePath", {
        enumerable: true,
        get: function() {
          return reactRouter.generatePath;
        }
      });
      Object.defineProperty(exports2, "matchPath", {
        enumerable: true,
        get: function() {
          return reactRouter.matchPath;
        }
      });
      Object.defineProperty(exports2, "matchRoutes", {
        enumerable: true,
        get: function() {
          return reactRouter.matchRoutes;
        }
      });
      Object.defineProperty(exports2, "parsePath", {
        enumerable: true,
        get: function() {
          return reactRouter.parsePath;
        }
      });
      Object.defineProperty(exports2, "renderMatches", {
        enumerable: true,
        get: function() {
          return reactRouter.renderMatches;
        }
      });
      Object.defineProperty(exports2, "resolvePath", {
        enumerable: true,
        get: function() {
          return reactRouter.resolvePath;
        }
      });
      Object.defineProperty(exports2, "useHref", {
        enumerable: true,
        get: function() {
          return reactRouter.useHref;
        }
      });
      Object.defineProperty(exports2, "useInRouterContext", {
        enumerable: true,
        get: function() {
          return reactRouter.useInRouterContext;
        }
      });
      Object.defineProperty(exports2, "useLocation", {
        enumerable: true,
        get: function() {
          return reactRouter.useLocation;
        }
      });
      Object.defineProperty(exports2, "useMatch", {
        enumerable: true,
        get: function() {
          return reactRouter.useMatch;
        }
      });
      Object.defineProperty(exports2, "useNavigate", {
        enumerable: true,
        get: function() {
          return reactRouter.useNavigate;
        }
      });
      Object.defineProperty(exports2, "useNavigationType", {
        enumerable: true,
        get: function() {
          return reactRouter.useNavigationType;
        }
      });
      Object.defineProperty(exports2, "useOutlet", {
        enumerable: true,
        get: function() {
          return reactRouter.useOutlet;
        }
      });
      Object.defineProperty(exports2, "useOutletContext", {
        enumerable: true,
        get: function() {
          return reactRouter.useOutletContext;
        }
      });
      Object.defineProperty(exports2, "useParams", {
        enumerable: true,
        get: function() {
          return reactRouter.useParams;
        }
      });
      Object.defineProperty(exports2, "useResolvedPath", {
        enumerable: true,
        get: function() {
          return reactRouter.useResolvedPath;
        }
      });
      Object.defineProperty(exports2, "useRoutes", {
        enumerable: true,
        get: function() {
          return reactRouter.useRoutes;
        }
      });
      exports2.BrowserRouter = BrowserRouter;
      exports2.HashRouter = HashRouter;
      exports2.Link = Link2;
      exports2.NavLink = NavLink2;
      exports2.createSearchParams = createSearchParams;
      exports2.unstable_HistoryRouter = HistoryRouter;
      exports2.useLinkClickHandler = useLinkClickHandler;
      exports2.useSearchParams = useSearchParams2;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/react-router-dom/main.js
var require_main3 = __commonJS({
  "node_modules/react-router-dom/main.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_router_dom_development();
    }
  }
});

// node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js
var require_react_dom_server_legacy_browser_development = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React5 = require_react();
        var ReactVersion = "18.2.0";
        var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function scheduleWork(callback) {
          callback();
        }
        function beginWriting(destination) {
        }
        function writeChunk(destination, chunk) {
          writeChunkAndReturn(destination, chunk);
        }
        function writeChunkAndReturn(destination, chunk) {
          return destination.push(chunk);
        }
        function completeWriting(destination) {
        }
        function close(destination) {
          destination.push(null);
        }
        function stringToChunk(content) {
          return content;
        }
        function stringToPrecomputedChunk(content) {
          return content;
        }
        function closeWithError(destination, error2) {
          destination.destroy(error2);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkAttributeStringCoercion(value, attributeName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkCSSPropertyStringCoercion(value, propName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkHtmlStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED = 0;
        var STRING = 1;
        var BOOLEANISH_STRING = 2;
        var BOOLEAN = 3;
        var OVERLOADED_BOOLEAN = 4;
        var NUMERIC = 5;
        var POSITIVE_NUMERIC = 6;
        var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
        var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
        var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
        var illegalAttributeNameCache = {};
        var validatedAttributeNameCache = {};
        function isAttributeNameSafe(attributeName) {
          if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
            return true;
          }
          if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
            return false;
          }
          if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
            validatedAttributeNameCache[attributeName] = true;
            return true;
          }
          illegalAttributeNameCache[attributeName] = true;
          {
            error("Invalid attribute name: `%s`", attributeName);
          }
          return false;
        }
        function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
          if (propertyInfo !== null && propertyInfo.type === RESERVED) {
            return false;
          }
          switch (typeof value) {
            case "function":
            case "symbol":
              return true;
            case "boolean": {
              if (isCustomComponentTag) {
                return false;
              }
              if (propertyInfo !== null) {
                return !propertyInfo.acceptsBooleans;
              } else {
                var prefix2 = name.toLowerCase().slice(0, 5);
                return prefix2 !== "data-" && prefix2 !== "aria-";
              }
            }
            default:
              return false;
          }
        }
        function getPropertyInfo(name) {
          return properties.hasOwnProperty(name) ? properties[name] : null;
        }
        function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
          this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
          this.attributeName = attributeName;
          this.attributeNamespace = attributeNamespace;
          this.mustUseProperty = mustUseProperty;
          this.propertyName = name;
          this.type = type;
          this.sanitizeURL = sanitizeURL2;
          this.removeEmptyString = removeEmptyString;
        }
        var properties = {};
        var reservedProps = [
          "children",
          "dangerouslySetInnerHTML",
          "defaultValue",
          "defaultChecked",
          "innerHTML",
          "suppressContentEditableWarning",
          "suppressHydrationWarning",
          "style"
        ];
        reservedProps.forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            RESERVED,
            false,
            name,
            null,
            false,
            false
          );
        });
        [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
          var name = _ref[0], attributeName = _ref[1];
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            null,
            false,
            false
          );
        });
        ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            name,
            null,
            false,
            false
          );
        });
        [
          "allowFullScreen",
          "async",
          "autoFocus",
          "autoPlay",
          "controls",
          "default",
          "defer",
          "disabled",
          "disablePictureInPicture",
          "disableRemotePlayback",
          "formNoValidate",
          "hidden",
          "loop",
          "noModule",
          "noValidate",
          "open",
          "playsInline",
          "readOnly",
          "required",
          "reversed",
          "scoped",
          "seamless",
          "itemScope"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        [
          "checked",
          "multiple",
          "muted",
          "selected"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            true,
            name,
            null,
            false,
            false
          );
        });
        [
          "capture",
          "download"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            OVERLOADED_BOOLEAN,
            false,
            name,
            null,
            false,
            false
          );
        });
        [
          "cols",
          "rows",
          "size",
          "span"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            POSITIVE_NUMERIC,
            false,
            name,
            null,
            false,
            false
          );
        });
        ["rowSpan", "start"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            NUMERIC,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        var CAMELIZE = /[\-\:]([a-z])/g;
        var capitalize = function(token) {
          return token[1].toUpperCase();
        };
        [
          "accent-height",
          "alignment-baseline",
          "arabic-form",
          "baseline-shift",
          "cap-height",
          "clip-path",
          "clip-rule",
          "color-interpolation",
          "color-interpolation-filters",
          "color-profile",
          "color-rendering",
          "dominant-baseline",
          "enable-background",
          "fill-opacity",
          "fill-rule",
          "flood-color",
          "flood-opacity",
          "font-family",
          "font-size",
          "font-size-adjust",
          "font-stretch",
          "font-style",
          "font-variant",
          "font-weight",
          "glyph-name",
          "glyph-orientation-horizontal",
          "glyph-orientation-vertical",
          "horiz-adv-x",
          "horiz-origin-x",
          "image-rendering",
          "letter-spacing",
          "lighting-color",
          "marker-end",
          "marker-mid",
          "marker-start",
          "overline-position",
          "overline-thickness",
          "paint-order",
          "panose-1",
          "pointer-events",
          "rendering-intent",
          "shape-rendering",
          "stop-color",
          "stop-opacity",
          "strikethrough-position",
          "strikethrough-thickness",
          "stroke-dasharray",
          "stroke-dashoffset",
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-miterlimit",
          "stroke-opacity",
          "stroke-width",
          "text-anchor",
          "text-decoration",
          "text-rendering",
          "underline-position",
          "underline-thickness",
          "unicode-bidi",
          "unicode-range",
          "units-per-em",
          "v-alphabetic",
          "v-hanging",
          "v-ideographic",
          "v-mathematical",
          "vector-effect",
          "vert-adv-y",
          "vert-origin-x",
          "vert-origin-y",
          "word-spacing",
          "writing-mode",
          "xmlns:xlink",
          "x-height"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            null,
            false,
            false
          );
        });
        [
          "xlink:actuate",
          "xlink:arcrole",
          "xlink:role",
          "xlink:show",
          "xlink:title",
          "xlink:type"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            "http://www.w3.org/1999/xlink",
            false,
            false
          );
        });
        [
          "xml:base",
          "xml:lang",
          "xml:space"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            "http://www.w3.org/XML/1998/namespace",
            false,
            false
          );
        });
        ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            attributeName.toLowerCase(),
            null,
            false,
            false
          );
        });
        var xlinkHref = "xlinkHref";
        properties[xlinkHref] = new PropertyInfoRecord(
          "xlinkHref",
          STRING,
          false,
          "xlink:href",
          "http://www.w3.org/1999/xlink",
          true,
          false
        );
        ["src", "href", "action", "formAction"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            attributeName.toLowerCase(),
            null,
            true,
            true
          );
        });
        var isUnitlessNumber = {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageOutset: true,
          borderImageSlice: true,
          borderImageWidth: true,
          boxFlex: true,
          boxFlexGroup: true,
          boxOrdinalGroup: true,
          columnCount: true,
          columns: true,
          flex: true,
          flexGrow: true,
          flexPositive: true,
          flexShrink: true,
          flexNegative: true,
          flexOrder: true,
          gridArea: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowSpan: true,
          gridRowStart: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnSpan: true,
          gridColumnStart: true,
          fontWeight: true,
          lineClamp: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          tabSize: true,
          widows: true,
          zIndex: true,
          zoom: true,
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeDasharray: true,
          strokeDashoffset: true,
          strokeMiterlimit: true,
          strokeOpacity: true,
          strokeWidth: true
        };
        function prefixKey(prefix2, key) {
          return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
        }
        var prefixes = ["Webkit", "ms", "Moz", "O"];
        Object.keys(isUnitlessNumber).forEach(function(prop) {
          prefixes.forEach(function(prefix2) {
            isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
          });
        });
        var hasReadOnlyValue = {
          button: true,
          checkbox: true,
          image: true,
          hidden: true,
          radio: true,
          reset: true,
          submit: true
        };
        function checkControlledValueProps(tagName, props) {
          {
            if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
              error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
            }
            if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
              error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
            }
          }
        }
        function isCustomComponent(tagName, props) {
          if (tagName.indexOf("-") === -1) {
            return typeof props.is === "string";
          }
          switch (tagName) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
              return false;
            default:
              return true;
          }
        }
        var ariaProperties = {
          "aria-current": 0,
          "aria-description": 0,
          "aria-details": 0,
          "aria-disabled": 0,
          "aria-hidden": 0,
          "aria-invalid": 0,
          "aria-keyshortcuts": 0,
          "aria-label": 0,
          "aria-roledescription": 0,
          "aria-autocomplete": 0,
          "aria-checked": 0,
          "aria-expanded": 0,
          "aria-haspopup": 0,
          "aria-level": 0,
          "aria-modal": 0,
          "aria-multiline": 0,
          "aria-multiselectable": 0,
          "aria-orientation": 0,
          "aria-placeholder": 0,
          "aria-pressed": 0,
          "aria-readonly": 0,
          "aria-required": 0,
          "aria-selected": 0,
          "aria-sort": 0,
          "aria-valuemax": 0,
          "aria-valuemin": 0,
          "aria-valuenow": 0,
          "aria-valuetext": 0,
          "aria-atomic": 0,
          "aria-busy": 0,
          "aria-live": 0,
          "aria-relevant": 0,
          "aria-dropeffect": 0,
          "aria-grabbed": 0,
          "aria-activedescendant": 0,
          "aria-colcount": 0,
          "aria-colindex": 0,
          "aria-colspan": 0,
          "aria-controls": 0,
          "aria-describedby": 0,
          "aria-errormessage": 0,
          "aria-flowto": 0,
          "aria-labelledby": 0,
          "aria-owns": 0,
          "aria-posinset": 0,
          "aria-rowcount": 0,
          "aria-rowindex": 0,
          "aria-rowspan": 0,
          "aria-setsize": 0
        };
        var warnedProperties = {};
        var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        function validateProperty(tagName, name) {
          {
            if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
              return true;
            }
            if (rARIACamel.test(name)) {
              var ariaName = "aria-" + name.slice(4).toLowerCase();
              var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
              if (correctName == null) {
                error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                warnedProperties[name] = true;
                return true;
              }
              if (name !== correctName) {
                error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                warnedProperties[name] = true;
                return true;
              }
            }
            if (rARIA.test(name)) {
              var lowerCasedName = name.toLowerCase();
              var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
              if (standardName == null) {
                warnedProperties[name] = true;
                return false;
              }
              if (name !== standardName) {
                error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties[name] = true;
                return true;
              }
            }
          }
          return true;
        }
        function warnInvalidARIAProps(type, props) {
          {
            var invalidProps = [];
            for (var key in props) {
              var isValid = validateProperty(type, key);
              if (!isValid) {
                invalidProps.push(key);
              }
            }
            var unknownPropString = invalidProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (invalidProps.length === 1) {
              error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            } else if (invalidProps.length > 1) {
              error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            }
          }
        }
        function validateProperties(type, props) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnInvalidARIAProps(type, props);
        }
        var didWarnValueNull = false;
        function validateProperties$1(type, props) {
          {
            if (type !== "input" && type !== "textarea" && type !== "select") {
              return;
            }
            if (props != null && props.value === null && !didWarnValueNull) {
              didWarnValueNull = true;
              if (type === "select" && props.multiple) {
                error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
              } else {
                error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
              }
            }
          }
        }
        var possibleStandardNames = {
          accept: "accept",
          acceptcharset: "acceptCharset",
          "accept-charset": "acceptCharset",
          accesskey: "accessKey",
          action: "action",
          allowfullscreen: "allowFullScreen",
          alt: "alt",
          as: "as",
          async: "async",
          autocapitalize: "autoCapitalize",
          autocomplete: "autoComplete",
          autocorrect: "autoCorrect",
          autofocus: "autoFocus",
          autoplay: "autoPlay",
          autosave: "autoSave",
          capture: "capture",
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          challenge: "challenge",
          charset: "charSet",
          checked: "checked",
          children: "children",
          cite: "cite",
          class: "className",
          classid: "classID",
          classname: "className",
          cols: "cols",
          colspan: "colSpan",
          content: "content",
          contenteditable: "contentEditable",
          contextmenu: "contextMenu",
          controls: "controls",
          controlslist: "controlsList",
          coords: "coords",
          crossorigin: "crossOrigin",
          dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
          data: "data",
          datetime: "dateTime",
          default: "default",
          defaultchecked: "defaultChecked",
          defaultvalue: "defaultValue",
          defer: "defer",
          dir: "dir",
          disabled: "disabled",
          disablepictureinpicture: "disablePictureInPicture",
          disableremoteplayback: "disableRemotePlayback",
          download: "download",
          draggable: "draggable",
          enctype: "encType",
          enterkeyhint: "enterKeyHint",
          for: "htmlFor",
          form: "form",
          formmethod: "formMethod",
          formaction: "formAction",
          formenctype: "formEncType",
          formnovalidate: "formNoValidate",
          formtarget: "formTarget",
          frameborder: "frameBorder",
          headers: "headers",
          height: "height",
          hidden: "hidden",
          high: "high",
          href: "href",
          hreflang: "hrefLang",
          htmlfor: "htmlFor",
          httpequiv: "httpEquiv",
          "http-equiv": "httpEquiv",
          icon: "icon",
          id: "id",
          imagesizes: "imageSizes",
          imagesrcset: "imageSrcSet",
          innerhtml: "innerHTML",
          inputmode: "inputMode",
          integrity: "integrity",
          is: "is",
          itemid: "itemID",
          itemprop: "itemProp",
          itemref: "itemRef",
          itemscope: "itemScope",
          itemtype: "itemType",
          keyparams: "keyParams",
          keytype: "keyType",
          kind: "kind",
          label: "label",
          lang: "lang",
          list: "list",
          loop: "loop",
          low: "low",
          manifest: "manifest",
          marginwidth: "marginWidth",
          marginheight: "marginHeight",
          max: "max",
          maxlength: "maxLength",
          media: "media",
          mediagroup: "mediaGroup",
          method: "method",
          min: "min",
          minlength: "minLength",
          multiple: "multiple",
          muted: "muted",
          name: "name",
          nomodule: "noModule",
          nonce: "nonce",
          novalidate: "noValidate",
          open: "open",
          optimum: "optimum",
          pattern: "pattern",
          placeholder: "placeholder",
          playsinline: "playsInline",
          poster: "poster",
          preload: "preload",
          profile: "profile",
          radiogroup: "radioGroup",
          readonly: "readOnly",
          referrerpolicy: "referrerPolicy",
          rel: "rel",
          required: "required",
          reversed: "reversed",
          role: "role",
          rows: "rows",
          rowspan: "rowSpan",
          sandbox: "sandbox",
          scope: "scope",
          scoped: "scoped",
          scrolling: "scrolling",
          seamless: "seamless",
          selected: "selected",
          shape: "shape",
          size: "size",
          sizes: "sizes",
          span: "span",
          spellcheck: "spellCheck",
          src: "src",
          srcdoc: "srcDoc",
          srclang: "srcLang",
          srcset: "srcSet",
          start: "start",
          step: "step",
          style: "style",
          summary: "summary",
          tabindex: "tabIndex",
          target: "target",
          title: "title",
          type: "type",
          usemap: "useMap",
          value: "value",
          width: "width",
          wmode: "wmode",
          wrap: "wrap",
          about: "about",
          accentheight: "accentHeight",
          "accent-height": "accentHeight",
          accumulate: "accumulate",
          additive: "additive",
          alignmentbaseline: "alignmentBaseline",
          "alignment-baseline": "alignmentBaseline",
          allowreorder: "allowReorder",
          alphabetic: "alphabetic",
          amplitude: "amplitude",
          arabicform: "arabicForm",
          "arabic-form": "arabicForm",
          ascent: "ascent",
          attributename: "attributeName",
          attributetype: "attributeType",
          autoreverse: "autoReverse",
          azimuth: "azimuth",
          basefrequency: "baseFrequency",
          baselineshift: "baselineShift",
          "baseline-shift": "baselineShift",
          baseprofile: "baseProfile",
          bbox: "bbox",
          begin: "begin",
          bias: "bias",
          by: "by",
          calcmode: "calcMode",
          capheight: "capHeight",
          "cap-height": "capHeight",
          clip: "clip",
          clippath: "clipPath",
          "clip-path": "clipPath",
          clippathunits: "clipPathUnits",
          cliprule: "clipRule",
          "clip-rule": "clipRule",
          color: "color",
          colorinterpolation: "colorInterpolation",
          "color-interpolation": "colorInterpolation",
          colorinterpolationfilters: "colorInterpolationFilters",
          "color-interpolation-filters": "colorInterpolationFilters",
          colorprofile: "colorProfile",
          "color-profile": "colorProfile",
          colorrendering: "colorRendering",
          "color-rendering": "colorRendering",
          contentscripttype: "contentScriptType",
          contentstyletype: "contentStyleType",
          cursor: "cursor",
          cx: "cx",
          cy: "cy",
          d: "d",
          datatype: "datatype",
          decelerate: "decelerate",
          descent: "descent",
          diffuseconstant: "diffuseConstant",
          direction: "direction",
          display: "display",
          divisor: "divisor",
          dominantbaseline: "dominantBaseline",
          "dominant-baseline": "dominantBaseline",
          dur: "dur",
          dx: "dx",
          dy: "dy",
          edgemode: "edgeMode",
          elevation: "elevation",
          enablebackground: "enableBackground",
          "enable-background": "enableBackground",
          end: "end",
          exponent: "exponent",
          externalresourcesrequired: "externalResourcesRequired",
          fill: "fill",
          fillopacity: "fillOpacity",
          "fill-opacity": "fillOpacity",
          fillrule: "fillRule",
          "fill-rule": "fillRule",
          filter: "filter",
          filterres: "filterRes",
          filterunits: "filterUnits",
          floodopacity: "floodOpacity",
          "flood-opacity": "floodOpacity",
          floodcolor: "floodColor",
          "flood-color": "floodColor",
          focusable: "focusable",
          fontfamily: "fontFamily",
          "font-family": "fontFamily",
          fontsize: "fontSize",
          "font-size": "fontSize",
          fontsizeadjust: "fontSizeAdjust",
          "font-size-adjust": "fontSizeAdjust",
          fontstretch: "fontStretch",
          "font-stretch": "fontStretch",
          fontstyle: "fontStyle",
          "font-style": "fontStyle",
          fontvariant: "fontVariant",
          "font-variant": "fontVariant",
          fontweight: "fontWeight",
          "font-weight": "fontWeight",
          format: "format",
          from: "from",
          fx: "fx",
          fy: "fy",
          g1: "g1",
          g2: "g2",
          glyphname: "glyphName",
          "glyph-name": "glyphName",
          glyphorientationhorizontal: "glyphOrientationHorizontal",
          "glyph-orientation-horizontal": "glyphOrientationHorizontal",
          glyphorientationvertical: "glyphOrientationVertical",
          "glyph-orientation-vertical": "glyphOrientationVertical",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          hanging: "hanging",
          horizadvx: "horizAdvX",
          "horiz-adv-x": "horizAdvX",
          horizoriginx: "horizOriginX",
          "horiz-origin-x": "horizOriginX",
          ideographic: "ideographic",
          imagerendering: "imageRendering",
          "image-rendering": "imageRendering",
          in2: "in2",
          in: "in",
          inlist: "inlist",
          intercept: "intercept",
          k1: "k1",
          k2: "k2",
          k3: "k3",
          k4: "k4",
          k: "k",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          kerning: "kerning",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          letterspacing: "letterSpacing",
          "letter-spacing": "letterSpacing",
          lightingcolor: "lightingColor",
          "lighting-color": "lightingColor",
          limitingconeangle: "limitingConeAngle",
          local: "local",
          markerend: "markerEnd",
          "marker-end": "markerEnd",
          markerheight: "markerHeight",
          markermid: "markerMid",
          "marker-mid": "markerMid",
          markerstart: "markerStart",
          "marker-start": "markerStart",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          mask: "mask",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          mathematical: "mathematical",
          mode: "mode",
          numoctaves: "numOctaves",
          offset: "offset",
          opacity: "opacity",
          operator: "operator",
          order: "order",
          orient: "orient",
          orientation: "orientation",
          origin: "origin",
          overflow: "overflow",
          overlineposition: "overlinePosition",
          "overline-position": "overlinePosition",
          overlinethickness: "overlineThickness",
          "overline-thickness": "overlineThickness",
          paintorder: "paintOrder",
          "paint-order": "paintOrder",
          panose1: "panose1",
          "panose-1": "panose1",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointerevents: "pointerEvents",
          "pointer-events": "pointerEvents",
          points: "points",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          prefix: "prefix",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          property: "property",
          r: "r",
          radius: "radius",
          refx: "refX",
          refy: "refY",
          renderingintent: "renderingIntent",
          "rendering-intent": "renderingIntent",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          resource: "resource",
          restart: "restart",
          result: "result",
          results: "results",
          rotate: "rotate",
          rx: "rx",
          ry: "ry",
          scale: "scale",
          security: "security",
          seed: "seed",
          shaperendering: "shapeRendering",
          "shape-rendering": "shapeRendering",
          slope: "slope",
          spacing: "spacing",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          speed: "speed",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stemh: "stemh",
          stemv: "stemv",
          stitchtiles: "stitchTiles",
          stopcolor: "stopColor",
          "stop-color": "stopColor",
          stopopacity: "stopOpacity",
          "stop-opacity": "stopOpacity",
          strikethroughposition: "strikethroughPosition",
          "strikethrough-position": "strikethroughPosition",
          strikethroughthickness: "strikethroughThickness",
          "strikethrough-thickness": "strikethroughThickness",
          string: "string",
          stroke: "stroke",
          strokedasharray: "strokeDasharray",
          "stroke-dasharray": "strokeDasharray",
          strokedashoffset: "strokeDashoffset",
          "stroke-dashoffset": "strokeDashoffset",
          strokelinecap: "strokeLinecap",
          "stroke-linecap": "strokeLinecap",
          strokelinejoin: "strokeLinejoin",
          "stroke-linejoin": "strokeLinejoin",
          strokemiterlimit: "strokeMiterlimit",
          "stroke-miterlimit": "strokeMiterlimit",
          strokewidth: "strokeWidth",
          "stroke-width": "strokeWidth",
          strokeopacity: "strokeOpacity",
          "stroke-opacity": "strokeOpacity",
          suppresscontenteditablewarning: "suppressContentEditableWarning",
          suppresshydrationwarning: "suppressHydrationWarning",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textanchor: "textAnchor",
          "text-anchor": "textAnchor",
          textdecoration: "textDecoration",
          "text-decoration": "textDecoration",
          textlength: "textLength",
          textrendering: "textRendering",
          "text-rendering": "textRendering",
          to: "to",
          transform: "transform",
          typeof: "typeof",
          u1: "u1",
          u2: "u2",
          underlineposition: "underlinePosition",
          "underline-position": "underlinePosition",
          underlinethickness: "underlineThickness",
          "underline-thickness": "underlineThickness",
          unicode: "unicode",
          unicodebidi: "unicodeBidi",
          "unicode-bidi": "unicodeBidi",
          unicoderange: "unicodeRange",
          "unicode-range": "unicodeRange",
          unitsperem: "unitsPerEm",
          "units-per-em": "unitsPerEm",
          unselectable: "unselectable",
          valphabetic: "vAlphabetic",
          "v-alphabetic": "vAlphabetic",
          values: "values",
          vectoreffect: "vectorEffect",
          "vector-effect": "vectorEffect",
          version: "version",
          vertadvy: "vertAdvY",
          "vert-adv-y": "vertAdvY",
          vertoriginx: "vertOriginX",
          "vert-origin-x": "vertOriginX",
          vertoriginy: "vertOriginY",
          "vert-origin-y": "vertOriginY",
          vhanging: "vHanging",
          "v-hanging": "vHanging",
          videographic: "vIdeographic",
          "v-ideographic": "vIdeographic",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          visibility: "visibility",
          vmathematical: "vMathematical",
          "v-mathematical": "vMathematical",
          vocab: "vocab",
          widths: "widths",
          wordspacing: "wordSpacing",
          "word-spacing": "wordSpacing",
          writingmode: "writingMode",
          "writing-mode": "writingMode",
          x1: "x1",
          x2: "x2",
          x: "x",
          xchannelselector: "xChannelSelector",
          xheight: "xHeight",
          "x-height": "xHeight",
          xlinkactuate: "xlinkActuate",
          "xlink:actuate": "xlinkActuate",
          xlinkarcrole: "xlinkArcrole",
          "xlink:arcrole": "xlinkArcrole",
          xlinkhref: "xlinkHref",
          "xlink:href": "xlinkHref",
          xlinkrole: "xlinkRole",
          "xlink:role": "xlinkRole",
          xlinkshow: "xlinkShow",
          "xlink:show": "xlinkShow",
          xlinktitle: "xlinkTitle",
          "xlink:title": "xlinkTitle",
          xlinktype: "xlinkType",
          "xlink:type": "xlinkType",
          xmlbase: "xmlBase",
          "xml:base": "xmlBase",
          xmllang: "xmlLang",
          "xml:lang": "xmlLang",
          xmlns: "xmlns",
          "xml:space": "xmlSpace",
          xmlnsxlink: "xmlnsXlink",
          "xmlns:xlink": "xmlnsXlink",
          xmlspace: "xmlSpace",
          y1: "y1",
          y2: "y2",
          y: "y",
          ychannelselector: "yChannelSelector",
          z: "z",
          zoomandpan: "zoomAndPan"
        };
        var validateProperty$1 = function() {
        };
        {
          var warnedProperties$1 = {};
          var EVENT_NAME_REGEX = /^on./;
          var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
          var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          validateProperty$1 = function(tagName, name, value, eventRegistry) {
            if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
              return true;
            }
            var lowerCasedName = name.toLowerCase();
            if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
              error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (eventRegistry != null) {
              var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
              if (registrationNameDependencies.hasOwnProperty(name)) {
                return true;
              }
              var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
              if (registrationName != null) {
                error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (EVENT_NAME_REGEX.test(name)) {
                error("Unknown event handler property `%s`. It will be ignored.", name);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (EVENT_NAME_REGEX.test(name)) {
              if (INVALID_EVENT_NAME_REGEX.test(name)) {
                error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
              return true;
            }
            if (lowerCasedName === "innerhtml") {
              error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "aria") {
              error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
              error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "number" && isNaN(value)) {
              error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
              warnedProperties$1[name] = true;
              return true;
            }
            var propertyInfo = getPropertyInfo(name);
            var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
            if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
              var standardName = possibleStandardNames[lowerCasedName];
              if (standardName !== name) {
                error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (!isReserved && name !== lowerCasedName) {
              error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              if (value) {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
              } else {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (isReserved) {
              return true;
            }
            if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              warnedProperties$1[name] = true;
              return false;
            }
            if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
              error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
              warnedProperties$1[name] = true;
              return true;
            }
            return true;
          };
        }
        var warnUnknownProperties = function(type, props, eventRegistry) {
          {
            var unknownProps = [];
            for (var key in props) {
              var isValid = validateProperty$1(type, key, props[key], eventRegistry);
              if (!isValid) {
                unknownProps.push(key);
              }
            }
            var unknownPropString = unknownProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (unknownProps.length === 1) {
              error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            } else if (unknownProps.length > 1) {
              error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            }
          }
        };
        function validateProperties$2(type, props, eventRegistry) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnUnknownProperties(type, props, eventRegistry);
        }
        var warnValidStyle = function() {
        };
        {
          var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
          var msPattern = /^-ms-/;
          var hyphenPattern = /-(.)/g;
          var badStyleValueWithSemicolonPattern = /;\s*$/;
          var warnedStyleNames = {};
          var warnedStyleValues = {};
          var warnedForNaNValue = false;
          var warnedForInfinityValue = false;
          var camelize = function(string) {
            return string.replace(hyphenPattern, function(_, character) {
              return character.toUpperCase();
            });
          };
          var warnHyphenatedStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error(
              "Unsupported style property %s. Did you mean %s?",
              name,
              camelize(name.replace(msPattern, "ms-"))
            );
          };
          var warnBadVendoredStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
          };
          var warnStyleValueWithSemicolon = function(name, value) {
            if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
              return;
            }
            warnedStyleValues[value] = true;
            error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
          };
          var warnStyleValueIsNaN = function(name, value) {
            if (warnedForNaNValue) {
              return;
            }
            warnedForNaNValue = true;
            error("`NaN` is an invalid value for the `%s` css style property.", name);
          };
          var warnStyleValueIsInfinity = function(name, value) {
            if (warnedForInfinityValue) {
              return;
            }
            warnedForInfinityValue = true;
            error("`Infinity` is an invalid value for the `%s` css style property.", name);
          };
          warnValidStyle = function(name, value) {
            if (name.indexOf("-") > -1) {
              warnHyphenatedStyleName(name);
            } else if (badVendoredStyleNamePattern.test(name)) {
              warnBadVendoredStyleName(name);
            } else if (badStyleValueWithSemicolonPattern.test(value)) {
              warnStyleValueWithSemicolon(name, value);
            }
            if (typeof value === "number") {
              if (isNaN(value)) {
                warnStyleValueIsNaN(name, value);
              } else if (!isFinite(value)) {
                warnStyleValueIsInfinity(name, value);
              }
            }
          };
        }
        var warnValidStyle$1 = warnValidStyle;
        var matchHtmlRegExp = /["'&<>]/;
        function escapeHtml(string) {
          {
            checkHtmlStringCoercion(string);
          }
          var str = "" + string;
          var match = matchHtmlRegExp.exec(str);
          if (!match) {
            return str;
          }
          var escape2;
          var html = "";
          var index;
          var lastIndex = 0;
          for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
              case 34:
                escape2 = "&quot;";
                break;
              case 38:
                escape2 = "&amp;";
                break;
              case 39:
                escape2 = "&#x27;";
                break;
              case 60:
                escape2 = "&lt;";
                break;
              case 62:
                escape2 = "&gt;";
                break;
              default:
                continue;
            }
            if (lastIndex !== index) {
              html += str.substring(lastIndex, index);
            }
            lastIndex = index + 1;
            html += escape2;
          }
          return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
        }
        function escapeTextForBrowser(text) {
          if (typeof text === "boolean" || typeof text === "number") {
            return "" + text;
          }
          return escapeHtml(text);
        }
        var uppercasePattern = /([A-Z])/g;
        var msPattern$1 = /^ms-/;
        function hyphenateStyleName(name) {
          return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
        }
        var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
        var didWarn = false;
        function sanitizeURL(url) {
          {
            if (!didWarn && isJavaScriptProtocol.test(url)) {
              didWarn = true;
              error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        var startInlineScript = stringToPrecomputedChunk("<script>");
        var endInlineScript = stringToPrecomputedChunk("<\/script>");
        var startScriptSrc = stringToPrecomputedChunk('<script src="');
        var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
        var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
        function escapeBootstrapScriptContent(scriptText) {
          {
            checkHtmlStringCoercion(scriptText);
          }
          return ("" + scriptText).replace(scriptRegex, scriptReplacer);
        }
        var scriptRegex = /(<\/|<)(s)(cript)/gi;
        var scriptReplacer = function(match, prefix2, s, suffix) {
          return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
        };
        function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
          var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
          var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
          var bootstrapChunks = [];
          if (bootstrapScriptContent !== void 0) {
            bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
          }
          if (bootstrapScripts !== void 0) {
            for (var i = 0; i < bootstrapScripts.length; i++) {
              bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
            }
          }
          if (bootstrapModules !== void 0) {
            for (var _i = 0; _i < bootstrapModules.length; _i++) {
              bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
            }
          }
          return {
            bootstrapChunks,
            startInlineScript: inlineScriptWithNonce,
            placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
            segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
            boundaryPrefix: idPrefix + "B:",
            idPrefix,
            nextSuspenseID: 0,
            sentCompleteSegmentFunction: false,
            sentCompleteBoundaryFunction: false,
            sentClientRenderFunction: false
          };
        }
        var ROOT_HTML_MODE = 0;
        var HTML_MODE = 1;
        var SVG_MODE = 2;
        var MATHML_MODE = 3;
        var HTML_TABLE_MODE = 4;
        var HTML_TABLE_BODY_MODE = 5;
        var HTML_TABLE_ROW_MODE = 6;
        var HTML_COLGROUP_MODE = 7;
        function createFormatContext(insertionMode, selectedValue) {
          return {
            insertionMode,
            selectedValue
          };
        }
        function getChildFormatContext(parentContext, type, props) {
          switch (type) {
            case "select":
              return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
            case "svg":
              return createFormatContext(SVG_MODE, null);
            case "math":
              return createFormatContext(MATHML_MODE, null);
            case "foreignObject":
              return createFormatContext(HTML_MODE, null);
            case "table":
              return createFormatContext(HTML_TABLE_MODE, null);
            case "thead":
            case "tbody":
            case "tfoot":
              return createFormatContext(HTML_TABLE_BODY_MODE, null);
            case "colgroup":
              return createFormatContext(HTML_COLGROUP_MODE, null);
            case "tr":
              return createFormatContext(HTML_TABLE_ROW_MODE, null);
          }
          if (parentContext.insertionMode >= HTML_TABLE_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          if (parentContext.insertionMode === ROOT_HTML_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          return parentContext;
        }
        var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
        function assignSuspenseBoundaryID(responseState) {
          var generatedID = responseState.nextSuspenseID++;
          return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
        }
        function makeId(responseState, treeId, localId) {
          var idPrefix = responseState.idPrefix;
          var id = ":" + idPrefix + "R" + treeId;
          if (localId > 0) {
            id += "H" + localId.toString(32);
          }
          return id + ":";
        }
        function encodeHTMLTextNode(text) {
          return escapeTextForBrowser(text);
        }
        var textSeparator = stringToPrecomputedChunk("<!-- -->");
        function pushTextInstance(target, text, responseState, textEmbedded) {
          if (text === "") {
            return textEmbedded;
          }
          if (textEmbedded) {
            target.push(textSeparator);
          }
          target.push(stringToChunk(encodeHTMLTextNode(text)));
          return true;
        }
        function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
          if (lastPushedText && textEmbedded) {
            target.push(textSeparator);
          }
        }
        var styleNameCache = /* @__PURE__ */ new Map();
        function processStyleName(styleName) {
          var chunk = styleNameCache.get(styleName);
          if (chunk !== void 0) {
            return chunk;
          }
          var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
          styleNameCache.set(styleName, result);
          return result;
        }
        var styleAttributeStart = stringToPrecomputedChunk(' style="');
        var styleAssign = stringToPrecomputedChunk(":");
        var styleSeparator = stringToPrecomputedChunk(";");
        function pushStyle(target, responseState, style) {
          if (typeof style !== "object") {
            throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
          }
          var isFirst = true;
          for (var styleName in style) {
            if (!hasOwnProperty.call(style, styleName)) {
              continue;
            }
            var styleValue = style[styleName];
            if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
              continue;
            }
            var nameChunk = void 0;
            var valueChunk = void 0;
            var isCustomProperty = styleName.indexOf("--") === 0;
            if (isCustomProperty) {
              nameChunk = stringToChunk(escapeTextForBrowser(styleName));
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            } else {
              {
                warnValidStyle$1(styleName, styleValue);
              }
              nameChunk = processStyleName(styleName);
              if (typeof styleValue === "number") {
                if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                  valueChunk = stringToChunk(styleValue + "px");
                } else {
                  valueChunk = stringToChunk("" + styleValue);
                }
              } else {
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              }
            }
            if (isFirst) {
              isFirst = false;
              target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
            } else {
              target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
            }
          }
          if (!isFirst) {
            target.push(attributeEnd);
          }
        }
        var attributeSeparator = stringToPrecomputedChunk(" ");
        var attributeAssign = stringToPrecomputedChunk('="');
        var attributeEnd = stringToPrecomputedChunk('"');
        var attributeEmptyString = stringToPrecomputedChunk('=""');
        function pushAttribute(target, responseState, name, value) {
          switch (name) {
            case "style": {
              pushStyle(target, responseState, value);
              return;
            }
            case "defaultValue":
            case "defaultChecked":
            case "innerHTML":
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              return;
          }
          if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
            return;
          }
          var propertyInfo = getPropertyInfo(name);
          if (propertyInfo !== null) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                if (!propertyInfo.acceptsBooleans) {
                  return;
                }
              }
            }
            var attributeName = propertyInfo.attributeName;
            var attributeNameChunk = stringToChunk(attributeName);
            switch (propertyInfo.type) {
              case BOOLEAN:
                if (value) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                }
                return;
              case OVERLOADED_BOOLEAN:
                if (value === true) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                } else if (value === false)
                  ;
                else {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                return;
              case NUMERIC:
                if (!isNaN(value)) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              case POSITIVE_NUMERIC:
                if (!isNaN(value) && value >= 1) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              default:
                if (propertyInfo.sanitizeURL) {
                  {
                    checkAttributeStringCoercion(value, attributeName);
                  }
                  value = "" + value;
                  sanitizeURL(value);
                }
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          } else if (isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                var prefix2 = name.toLowerCase().slice(0, 5);
                if (prefix2 !== "data-" && prefix2 !== "aria-") {
                  return;
                }
              }
            }
            target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        }
        var endOfStartTag = stringToPrecomputedChunk(">");
        var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
        function pushInnerHTML(target, innerHTML, children) {
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        var didWarnDefaultInputValue = false;
        var didWarnDefaultChecked = false;
        var didWarnDefaultSelectValue = false;
        var didWarnDefaultTextareaValue = false;
        var didWarnInvalidOptionChildren = false;
        var didWarnInvalidOptionInnerHTML = false;
        var didWarnSelectedSetOnOption = false;
        function checkSelectProp(props, propName) {
          {
            var value = props[propName];
            if (value != null) {
              var array = isArray(value);
              if (props.multiple && !array) {
                error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
              } else if (!props.multiple && array) {
                error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
              }
            }
          }
        }
        function pushStartSelect(target, props, responseState) {
          {
            checkControlledValueProps("select", props);
            checkSelectProp(props, "value");
            checkSelectProp(props, "defaultValue");
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
              error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultSelectValue = true;
            }
          }
          target.push(startChunkForTag("select"));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function flattenOptionChildren(children) {
          var content = "";
          React5.Children.forEach(children, function(child) {
            if (child == null) {
              return;
            }
            content += child;
            {
              if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                didWarnInvalidOptionChildren = true;
                error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
              }
            }
          });
          return content;
        }
        var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
        function pushStartOption(target, props, responseState, formatContext) {
          var selectedValue = formatContext.selectedValue;
          target.push(startChunkForTag("option"));
          var children = null;
          var value = null;
          var selected = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "selected":
                  selected = propValue;
                  {
                    if (!didWarnSelectedSetOnOption) {
                      error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                      didWarnSelectedSetOnOption = true;
                    }
                  }
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "value":
                  value = propValue;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (selectedValue != null) {
            var stringValue;
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              stringValue = "" + value;
            } else {
              {
                if (innerHTML !== null) {
                  if (!didWarnInvalidOptionInnerHTML) {
                    didWarnInvalidOptionInnerHTML = true;
                    error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                  }
                }
              }
              stringValue = flattenOptionChildren(children);
            }
            if (isArray(selectedValue)) {
              for (var i = 0; i < selectedValue.length; i++) {
                {
                  checkAttributeStringCoercion(selectedValue[i], "value");
                }
                var v = "" + selectedValue[i];
                if (v === stringValue) {
                  target.push(selectedMarkerAttribute);
                  break;
                }
              }
            } else {
              {
                checkAttributeStringCoercion(selectedValue, "select.value");
              }
              if ("" + selectedValue === stringValue) {
                target.push(selectedMarkerAttribute);
              }
            }
          } else if (selected) {
            target.push(selectedMarkerAttribute);
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function pushInput(target, props, responseState) {
          {
            checkControlledValueProps("input", props);
            if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
              error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultChecked = true;
            }
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
              error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultInputValue = true;
            }
          }
          target.push(startChunkForTag("input"));
          var value = null;
          var defaultValue = null;
          var checked = null;
          var defaultChecked = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                case "defaultChecked":
                  defaultChecked = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "checked":
                  checked = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (checked !== null) {
            pushAttribute(target, responseState, "checked", checked);
          } else if (defaultChecked !== null) {
            pushAttribute(target, responseState, "checked", defaultChecked);
          }
          if (value !== null) {
            pushAttribute(target, responseState, "value", value);
          } else if (defaultValue !== null) {
            pushAttribute(target, responseState, "value", defaultValue);
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartTextArea(target, props, responseState) {
          {
            checkControlledValueProps("textarea", props);
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
              error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultTextareaValue = true;
            }
          }
          target.push(startChunkForTag("textarea"));
          var value = null;
          var defaultValue = null;
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (value === null && defaultValue !== null) {
            value = defaultValue;
          }
          target.push(endOfStartTag);
          if (children != null) {
            {
              error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
            }
            if (value != null) {
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            }
            if (isArray(children)) {
              if (children.length > 1) {
                throw new Error("<textarea> can only have at most one child.");
              }
              {
                checkHtmlStringCoercion(children[0]);
              }
              value = "" + children[0];
            }
            {
              checkHtmlStringCoercion(children);
            }
            value = "" + children;
          }
          if (typeof value === "string" && value[0] === "\n") {
            target.push(leadingNewline);
          }
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            target.push(stringToChunk(encodeHTMLTextNode("" + value)));
          }
          return null;
        }
        function pushSelfClosing(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartMenuItem(target, props, responseState) {
          target.push(startChunkForTag("menuitem"));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          return null;
        }
        function pushStartTitle(target, props, responseState) {
          target.push(startChunkForTag("title"));
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          {
            var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
            if (Array.isArray(children) && children.length > 1) {
              error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && child.$$typeof != null) {
              error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && typeof child !== "string" && typeof child !== "number") {
              error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            }
          }
          return children;
        }
        function pushStartGenericElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          if (typeof children === "string") {
            target.push(stringToChunk(encodeHTMLTextNode(children)));
            return null;
          }
          return children;
        }
        function pushStartCustomElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "style":
                  pushStyle(target, responseState, propValue);
                  break;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                  break;
                default:
                  if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                    target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                  }
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        var leadingNewline = stringToPrecomputedChunk("\n");
        function pushStartPreformattedElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                target.push(leadingNewline, stringToChunk(html));
              } else {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          if (typeof children === "string" && children[0] === "\n") {
            target.push(leadingNewline);
          }
          return children;
        }
        var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
        var validatedTagCache = /* @__PURE__ */ new Map();
        function startChunkForTag(tag) {
          var tagStartChunk = validatedTagCache.get(tag);
          if (tagStartChunk === void 0) {
            if (!VALID_TAG_REGEX.test(tag)) {
              throw new Error("Invalid tag: " + tag);
            }
            tagStartChunk = stringToPrecomputedChunk("<" + tag);
            validatedTagCache.set(tag, tagStartChunk);
          }
          return tagStartChunk;
        }
        var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
        function pushStartInstance(target, type, props, responseState, formatContext) {
          {
            validateProperties(type, props);
            validateProperties$1(type, props);
            validateProperties$2(type, props, null);
            if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
              error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
            }
            if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
              if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
              }
            }
          }
          switch (type) {
            case "select":
              return pushStartSelect(target, props, responseState);
            case "option":
              return pushStartOption(target, props, responseState, formatContext);
            case "textarea":
              return pushStartTextArea(target, props, responseState);
            case "input":
              return pushInput(target, props, responseState);
            case "menuitem":
              return pushStartMenuItem(target, props, responseState);
            case "title":
              return pushStartTitle(target, props, responseState);
            case "listing":
            case "pre": {
              return pushStartPreformattedElement(target, props, type, responseState);
            }
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              return pushSelfClosing(target, props, type, responseState);
            }
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph": {
              return pushStartGenericElement(target, props, type, responseState);
            }
            case "html": {
              if (formatContext.insertionMode === ROOT_HTML_MODE) {
                target.push(DOCTYPE);
              }
              return pushStartGenericElement(target, props, type, responseState);
            }
            default: {
              if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                return pushStartGenericElement(target, props, type, responseState);
              } else {
                return pushStartCustomElement(target, props, type, responseState);
              }
            }
          }
        }
        var endTag1 = stringToPrecomputedChunk("</");
        var endTag2 = stringToPrecomputedChunk(">");
        function pushEndInstance(target, type, props) {
          switch (type) {
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              break;
            }
            default: {
              target.push(endTag1, stringToChunk(type), endTag2);
            }
          }
        }
        function writeCompletedRoot(destination, responseState) {
          var bootstrapChunks = responseState.bootstrapChunks;
          var i = 0;
          for (; i < bootstrapChunks.length - 1; i++) {
            writeChunk(destination, bootstrapChunks[i]);
          }
          if (i < bootstrapChunks.length) {
            return writeChunkAndReturn(destination, bootstrapChunks[i]);
          }
          return true;
        }
        var placeholder1 = stringToPrecomputedChunk('<template id="');
        var placeholder2 = stringToPrecomputedChunk('"></template>');
        function writePlaceholder(destination, responseState, id) {
          writeChunk(destination, placeholder1);
          writeChunk(destination, responseState.placeholderPrefix);
          var formattedID = stringToChunk(id.toString(16));
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, placeholder2);
        }
        var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
        var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
        var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
        var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
        var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
        var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
        var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
        var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
        var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
        var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
        var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
        function writeStartCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        }
        function writeStartPendingSuspenseBoundary(destination, responseState, id) {
          writeChunk(destination, startPendingSuspenseBoundary1);
          if (id === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, id);
          return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
        }
        function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
          var result;
          result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
          writeChunk(destination, clientRenderedSuspenseBoundaryError1);
          if (errorDigest) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          {
            if (errorMesssage) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
          }
          result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
          return result;
        }
        function writeEndCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndPendingSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
        var startSegmentHTML2 = stringToPrecomputedChunk('">');
        var endSegmentHTML = stringToPrecomputedChunk("</div>");
        var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
        var startSegmentSVG2 = stringToPrecomputedChunk('">');
        var endSegmentSVG = stringToPrecomputedChunk("</svg>");
        var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
        var startSegmentMathML2 = stringToPrecomputedChunk('">');
        var endSegmentMathML = stringToPrecomputedChunk("</math>");
        var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
        var startSegmentTable2 = stringToPrecomputedChunk('">');
        var endSegmentTable = stringToPrecomputedChunk("</table>");
        var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
        var startSegmentTableBody2 = stringToPrecomputedChunk('">');
        var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
        var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
        var startSegmentTableRow2 = stringToPrecomputedChunk('">');
        var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
        var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
        var startSegmentColGroup2 = stringToPrecomputedChunk('">');
        var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
        function writeStartSegment(destination, responseState, formatContext, id) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              writeChunk(destination, startSegmentHTML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentHTML2);
            }
            case SVG_MODE: {
              writeChunk(destination, startSegmentSVG);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentSVG2);
            }
            case MATHML_MODE: {
              writeChunk(destination, startSegmentMathML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentMathML2);
            }
            case HTML_TABLE_MODE: {
              writeChunk(destination, startSegmentTable);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTable2);
            }
            case HTML_TABLE_BODY_MODE: {
              writeChunk(destination, startSegmentTableBody);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableBody2);
            }
            case HTML_TABLE_ROW_MODE: {
              writeChunk(destination, startSegmentTableRow);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableRow2);
            }
            case HTML_COLGROUP_MODE: {
              writeChunk(destination, startSegmentColGroup);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentColGroup2);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        function writeEndSegment(destination, formatContext) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              return writeChunkAndReturn(destination, endSegmentHTML);
            }
            case SVG_MODE: {
              return writeChunkAndReturn(destination, endSegmentSVG);
            }
            case MATHML_MODE: {
              return writeChunkAndReturn(destination, endSegmentMathML);
            }
            case HTML_TABLE_MODE: {
              return writeChunkAndReturn(destination, endSegmentTable);
            }
            case HTML_TABLE_BODY_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableBody);
            }
            case HTML_TABLE_ROW_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableRow);
            }
            case HTML_COLGROUP_MODE: {
              return writeChunkAndReturn(destination, endSegmentColGroup);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
        var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
        var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
        var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
        var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
        var completeSegmentScript2 = stringToPrecomputedChunk('","');
        var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteSegmentFunction) {
            responseState.sentCompleteSegmentFunction = true;
            writeChunk(destination, completeSegmentScript1Full);
          } else {
            writeChunk(destination, completeSegmentScript1Partial);
          }
          writeChunk(destination, responseState.segmentPrefix);
          var formattedID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, formattedID);
          writeChunk(destination, completeSegmentScript2);
          writeChunk(destination, responseState.placeholderPrefix);
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, completeSegmentScript3);
        }
        var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
        var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
        var completeBoundaryScript2 = stringToPrecomputedChunk('","');
        var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteBoundaryFunction) {
            responseState.sentCompleteBoundaryFunction = true;
            writeChunk(destination, completeBoundaryScript1Full);
          } else {
            writeChunk(destination, completeBoundaryScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          var formattedContentID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, boundaryID);
          writeChunk(destination, completeBoundaryScript2);
          writeChunk(destination, responseState.segmentPrefix);
          writeChunk(destination, formattedContentID);
          return writeChunkAndReturn(destination, completeBoundaryScript3);
        }
        var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
        var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
        var clientRenderScript1A = stringToPrecomputedChunk('"');
        var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
        var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
        function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentClientRenderFunction) {
            responseState.sentClientRenderFunction = true;
            writeChunk(destination, clientRenderScript1Full);
          } else {
            writeChunk(destination, clientRenderScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, boundaryID);
          writeChunk(destination, clientRenderScript1A);
          if (errorDigest || errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
          }
          if (errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
          }
          return writeChunkAndReturn(destination, clientRenderScript2);
        }
        var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
        function escapeJSStringsForInstructionScripts(input) {
          var escaped = JSON.stringify(input);
          return escaped.replace(regexForJSStringsInScripts, function(match) {
            switch (match) {
              case "<":
                return "\\u003c";
              case "\u2028":
                return "\\u2028";
              case "\u2029":
                return "\\u2029";
              default: {
                throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
              }
            }
          });
        }
        function createResponseState$1(generateStaticMarkup, identifierPrefix) {
          var responseState = createResponseState(identifierPrefix, void 0);
          return {
            bootstrapChunks: responseState.bootstrapChunks,
            startInlineScript: responseState.startInlineScript,
            placeholderPrefix: responseState.placeholderPrefix,
            segmentPrefix: responseState.segmentPrefix,
            boundaryPrefix: responseState.boundaryPrefix,
            idPrefix: responseState.idPrefix,
            nextSuspenseID: responseState.nextSuspenseID,
            sentCompleteSegmentFunction: responseState.sentCompleteSegmentFunction,
            sentCompleteBoundaryFunction: responseState.sentCompleteBoundaryFunction,
            sentClientRenderFunction: responseState.sentClientRenderFunction,
            generateStaticMarkup
          };
        }
        function createRootFormatContext() {
          return {
            insertionMode: HTML_MODE,
            selectedValue: null
          };
        }
        function pushTextInstance$1(target, text, responseState, textEmbedded) {
          if (responseState.generateStaticMarkup) {
            target.push(stringToChunk(escapeTextForBrowser(text)));
            return false;
          } else {
            return pushTextInstance(target, text, responseState, textEmbedded);
          }
        }
        function pushSegmentFinale$1(target, responseState, lastPushedText, textEmbedded) {
          if (responseState.generateStaticMarkup) {
            return;
          } else {
            return pushSegmentFinale(target, responseState, lastPushedText, textEmbedded);
          }
        }
        function writeStartCompletedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeStartCompletedSuspenseBoundary(destination);
        }
        function writeStartClientRenderedSuspenseBoundary$1(destination, responseState, errorDigest, errorMessage, errorComponentStack) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMessage, errorComponentStack);
        }
        function writeEndCompletedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeEndCompletedSuspenseBoundary(destination);
        }
        function writeEndClientRenderedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeEndClientRenderedSuspenseBoundary(destination);
        }
        var assign = Object.assign;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_SCOPE_TYPE = Symbol.for("react.scope");
        var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
        var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
        var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeClassComponentFrame(ctor, source, ownerFn) {
          {
            return describeNativeComponentFrame(ctor, true);
          }
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var warnedAboutMissingGetChildContext;
        {
          warnedAboutMissingGetChildContext = {};
        }
        var emptyContextObject = {};
        {
          Object.freeze(emptyContextObject);
        }
        function getMaskedContext(type, unmaskedContext) {
          {
            var contextTypes = type.contextTypes;
            if (!contextTypes) {
              return emptyContextObject;
            }
            var context = {};
            for (var key in contextTypes) {
              context[key] = unmaskedContext[key];
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(contextTypes, context, "context", name);
            }
            return context;
          }
        }
        function processChildContext(instance, type, parentContext, childContextTypes) {
          {
            if (typeof instance.getChildContext !== "function") {
              {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!warnedAboutMissingGetChildContext[componentName]) {
                  warnedAboutMissingGetChildContext[componentName] = true;
                  error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                }
              }
              return parentContext;
            }
            var childContext = instance.getChildContext();
            for (var contextKey in childContext) {
              if (!(contextKey in childContextTypes)) {
                throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
              }
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(childContextTypes, childContext, "child context", name);
            }
            return assign({}, parentContext, childContext);
          }
        }
        var rendererSigil;
        {
          rendererSigil = {};
        }
        var rootContextSnapshot = null;
        var currentActiveSnapshot = null;
        function popNode(prev) {
          {
            prev.context._currentValue2 = prev.parentValue;
          }
        }
        function pushNode(next) {
          {
            next.context._currentValue2 = next.value;
          }
        }
        function popToNearestCommonAncestor(prev, next) {
          if (prev === next)
            ;
          else {
            popNode(prev);
            var parentPrev = prev.parent;
            var parentNext = next.parent;
            if (parentPrev === null) {
              if (parentNext !== null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
            } else {
              if (parentNext === null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
              popToNearestCommonAncestor(parentPrev, parentNext);
            }
            pushNode(next);
          }
        }
        function popAllPrevious(prev) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev !== null) {
            popAllPrevious(parentPrev);
          }
        }
        function pushAllNext(next) {
          var parentNext = next.parent;
          if (parentNext !== null) {
            pushAllNext(parentNext);
          }
          pushNode(next);
        }
        function popPreviousToCommonLevel(prev, next) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (parentPrev.depth === next.depth) {
            popToNearestCommonAncestor(parentPrev, next);
          } else {
            popPreviousToCommonLevel(parentPrev, next);
          }
        }
        function popNextToCommonLevel(prev, next) {
          var parentNext = next.parent;
          if (parentNext === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (prev.depth === parentNext.depth) {
            popToNearestCommonAncestor(prev, parentNext);
          } else {
            popNextToCommonLevel(prev, parentNext);
          }
          pushNode(next);
        }
        function switchContext(newSnapshot) {
          var prev = currentActiveSnapshot;
          var next = newSnapshot;
          if (prev !== next) {
            if (prev === null) {
              pushAllNext(next);
            } else if (next === null) {
              popAllPrevious(prev);
            } else if (prev.depth === next.depth) {
              popToNearestCommonAncestor(prev, next);
            } else if (prev.depth > next.depth) {
              popPreviousToCommonLevel(prev, next);
            } else {
              popNextToCommonLevel(prev, next);
            }
            currentActiveSnapshot = next;
          }
        }
        function pushProvider(context, nextValue) {
          var prevValue;
          {
            prevValue = context._currentValue2;
            context._currentValue2 = nextValue;
            {
              if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer2 = rendererSigil;
            }
          }
          var prevNode = currentActiveSnapshot;
          var newNode = {
            parent: prevNode,
            depth: prevNode === null ? 0 : prevNode.depth + 1,
            context,
            parentValue: prevValue,
            value: nextValue
          };
          currentActiveSnapshot = newNode;
          return newNode;
        }
        function popProvider(context) {
          var prevSnapshot = currentActiveSnapshot;
          if (prevSnapshot === null) {
            throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          }
          {
            if (prevSnapshot.context !== context) {
              error("The parent context is not the expected context. This is probably a bug in React.");
            }
          }
          {
            var _value = prevSnapshot.parentValue;
            if (_value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
              prevSnapshot.context._currentValue2 = prevSnapshot.context._defaultValue;
            } else {
              prevSnapshot.context._currentValue2 = _value;
            }
            {
              if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer2 = rendererSigil;
            }
          }
          return currentActiveSnapshot = prevSnapshot.parent;
        }
        function getActiveContext() {
          return currentActiveSnapshot;
        }
        function readContext(context) {
          var value = context._currentValue2;
          return value;
        }
        function get(key) {
          return key._reactInternals;
        }
        function set(key, value) {
          key._reactInternals = value;
        }
        var didWarnAboutNoopUpdateForComponent = {};
        var didWarnAboutDeprecatedWillMount = {};
        var didWarnAboutUninitializedState;
        var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
        var didWarnAboutLegacyLifecyclesAndDerivedState;
        var didWarnAboutUndefinedDerivedState;
        var warnOnUndefinedDerivedState;
        var warnOnInvalidCallback;
        var didWarnAboutDirectlyAssigningPropsToState;
        var didWarnAboutContextTypeAndContextTypes;
        var didWarnAboutInvalidateContextType;
        {
          didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
          didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
          didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
          didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
          didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
          var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
          warnOnInvalidCallback = function(callback, callerName) {
            if (callback === null || typeof callback === "function") {
              return;
            }
            var key = callerName + "_" + callback;
            if (!didWarnOnInvalidCallback.has(key)) {
              didWarnOnInvalidCallback.add(key);
              error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
            }
          };
          warnOnUndefinedDerivedState = function(type, partialState) {
            if (partialState === void 0) {
              var componentName = getComponentNameFromType(type) || "Component";
              if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                didWarnAboutUndefinedDerivedState.add(componentName);
                error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
              }
            }
          };
        }
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnAboutNoopUpdateForComponent[warningKey]) {
              return;
            }
            error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
            didWarnAboutNoopUpdateForComponent[warningKey] = true;
          }
        }
        var classComponentUpdater = {
          isMounted: function(inst) {
            return false;
          },
          enqueueSetState: function(inst, payload, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "setState");
            } else {
              internals.queue.push(payload);
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          },
          enqueueReplaceState: function(inst, payload, callback) {
            var internals = get(inst);
            internals.replace = true;
            internals.queue = [payload];
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          },
          enqueueForceUpdate: function(inst, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "forceUpdate");
            } else {
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          }
        };
        function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
          var partialState = getDerivedStateFromProps(nextProps, prevState);
          {
            warnOnUndefinedDerivedState(ctor, partialState);
          }
          var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
          return newState;
        }
        function constructClassInstance(ctor, props, maskedLegacyContext) {
          var context = emptyContextObject;
          var contextType = ctor.contextType;
          {
            if ("contextType" in ctor) {
              var isValid = contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0;
              if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                didWarnAboutInvalidateContextType.add(ctor);
                var addendum = "";
                if (contextType === void 0) {
                  addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                } else if (typeof contextType !== "object") {
                  addendum = " However, it is set to a " + typeof contextType + ".";
                } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                  addendum = " Did you accidentally pass the Context.Provider instead?";
                } else if (contextType._context !== void 0) {
                  addendum = " Did you accidentally pass the Context.Consumer instead?";
                } else {
                  addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                }
                error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
              }
            }
          }
          if (typeof contextType === "object" && contextType !== null) {
            context = readContext(contextType);
          } else {
            context = maskedLegacyContext;
          }
          var instance = new ctor(props, context);
          {
            if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutUninitializedState.has(componentName)) {
                didWarnAboutUninitializedState.add(componentName);
                error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
              }
            }
            if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
              var foundWillMountName = null;
              var foundWillReceivePropsName = null;
              var foundWillUpdateName = null;
              if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
                foundWillMountName = "componentWillMount";
              } else if (typeof instance.UNSAFE_componentWillMount === "function") {
                foundWillMountName = "UNSAFE_componentWillMount";
              }
              if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                foundWillReceivePropsName = "componentWillReceiveProps";
              } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
                foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
              }
              if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
                foundWillUpdateName = "componentWillUpdate";
              } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
                foundWillUpdateName = "UNSAFE_componentWillUpdate";
              }
              if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                var _componentName = getComponentNameFromType(ctor) || "Component";
                var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                  didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                  error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                }
              }
            }
          }
          return instance;
        }
        function checkClassInstance(instance, ctor, newProps) {
          {
            var name = getComponentNameFromType(ctor) || "Component";
            var renderPresent = instance.render;
            if (!renderPresent) {
              if (ctor.prototype && typeof ctor.prototype.render === "function") {
                error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
              } else {
                error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
              }
            }
            if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
              error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
            }
            if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
            }
            if (instance.propTypes) {
              error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
            }
            if (instance.contextType) {
              error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
            }
            {
              if (instance.contextTypes) {
                error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
              }
              if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                didWarnAboutContextTypeAndContextTypes.add(ctor);
                error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
              }
            }
            if (typeof instance.componentShouldUpdate === "function") {
              error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
            }
            if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
              error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
            }
            if (typeof instance.componentDidUnmount === "function") {
              error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
            }
            if (typeof instance.componentDidReceiveProps === "function") {
              error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
            }
            if (typeof instance.componentWillRecieveProps === "function") {
              error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
            }
            if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
              error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
            }
            var hasMutatedProps = instance.props !== newProps;
            if (instance.props !== void 0 && hasMutatedProps) {
              error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
            }
            if (instance.defaultProps) {
              error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
            }
            if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
              didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
              error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
            }
            if (typeof instance.getDerivedStateFromProps === "function") {
              error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof instance.getDerivedStateFromError === "function") {
              error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof ctor.getSnapshotBeforeUpdate === "function") {
              error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
            }
            var _state = instance.state;
            if (_state && (typeof _state !== "object" || isArray(_state))) {
              error("%s.state: must be set to an object or null", name);
            }
            if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
              error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
            }
          }
        }
        function callComponentWillMount(type, instance) {
          var oldState = instance.state;
          if (typeof instance.componentWillMount === "function") {
            {
              if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!didWarnAboutDeprecatedWillMount[componentName]) {
                  warn(
                    "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                    componentName
                  );
                  didWarnAboutDeprecatedWillMount[componentName] = true;
                }
              }
            }
            instance.componentWillMount();
          }
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            instance.UNSAFE_componentWillMount();
          }
          if (oldState !== instance.state) {
            {
              error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
            }
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
          if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
            var oldQueue = internalInstance.queue;
            var oldReplace = internalInstance.replace;
            internalInstance.queue = null;
            internalInstance.replace = false;
            if (oldReplace && oldQueue.length === 1) {
              inst.state = oldQueue[0];
            } else {
              var nextState = oldReplace ? oldQueue[0] : inst.state;
              var dontMutate = true;
              for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                var partial = oldQueue[i];
                var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                if (partialState != null) {
                  if (dontMutate) {
                    dontMutate = false;
                    nextState = assign({}, nextState, partialState);
                  } else {
                    assign(nextState, partialState);
                  }
                }
              }
              inst.state = nextState;
            }
          } else {
            internalInstance.queue = null;
          }
        }
        function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
          {
            checkClassInstance(instance, ctor, newProps);
          }
          var initialState = instance.state !== void 0 ? instance.state : null;
          instance.updater = classComponentUpdater;
          instance.props = newProps;
          instance.state = initialState;
          var internalInstance = {
            queue: [],
            replace: false
          };
          set(instance, internalInstance);
          var contextType = ctor.contextType;
          if (typeof contextType === "object" && contextType !== null) {
            instance.context = readContext(contextType);
          } else {
            instance.context = maskedLegacyContext;
          }
          {
            if (instance.state === newProps) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
              }
            }
          }
          var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
          if (typeof getDerivedStateFromProps === "function") {
            instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
          }
          if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
            callComponentWillMount(ctor, instance);
            processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
          }
        }
        var emptyTreeContext = {
          id: 1,
          overflow: ""
        };
        function getTreeId(context) {
          var overflow = context.overflow;
          var idWithLeadingBit = context.id;
          var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
          return id.toString(32) + overflow;
        }
        function pushTreeContext(baseContext, totalChildren, index) {
          var baseIdWithLeadingBit = baseContext.id;
          var baseOverflow = baseContext.overflow;
          var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
          var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
          var slot = index + 1;
          var length = getBitLength(totalChildren) + baseLength;
          if (length > 30) {
            var numberOfOverflowBits = baseLength - baseLength % 5;
            var newOverflowBits = (1 << numberOfOverflowBits) - 1;
            var newOverflow = (baseId & newOverflowBits).toString(32);
            var restOfBaseId = baseId >> numberOfOverflowBits;
            var restOfBaseLength = baseLength - numberOfOverflowBits;
            var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
            var restOfNewBits = slot << restOfBaseLength;
            var id = restOfNewBits | restOfBaseId;
            var overflow = newOverflow + baseOverflow;
            return {
              id: 1 << restOfLength | id,
              overflow
            };
          } else {
            var newBits = slot << baseLength;
            var _id = newBits | baseId;
            var _overflow = baseOverflow;
            return {
              id: 1 << length | _id,
              overflow: _overflow
            };
          }
        }
        function getBitLength(number) {
          return 32 - clz32(number);
        }
        function getLeadingBit(id) {
          return 1 << getBitLength(id) - 1;
        }
        var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
        var log = Math.log;
        var LN2 = Math.LN2;
        function clz32Fallback(x) {
          var asUint = x >>> 0;
          if (asUint === 0) {
            return 32;
          }
          return 31 - (log(asUint) / LN2 | 0) | 0;
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var currentlyRenderingComponent = null;
        var currentlyRenderingTask = null;
        var firstWorkInProgressHook = null;
        var workInProgressHook = null;
        var isReRender = false;
        var didScheduleRenderPhaseUpdate = false;
        var localIdCounter = 0;
        var renderPhaseUpdates = null;
        var numberOfReRenders = 0;
        var RE_RENDER_LIMIT = 25;
        var isInHookUserCodeInDev = false;
        var currentHookNameInDev;
        function resolveCurrentlyRenderingComponent() {
          if (currentlyRenderingComponent === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
          }
          {
            if (isInHookUserCodeInDev) {
              error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
            }
          }
          return currentlyRenderingComponent;
        }
        function areHookInputsEqual(nextDeps, prevDeps) {
          if (prevDeps === null) {
            {
              error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
            }
            return false;
          }
          {
            if (nextDeps.length !== prevDeps.length) {
              error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
            }
          }
          for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
            if (objectIs(nextDeps[i], prevDeps[i])) {
              continue;
            }
            return false;
          }
          return true;
        }
        function createHook() {
          if (numberOfReRenders > 0) {
            throw new Error("Rendered more hooks than during the previous render");
          }
          return {
            memoizedState: null,
            queue: null,
            next: null
          };
        }
        function createWorkInProgressHook() {
          if (workInProgressHook === null) {
            if (firstWorkInProgressHook === null) {
              isReRender = false;
              firstWorkInProgressHook = workInProgressHook = createHook();
            } else {
              isReRender = true;
              workInProgressHook = firstWorkInProgressHook;
            }
          } else {
            if (workInProgressHook.next === null) {
              isReRender = false;
              workInProgressHook = workInProgressHook.next = createHook();
            } else {
              isReRender = true;
              workInProgressHook = workInProgressHook.next;
            }
          }
          return workInProgressHook;
        }
        function prepareToUseHooks(task, componentIdentity) {
          currentlyRenderingComponent = componentIdentity;
          currentlyRenderingTask = task;
          {
            isInHookUserCodeInDev = false;
          }
          localIdCounter = 0;
        }
        function finishHooks(Component, props, children, refOrContext) {
          while (didScheduleRenderPhaseUpdate) {
            didScheduleRenderPhaseUpdate = false;
            localIdCounter = 0;
            numberOfReRenders += 1;
            workInProgressHook = null;
            children = Component(props, refOrContext);
          }
          resetHooksState();
          return children;
        }
        function checkDidRenderIdHook() {
          var didRenderIdHook = localIdCounter !== 0;
          return didRenderIdHook;
        }
        function resetHooksState() {
          {
            isInHookUserCodeInDev = false;
          }
          currentlyRenderingComponent = null;
          currentlyRenderingTask = null;
          didScheduleRenderPhaseUpdate = false;
          firstWorkInProgressHook = null;
          numberOfReRenders = 0;
          renderPhaseUpdates = null;
          workInProgressHook = null;
        }
        function readContext$1(context) {
          {
            if (isInHookUserCodeInDev) {
              error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
            }
          }
          return readContext(context);
        }
        function useContext3(context) {
          {
            currentHookNameInDev = "useContext";
          }
          resolveCurrentlyRenderingComponent();
          return readContext(context);
        }
        function basicStateReducer(state, action) {
          return typeof action === "function" ? action(state) : action;
        }
        function useState2(initialState) {
          {
            currentHookNameInDev = "useState";
          }
          return useReducer(
            basicStateReducer,
            initialState
          );
        }
        function useReducer(reducer, initialArg, init) {
          {
            if (reducer !== basicStateReducer) {
              currentHookNameInDev = "useReducer";
            }
          }
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          if (isReRender) {
            var queue = workInProgressHook.queue;
            var dispatch = queue.dispatch;
            if (renderPhaseUpdates !== null) {
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate !== void 0) {
                renderPhaseUpdates.delete(queue);
                var newState = workInProgressHook.memoizedState;
                var update = firstRenderPhaseUpdate;
                do {
                  var action = update.action;
                  {
                    isInHookUserCodeInDev = true;
                  }
                  newState = reducer(newState, action);
                  {
                    isInHookUserCodeInDev = false;
                  }
                  update = update.next;
                } while (update !== null);
                workInProgressHook.memoizedState = newState;
                return [newState, dispatch];
              }
            }
            return [workInProgressHook.memoizedState, dispatch];
          } else {
            {
              isInHookUserCodeInDev = true;
            }
            var initialState;
            if (reducer === basicStateReducer) {
              initialState = typeof initialArg === "function" ? initialArg() : initialArg;
            } else {
              initialState = init !== void 0 ? init(initialArg) : initialArg;
            }
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = initialState;
            var _queue = workInProgressHook.queue = {
              last: null,
              dispatch: null
            };
            var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
            return [workInProgressHook.memoizedState, _dispatch];
          }
        }
        function useMemo2(nextCreate, deps) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var nextDeps = deps === void 0 ? null : deps;
          if (workInProgressHook !== null) {
            var prevState = workInProgressHook.memoizedState;
            if (prevState !== null) {
              if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                  return prevState[0];
                }
              }
            }
          }
          {
            isInHookUserCodeInDev = true;
          }
          var nextValue = nextCreate();
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = [nextValue, nextDeps];
          return nextValue;
        }
        function useRef3(initialValue) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var previousRef = workInProgressHook.memoizedState;
          if (previousRef === null) {
            var ref = {
              current: initialValue
            };
            {
              Object.seal(ref);
            }
            workInProgressHook.memoizedState = ref;
            return ref;
          } else {
            return previousRef;
          }
        }
        function useLayoutEffect2(create, inputs) {
          {
            currentHookNameInDev = "useLayoutEffect";
            error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
          }
        }
        function dispatchAction(componentIdentity, queue, action) {
          if (numberOfReRenders >= RE_RENDER_LIMIT) {
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          }
          if (componentIdentity === currentlyRenderingComponent) {
            didScheduleRenderPhaseUpdate = true;
            var update = {
              action,
              next: null
            };
            if (renderPhaseUpdates === null) {
              renderPhaseUpdates = /* @__PURE__ */ new Map();
            }
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate === void 0) {
              renderPhaseUpdates.set(queue, update);
            } else {
              var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
              while (lastRenderPhaseUpdate.next !== null) {
                lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
              }
              lastRenderPhaseUpdate.next = update;
            }
          }
        }
        function useCallback3(callback, deps) {
          return useMemo2(function() {
            return callback;
          }, deps);
        }
        function useMutableSource(source, getSnapshot, subscribe) {
          resolveCurrentlyRenderingComponent();
          return getSnapshot(source._source);
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          if (getServerSnapshot === void 0) {
            throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
          }
          return getServerSnapshot();
        }
        function useDeferredValue(value) {
          resolveCurrentlyRenderingComponent();
          return value;
        }
        function unsupportedStartTransition() {
          throw new Error("startTransition cannot be called during server rendering.");
        }
        function useTransition2() {
          resolveCurrentlyRenderingComponent();
          return [false, unsupportedStartTransition];
        }
        function useId() {
          var task = currentlyRenderingTask;
          var treeId = getTreeId(task.treeContext);
          var responseState = currentResponseState;
          if (responseState === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
          }
          var localId = localIdCounter++;
          return makeId(responseState, treeId, localId);
        }
        function noop() {
        }
        var Dispatcher = {
          readContext: readContext$1,
          useContext: useContext3,
          useMemo: useMemo2,
          useReducer,
          useRef: useRef3,
          useState: useState2,
          useInsertionEffect: noop,
          useLayoutEffect: useLayoutEffect2,
          useCallback: useCallback3,
          useImperativeHandle: noop,
          useEffect: noop,
          useDebugValue: noop,
          useDeferredValue,
          useTransition: useTransition2,
          useId,
          useMutableSource,
          useSyncExternalStore
        };
        var currentResponseState = null;
        function setCurrentResponseState(responseState) {
          currentResponseState = responseState;
        }
        function getStackByComponentStackNode(componentStack) {
          try {
            var info = "";
            var node = componentStack;
            do {
              switch (node.tag) {
                case 0:
                  info += describeBuiltInComponentFrame(node.type, null, null);
                  break;
                case 1:
                  info += describeFunctionComponentFrame(node.type, null, null);
                  break;
                case 2:
                  info += describeClassComponentFrame(node.type, null, null);
                  break;
              }
              node = node.parent;
            } while (node);
            return info;
          } catch (x) {
            return "\nError generating stack: " + x.message + "\n" + x.stack;
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        var PENDING = 0;
        var COMPLETED = 1;
        var FLUSHED = 2;
        var ABORTED = 3;
        var ERRORED = 4;
        var OPEN = 0;
        var CLOSING = 1;
        var CLOSED = 2;
        var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
        function defaultErrorHandler(error2) {
          console["error"](error2);
          return null;
        }
        function noop$1() {
        }
        function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError) {
          var pingedTasks = [];
          var abortSet = /* @__PURE__ */ new Set();
          var request = {
            destination: null,
            responseState,
            progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
            status: OPEN,
            fatalError: null,
            nextSegmentId: 0,
            allPendingTasks: 0,
            pendingRootTasks: 0,
            completedRootSegment: null,
            abortableTasks: abortSet,
            pingedTasks,
            clientRenderedBoundaries: [],
            completedBoundaries: [],
            partialBoundaries: [],
            onError: onError2 === void 0 ? defaultErrorHandler : onError2,
            onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
            onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
            onShellError: onShellError === void 0 ? noop$1 : onShellError,
            onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
          };
          var rootSegment = createPendingSegment(
            request,
            0,
            null,
            rootFormatContext,
            false,
            false
          );
          rootSegment.parentFlushed = true;
          var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
          pingedTasks.push(rootTask);
          return request;
        }
        function pingTask(request, task) {
          var pingedTasks = request.pingedTasks;
          pingedTasks.push(task);
          if (pingedTasks.length === 1) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
        }
        function createSuspenseBoundary(request, fallbackAbortableTasks) {
          return {
            id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
            rootSegmentID: -1,
            parentFlushed: false,
            pendingTasks: 0,
            forceClientRender: false,
            completedSegments: [],
            byteSize: 0,
            fallbackAbortableTasks,
            errorDigest: null
          };
        }
        function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
          request.allPendingTasks++;
          if (blockedBoundary === null) {
            request.pendingRootTasks++;
          } else {
            blockedBoundary.pendingTasks++;
          }
          var task = {
            node,
            ping: function() {
              return pingTask(request, task);
            },
            blockedBoundary,
            blockedSegment,
            abortSet,
            legacyContext,
            context,
            treeContext
          };
          {
            task.componentStack = null;
          }
          abortSet.add(task);
          return task;
        }
        function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
          return {
            status: PENDING,
            id: -1,
            index,
            parentFlushed: false,
            chunks: [],
            children: [],
            formatContext,
            boundary,
            lastPushedText,
            textEmbedded
          };
        }
        var currentTaskInDEV = null;
        function getCurrentStackInDEV() {
          {
            if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
              return "";
            }
            return getStackByComponentStackNode(currentTaskInDEV.componentStack);
          }
        }
        function pushBuiltInComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 0,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushFunctionComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 1,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushClassComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 2,
              parent: task.componentStack,
              type
            };
          }
        }
        function popComponentStackInDEV(task) {
          {
            if (task.componentStack === null) {
              error("Unexpectedly popped too many stack frames. This is a bug in React.");
            } else {
              task.componentStack = task.componentStack.parent;
            }
          }
        }
        var lastBoundaryErrorComponentStackDev = null;
        function captureBoundaryErrorDetailsDev(boundary, error2) {
          {
            var errorMessage;
            if (typeof error2 === "string") {
              errorMessage = error2;
            } else if (error2 && typeof error2.message === "string") {
              errorMessage = error2.message;
            } else {
              errorMessage = String(error2);
            }
            var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
            lastBoundaryErrorComponentStackDev = null;
            boundary.errorMessage = errorMessage;
            boundary.errorComponentStack = errorComponentStack;
          }
        }
        function logRecoverableError(request, error2) {
          var errorDigest = request.onError(error2);
          if (errorDigest != null && typeof errorDigest !== "string") {
            throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
          }
          return errorDigest;
        }
        function fatalError(request, error2) {
          var onShellError = request.onShellError;
          onShellError(error2);
          var onFatalError = request.onFatalError;
          onFatalError(error2);
          if (request.destination !== null) {
            request.status = CLOSED;
            closeWithError(request.destination, error2);
          } else {
            request.status = CLOSING;
            request.fatalError = error2;
          }
        }
        function renderSuspenseBoundary(request, task, props) {
          pushBuiltInComponentStackInDEV(task, "Suspense");
          var parentBoundary = task.blockedBoundary;
          var parentSegment = task.blockedSegment;
          var fallback = props.fallback;
          var content = props.children;
          var fallbackAbortSet = /* @__PURE__ */ new Set();
          var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
          var insertionIndex = parentSegment.chunks.length;
          var boundarySegment = createPendingSegment(
            request,
            insertionIndex,
            newBoundary,
            parentSegment.formatContext,
            false,
            false
          );
          parentSegment.children.push(boundarySegment);
          parentSegment.lastPushedText = false;
          var contentRootSegment = createPendingSegment(
            request,
            0,
            null,
            parentSegment.formatContext,
            false,
            false
          );
          contentRootSegment.parentFlushed = true;
          task.blockedBoundary = newBoundary;
          task.blockedSegment = contentRootSegment;
          try {
            renderNode(request, task, content);
            pushSegmentFinale$1(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
            contentRootSegment.status = COMPLETED;
            queueCompletedSegment(newBoundary, contentRootSegment);
            if (newBoundary.pendingTasks === 0) {
              popComponentStackInDEV(task);
              return;
            }
          } catch (error2) {
            contentRootSegment.status = ERRORED;
            newBoundary.forceClientRender = true;
            newBoundary.errorDigest = logRecoverableError(request, error2);
            {
              captureBoundaryErrorDetailsDev(newBoundary, error2);
            }
          } finally {
            task.blockedBoundary = parentBoundary;
            task.blockedSegment = parentSegment;
          }
          var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
          {
            suspendedFallbackTask.componentStack = task.componentStack;
          }
          request.pingedTasks.push(suspendedFallbackTask);
          popComponentStackInDEV(task);
        }
        function renderHostElement(request, task, type, props) {
          pushBuiltInComponentStackInDEV(task, type);
          var segment = task.blockedSegment;
          var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
          segment.lastPushedText = false;
          var prevContext = segment.formatContext;
          segment.formatContext = getChildFormatContext(prevContext, type, props);
          renderNode(request, task, children);
          segment.formatContext = prevContext;
          pushEndInstance(segment.chunks, type);
          segment.lastPushedText = false;
          popComponentStackInDEV(task);
        }
        function shouldConstruct$1(Component) {
          return Component.prototype && Component.prototype.isReactComponent;
        }
        function renderWithHooks(request, task, Component, props, secondArg) {
          var componentIdentity = {};
          prepareToUseHooks(task, componentIdentity);
          var result = Component(props, secondArg);
          return finishHooks(Component, props, result, secondArg);
        }
        function finishClassComponent(request, task, instance, Component, props) {
          var nextChildren = instance.render();
          {
            if (instance.props !== props) {
              if (!didWarnAboutReassigningProps) {
                error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
              }
              didWarnAboutReassigningProps = true;
            }
          }
          {
            var childContextTypes = Component.childContextTypes;
            if (childContextTypes !== null && childContextTypes !== void 0) {
              var previousContext = task.legacyContext;
              var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
              task.legacyContext = mergedContext;
              renderNodeDestructive(request, task, nextChildren);
              task.legacyContext = previousContext;
              return;
            }
          }
          renderNodeDestructive(request, task, nextChildren);
        }
        function renderClassComponent(request, task, Component, props) {
          pushClassComponentStackInDEV(task, Component);
          var maskedContext = getMaskedContext(Component, task.legacyContext);
          var instance = constructClassInstance(Component, props, maskedContext);
          mountClassInstance(instance, Component, props, maskedContext);
          finishClassComponent(request, task, instance, Component, props);
          popComponentStackInDEV(task);
        }
        var didWarnAboutBadClass = {};
        var didWarnAboutModulePatternComponent = {};
        var didWarnAboutContextTypeOnFunctionComponent = {};
        var didWarnAboutGetDerivedStateOnFunctionComponent = {};
        var didWarnAboutReassigningProps = false;
        var didWarnAboutGenerators = false;
        var didWarnAboutMaps = false;
        var hasWarnedAboutUsingContextAsConsumer = false;
        function renderIndeterminateComponent(request, task, Component, props) {
          var legacyContext;
          {
            legacyContext = getMaskedContext(Component, task.legacyContext);
          }
          pushFunctionComponentStackInDEV(task, Component);
          {
            if (Component.prototype && typeof Component.prototype.render === "function") {
              var componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutBadClass[componentName]) {
                error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                didWarnAboutBadClass[componentName] = true;
              }
            }
          }
          var value = renderWithHooks(request, task, Component, props, legacyContext);
          var hasId = checkDidRenderIdHook();
          {
            if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
              var _componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                didWarnAboutModulePatternComponent[_componentName] = true;
              }
            }
          }
          if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
            {
              var _componentName2 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName2]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                didWarnAboutModulePatternComponent[_componentName2] = true;
              }
            }
            mountClassInstance(value, Component, props, legacyContext);
            finishClassComponent(request, task, value, Component, props);
          } else {
            {
              validateFunctionComponentInDev(Component);
            }
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, value);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, value);
            }
          }
          popComponentStackInDEV(task);
        }
        function validateFunctionComponentInDev(Component) {
          {
            if (Component) {
              if (Component.childContextTypes) {
                error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
              }
            }
            if (typeof Component.getDerivedStateFromProps === "function") {
              var _componentName3 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
              }
            }
            if (typeof Component.contextType === "object" && Component.contextType !== null) {
              var _componentName4 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                error("%s: Function components do not support contextType.", _componentName4);
                didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
              }
            }
          }
        }
        function resolveDefaultProps(Component, baseProps) {
          if (Component && Component.defaultProps) {
            var props = assign({}, baseProps);
            var defaultProps = Component.defaultProps;
            for (var propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
            return props;
          }
          return baseProps;
        }
        function renderForwardRef(request, task, type, props, ref) {
          pushFunctionComponentStackInDEV(task, type.render);
          var children = renderWithHooks(request, task, type.render, props, ref);
          var hasId = checkDidRenderIdHook();
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, children);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, children);
          }
          popComponentStackInDEV(task);
        }
        function renderMemo(request, task, type, props, ref) {
          var innerType = type.type;
          var resolvedProps = resolveDefaultProps(innerType, props);
          renderElement(request, task, innerType, resolvedProps, ref);
        }
        function renderContextConsumer(request, task, context, props) {
          {
            if (context._context === void 0) {
              if (context !== context.Consumer) {
                if (!hasWarnedAboutUsingContextAsConsumer) {
                  hasWarnedAboutUsingContextAsConsumer = true;
                  error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                }
              }
            } else {
              context = context._context;
            }
          }
          var render = props.children;
          {
            if (typeof render !== "function") {
              error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
            }
          }
          var newValue = readContext(context);
          var newChildren = render(newValue);
          renderNodeDestructive(request, task, newChildren);
        }
        function renderContextProvider(request, task, type, props) {
          var context = type._context;
          var value = props.value;
          var children = props.children;
          var prevSnapshot;
          {
            prevSnapshot = task.context;
          }
          task.context = pushProvider(context, value);
          renderNodeDestructive(request, task, children);
          task.context = popProvider(context);
          {
            if (prevSnapshot !== task.context) {
              error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
            }
          }
        }
        function renderLazyComponent(request, task, lazyComponent, props, ref) {
          pushBuiltInComponentStackInDEV(task, "Lazy");
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;
          var Component = init(payload);
          var resolvedProps = resolveDefaultProps(Component, props);
          renderElement(request, task, Component, resolvedProps, ref);
          popComponentStackInDEV(task);
        }
        function renderElement(request, task, type, props, ref) {
          if (typeof type === "function") {
            if (shouldConstruct$1(type)) {
              renderClassComponent(request, task, type, props);
              return;
            } else {
              renderIndeterminateComponent(request, task, type, props);
              return;
            }
          }
          if (typeof type === "string") {
            renderHostElement(request, task, type, props);
            return;
          }
          switch (type) {
            case REACT_LEGACY_HIDDEN_TYPE:
            case REACT_DEBUG_TRACING_MODE_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_FRAGMENT_TYPE: {
              renderNodeDestructive(request, task, props.children);
              return;
            }
            case REACT_SUSPENSE_LIST_TYPE: {
              pushBuiltInComponentStackInDEV(task, "SuspenseList");
              renderNodeDestructive(request, task, props.children);
              popComponentStackInDEV(task);
              return;
            }
            case REACT_SCOPE_TYPE: {
              throw new Error("ReactDOMServer does not yet support scope components.");
            }
            case REACT_SUSPENSE_TYPE: {
              {
                renderSuspenseBoundary(request, task, props);
              }
              return;
            }
          }
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE: {
                renderForwardRef(request, task, type, props, ref);
                return;
              }
              case REACT_MEMO_TYPE: {
                renderMemo(request, task, type, props, ref);
                return;
              }
              case REACT_PROVIDER_TYPE: {
                renderContextProvider(request, task, type, props);
                return;
              }
              case REACT_CONTEXT_TYPE: {
                renderContextConsumer(request, task, type, props);
                return;
              }
              case REACT_LAZY_TYPE: {
                renderLazyComponent(request, task, type, props);
                return;
              }
            }
          }
          var info = "";
          {
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
          }
          throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
        }
        function validateIterable(iterable, iteratorFn) {
          {
            if (typeof Symbol === "function" && iterable[Symbol.toStringTag] === "Generator") {
              if (!didWarnAboutGenerators) {
                error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
              }
              didWarnAboutGenerators = true;
            }
            if (iterable.entries === iteratorFn) {
              if (!didWarnAboutMaps) {
                error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
              }
              didWarnAboutMaps = true;
            }
          }
        }
        function renderNodeDestructive(request, task, node) {
          {
            try {
              return renderNodeDestructiveImpl(request, task, node);
            } catch (x) {
              if (typeof x === "object" && x !== null && typeof x.then === "function")
                ;
              else {
                lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
              }
              throw x;
            }
          }
        }
        function renderNodeDestructiveImpl(request, task, node) {
          task.node = node;
          if (typeof node === "object" && node !== null) {
            switch (node.$$typeof) {
              case REACT_ELEMENT_TYPE: {
                var element = node;
                var type = element.type;
                var props = element.props;
                var ref = element.ref;
                renderElement(request, task, type, props, ref);
                return;
              }
              case REACT_PORTAL_TYPE:
                throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
              case REACT_LAZY_TYPE: {
                var lazyNode = node;
                var payload = lazyNode._payload;
                var init = lazyNode._init;
                var resolvedNode;
                {
                  try {
                    resolvedNode = init(payload);
                  } catch (x) {
                    if (typeof x === "object" && x !== null && typeof x.then === "function") {
                      pushBuiltInComponentStackInDEV(task, "Lazy");
                    }
                    throw x;
                  }
                }
                renderNodeDestructive(request, task, resolvedNode);
                return;
              }
            }
            if (isArray(node)) {
              renderChildrenArray(request, task, node);
              return;
            }
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
              {
                validateIterable(node, iteratorFn);
              }
              var iterator = iteratorFn.call(node);
              if (iterator) {
                var step = iterator.next();
                if (!step.done) {
                  var children = [];
                  do {
                    children.push(step.value);
                    step = iterator.next();
                  } while (!step.done);
                  renderChildrenArray(request, task, children);
                  return;
                }
                return;
              }
            }
            var childString = Object.prototype.toString.call(node);
            throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
          }
          if (typeof node === "string") {
            var segment = task.blockedSegment;
            segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
            return;
          }
          if (typeof node === "number") {
            var _segment = task.blockedSegment;
            _segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
            return;
          }
          {
            if (typeof node === "function") {
              error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
            }
          }
        }
        function renderChildrenArray(request, task, children) {
          var totalChildren = children.length;
          for (var i = 0; i < totalChildren; i++) {
            var prevTreeContext = task.treeContext;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
            try {
              renderNode(request, task, children[i]);
            } finally {
              task.treeContext = prevTreeContext;
            }
          }
        }
        function spawnNewSuspendedTask(request, task, x) {
          var segment = task.blockedSegment;
          var insertionIndex = segment.chunks.length;
          var newSegment = createPendingSegment(
            request,
            insertionIndex,
            null,
            segment.formatContext,
            segment.lastPushedText,
            true
          );
          segment.children.push(newSegment);
          segment.lastPushedText = false;
          var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
          {
            if (task.componentStack !== null) {
              newTask.componentStack = task.componentStack.parent;
            }
          }
          var ping = newTask.ping;
          x.then(ping, ping);
        }
        function renderNode(request, task, node) {
          var previousFormatContext = task.blockedSegment.formatContext;
          var previousLegacyContext = task.legacyContext;
          var previousContext = task.context;
          var previousComponentStack = null;
          {
            previousComponentStack = task.componentStack;
          }
          try {
            return renderNodeDestructive(request, task, node);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              spawnNewSuspendedTask(request, task, x);
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              return;
            } else {
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              throw x;
            }
          }
        }
        function erroredTask(request, boundary, segment, error2) {
          var errorDigest = logRecoverableError(request, error2);
          if (boundary === null) {
            fatalError(request, error2);
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              boundary.errorDigest = errorDigest;
              {
                captureBoundaryErrorDetailsDev(boundary, error2);
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function abortTaskSoft(task) {
          var request = this;
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          finishedTask(request, boundary, segment);
        }
        function abortTask(task, request, reason) {
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          if (boundary === null) {
            request.allPendingTasks--;
            if (request.status !== CLOSED) {
              request.status = CLOSED;
              if (request.destination !== null) {
                close(request.destination);
              }
            }
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
              boundary.errorDigest = request.onError(_error);
              {
                var errorPrefix = "The server did not finish this Suspense boundary: ";
                if (_error && typeof _error.message === "string") {
                  _error = errorPrefix + _error.message;
                } else {
                  _error = errorPrefix + String(_error);
                }
                var previousTaskInDev = currentTaskInDEV;
                currentTaskInDEV = task;
                try {
                  captureBoundaryErrorDetailsDev(boundary, _error);
                } finally {
                  currentTaskInDEV = previousTaskInDev;
                }
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return abortTask(fallbackTask, request, reason);
            });
            boundary.fallbackAbortableTasks.clear();
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
        }
        function queueCompletedSegment(boundary, segment) {
          if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
            var childSegment = segment.children[0];
            childSegment.id = segment.id;
            childSegment.parentFlushed = true;
            if (childSegment.status === COMPLETED) {
              queueCompletedSegment(boundary, childSegment);
            }
          } else {
            var completedSegments = boundary.completedSegments;
            completedSegments.push(segment);
          }
        }
        function finishedTask(request, boundary, segment) {
          if (boundary === null) {
            if (segment.parentFlushed) {
              if (request.completedRootSegment !== null) {
                throw new Error("There can only be one root segment. This is a bug in React.");
              }
              request.completedRootSegment = segment;
            }
            request.pendingRootTasks--;
            if (request.pendingRootTasks === 0) {
              request.onShellError = noop$1;
              var onShellReady = request.onShellReady;
              onShellReady();
            }
          } else {
            boundary.pendingTasks--;
            if (boundary.forceClientRender)
              ;
            else if (boundary.pendingTasks === 0) {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                }
              }
              if (boundary.parentFlushed) {
                request.completedBoundaries.push(boundary);
              }
              boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
              boundary.fallbackAbortableTasks.clear();
            } else {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                  var completedSegments = boundary.completedSegments;
                  if (completedSegments.length === 1) {
                    if (boundary.parentFlushed) {
                      request.partialBoundaries.push(boundary);
                    }
                  }
                }
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function retryTask(request, task) {
          var segment = task.blockedSegment;
          if (segment.status !== PENDING) {
            return;
          }
          switchContext(task.context);
          var prevTaskInDEV = null;
          {
            prevTaskInDEV = currentTaskInDEV;
            currentTaskInDEV = task;
          }
          try {
            renderNodeDestructive(request, task, task.node);
            pushSegmentFinale$1(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
            task.abortSet.delete(task);
            segment.status = COMPLETED;
            finishedTask(request, task.blockedBoundary, segment);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              var ping = task.ping;
              x.then(ping, ping);
            } else {
              task.abortSet.delete(task);
              segment.status = ERRORED;
              erroredTask(request, task.blockedBoundary, segment, x);
            }
          } finally {
            {
              currentTaskInDEV = prevTaskInDEV;
            }
          }
        }
        function performWork(request) {
          if (request.status === CLOSED) {
            return;
          }
          var prevContext = getActiveContext();
          var prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = Dispatcher;
          var prevGetCurrentStackImpl;
          {
            prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
            ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
          }
          var prevResponseState = currentResponseState;
          setCurrentResponseState(request.responseState);
          try {
            var pingedTasks = request.pingedTasks;
            var i;
            for (i = 0; i < pingedTasks.length; i++) {
              var task = pingedTasks[i];
              retryTask(request, task);
            }
            pingedTasks.splice(0, i);
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          } finally {
            setCurrentResponseState(prevResponseState);
            ReactCurrentDispatcher$1.current = prevDispatcher;
            {
              ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
            }
            if (prevDispatcher === Dispatcher) {
              switchContext(prevContext);
            }
          }
        }
        function flushSubtree(request, destination, segment) {
          segment.parentFlushed = true;
          switch (segment.status) {
            case PENDING: {
              var segmentID = segment.id = request.nextSegmentId++;
              segment.lastPushedText = false;
              segment.textEmbedded = false;
              return writePlaceholder(destination, request.responseState, segmentID);
            }
            case COMPLETED: {
              segment.status = FLUSHED;
              var r = true;
              var chunks = segment.chunks;
              var chunkIdx = 0;
              var children = segment.children;
              for (var childIdx = 0; childIdx < children.length; childIdx++) {
                var nextChild = children[childIdx];
                for (; chunkIdx < nextChild.index; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                r = flushSegment(request, destination, nextChild);
              }
              for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              if (chunkIdx < chunks.length) {
                r = writeChunkAndReturn(destination, chunks[chunkIdx]);
              }
              return r;
            }
            default: {
              throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
            }
          }
        }
        function flushSegment(request, destination, segment) {
          var boundary = segment.boundary;
          if (boundary === null) {
            return flushSubtree(request, destination, segment);
          }
          boundary.parentFlushed = true;
          if (boundary.forceClientRender) {
            writeStartClientRenderedSuspenseBoundary$1(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
            flushSubtree(request, destination, segment);
            return writeEndClientRenderedSuspenseBoundary$1(destination, request.responseState);
          } else if (boundary.pendingTasks > 0) {
            boundary.rootSegmentID = request.nextSegmentId++;
            if (boundary.completedSegments.length > 0) {
              request.partialBoundaries.push(boundary);
            }
            var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
            writeStartPendingSuspenseBoundary(destination, request.responseState, id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else if (boundary.byteSize > request.progressiveChunkSize) {
            boundary.rootSegmentID = request.nextSegmentId++;
            request.completedBoundaries.push(boundary);
            writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else {
            writeStartCompletedSuspenseBoundary$1(destination, request.responseState);
            var completedSegments = boundary.completedSegments;
            if (completedSegments.length !== 1) {
              throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
            }
            var contentSegment = completedSegments[0];
            flushSegment(request, destination, contentSegment);
            return writeEndCompletedSuspenseBoundary$1(destination, request.responseState);
          }
        }
        function flushClientRenderedBoundary(request, destination, boundary) {
          return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
        }
        function flushSegmentContainer(request, destination, segment) {
          writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
          flushSegment(request, destination, segment);
          return writeEndSegment(destination, segment.formatContext);
        }
        function flushCompletedBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            flushPartiallyCompletedSegment(request, destination, boundary, segment);
          }
          completedSegments.length = 0;
          return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
        }
        function flushPartialBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
              i++;
              completedSegments.splice(0, i);
              return false;
            }
          }
          completedSegments.splice(0, i);
          return true;
        }
        function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
          if (segment.status === FLUSHED) {
            return true;
          }
          var segmentID = segment.id;
          if (segmentID === -1) {
            var rootSegmentID = segment.id = boundary.rootSegmentID;
            if (rootSegmentID === -1) {
              throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
            }
            return flushSegmentContainer(request, destination, segment);
          } else {
            flushSegmentContainer(request, destination, segment);
            return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
          }
        }
        function flushCompletedQueues(request, destination) {
          try {
            var completedRootSegment = request.completedRootSegment;
            if (completedRootSegment !== null && request.pendingRootTasks === 0) {
              flushSegment(request, destination, completedRootSegment);
              request.completedRootSegment = null;
              writeCompletedRoot(destination, request.responseState);
            }
            var clientRenderedBoundaries = request.clientRenderedBoundaries;
            var i;
            for (i = 0; i < clientRenderedBoundaries.length; i++) {
              var boundary = clientRenderedBoundaries[i];
              if (!flushClientRenderedBoundary(request, destination, boundary)) {
                request.destination = null;
                i++;
                clientRenderedBoundaries.splice(0, i);
                return;
              }
            }
            clientRenderedBoundaries.splice(0, i);
            var completedBoundaries = request.completedBoundaries;
            for (i = 0; i < completedBoundaries.length; i++) {
              var _boundary = completedBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary)) {
                request.destination = null;
                i++;
                completedBoundaries.splice(0, i);
                return;
              }
            }
            completedBoundaries.splice(0, i);
            completeWriting(destination);
            beginWriting(destination);
            var partialBoundaries = request.partialBoundaries;
            for (i = 0; i < partialBoundaries.length; i++) {
              var _boundary2 = partialBoundaries[i];
              if (!flushPartialBoundary(request, destination, _boundary2)) {
                request.destination = null;
                i++;
                partialBoundaries.splice(0, i);
                return;
              }
            }
            partialBoundaries.splice(0, i);
            var largeBoundaries = request.completedBoundaries;
            for (i = 0; i < largeBoundaries.length; i++) {
              var _boundary3 = largeBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary3)) {
                request.destination = null;
                i++;
                largeBoundaries.splice(0, i);
                return;
              }
            }
            largeBoundaries.splice(0, i);
          } finally {
            if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
              {
                if (request.abortableTasks.size !== 0) {
                  error("There was still abortable task at the root when we closed. This is a bug in React.");
                }
              }
              close(destination);
            }
          }
        }
        function startWork(request) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
        function startFlowing(request, destination) {
          if (request.status === CLOSING) {
            request.status = CLOSED;
            closeWithError(destination, request.fatalError);
            return;
          }
          if (request.status === CLOSED) {
            return;
          }
          if (request.destination !== null) {
            return;
          }
          request.destination = destination;
          try {
            flushCompletedQueues(request, destination);
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function abort(request, reason) {
          try {
            var abortableTasks = request.abortableTasks;
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, reason);
            });
            abortableTasks.clear();
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function onError() {
        }
        function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
          var didFatal = false;
          var fatalError2 = null;
          var result = "";
          var destination = {
            push: function(chunk) {
              if (chunk !== null) {
                result += chunk;
              }
              return true;
            },
            destroy: function(error2) {
              didFatal = true;
              fatalError2 = error2;
            }
          };
          var readyToStream = false;
          function onShellReady() {
            readyToStream = true;
          }
          var request = createRequest(children, createResponseState$1(generateStaticMarkup, options ? options.identifierPrefix : void 0), createRootFormatContext(), Infinity, onError, void 0, onShellReady, void 0, void 0);
          startWork(request);
          abort(request, abortReason);
          startFlowing(request, destination);
          if (didFatal) {
            throw fatalError2;
          }
          if (!readyToStream) {
            throw new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          }
          return result;
        }
        function renderToString(children, options) {
          return renderToStringImpl(children, options, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
        }
        function renderToStaticMarkup(children, options) {
          return renderToStringImpl(children, options, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
        }
        function renderToNodeStream() {
          throw new Error("ReactDOMServer.renderToNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToString() instead.");
        }
        function renderToStaticNodeStream() {
          throw new Error("ReactDOMServer.renderToStaticNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToStaticMarkup() instead.");
        }
        exports.renderToNodeStream = renderToNodeStream;
        exports.renderToStaticMarkup = renderToStaticMarkup;
        exports.renderToStaticNodeStream = renderToStaticNodeStream;
        exports.renderToString = renderToString;
        exports.version = ReactVersion;
      })();
    }
  }
});

// node_modules/react-dom/cjs/react-dom-server.browser.development.js
var require_react_dom_server_browser_development = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server.browser.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React5 = require_react();
        var ReactVersion = "18.2.0";
        var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function scheduleWork(callback) {
          callback();
        }
        var VIEW_SIZE = 512;
        var currentView = null;
        var writtenBytes = 0;
        function beginWriting(destination) {
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = 0;
        }
        function writeChunk(destination, chunk) {
          if (chunk.length === 0) {
            return;
          }
          if (chunk.length > VIEW_SIZE) {
            if (writtenBytes > 0) {
              destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
              currentView = new Uint8Array(VIEW_SIZE);
              writtenBytes = 0;
            }
            destination.enqueue(chunk);
            return;
          }
          var bytesToWrite = chunk;
          var allowableBytes = currentView.length - writtenBytes;
          if (allowableBytes < bytesToWrite.length) {
            if (allowableBytes === 0) {
              destination.enqueue(currentView);
            } else {
              currentView.set(bytesToWrite.subarray(0, allowableBytes), writtenBytes);
              destination.enqueue(currentView);
              bytesToWrite = bytesToWrite.subarray(allowableBytes);
            }
            currentView = new Uint8Array(VIEW_SIZE);
            writtenBytes = 0;
          }
          currentView.set(bytesToWrite, writtenBytes);
          writtenBytes += bytesToWrite.length;
        }
        function writeChunkAndReturn(destination, chunk) {
          writeChunk(destination, chunk);
          return true;
        }
        function completeWriting(destination) {
          if (currentView && writtenBytes > 0) {
            destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
            currentView = null;
            writtenBytes = 0;
          }
        }
        function close(destination) {
          destination.close();
        }
        var textEncoder = new TextEncoder();
        function stringToChunk(content) {
          return textEncoder.encode(content);
        }
        function stringToPrecomputedChunk(content) {
          return textEncoder.encode(content);
        }
        function closeWithError(destination, error2) {
          if (typeof destination.error === "function") {
            destination.error(error2);
          } else {
            destination.close();
          }
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkAttributeStringCoercion(value, attributeName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkCSSPropertyStringCoercion(value, propName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkHtmlStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED = 0;
        var STRING = 1;
        var BOOLEANISH_STRING = 2;
        var BOOLEAN = 3;
        var OVERLOADED_BOOLEAN = 4;
        var NUMERIC = 5;
        var POSITIVE_NUMERIC = 6;
        var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
        var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
        var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
        var illegalAttributeNameCache = {};
        var validatedAttributeNameCache = {};
        function isAttributeNameSafe(attributeName) {
          if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
            return true;
          }
          if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
            return false;
          }
          if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
            validatedAttributeNameCache[attributeName] = true;
            return true;
          }
          illegalAttributeNameCache[attributeName] = true;
          {
            error("Invalid attribute name: `%s`", attributeName);
          }
          return false;
        }
        function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
          if (propertyInfo !== null && propertyInfo.type === RESERVED) {
            return false;
          }
          switch (typeof value) {
            case "function":
            case "symbol":
              return true;
            case "boolean": {
              if (isCustomComponentTag) {
                return false;
              }
              if (propertyInfo !== null) {
                return !propertyInfo.acceptsBooleans;
              } else {
                var prefix2 = name.toLowerCase().slice(0, 5);
                return prefix2 !== "data-" && prefix2 !== "aria-";
              }
            }
            default:
              return false;
          }
        }
        function getPropertyInfo(name) {
          return properties.hasOwnProperty(name) ? properties[name] : null;
        }
        function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
          this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
          this.attributeName = attributeName;
          this.attributeNamespace = attributeNamespace;
          this.mustUseProperty = mustUseProperty;
          this.propertyName = name;
          this.type = type;
          this.sanitizeURL = sanitizeURL2;
          this.removeEmptyString = removeEmptyString;
        }
        var properties = {};
        var reservedProps = [
          "children",
          "dangerouslySetInnerHTML",
          "defaultValue",
          "defaultChecked",
          "innerHTML",
          "suppressContentEditableWarning",
          "suppressHydrationWarning",
          "style"
        ];
        reservedProps.forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            RESERVED,
            false,
            name,
            null,
            false,
            false
          );
        });
        [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
          var name = _ref[0], attributeName = _ref[1];
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            null,
            false,
            false
          );
        });
        ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            name,
            null,
            false,
            false
          );
        });
        [
          "allowFullScreen",
          "async",
          "autoFocus",
          "autoPlay",
          "controls",
          "default",
          "defer",
          "disabled",
          "disablePictureInPicture",
          "disableRemotePlayback",
          "formNoValidate",
          "hidden",
          "loop",
          "noModule",
          "noValidate",
          "open",
          "playsInline",
          "readOnly",
          "required",
          "reversed",
          "scoped",
          "seamless",
          "itemScope"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        [
          "checked",
          "multiple",
          "muted",
          "selected"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            true,
            name,
            null,
            false,
            false
          );
        });
        [
          "capture",
          "download"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            OVERLOADED_BOOLEAN,
            false,
            name,
            null,
            false,
            false
          );
        });
        [
          "cols",
          "rows",
          "size",
          "span"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            POSITIVE_NUMERIC,
            false,
            name,
            null,
            false,
            false
          );
        });
        ["rowSpan", "start"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            NUMERIC,
            false,
            name.toLowerCase(),
            null,
            false,
            false
          );
        });
        var CAMELIZE = /[\-\:]([a-z])/g;
        var capitalize = function(token) {
          return token[1].toUpperCase();
        };
        [
          "accent-height",
          "alignment-baseline",
          "arabic-form",
          "baseline-shift",
          "cap-height",
          "clip-path",
          "clip-rule",
          "color-interpolation",
          "color-interpolation-filters",
          "color-profile",
          "color-rendering",
          "dominant-baseline",
          "enable-background",
          "fill-opacity",
          "fill-rule",
          "flood-color",
          "flood-opacity",
          "font-family",
          "font-size",
          "font-size-adjust",
          "font-stretch",
          "font-style",
          "font-variant",
          "font-weight",
          "glyph-name",
          "glyph-orientation-horizontal",
          "glyph-orientation-vertical",
          "horiz-adv-x",
          "horiz-origin-x",
          "image-rendering",
          "letter-spacing",
          "lighting-color",
          "marker-end",
          "marker-mid",
          "marker-start",
          "overline-position",
          "overline-thickness",
          "paint-order",
          "panose-1",
          "pointer-events",
          "rendering-intent",
          "shape-rendering",
          "stop-color",
          "stop-opacity",
          "strikethrough-position",
          "strikethrough-thickness",
          "stroke-dasharray",
          "stroke-dashoffset",
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-miterlimit",
          "stroke-opacity",
          "stroke-width",
          "text-anchor",
          "text-decoration",
          "text-rendering",
          "underline-position",
          "underline-thickness",
          "unicode-bidi",
          "unicode-range",
          "units-per-em",
          "v-alphabetic",
          "v-hanging",
          "v-ideographic",
          "v-mathematical",
          "vector-effect",
          "vert-adv-y",
          "vert-origin-x",
          "vert-origin-y",
          "word-spacing",
          "writing-mode",
          "xmlns:xlink",
          "x-height"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            null,
            false,
            false
          );
        });
        [
          "xlink:actuate",
          "xlink:arcrole",
          "xlink:role",
          "xlink:show",
          "xlink:title",
          "xlink:type"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            "http://www.w3.org/1999/xlink",
            false,
            false
          );
        });
        [
          "xml:base",
          "xml:lang",
          "xml:space"
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            attributeName,
            "http://www.w3.org/XML/1998/namespace",
            false,
            false
          );
        });
        ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            attributeName.toLowerCase(),
            null,
            false,
            false
          );
        });
        var xlinkHref = "xlinkHref";
        properties[xlinkHref] = new PropertyInfoRecord(
          "xlinkHref",
          STRING,
          false,
          "xlink:href",
          "http://www.w3.org/1999/xlink",
          true,
          false
        );
        ["src", "href", "action", "formAction"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            attributeName.toLowerCase(),
            null,
            true,
            true
          );
        });
        var isUnitlessNumber = {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageOutset: true,
          borderImageSlice: true,
          borderImageWidth: true,
          boxFlex: true,
          boxFlexGroup: true,
          boxOrdinalGroup: true,
          columnCount: true,
          columns: true,
          flex: true,
          flexGrow: true,
          flexPositive: true,
          flexShrink: true,
          flexNegative: true,
          flexOrder: true,
          gridArea: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowSpan: true,
          gridRowStart: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnSpan: true,
          gridColumnStart: true,
          fontWeight: true,
          lineClamp: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          tabSize: true,
          widows: true,
          zIndex: true,
          zoom: true,
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeDasharray: true,
          strokeDashoffset: true,
          strokeMiterlimit: true,
          strokeOpacity: true,
          strokeWidth: true
        };
        function prefixKey(prefix2, key) {
          return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
        }
        var prefixes = ["Webkit", "ms", "Moz", "O"];
        Object.keys(isUnitlessNumber).forEach(function(prop) {
          prefixes.forEach(function(prefix2) {
            isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
          });
        });
        var hasReadOnlyValue = {
          button: true,
          checkbox: true,
          image: true,
          hidden: true,
          radio: true,
          reset: true,
          submit: true
        };
        function checkControlledValueProps(tagName, props) {
          {
            if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
              error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
            }
            if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
              error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
            }
          }
        }
        function isCustomComponent(tagName, props) {
          if (tagName.indexOf("-") === -1) {
            return typeof props.is === "string";
          }
          switch (tagName) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
              return false;
            default:
              return true;
          }
        }
        var ariaProperties = {
          "aria-current": 0,
          "aria-description": 0,
          "aria-details": 0,
          "aria-disabled": 0,
          "aria-hidden": 0,
          "aria-invalid": 0,
          "aria-keyshortcuts": 0,
          "aria-label": 0,
          "aria-roledescription": 0,
          "aria-autocomplete": 0,
          "aria-checked": 0,
          "aria-expanded": 0,
          "aria-haspopup": 0,
          "aria-level": 0,
          "aria-modal": 0,
          "aria-multiline": 0,
          "aria-multiselectable": 0,
          "aria-orientation": 0,
          "aria-placeholder": 0,
          "aria-pressed": 0,
          "aria-readonly": 0,
          "aria-required": 0,
          "aria-selected": 0,
          "aria-sort": 0,
          "aria-valuemax": 0,
          "aria-valuemin": 0,
          "aria-valuenow": 0,
          "aria-valuetext": 0,
          "aria-atomic": 0,
          "aria-busy": 0,
          "aria-live": 0,
          "aria-relevant": 0,
          "aria-dropeffect": 0,
          "aria-grabbed": 0,
          "aria-activedescendant": 0,
          "aria-colcount": 0,
          "aria-colindex": 0,
          "aria-colspan": 0,
          "aria-controls": 0,
          "aria-describedby": 0,
          "aria-errormessage": 0,
          "aria-flowto": 0,
          "aria-labelledby": 0,
          "aria-owns": 0,
          "aria-posinset": 0,
          "aria-rowcount": 0,
          "aria-rowindex": 0,
          "aria-rowspan": 0,
          "aria-setsize": 0
        };
        var warnedProperties = {};
        var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        function validateProperty(tagName, name) {
          {
            if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
              return true;
            }
            if (rARIACamel.test(name)) {
              var ariaName = "aria-" + name.slice(4).toLowerCase();
              var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
              if (correctName == null) {
                error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                warnedProperties[name] = true;
                return true;
              }
              if (name !== correctName) {
                error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                warnedProperties[name] = true;
                return true;
              }
            }
            if (rARIA.test(name)) {
              var lowerCasedName = name.toLowerCase();
              var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
              if (standardName == null) {
                warnedProperties[name] = true;
                return false;
              }
              if (name !== standardName) {
                error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties[name] = true;
                return true;
              }
            }
          }
          return true;
        }
        function warnInvalidARIAProps(type, props) {
          {
            var invalidProps = [];
            for (var key in props) {
              var isValid = validateProperty(type, key);
              if (!isValid) {
                invalidProps.push(key);
              }
            }
            var unknownPropString = invalidProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (invalidProps.length === 1) {
              error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            } else if (invalidProps.length > 1) {
              error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            }
          }
        }
        function validateProperties(type, props) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnInvalidARIAProps(type, props);
        }
        var didWarnValueNull = false;
        function validateProperties$1(type, props) {
          {
            if (type !== "input" && type !== "textarea" && type !== "select") {
              return;
            }
            if (props != null && props.value === null && !didWarnValueNull) {
              didWarnValueNull = true;
              if (type === "select" && props.multiple) {
                error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
              } else {
                error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
              }
            }
          }
        }
        var possibleStandardNames = {
          accept: "accept",
          acceptcharset: "acceptCharset",
          "accept-charset": "acceptCharset",
          accesskey: "accessKey",
          action: "action",
          allowfullscreen: "allowFullScreen",
          alt: "alt",
          as: "as",
          async: "async",
          autocapitalize: "autoCapitalize",
          autocomplete: "autoComplete",
          autocorrect: "autoCorrect",
          autofocus: "autoFocus",
          autoplay: "autoPlay",
          autosave: "autoSave",
          capture: "capture",
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          challenge: "challenge",
          charset: "charSet",
          checked: "checked",
          children: "children",
          cite: "cite",
          class: "className",
          classid: "classID",
          classname: "className",
          cols: "cols",
          colspan: "colSpan",
          content: "content",
          contenteditable: "contentEditable",
          contextmenu: "contextMenu",
          controls: "controls",
          controlslist: "controlsList",
          coords: "coords",
          crossorigin: "crossOrigin",
          dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
          data: "data",
          datetime: "dateTime",
          default: "default",
          defaultchecked: "defaultChecked",
          defaultvalue: "defaultValue",
          defer: "defer",
          dir: "dir",
          disabled: "disabled",
          disablepictureinpicture: "disablePictureInPicture",
          disableremoteplayback: "disableRemotePlayback",
          download: "download",
          draggable: "draggable",
          enctype: "encType",
          enterkeyhint: "enterKeyHint",
          for: "htmlFor",
          form: "form",
          formmethod: "formMethod",
          formaction: "formAction",
          formenctype: "formEncType",
          formnovalidate: "formNoValidate",
          formtarget: "formTarget",
          frameborder: "frameBorder",
          headers: "headers",
          height: "height",
          hidden: "hidden",
          high: "high",
          href: "href",
          hreflang: "hrefLang",
          htmlfor: "htmlFor",
          httpequiv: "httpEquiv",
          "http-equiv": "httpEquiv",
          icon: "icon",
          id: "id",
          imagesizes: "imageSizes",
          imagesrcset: "imageSrcSet",
          innerhtml: "innerHTML",
          inputmode: "inputMode",
          integrity: "integrity",
          is: "is",
          itemid: "itemID",
          itemprop: "itemProp",
          itemref: "itemRef",
          itemscope: "itemScope",
          itemtype: "itemType",
          keyparams: "keyParams",
          keytype: "keyType",
          kind: "kind",
          label: "label",
          lang: "lang",
          list: "list",
          loop: "loop",
          low: "low",
          manifest: "manifest",
          marginwidth: "marginWidth",
          marginheight: "marginHeight",
          max: "max",
          maxlength: "maxLength",
          media: "media",
          mediagroup: "mediaGroup",
          method: "method",
          min: "min",
          minlength: "minLength",
          multiple: "multiple",
          muted: "muted",
          name: "name",
          nomodule: "noModule",
          nonce: "nonce",
          novalidate: "noValidate",
          open: "open",
          optimum: "optimum",
          pattern: "pattern",
          placeholder: "placeholder",
          playsinline: "playsInline",
          poster: "poster",
          preload: "preload",
          profile: "profile",
          radiogroup: "radioGroup",
          readonly: "readOnly",
          referrerpolicy: "referrerPolicy",
          rel: "rel",
          required: "required",
          reversed: "reversed",
          role: "role",
          rows: "rows",
          rowspan: "rowSpan",
          sandbox: "sandbox",
          scope: "scope",
          scoped: "scoped",
          scrolling: "scrolling",
          seamless: "seamless",
          selected: "selected",
          shape: "shape",
          size: "size",
          sizes: "sizes",
          span: "span",
          spellcheck: "spellCheck",
          src: "src",
          srcdoc: "srcDoc",
          srclang: "srcLang",
          srcset: "srcSet",
          start: "start",
          step: "step",
          style: "style",
          summary: "summary",
          tabindex: "tabIndex",
          target: "target",
          title: "title",
          type: "type",
          usemap: "useMap",
          value: "value",
          width: "width",
          wmode: "wmode",
          wrap: "wrap",
          about: "about",
          accentheight: "accentHeight",
          "accent-height": "accentHeight",
          accumulate: "accumulate",
          additive: "additive",
          alignmentbaseline: "alignmentBaseline",
          "alignment-baseline": "alignmentBaseline",
          allowreorder: "allowReorder",
          alphabetic: "alphabetic",
          amplitude: "amplitude",
          arabicform: "arabicForm",
          "arabic-form": "arabicForm",
          ascent: "ascent",
          attributename: "attributeName",
          attributetype: "attributeType",
          autoreverse: "autoReverse",
          azimuth: "azimuth",
          basefrequency: "baseFrequency",
          baselineshift: "baselineShift",
          "baseline-shift": "baselineShift",
          baseprofile: "baseProfile",
          bbox: "bbox",
          begin: "begin",
          bias: "bias",
          by: "by",
          calcmode: "calcMode",
          capheight: "capHeight",
          "cap-height": "capHeight",
          clip: "clip",
          clippath: "clipPath",
          "clip-path": "clipPath",
          clippathunits: "clipPathUnits",
          cliprule: "clipRule",
          "clip-rule": "clipRule",
          color: "color",
          colorinterpolation: "colorInterpolation",
          "color-interpolation": "colorInterpolation",
          colorinterpolationfilters: "colorInterpolationFilters",
          "color-interpolation-filters": "colorInterpolationFilters",
          colorprofile: "colorProfile",
          "color-profile": "colorProfile",
          colorrendering: "colorRendering",
          "color-rendering": "colorRendering",
          contentscripttype: "contentScriptType",
          contentstyletype: "contentStyleType",
          cursor: "cursor",
          cx: "cx",
          cy: "cy",
          d: "d",
          datatype: "datatype",
          decelerate: "decelerate",
          descent: "descent",
          diffuseconstant: "diffuseConstant",
          direction: "direction",
          display: "display",
          divisor: "divisor",
          dominantbaseline: "dominantBaseline",
          "dominant-baseline": "dominantBaseline",
          dur: "dur",
          dx: "dx",
          dy: "dy",
          edgemode: "edgeMode",
          elevation: "elevation",
          enablebackground: "enableBackground",
          "enable-background": "enableBackground",
          end: "end",
          exponent: "exponent",
          externalresourcesrequired: "externalResourcesRequired",
          fill: "fill",
          fillopacity: "fillOpacity",
          "fill-opacity": "fillOpacity",
          fillrule: "fillRule",
          "fill-rule": "fillRule",
          filter: "filter",
          filterres: "filterRes",
          filterunits: "filterUnits",
          floodopacity: "floodOpacity",
          "flood-opacity": "floodOpacity",
          floodcolor: "floodColor",
          "flood-color": "floodColor",
          focusable: "focusable",
          fontfamily: "fontFamily",
          "font-family": "fontFamily",
          fontsize: "fontSize",
          "font-size": "fontSize",
          fontsizeadjust: "fontSizeAdjust",
          "font-size-adjust": "fontSizeAdjust",
          fontstretch: "fontStretch",
          "font-stretch": "fontStretch",
          fontstyle: "fontStyle",
          "font-style": "fontStyle",
          fontvariant: "fontVariant",
          "font-variant": "fontVariant",
          fontweight: "fontWeight",
          "font-weight": "fontWeight",
          format: "format",
          from: "from",
          fx: "fx",
          fy: "fy",
          g1: "g1",
          g2: "g2",
          glyphname: "glyphName",
          "glyph-name": "glyphName",
          glyphorientationhorizontal: "glyphOrientationHorizontal",
          "glyph-orientation-horizontal": "glyphOrientationHorizontal",
          glyphorientationvertical: "glyphOrientationVertical",
          "glyph-orientation-vertical": "glyphOrientationVertical",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          hanging: "hanging",
          horizadvx: "horizAdvX",
          "horiz-adv-x": "horizAdvX",
          horizoriginx: "horizOriginX",
          "horiz-origin-x": "horizOriginX",
          ideographic: "ideographic",
          imagerendering: "imageRendering",
          "image-rendering": "imageRendering",
          in2: "in2",
          in: "in",
          inlist: "inlist",
          intercept: "intercept",
          k1: "k1",
          k2: "k2",
          k3: "k3",
          k4: "k4",
          k: "k",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          kerning: "kerning",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          letterspacing: "letterSpacing",
          "letter-spacing": "letterSpacing",
          lightingcolor: "lightingColor",
          "lighting-color": "lightingColor",
          limitingconeangle: "limitingConeAngle",
          local: "local",
          markerend: "markerEnd",
          "marker-end": "markerEnd",
          markerheight: "markerHeight",
          markermid: "markerMid",
          "marker-mid": "markerMid",
          markerstart: "markerStart",
          "marker-start": "markerStart",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          mask: "mask",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          mathematical: "mathematical",
          mode: "mode",
          numoctaves: "numOctaves",
          offset: "offset",
          opacity: "opacity",
          operator: "operator",
          order: "order",
          orient: "orient",
          orientation: "orientation",
          origin: "origin",
          overflow: "overflow",
          overlineposition: "overlinePosition",
          "overline-position": "overlinePosition",
          overlinethickness: "overlineThickness",
          "overline-thickness": "overlineThickness",
          paintorder: "paintOrder",
          "paint-order": "paintOrder",
          panose1: "panose1",
          "panose-1": "panose1",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointerevents: "pointerEvents",
          "pointer-events": "pointerEvents",
          points: "points",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          prefix: "prefix",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          property: "property",
          r: "r",
          radius: "radius",
          refx: "refX",
          refy: "refY",
          renderingintent: "renderingIntent",
          "rendering-intent": "renderingIntent",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          resource: "resource",
          restart: "restart",
          result: "result",
          results: "results",
          rotate: "rotate",
          rx: "rx",
          ry: "ry",
          scale: "scale",
          security: "security",
          seed: "seed",
          shaperendering: "shapeRendering",
          "shape-rendering": "shapeRendering",
          slope: "slope",
          spacing: "spacing",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          speed: "speed",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stemh: "stemh",
          stemv: "stemv",
          stitchtiles: "stitchTiles",
          stopcolor: "stopColor",
          "stop-color": "stopColor",
          stopopacity: "stopOpacity",
          "stop-opacity": "stopOpacity",
          strikethroughposition: "strikethroughPosition",
          "strikethrough-position": "strikethroughPosition",
          strikethroughthickness: "strikethroughThickness",
          "strikethrough-thickness": "strikethroughThickness",
          string: "string",
          stroke: "stroke",
          strokedasharray: "strokeDasharray",
          "stroke-dasharray": "strokeDasharray",
          strokedashoffset: "strokeDashoffset",
          "stroke-dashoffset": "strokeDashoffset",
          strokelinecap: "strokeLinecap",
          "stroke-linecap": "strokeLinecap",
          strokelinejoin: "strokeLinejoin",
          "stroke-linejoin": "strokeLinejoin",
          strokemiterlimit: "strokeMiterlimit",
          "stroke-miterlimit": "strokeMiterlimit",
          strokewidth: "strokeWidth",
          "stroke-width": "strokeWidth",
          strokeopacity: "strokeOpacity",
          "stroke-opacity": "strokeOpacity",
          suppresscontenteditablewarning: "suppressContentEditableWarning",
          suppresshydrationwarning: "suppressHydrationWarning",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textanchor: "textAnchor",
          "text-anchor": "textAnchor",
          textdecoration: "textDecoration",
          "text-decoration": "textDecoration",
          textlength: "textLength",
          textrendering: "textRendering",
          "text-rendering": "textRendering",
          to: "to",
          transform: "transform",
          typeof: "typeof",
          u1: "u1",
          u2: "u2",
          underlineposition: "underlinePosition",
          "underline-position": "underlinePosition",
          underlinethickness: "underlineThickness",
          "underline-thickness": "underlineThickness",
          unicode: "unicode",
          unicodebidi: "unicodeBidi",
          "unicode-bidi": "unicodeBidi",
          unicoderange: "unicodeRange",
          "unicode-range": "unicodeRange",
          unitsperem: "unitsPerEm",
          "units-per-em": "unitsPerEm",
          unselectable: "unselectable",
          valphabetic: "vAlphabetic",
          "v-alphabetic": "vAlphabetic",
          values: "values",
          vectoreffect: "vectorEffect",
          "vector-effect": "vectorEffect",
          version: "version",
          vertadvy: "vertAdvY",
          "vert-adv-y": "vertAdvY",
          vertoriginx: "vertOriginX",
          "vert-origin-x": "vertOriginX",
          vertoriginy: "vertOriginY",
          "vert-origin-y": "vertOriginY",
          vhanging: "vHanging",
          "v-hanging": "vHanging",
          videographic: "vIdeographic",
          "v-ideographic": "vIdeographic",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          visibility: "visibility",
          vmathematical: "vMathematical",
          "v-mathematical": "vMathematical",
          vocab: "vocab",
          widths: "widths",
          wordspacing: "wordSpacing",
          "word-spacing": "wordSpacing",
          writingmode: "writingMode",
          "writing-mode": "writingMode",
          x1: "x1",
          x2: "x2",
          x: "x",
          xchannelselector: "xChannelSelector",
          xheight: "xHeight",
          "x-height": "xHeight",
          xlinkactuate: "xlinkActuate",
          "xlink:actuate": "xlinkActuate",
          xlinkarcrole: "xlinkArcrole",
          "xlink:arcrole": "xlinkArcrole",
          xlinkhref: "xlinkHref",
          "xlink:href": "xlinkHref",
          xlinkrole: "xlinkRole",
          "xlink:role": "xlinkRole",
          xlinkshow: "xlinkShow",
          "xlink:show": "xlinkShow",
          xlinktitle: "xlinkTitle",
          "xlink:title": "xlinkTitle",
          xlinktype: "xlinkType",
          "xlink:type": "xlinkType",
          xmlbase: "xmlBase",
          "xml:base": "xmlBase",
          xmllang: "xmlLang",
          "xml:lang": "xmlLang",
          xmlns: "xmlns",
          "xml:space": "xmlSpace",
          xmlnsxlink: "xmlnsXlink",
          "xmlns:xlink": "xmlnsXlink",
          xmlspace: "xmlSpace",
          y1: "y1",
          y2: "y2",
          y: "y",
          ychannelselector: "yChannelSelector",
          z: "z",
          zoomandpan: "zoomAndPan"
        };
        var validateProperty$1 = function() {
        };
        {
          var warnedProperties$1 = {};
          var EVENT_NAME_REGEX = /^on./;
          var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
          var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          validateProperty$1 = function(tagName, name, value, eventRegistry) {
            if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
              return true;
            }
            var lowerCasedName = name.toLowerCase();
            if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
              error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (eventRegistry != null) {
              var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
              if (registrationNameDependencies.hasOwnProperty(name)) {
                return true;
              }
              var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
              if (registrationName != null) {
                error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (EVENT_NAME_REGEX.test(name)) {
                error("Unknown event handler property `%s`. It will be ignored.", name);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (EVENT_NAME_REGEX.test(name)) {
              if (INVALID_EVENT_NAME_REGEX.test(name)) {
                error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
              return true;
            }
            if (lowerCasedName === "innerhtml") {
              error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "aria") {
              error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
              error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "number" && isNaN(value)) {
              error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
              warnedProperties$1[name] = true;
              return true;
            }
            var propertyInfo = getPropertyInfo(name);
            var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
            if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
              var standardName = possibleStandardNames[lowerCasedName];
              if (standardName !== name) {
                error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (!isReserved && name !== lowerCasedName) {
              error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              if (value) {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
              } else {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (isReserved) {
              return true;
            }
            if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              warnedProperties$1[name] = true;
              return false;
            }
            if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
              error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
              warnedProperties$1[name] = true;
              return true;
            }
            return true;
          };
        }
        var warnUnknownProperties = function(type, props, eventRegistry) {
          {
            var unknownProps = [];
            for (var key in props) {
              var isValid = validateProperty$1(type, key, props[key], eventRegistry);
              if (!isValid) {
                unknownProps.push(key);
              }
            }
            var unknownPropString = unknownProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (unknownProps.length === 1) {
              error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            } else if (unknownProps.length > 1) {
              error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            }
          }
        };
        function validateProperties$2(type, props, eventRegistry) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnUnknownProperties(type, props, eventRegistry);
        }
        var warnValidStyle = function() {
        };
        {
          var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
          var msPattern = /^-ms-/;
          var hyphenPattern = /-(.)/g;
          var badStyleValueWithSemicolonPattern = /;\s*$/;
          var warnedStyleNames = {};
          var warnedStyleValues = {};
          var warnedForNaNValue = false;
          var warnedForInfinityValue = false;
          var camelize = function(string) {
            return string.replace(hyphenPattern, function(_, character) {
              return character.toUpperCase();
            });
          };
          var warnHyphenatedStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error(
              "Unsupported style property %s. Did you mean %s?",
              name,
              camelize(name.replace(msPattern, "ms-"))
            );
          };
          var warnBadVendoredStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
          };
          var warnStyleValueWithSemicolon = function(name, value) {
            if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
              return;
            }
            warnedStyleValues[value] = true;
            error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
          };
          var warnStyleValueIsNaN = function(name, value) {
            if (warnedForNaNValue) {
              return;
            }
            warnedForNaNValue = true;
            error("`NaN` is an invalid value for the `%s` css style property.", name);
          };
          var warnStyleValueIsInfinity = function(name, value) {
            if (warnedForInfinityValue) {
              return;
            }
            warnedForInfinityValue = true;
            error("`Infinity` is an invalid value for the `%s` css style property.", name);
          };
          warnValidStyle = function(name, value) {
            if (name.indexOf("-") > -1) {
              warnHyphenatedStyleName(name);
            } else if (badVendoredStyleNamePattern.test(name)) {
              warnBadVendoredStyleName(name);
            } else if (badStyleValueWithSemicolonPattern.test(value)) {
              warnStyleValueWithSemicolon(name, value);
            }
            if (typeof value === "number") {
              if (isNaN(value)) {
                warnStyleValueIsNaN(name, value);
              } else if (!isFinite(value)) {
                warnStyleValueIsInfinity(name, value);
              }
            }
          };
        }
        var warnValidStyle$1 = warnValidStyle;
        var matchHtmlRegExp = /["'&<>]/;
        function escapeHtml(string) {
          {
            checkHtmlStringCoercion(string);
          }
          var str = "" + string;
          var match = matchHtmlRegExp.exec(str);
          if (!match) {
            return str;
          }
          var escape2;
          var html = "";
          var index;
          var lastIndex = 0;
          for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
              case 34:
                escape2 = "&quot;";
                break;
              case 38:
                escape2 = "&amp;";
                break;
              case 39:
                escape2 = "&#x27;";
                break;
              case 60:
                escape2 = "&lt;";
                break;
              case 62:
                escape2 = "&gt;";
                break;
              default:
                continue;
            }
            if (lastIndex !== index) {
              html += str.substring(lastIndex, index);
            }
            lastIndex = index + 1;
            html += escape2;
          }
          return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
        }
        function escapeTextForBrowser(text) {
          if (typeof text === "boolean" || typeof text === "number") {
            return "" + text;
          }
          return escapeHtml(text);
        }
        var uppercasePattern = /([A-Z])/g;
        var msPattern$1 = /^ms-/;
        function hyphenateStyleName(name) {
          return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
        }
        var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
        var didWarn = false;
        function sanitizeURL(url) {
          {
            if (!didWarn && isJavaScriptProtocol.test(url)) {
              didWarn = true;
              error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        var startInlineScript = stringToPrecomputedChunk("<script>");
        var endInlineScript = stringToPrecomputedChunk("<\/script>");
        var startScriptSrc = stringToPrecomputedChunk('<script src="');
        var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
        var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
        function escapeBootstrapScriptContent(scriptText) {
          {
            checkHtmlStringCoercion(scriptText);
          }
          return ("" + scriptText).replace(scriptRegex, scriptReplacer);
        }
        var scriptRegex = /(<\/|<)(s)(cript)/gi;
        var scriptReplacer = function(match, prefix2, s, suffix) {
          return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
        };
        function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
          var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
          var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
          var bootstrapChunks = [];
          if (bootstrapScriptContent !== void 0) {
            bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
          }
          if (bootstrapScripts !== void 0) {
            for (var i = 0; i < bootstrapScripts.length; i++) {
              bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
            }
          }
          if (bootstrapModules !== void 0) {
            for (var _i = 0; _i < bootstrapModules.length; _i++) {
              bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
            }
          }
          return {
            bootstrapChunks,
            startInlineScript: inlineScriptWithNonce,
            placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
            segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
            boundaryPrefix: idPrefix + "B:",
            idPrefix,
            nextSuspenseID: 0,
            sentCompleteSegmentFunction: false,
            sentCompleteBoundaryFunction: false,
            sentClientRenderFunction: false
          };
        }
        var ROOT_HTML_MODE = 0;
        var HTML_MODE = 1;
        var SVG_MODE = 2;
        var MATHML_MODE = 3;
        var HTML_TABLE_MODE = 4;
        var HTML_TABLE_BODY_MODE = 5;
        var HTML_TABLE_ROW_MODE = 6;
        var HTML_COLGROUP_MODE = 7;
        function createFormatContext(insertionMode, selectedValue) {
          return {
            insertionMode,
            selectedValue
          };
        }
        function createRootFormatContext(namespaceURI) {
          var insertionMode = namespaceURI === "http://www.w3.org/2000/svg" ? SVG_MODE : namespaceURI === "http://www.w3.org/1998/Math/MathML" ? MATHML_MODE : ROOT_HTML_MODE;
          return createFormatContext(insertionMode, null);
        }
        function getChildFormatContext(parentContext, type, props) {
          switch (type) {
            case "select":
              return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
            case "svg":
              return createFormatContext(SVG_MODE, null);
            case "math":
              return createFormatContext(MATHML_MODE, null);
            case "foreignObject":
              return createFormatContext(HTML_MODE, null);
            case "table":
              return createFormatContext(HTML_TABLE_MODE, null);
            case "thead":
            case "tbody":
            case "tfoot":
              return createFormatContext(HTML_TABLE_BODY_MODE, null);
            case "colgroup":
              return createFormatContext(HTML_COLGROUP_MODE, null);
            case "tr":
              return createFormatContext(HTML_TABLE_ROW_MODE, null);
          }
          if (parentContext.insertionMode >= HTML_TABLE_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          if (parentContext.insertionMode === ROOT_HTML_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          return parentContext;
        }
        var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
        function assignSuspenseBoundaryID(responseState) {
          var generatedID = responseState.nextSuspenseID++;
          return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
        }
        function makeId(responseState, treeId, localId) {
          var idPrefix = responseState.idPrefix;
          var id = ":" + idPrefix + "R" + treeId;
          if (localId > 0) {
            id += "H" + localId.toString(32);
          }
          return id + ":";
        }
        function encodeHTMLTextNode(text) {
          return escapeTextForBrowser(text);
        }
        var textSeparator = stringToPrecomputedChunk("<!-- -->");
        function pushTextInstance(target, text, responseState, textEmbedded) {
          if (text === "") {
            return textEmbedded;
          }
          if (textEmbedded) {
            target.push(textSeparator);
          }
          target.push(stringToChunk(encodeHTMLTextNode(text)));
          return true;
        }
        function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
          if (lastPushedText && textEmbedded) {
            target.push(textSeparator);
          }
        }
        var styleNameCache = /* @__PURE__ */ new Map();
        function processStyleName(styleName) {
          var chunk = styleNameCache.get(styleName);
          if (chunk !== void 0) {
            return chunk;
          }
          var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
          styleNameCache.set(styleName, result);
          return result;
        }
        var styleAttributeStart = stringToPrecomputedChunk(' style="');
        var styleAssign = stringToPrecomputedChunk(":");
        var styleSeparator = stringToPrecomputedChunk(";");
        function pushStyle(target, responseState, style) {
          if (typeof style !== "object") {
            throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
          }
          var isFirst = true;
          for (var styleName in style) {
            if (!hasOwnProperty.call(style, styleName)) {
              continue;
            }
            var styleValue = style[styleName];
            if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
              continue;
            }
            var nameChunk = void 0;
            var valueChunk = void 0;
            var isCustomProperty = styleName.indexOf("--") === 0;
            if (isCustomProperty) {
              nameChunk = stringToChunk(escapeTextForBrowser(styleName));
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            } else {
              {
                warnValidStyle$1(styleName, styleValue);
              }
              nameChunk = processStyleName(styleName);
              if (typeof styleValue === "number") {
                if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                  valueChunk = stringToChunk(styleValue + "px");
                } else {
                  valueChunk = stringToChunk("" + styleValue);
                }
              } else {
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              }
            }
            if (isFirst) {
              isFirst = false;
              target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
            } else {
              target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
            }
          }
          if (!isFirst) {
            target.push(attributeEnd);
          }
        }
        var attributeSeparator = stringToPrecomputedChunk(" ");
        var attributeAssign = stringToPrecomputedChunk('="');
        var attributeEnd = stringToPrecomputedChunk('"');
        var attributeEmptyString = stringToPrecomputedChunk('=""');
        function pushAttribute(target, responseState, name, value) {
          switch (name) {
            case "style": {
              pushStyle(target, responseState, value);
              return;
            }
            case "defaultValue":
            case "defaultChecked":
            case "innerHTML":
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              return;
          }
          if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
            return;
          }
          var propertyInfo = getPropertyInfo(name);
          if (propertyInfo !== null) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                if (!propertyInfo.acceptsBooleans) {
                  return;
                }
              }
            }
            var attributeName = propertyInfo.attributeName;
            var attributeNameChunk = stringToChunk(attributeName);
            switch (propertyInfo.type) {
              case BOOLEAN:
                if (value) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                }
                return;
              case OVERLOADED_BOOLEAN:
                if (value === true) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                } else if (value === false)
                  ;
                else {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                return;
              case NUMERIC:
                if (!isNaN(value)) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              case POSITIVE_NUMERIC:
                if (!isNaN(value) && value >= 1) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              default:
                if (propertyInfo.sanitizeURL) {
                  {
                    checkAttributeStringCoercion(value, attributeName);
                  }
                  value = "" + value;
                  sanitizeURL(value);
                }
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          } else if (isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                var prefix2 = name.toLowerCase().slice(0, 5);
                if (prefix2 !== "data-" && prefix2 !== "aria-") {
                  return;
                }
              }
            }
            target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        }
        var endOfStartTag = stringToPrecomputedChunk(">");
        var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
        function pushInnerHTML(target, innerHTML, children) {
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        var didWarnDefaultInputValue = false;
        var didWarnDefaultChecked = false;
        var didWarnDefaultSelectValue = false;
        var didWarnDefaultTextareaValue = false;
        var didWarnInvalidOptionChildren = false;
        var didWarnInvalidOptionInnerHTML = false;
        var didWarnSelectedSetOnOption = false;
        function checkSelectProp(props, propName) {
          {
            var value = props[propName];
            if (value != null) {
              var array = isArray(value);
              if (props.multiple && !array) {
                error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
              } else if (!props.multiple && array) {
                error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
              }
            }
          }
        }
        function pushStartSelect(target, props, responseState) {
          {
            checkControlledValueProps("select", props);
            checkSelectProp(props, "value");
            checkSelectProp(props, "defaultValue");
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
              error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultSelectValue = true;
            }
          }
          target.push(startChunkForTag("select"));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function flattenOptionChildren(children) {
          var content = "";
          React5.Children.forEach(children, function(child) {
            if (child == null) {
              return;
            }
            content += child;
            {
              if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                didWarnInvalidOptionChildren = true;
                error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
              }
            }
          });
          return content;
        }
        var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
        function pushStartOption(target, props, responseState, formatContext) {
          var selectedValue = formatContext.selectedValue;
          target.push(startChunkForTag("option"));
          var children = null;
          var value = null;
          var selected = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "selected":
                  selected = propValue;
                  {
                    if (!didWarnSelectedSetOnOption) {
                      error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                      didWarnSelectedSetOnOption = true;
                    }
                  }
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "value":
                  value = propValue;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (selectedValue != null) {
            var stringValue;
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              stringValue = "" + value;
            } else {
              {
                if (innerHTML !== null) {
                  if (!didWarnInvalidOptionInnerHTML) {
                    didWarnInvalidOptionInnerHTML = true;
                    error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                  }
                }
              }
              stringValue = flattenOptionChildren(children);
            }
            if (isArray(selectedValue)) {
              for (var i = 0; i < selectedValue.length; i++) {
                {
                  checkAttributeStringCoercion(selectedValue[i], "value");
                }
                var v = "" + selectedValue[i];
                if (v === stringValue) {
                  target.push(selectedMarkerAttribute);
                  break;
                }
              }
            } else {
              {
                checkAttributeStringCoercion(selectedValue, "select.value");
              }
              if ("" + selectedValue === stringValue) {
                target.push(selectedMarkerAttribute);
              }
            }
          } else if (selected) {
            target.push(selectedMarkerAttribute);
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function pushInput(target, props, responseState) {
          {
            checkControlledValueProps("input", props);
            if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
              error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultChecked = true;
            }
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
              error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultInputValue = true;
            }
          }
          target.push(startChunkForTag("input"));
          var value = null;
          var defaultValue = null;
          var checked = null;
          var defaultChecked = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                case "defaultChecked":
                  defaultChecked = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "checked":
                  checked = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (checked !== null) {
            pushAttribute(target, responseState, "checked", checked);
          } else if (defaultChecked !== null) {
            pushAttribute(target, responseState, "checked", defaultChecked);
          }
          if (value !== null) {
            pushAttribute(target, responseState, "value", value);
          } else if (defaultValue !== null) {
            pushAttribute(target, responseState, "value", defaultValue);
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartTextArea(target, props, responseState) {
          {
            checkControlledValueProps("textarea", props);
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
              error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultTextareaValue = true;
            }
          }
          target.push(startChunkForTag("textarea"));
          var value = null;
          var defaultValue = null;
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (value === null && defaultValue !== null) {
            value = defaultValue;
          }
          target.push(endOfStartTag);
          if (children != null) {
            {
              error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
            }
            if (value != null) {
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            }
            if (isArray(children)) {
              if (children.length > 1) {
                throw new Error("<textarea> can only have at most one child.");
              }
              {
                checkHtmlStringCoercion(children[0]);
              }
              value = "" + children[0];
            }
            {
              checkHtmlStringCoercion(children);
            }
            value = "" + children;
          }
          if (typeof value === "string" && value[0] === "\n") {
            target.push(leadingNewline);
          }
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            target.push(stringToChunk(encodeHTMLTextNode("" + value)));
          }
          return null;
        }
        function pushSelfClosing(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartMenuItem(target, props, responseState) {
          target.push(startChunkForTag("menuitem"));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          return null;
        }
        function pushStartTitle(target, props, responseState) {
          target.push(startChunkForTag("title"));
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          {
            var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
            if (Array.isArray(children) && children.length > 1) {
              error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && child.$$typeof != null) {
              error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && typeof child !== "string" && typeof child !== "number") {
              error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            }
          }
          return children;
        }
        function pushStartGenericElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          if (typeof children === "string") {
            target.push(stringToChunk(encodeHTMLTextNode(children)));
            return null;
          }
          return children;
        }
        function pushStartCustomElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "style":
                  pushStyle(target, responseState, propValue);
                  break;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                  break;
                default:
                  if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                    target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                  }
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        var leadingNewline = stringToPrecomputedChunk("\n");
        function pushStartPreformattedElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                target.push(leadingNewline, stringToChunk(html));
              } else {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          if (typeof children === "string" && children[0] === "\n") {
            target.push(leadingNewline);
          }
          return children;
        }
        var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
        var validatedTagCache = /* @__PURE__ */ new Map();
        function startChunkForTag(tag) {
          var tagStartChunk = validatedTagCache.get(tag);
          if (tagStartChunk === void 0) {
            if (!VALID_TAG_REGEX.test(tag)) {
              throw new Error("Invalid tag: " + tag);
            }
            tagStartChunk = stringToPrecomputedChunk("<" + tag);
            validatedTagCache.set(tag, tagStartChunk);
          }
          return tagStartChunk;
        }
        var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
        function pushStartInstance(target, type, props, responseState, formatContext) {
          {
            validateProperties(type, props);
            validateProperties$1(type, props);
            validateProperties$2(type, props, null);
            if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
              error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
            }
            if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
              if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
              }
            }
          }
          switch (type) {
            case "select":
              return pushStartSelect(target, props, responseState);
            case "option":
              return pushStartOption(target, props, responseState, formatContext);
            case "textarea":
              return pushStartTextArea(target, props, responseState);
            case "input":
              return pushInput(target, props, responseState);
            case "menuitem":
              return pushStartMenuItem(target, props, responseState);
            case "title":
              return pushStartTitle(target, props, responseState);
            case "listing":
            case "pre": {
              return pushStartPreformattedElement(target, props, type, responseState);
            }
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              return pushSelfClosing(target, props, type, responseState);
            }
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph": {
              return pushStartGenericElement(target, props, type, responseState);
            }
            case "html": {
              if (formatContext.insertionMode === ROOT_HTML_MODE) {
                target.push(DOCTYPE);
              }
              return pushStartGenericElement(target, props, type, responseState);
            }
            default: {
              if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                return pushStartGenericElement(target, props, type, responseState);
              } else {
                return pushStartCustomElement(target, props, type, responseState);
              }
            }
          }
        }
        var endTag1 = stringToPrecomputedChunk("</");
        var endTag2 = stringToPrecomputedChunk(">");
        function pushEndInstance(target, type, props) {
          switch (type) {
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              break;
            }
            default: {
              target.push(endTag1, stringToChunk(type), endTag2);
            }
          }
        }
        function writeCompletedRoot(destination, responseState) {
          var bootstrapChunks = responseState.bootstrapChunks;
          var i = 0;
          for (; i < bootstrapChunks.length - 1; i++) {
            writeChunk(destination, bootstrapChunks[i]);
          }
          if (i < bootstrapChunks.length) {
            return writeChunkAndReturn(destination, bootstrapChunks[i]);
          }
          return true;
        }
        var placeholder1 = stringToPrecomputedChunk('<template id="');
        var placeholder2 = stringToPrecomputedChunk('"></template>');
        function writePlaceholder(destination, responseState, id) {
          writeChunk(destination, placeholder1);
          writeChunk(destination, responseState.placeholderPrefix);
          var formattedID = stringToChunk(id.toString(16));
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, placeholder2);
        }
        var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
        var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
        var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
        var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
        var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
        var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
        var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
        var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
        var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
        var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
        var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
        function writeStartCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        }
        function writeStartPendingSuspenseBoundary(destination, responseState, id) {
          writeChunk(destination, startPendingSuspenseBoundary1);
          if (id === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, id);
          return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
        }
        function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
          var result;
          result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
          writeChunk(destination, clientRenderedSuspenseBoundaryError1);
          if (errorDigest) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          {
            if (errorMesssage) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
          }
          result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
          return result;
        }
        function writeEndCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndPendingSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
        var startSegmentHTML2 = stringToPrecomputedChunk('">');
        var endSegmentHTML = stringToPrecomputedChunk("</div>");
        var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
        var startSegmentSVG2 = stringToPrecomputedChunk('">');
        var endSegmentSVG = stringToPrecomputedChunk("</svg>");
        var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
        var startSegmentMathML2 = stringToPrecomputedChunk('">');
        var endSegmentMathML = stringToPrecomputedChunk("</math>");
        var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
        var startSegmentTable2 = stringToPrecomputedChunk('">');
        var endSegmentTable = stringToPrecomputedChunk("</table>");
        var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
        var startSegmentTableBody2 = stringToPrecomputedChunk('">');
        var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
        var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
        var startSegmentTableRow2 = stringToPrecomputedChunk('">');
        var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
        var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
        var startSegmentColGroup2 = stringToPrecomputedChunk('">');
        var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
        function writeStartSegment(destination, responseState, formatContext, id) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              writeChunk(destination, startSegmentHTML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentHTML2);
            }
            case SVG_MODE: {
              writeChunk(destination, startSegmentSVG);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentSVG2);
            }
            case MATHML_MODE: {
              writeChunk(destination, startSegmentMathML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentMathML2);
            }
            case HTML_TABLE_MODE: {
              writeChunk(destination, startSegmentTable);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTable2);
            }
            case HTML_TABLE_BODY_MODE: {
              writeChunk(destination, startSegmentTableBody);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableBody2);
            }
            case HTML_TABLE_ROW_MODE: {
              writeChunk(destination, startSegmentTableRow);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableRow2);
            }
            case HTML_COLGROUP_MODE: {
              writeChunk(destination, startSegmentColGroup);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentColGroup2);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        function writeEndSegment(destination, formatContext) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              return writeChunkAndReturn(destination, endSegmentHTML);
            }
            case SVG_MODE: {
              return writeChunkAndReturn(destination, endSegmentSVG);
            }
            case MATHML_MODE: {
              return writeChunkAndReturn(destination, endSegmentMathML);
            }
            case HTML_TABLE_MODE: {
              return writeChunkAndReturn(destination, endSegmentTable);
            }
            case HTML_TABLE_BODY_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableBody);
            }
            case HTML_TABLE_ROW_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableRow);
            }
            case HTML_COLGROUP_MODE: {
              return writeChunkAndReturn(destination, endSegmentColGroup);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
        var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
        var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
        var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
        var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
        var completeSegmentScript2 = stringToPrecomputedChunk('","');
        var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteSegmentFunction) {
            responseState.sentCompleteSegmentFunction = true;
            writeChunk(destination, completeSegmentScript1Full);
          } else {
            writeChunk(destination, completeSegmentScript1Partial);
          }
          writeChunk(destination, responseState.segmentPrefix);
          var formattedID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, formattedID);
          writeChunk(destination, completeSegmentScript2);
          writeChunk(destination, responseState.placeholderPrefix);
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, completeSegmentScript3);
        }
        var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
        var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
        var completeBoundaryScript2 = stringToPrecomputedChunk('","');
        var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteBoundaryFunction) {
            responseState.sentCompleteBoundaryFunction = true;
            writeChunk(destination, completeBoundaryScript1Full);
          } else {
            writeChunk(destination, completeBoundaryScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          var formattedContentID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, boundaryID);
          writeChunk(destination, completeBoundaryScript2);
          writeChunk(destination, responseState.segmentPrefix);
          writeChunk(destination, formattedContentID);
          return writeChunkAndReturn(destination, completeBoundaryScript3);
        }
        var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
        var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
        var clientRenderScript1A = stringToPrecomputedChunk('"');
        var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
        var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
        function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentClientRenderFunction) {
            responseState.sentClientRenderFunction = true;
            writeChunk(destination, clientRenderScript1Full);
          } else {
            writeChunk(destination, clientRenderScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, boundaryID);
          writeChunk(destination, clientRenderScript1A);
          if (errorDigest || errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
          }
          if (errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
          }
          return writeChunkAndReturn(destination, clientRenderScript2);
        }
        var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
        function escapeJSStringsForInstructionScripts(input) {
          var escaped = JSON.stringify(input);
          return escaped.replace(regexForJSStringsInScripts, function(match) {
            switch (match) {
              case "<":
                return "\\u003c";
              case "\u2028":
                return "\\u2028";
              case "\u2029":
                return "\\u2029";
              default: {
                throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
              }
            }
          });
        }
        var assign = Object.assign;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_SCOPE_TYPE = Symbol.for("react.scope");
        var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
        var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
        var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeClassComponentFrame(ctor, source, ownerFn) {
          {
            return describeNativeComponentFrame(ctor, true);
          }
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var warnedAboutMissingGetChildContext;
        {
          warnedAboutMissingGetChildContext = {};
        }
        var emptyContextObject = {};
        {
          Object.freeze(emptyContextObject);
        }
        function getMaskedContext(type, unmaskedContext) {
          {
            var contextTypes = type.contextTypes;
            if (!contextTypes) {
              return emptyContextObject;
            }
            var context = {};
            for (var key in contextTypes) {
              context[key] = unmaskedContext[key];
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(contextTypes, context, "context", name);
            }
            return context;
          }
        }
        function processChildContext(instance, type, parentContext, childContextTypes) {
          {
            if (typeof instance.getChildContext !== "function") {
              {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!warnedAboutMissingGetChildContext[componentName]) {
                  warnedAboutMissingGetChildContext[componentName] = true;
                  error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                }
              }
              return parentContext;
            }
            var childContext = instance.getChildContext();
            for (var contextKey in childContext) {
              if (!(contextKey in childContextTypes)) {
                throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
              }
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(childContextTypes, childContext, "child context", name);
            }
            return assign({}, parentContext, childContext);
          }
        }
        var rendererSigil;
        {
          rendererSigil = {};
        }
        var rootContextSnapshot = null;
        var currentActiveSnapshot = null;
        function popNode(prev) {
          {
            prev.context._currentValue = prev.parentValue;
          }
        }
        function pushNode(next) {
          {
            next.context._currentValue = next.value;
          }
        }
        function popToNearestCommonAncestor(prev, next) {
          if (prev === next)
            ;
          else {
            popNode(prev);
            var parentPrev = prev.parent;
            var parentNext = next.parent;
            if (parentPrev === null) {
              if (parentNext !== null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
            } else {
              if (parentNext === null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
              popToNearestCommonAncestor(parentPrev, parentNext);
            }
            pushNode(next);
          }
        }
        function popAllPrevious(prev) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev !== null) {
            popAllPrevious(parentPrev);
          }
        }
        function pushAllNext(next) {
          var parentNext = next.parent;
          if (parentNext !== null) {
            pushAllNext(parentNext);
          }
          pushNode(next);
        }
        function popPreviousToCommonLevel(prev, next) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (parentPrev.depth === next.depth) {
            popToNearestCommonAncestor(parentPrev, next);
          } else {
            popPreviousToCommonLevel(parentPrev, next);
          }
        }
        function popNextToCommonLevel(prev, next) {
          var parentNext = next.parent;
          if (parentNext === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (prev.depth === parentNext.depth) {
            popToNearestCommonAncestor(prev, parentNext);
          } else {
            popNextToCommonLevel(prev, parentNext);
          }
          pushNode(next);
        }
        function switchContext(newSnapshot) {
          var prev = currentActiveSnapshot;
          var next = newSnapshot;
          if (prev !== next) {
            if (prev === null) {
              pushAllNext(next);
            } else if (next === null) {
              popAllPrevious(prev);
            } else if (prev.depth === next.depth) {
              popToNearestCommonAncestor(prev, next);
            } else if (prev.depth > next.depth) {
              popPreviousToCommonLevel(prev, next);
            } else {
              popNextToCommonLevel(prev, next);
            }
            currentActiveSnapshot = next;
          }
        }
        function pushProvider(context, nextValue) {
          var prevValue;
          {
            prevValue = context._currentValue;
            context._currentValue = nextValue;
            {
              if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer = rendererSigil;
            }
          }
          var prevNode = currentActiveSnapshot;
          var newNode = {
            parent: prevNode,
            depth: prevNode === null ? 0 : prevNode.depth + 1,
            context,
            parentValue: prevValue,
            value: nextValue
          };
          currentActiveSnapshot = newNode;
          return newNode;
        }
        function popProvider(context) {
          var prevSnapshot = currentActiveSnapshot;
          if (prevSnapshot === null) {
            throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          }
          {
            if (prevSnapshot.context !== context) {
              error("The parent context is not the expected context. This is probably a bug in React.");
            }
          }
          {
            var value = prevSnapshot.parentValue;
            if (value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
              prevSnapshot.context._currentValue = prevSnapshot.context._defaultValue;
            } else {
              prevSnapshot.context._currentValue = value;
            }
            {
              if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer = rendererSigil;
            }
          }
          return currentActiveSnapshot = prevSnapshot.parent;
        }
        function getActiveContext() {
          return currentActiveSnapshot;
        }
        function readContext(context) {
          var value = context._currentValue;
          return value;
        }
        function get(key) {
          return key._reactInternals;
        }
        function set(key, value) {
          key._reactInternals = value;
        }
        var didWarnAboutNoopUpdateForComponent = {};
        var didWarnAboutDeprecatedWillMount = {};
        var didWarnAboutUninitializedState;
        var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
        var didWarnAboutLegacyLifecyclesAndDerivedState;
        var didWarnAboutUndefinedDerivedState;
        var warnOnUndefinedDerivedState;
        var warnOnInvalidCallback;
        var didWarnAboutDirectlyAssigningPropsToState;
        var didWarnAboutContextTypeAndContextTypes;
        var didWarnAboutInvalidateContextType;
        {
          didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
          didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
          didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
          didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
          didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
          var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
          warnOnInvalidCallback = function(callback, callerName) {
            if (callback === null || typeof callback === "function") {
              return;
            }
            var key = callerName + "_" + callback;
            if (!didWarnOnInvalidCallback.has(key)) {
              didWarnOnInvalidCallback.add(key);
              error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
            }
          };
          warnOnUndefinedDerivedState = function(type, partialState) {
            if (partialState === void 0) {
              var componentName = getComponentNameFromType(type) || "Component";
              if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                didWarnAboutUndefinedDerivedState.add(componentName);
                error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
              }
            }
          };
        }
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnAboutNoopUpdateForComponent[warningKey]) {
              return;
            }
            error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
            didWarnAboutNoopUpdateForComponent[warningKey] = true;
          }
        }
        var classComponentUpdater = {
          isMounted: function(inst) {
            return false;
          },
          enqueueSetState: function(inst, payload, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "setState");
            } else {
              internals.queue.push(payload);
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          },
          enqueueReplaceState: function(inst, payload, callback) {
            var internals = get(inst);
            internals.replace = true;
            internals.queue = [payload];
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          },
          enqueueForceUpdate: function(inst, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "forceUpdate");
            } else {
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          }
        };
        function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
          var partialState = getDerivedStateFromProps(nextProps, prevState);
          {
            warnOnUndefinedDerivedState(ctor, partialState);
          }
          var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
          return newState;
        }
        function constructClassInstance(ctor, props, maskedLegacyContext) {
          var context = emptyContextObject;
          var contextType = ctor.contextType;
          {
            if ("contextType" in ctor) {
              var isValid = contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0;
              if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                didWarnAboutInvalidateContextType.add(ctor);
                var addendum = "";
                if (contextType === void 0) {
                  addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                } else if (typeof contextType !== "object") {
                  addendum = " However, it is set to a " + typeof contextType + ".";
                } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                  addendum = " Did you accidentally pass the Context.Provider instead?";
                } else if (contextType._context !== void 0) {
                  addendum = " Did you accidentally pass the Context.Consumer instead?";
                } else {
                  addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                }
                error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
              }
            }
          }
          if (typeof contextType === "object" && contextType !== null) {
            context = readContext(contextType);
          } else {
            context = maskedLegacyContext;
          }
          var instance = new ctor(props, context);
          {
            if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutUninitializedState.has(componentName)) {
                didWarnAboutUninitializedState.add(componentName);
                error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
              }
            }
            if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
              var foundWillMountName = null;
              var foundWillReceivePropsName = null;
              var foundWillUpdateName = null;
              if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
                foundWillMountName = "componentWillMount";
              } else if (typeof instance.UNSAFE_componentWillMount === "function") {
                foundWillMountName = "UNSAFE_componentWillMount";
              }
              if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                foundWillReceivePropsName = "componentWillReceiveProps";
              } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
                foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
              }
              if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
                foundWillUpdateName = "componentWillUpdate";
              } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
                foundWillUpdateName = "UNSAFE_componentWillUpdate";
              }
              if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                var _componentName = getComponentNameFromType(ctor) || "Component";
                var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                  didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                  error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                }
              }
            }
          }
          return instance;
        }
        function checkClassInstance(instance, ctor, newProps) {
          {
            var name = getComponentNameFromType(ctor) || "Component";
            var renderPresent = instance.render;
            if (!renderPresent) {
              if (ctor.prototype && typeof ctor.prototype.render === "function") {
                error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
              } else {
                error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
              }
            }
            if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
              error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
            }
            if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
            }
            if (instance.propTypes) {
              error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
            }
            if (instance.contextType) {
              error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
            }
            {
              if (instance.contextTypes) {
                error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
              }
              if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                didWarnAboutContextTypeAndContextTypes.add(ctor);
                error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
              }
            }
            if (typeof instance.componentShouldUpdate === "function") {
              error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
            }
            if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
              error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
            }
            if (typeof instance.componentDidUnmount === "function") {
              error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
            }
            if (typeof instance.componentDidReceiveProps === "function") {
              error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
            }
            if (typeof instance.componentWillRecieveProps === "function") {
              error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
            }
            if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
              error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
            }
            var hasMutatedProps = instance.props !== newProps;
            if (instance.props !== void 0 && hasMutatedProps) {
              error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
            }
            if (instance.defaultProps) {
              error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
            }
            if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
              didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
              error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
            }
            if (typeof instance.getDerivedStateFromProps === "function") {
              error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof instance.getDerivedStateFromError === "function") {
              error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof ctor.getSnapshotBeforeUpdate === "function") {
              error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
            }
            var _state = instance.state;
            if (_state && (typeof _state !== "object" || isArray(_state))) {
              error("%s.state: must be set to an object or null", name);
            }
            if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
              error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
            }
          }
        }
        function callComponentWillMount(type, instance) {
          var oldState = instance.state;
          if (typeof instance.componentWillMount === "function") {
            {
              if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!didWarnAboutDeprecatedWillMount[componentName]) {
                  warn(
                    "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                    componentName
                  );
                  didWarnAboutDeprecatedWillMount[componentName] = true;
                }
              }
            }
            instance.componentWillMount();
          }
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            instance.UNSAFE_componentWillMount();
          }
          if (oldState !== instance.state) {
            {
              error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
            }
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
          if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
            var oldQueue = internalInstance.queue;
            var oldReplace = internalInstance.replace;
            internalInstance.queue = null;
            internalInstance.replace = false;
            if (oldReplace && oldQueue.length === 1) {
              inst.state = oldQueue[0];
            } else {
              var nextState = oldReplace ? oldQueue[0] : inst.state;
              var dontMutate = true;
              for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                var partial = oldQueue[i];
                var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                if (partialState != null) {
                  if (dontMutate) {
                    dontMutate = false;
                    nextState = assign({}, nextState, partialState);
                  } else {
                    assign(nextState, partialState);
                  }
                }
              }
              inst.state = nextState;
            }
          } else {
            internalInstance.queue = null;
          }
        }
        function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
          {
            checkClassInstance(instance, ctor, newProps);
          }
          var initialState = instance.state !== void 0 ? instance.state : null;
          instance.updater = classComponentUpdater;
          instance.props = newProps;
          instance.state = initialState;
          var internalInstance = {
            queue: [],
            replace: false
          };
          set(instance, internalInstance);
          var contextType = ctor.contextType;
          if (typeof contextType === "object" && contextType !== null) {
            instance.context = readContext(contextType);
          } else {
            instance.context = maskedLegacyContext;
          }
          {
            if (instance.state === newProps) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
              }
            }
          }
          var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
          if (typeof getDerivedStateFromProps === "function") {
            instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
          }
          if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
            callComponentWillMount(ctor, instance);
            processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
          }
        }
        var emptyTreeContext = {
          id: 1,
          overflow: ""
        };
        function getTreeId(context) {
          var overflow = context.overflow;
          var idWithLeadingBit = context.id;
          var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
          return id.toString(32) + overflow;
        }
        function pushTreeContext(baseContext, totalChildren, index) {
          var baseIdWithLeadingBit = baseContext.id;
          var baseOverflow = baseContext.overflow;
          var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
          var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
          var slot = index + 1;
          var length = getBitLength(totalChildren) + baseLength;
          if (length > 30) {
            var numberOfOverflowBits = baseLength - baseLength % 5;
            var newOverflowBits = (1 << numberOfOverflowBits) - 1;
            var newOverflow = (baseId & newOverflowBits).toString(32);
            var restOfBaseId = baseId >> numberOfOverflowBits;
            var restOfBaseLength = baseLength - numberOfOverflowBits;
            var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
            var restOfNewBits = slot << restOfBaseLength;
            var id = restOfNewBits | restOfBaseId;
            var overflow = newOverflow + baseOverflow;
            return {
              id: 1 << restOfLength | id,
              overflow
            };
          } else {
            var newBits = slot << baseLength;
            var _id = newBits | baseId;
            var _overflow = baseOverflow;
            return {
              id: 1 << length | _id,
              overflow: _overflow
            };
          }
        }
        function getBitLength(number) {
          return 32 - clz32(number);
        }
        function getLeadingBit(id) {
          return 1 << getBitLength(id) - 1;
        }
        var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
        var log = Math.log;
        var LN2 = Math.LN2;
        function clz32Fallback(x) {
          var asUint = x >>> 0;
          if (asUint === 0) {
            return 32;
          }
          return 31 - (log(asUint) / LN2 | 0) | 0;
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var currentlyRenderingComponent = null;
        var currentlyRenderingTask = null;
        var firstWorkInProgressHook = null;
        var workInProgressHook = null;
        var isReRender = false;
        var didScheduleRenderPhaseUpdate = false;
        var localIdCounter = 0;
        var renderPhaseUpdates = null;
        var numberOfReRenders = 0;
        var RE_RENDER_LIMIT = 25;
        var isInHookUserCodeInDev = false;
        var currentHookNameInDev;
        function resolveCurrentlyRenderingComponent() {
          if (currentlyRenderingComponent === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
          }
          {
            if (isInHookUserCodeInDev) {
              error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
            }
          }
          return currentlyRenderingComponent;
        }
        function areHookInputsEqual(nextDeps, prevDeps) {
          if (prevDeps === null) {
            {
              error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
            }
            return false;
          }
          {
            if (nextDeps.length !== prevDeps.length) {
              error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
            }
          }
          for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
            if (objectIs(nextDeps[i], prevDeps[i])) {
              continue;
            }
            return false;
          }
          return true;
        }
        function createHook() {
          if (numberOfReRenders > 0) {
            throw new Error("Rendered more hooks than during the previous render");
          }
          return {
            memoizedState: null,
            queue: null,
            next: null
          };
        }
        function createWorkInProgressHook() {
          if (workInProgressHook === null) {
            if (firstWorkInProgressHook === null) {
              isReRender = false;
              firstWorkInProgressHook = workInProgressHook = createHook();
            } else {
              isReRender = true;
              workInProgressHook = firstWorkInProgressHook;
            }
          } else {
            if (workInProgressHook.next === null) {
              isReRender = false;
              workInProgressHook = workInProgressHook.next = createHook();
            } else {
              isReRender = true;
              workInProgressHook = workInProgressHook.next;
            }
          }
          return workInProgressHook;
        }
        function prepareToUseHooks(task, componentIdentity) {
          currentlyRenderingComponent = componentIdentity;
          currentlyRenderingTask = task;
          {
            isInHookUserCodeInDev = false;
          }
          localIdCounter = 0;
        }
        function finishHooks(Component, props, children, refOrContext) {
          while (didScheduleRenderPhaseUpdate) {
            didScheduleRenderPhaseUpdate = false;
            localIdCounter = 0;
            numberOfReRenders += 1;
            workInProgressHook = null;
            children = Component(props, refOrContext);
          }
          resetHooksState();
          return children;
        }
        function checkDidRenderIdHook() {
          var didRenderIdHook = localIdCounter !== 0;
          return didRenderIdHook;
        }
        function resetHooksState() {
          {
            isInHookUserCodeInDev = false;
          }
          currentlyRenderingComponent = null;
          currentlyRenderingTask = null;
          didScheduleRenderPhaseUpdate = false;
          firstWorkInProgressHook = null;
          numberOfReRenders = 0;
          renderPhaseUpdates = null;
          workInProgressHook = null;
        }
        function readContext$1(context) {
          {
            if (isInHookUserCodeInDev) {
              error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
            }
          }
          return readContext(context);
        }
        function useContext3(context) {
          {
            currentHookNameInDev = "useContext";
          }
          resolveCurrentlyRenderingComponent();
          return readContext(context);
        }
        function basicStateReducer(state, action) {
          return typeof action === "function" ? action(state) : action;
        }
        function useState2(initialState) {
          {
            currentHookNameInDev = "useState";
          }
          return useReducer(
            basicStateReducer,
            initialState
          );
        }
        function useReducer(reducer, initialArg, init) {
          {
            if (reducer !== basicStateReducer) {
              currentHookNameInDev = "useReducer";
            }
          }
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          if (isReRender) {
            var queue = workInProgressHook.queue;
            var dispatch = queue.dispatch;
            if (renderPhaseUpdates !== null) {
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate !== void 0) {
                renderPhaseUpdates.delete(queue);
                var newState = workInProgressHook.memoizedState;
                var update = firstRenderPhaseUpdate;
                do {
                  var action = update.action;
                  {
                    isInHookUserCodeInDev = true;
                  }
                  newState = reducer(newState, action);
                  {
                    isInHookUserCodeInDev = false;
                  }
                  update = update.next;
                } while (update !== null);
                workInProgressHook.memoizedState = newState;
                return [newState, dispatch];
              }
            }
            return [workInProgressHook.memoizedState, dispatch];
          } else {
            {
              isInHookUserCodeInDev = true;
            }
            var initialState;
            if (reducer === basicStateReducer) {
              initialState = typeof initialArg === "function" ? initialArg() : initialArg;
            } else {
              initialState = init !== void 0 ? init(initialArg) : initialArg;
            }
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = initialState;
            var _queue = workInProgressHook.queue = {
              last: null,
              dispatch: null
            };
            var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
            return [workInProgressHook.memoizedState, _dispatch];
          }
        }
        function useMemo2(nextCreate, deps) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var nextDeps = deps === void 0 ? null : deps;
          if (workInProgressHook !== null) {
            var prevState = workInProgressHook.memoizedState;
            if (prevState !== null) {
              if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                  return prevState[0];
                }
              }
            }
          }
          {
            isInHookUserCodeInDev = true;
          }
          var nextValue = nextCreate();
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = [nextValue, nextDeps];
          return nextValue;
        }
        function useRef3(initialValue) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var previousRef = workInProgressHook.memoizedState;
          if (previousRef === null) {
            var ref = {
              current: initialValue
            };
            {
              Object.seal(ref);
            }
            workInProgressHook.memoizedState = ref;
            return ref;
          } else {
            return previousRef;
          }
        }
        function useLayoutEffect2(create, inputs) {
          {
            currentHookNameInDev = "useLayoutEffect";
            error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
          }
        }
        function dispatchAction(componentIdentity, queue, action) {
          if (numberOfReRenders >= RE_RENDER_LIMIT) {
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          }
          if (componentIdentity === currentlyRenderingComponent) {
            didScheduleRenderPhaseUpdate = true;
            var update = {
              action,
              next: null
            };
            if (renderPhaseUpdates === null) {
              renderPhaseUpdates = /* @__PURE__ */ new Map();
            }
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate === void 0) {
              renderPhaseUpdates.set(queue, update);
            } else {
              var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
              while (lastRenderPhaseUpdate.next !== null) {
                lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
              }
              lastRenderPhaseUpdate.next = update;
            }
          }
        }
        function useCallback3(callback, deps) {
          return useMemo2(function() {
            return callback;
          }, deps);
        }
        function useMutableSource(source, getSnapshot, subscribe) {
          resolveCurrentlyRenderingComponent();
          return getSnapshot(source._source);
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          if (getServerSnapshot === void 0) {
            throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
          }
          return getServerSnapshot();
        }
        function useDeferredValue(value) {
          resolveCurrentlyRenderingComponent();
          return value;
        }
        function unsupportedStartTransition() {
          throw new Error("startTransition cannot be called during server rendering.");
        }
        function useTransition2() {
          resolveCurrentlyRenderingComponent();
          return [false, unsupportedStartTransition];
        }
        function useId() {
          var task = currentlyRenderingTask;
          var treeId = getTreeId(task.treeContext);
          var responseState = currentResponseState;
          if (responseState === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
          }
          var localId = localIdCounter++;
          return makeId(responseState, treeId, localId);
        }
        function noop() {
        }
        var Dispatcher = {
          readContext: readContext$1,
          useContext: useContext3,
          useMemo: useMemo2,
          useReducer,
          useRef: useRef3,
          useState: useState2,
          useInsertionEffect: noop,
          useLayoutEffect: useLayoutEffect2,
          useCallback: useCallback3,
          useImperativeHandle: noop,
          useEffect: noop,
          useDebugValue: noop,
          useDeferredValue,
          useTransition: useTransition2,
          useId,
          useMutableSource,
          useSyncExternalStore
        };
        var currentResponseState = null;
        function setCurrentResponseState(responseState) {
          currentResponseState = responseState;
        }
        function getStackByComponentStackNode(componentStack) {
          try {
            var info = "";
            var node = componentStack;
            do {
              switch (node.tag) {
                case 0:
                  info += describeBuiltInComponentFrame(node.type, null, null);
                  break;
                case 1:
                  info += describeFunctionComponentFrame(node.type, null, null);
                  break;
                case 2:
                  info += describeClassComponentFrame(node.type, null, null);
                  break;
              }
              node = node.parent;
            } while (node);
            return info;
          } catch (x) {
            return "\nError generating stack: " + x.message + "\n" + x.stack;
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        var PENDING = 0;
        var COMPLETED = 1;
        var FLUSHED = 2;
        var ABORTED = 3;
        var ERRORED = 4;
        var OPEN = 0;
        var CLOSING = 1;
        var CLOSED = 2;
        var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
        function defaultErrorHandler(error2) {
          console["error"](error2);
          return null;
        }
        function noop$1() {
        }
        function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError) {
          var pingedTasks = [];
          var abortSet = /* @__PURE__ */ new Set();
          var request = {
            destination: null,
            responseState,
            progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
            status: OPEN,
            fatalError: null,
            nextSegmentId: 0,
            allPendingTasks: 0,
            pendingRootTasks: 0,
            completedRootSegment: null,
            abortableTasks: abortSet,
            pingedTasks,
            clientRenderedBoundaries: [],
            completedBoundaries: [],
            partialBoundaries: [],
            onError: onError === void 0 ? defaultErrorHandler : onError,
            onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
            onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
            onShellError: onShellError === void 0 ? noop$1 : onShellError,
            onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
          };
          var rootSegment = createPendingSegment(
            request,
            0,
            null,
            rootFormatContext,
            false,
            false
          );
          rootSegment.parentFlushed = true;
          var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
          pingedTasks.push(rootTask);
          return request;
        }
        function pingTask(request, task) {
          var pingedTasks = request.pingedTasks;
          pingedTasks.push(task);
          if (pingedTasks.length === 1) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
        }
        function createSuspenseBoundary(request, fallbackAbortableTasks) {
          return {
            id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
            rootSegmentID: -1,
            parentFlushed: false,
            pendingTasks: 0,
            forceClientRender: false,
            completedSegments: [],
            byteSize: 0,
            fallbackAbortableTasks,
            errorDigest: null
          };
        }
        function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
          request.allPendingTasks++;
          if (blockedBoundary === null) {
            request.pendingRootTasks++;
          } else {
            blockedBoundary.pendingTasks++;
          }
          var task = {
            node,
            ping: function() {
              return pingTask(request, task);
            },
            blockedBoundary,
            blockedSegment,
            abortSet,
            legacyContext,
            context,
            treeContext
          };
          {
            task.componentStack = null;
          }
          abortSet.add(task);
          return task;
        }
        function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
          return {
            status: PENDING,
            id: -1,
            index,
            parentFlushed: false,
            chunks: [],
            children: [],
            formatContext,
            boundary,
            lastPushedText,
            textEmbedded
          };
        }
        var currentTaskInDEV = null;
        function getCurrentStackInDEV() {
          {
            if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
              return "";
            }
            return getStackByComponentStackNode(currentTaskInDEV.componentStack);
          }
        }
        function pushBuiltInComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 0,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushFunctionComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 1,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushClassComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 2,
              parent: task.componentStack,
              type
            };
          }
        }
        function popComponentStackInDEV(task) {
          {
            if (task.componentStack === null) {
              error("Unexpectedly popped too many stack frames. This is a bug in React.");
            } else {
              task.componentStack = task.componentStack.parent;
            }
          }
        }
        var lastBoundaryErrorComponentStackDev = null;
        function captureBoundaryErrorDetailsDev(boundary, error2) {
          {
            var errorMessage;
            if (typeof error2 === "string") {
              errorMessage = error2;
            } else if (error2 && typeof error2.message === "string") {
              errorMessage = error2.message;
            } else {
              errorMessage = String(error2);
            }
            var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
            lastBoundaryErrorComponentStackDev = null;
            boundary.errorMessage = errorMessage;
            boundary.errorComponentStack = errorComponentStack;
          }
        }
        function logRecoverableError(request, error2) {
          var errorDigest = request.onError(error2);
          if (errorDigest != null && typeof errorDigest !== "string") {
            throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
          }
          return errorDigest;
        }
        function fatalError(request, error2) {
          var onShellError = request.onShellError;
          onShellError(error2);
          var onFatalError = request.onFatalError;
          onFatalError(error2);
          if (request.destination !== null) {
            request.status = CLOSED;
            closeWithError(request.destination, error2);
          } else {
            request.status = CLOSING;
            request.fatalError = error2;
          }
        }
        function renderSuspenseBoundary(request, task, props) {
          pushBuiltInComponentStackInDEV(task, "Suspense");
          var parentBoundary = task.blockedBoundary;
          var parentSegment = task.blockedSegment;
          var fallback = props.fallback;
          var content = props.children;
          var fallbackAbortSet = /* @__PURE__ */ new Set();
          var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
          var insertionIndex = parentSegment.chunks.length;
          var boundarySegment = createPendingSegment(
            request,
            insertionIndex,
            newBoundary,
            parentSegment.formatContext,
            false,
            false
          );
          parentSegment.children.push(boundarySegment);
          parentSegment.lastPushedText = false;
          var contentRootSegment = createPendingSegment(
            request,
            0,
            null,
            parentSegment.formatContext,
            false,
            false
          );
          contentRootSegment.parentFlushed = true;
          task.blockedBoundary = newBoundary;
          task.blockedSegment = contentRootSegment;
          try {
            renderNode(request, task, content);
            pushSegmentFinale(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
            contentRootSegment.status = COMPLETED;
            queueCompletedSegment(newBoundary, contentRootSegment);
            if (newBoundary.pendingTasks === 0) {
              popComponentStackInDEV(task);
              return;
            }
          } catch (error2) {
            contentRootSegment.status = ERRORED;
            newBoundary.forceClientRender = true;
            newBoundary.errorDigest = logRecoverableError(request, error2);
            {
              captureBoundaryErrorDetailsDev(newBoundary, error2);
            }
          } finally {
            task.blockedBoundary = parentBoundary;
            task.blockedSegment = parentSegment;
          }
          var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
          {
            suspendedFallbackTask.componentStack = task.componentStack;
          }
          request.pingedTasks.push(suspendedFallbackTask);
          popComponentStackInDEV(task);
        }
        function renderHostElement(request, task, type, props) {
          pushBuiltInComponentStackInDEV(task, type);
          var segment = task.blockedSegment;
          var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
          segment.lastPushedText = false;
          var prevContext = segment.formatContext;
          segment.formatContext = getChildFormatContext(prevContext, type, props);
          renderNode(request, task, children);
          segment.formatContext = prevContext;
          pushEndInstance(segment.chunks, type);
          segment.lastPushedText = false;
          popComponentStackInDEV(task);
        }
        function shouldConstruct$1(Component) {
          return Component.prototype && Component.prototype.isReactComponent;
        }
        function renderWithHooks(request, task, Component, props, secondArg) {
          var componentIdentity = {};
          prepareToUseHooks(task, componentIdentity);
          var result = Component(props, secondArg);
          return finishHooks(Component, props, result, secondArg);
        }
        function finishClassComponent(request, task, instance, Component, props) {
          var nextChildren = instance.render();
          {
            if (instance.props !== props) {
              if (!didWarnAboutReassigningProps) {
                error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
              }
              didWarnAboutReassigningProps = true;
            }
          }
          {
            var childContextTypes = Component.childContextTypes;
            if (childContextTypes !== null && childContextTypes !== void 0) {
              var previousContext = task.legacyContext;
              var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
              task.legacyContext = mergedContext;
              renderNodeDestructive(request, task, nextChildren);
              task.legacyContext = previousContext;
              return;
            }
          }
          renderNodeDestructive(request, task, nextChildren);
        }
        function renderClassComponent(request, task, Component, props) {
          pushClassComponentStackInDEV(task, Component);
          var maskedContext = getMaskedContext(Component, task.legacyContext);
          var instance = constructClassInstance(Component, props, maskedContext);
          mountClassInstance(instance, Component, props, maskedContext);
          finishClassComponent(request, task, instance, Component, props);
          popComponentStackInDEV(task);
        }
        var didWarnAboutBadClass = {};
        var didWarnAboutModulePatternComponent = {};
        var didWarnAboutContextTypeOnFunctionComponent = {};
        var didWarnAboutGetDerivedStateOnFunctionComponent = {};
        var didWarnAboutReassigningProps = false;
        var didWarnAboutGenerators = false;
        var didWarnAboutMaps = false;
        var hasWarnedAboutUsingContextAsConsumer = false;
        function renderIndeterminateComponent(request, task, Component, props) {
          var legacyContext;
          {
            legacyContext = getMaskedContext(Component, task.legacyContext);
          }
          pushFunctionComponentStackInDEV(task, Component);
          {
            if (Component.prototype && typeof Component.prototype.render === "function") {
              var componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutBadClass[componentName]) {
                error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                didWarnAboutBadClass[componentName] = true;
              }
            }
          }
          var value = renderWithHooks(request, task, Component, props, legacyContext);
          var hasId = checkDidRenderIdHook();
          {
            if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
              var _componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                didWarnAboutModulePatternComponent[_componentName] = true;
              }
            }
          }
          if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
            {
              var _componentName2 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName2]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                didWarnAboutModulePatternComponent[_componentName2] = true;
              }
            }
            mountClassInstance(value, Component, props, legacyContext);
            finishClassComponent(request, task, value, Component, props);
          } else {
            {
              validateFunctionComponentInDev(Component);
            }
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, value);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, value);
            }
          }
          popComponentStackInDEV(task);
        }
        function validateFunctionComponentInDev(Component) {
          {
            if (Component) {
              if (Component.childContextTypes) {
                error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
              }
            }
            if (typeof Component.getDerivedStateFromProps === "function") {
              var _componentName3 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
              }
            }
            if (typeof Component.contextType === "object" && Component.contextType !== null) {
              var _componentName4 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                error("%s: Function components do not support contextType.", _componentName4);
                didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
              }
            }
          }
        }
        function resolveDefaultProps(Component, baseProps) {
          if (Component && Component.defaultProps) {
            var props = assign({}, baseProps);
            var defaultProps = Component.defaultProps;
            for (var propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
            return props;
          }
          return baseProps;
        }
        function renderForwardRef(request, task, type, props, ref) {
          pushFunctionComponentStackInDEV(task, type.render);
          var children = renderWithHooks(request, task, type.render, props, ref);
          var hasId = checkDidRenderIdHook();
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, children);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, children);
          }
          popComponentStackInDEV(task);
        }
        function renderMemo(request, task, type, props, ref) {
          var innerType = type.type;
          var resolvedProps = resolveDefaultProps(innerType, props);
          renderElement(request, task, innerType, resolvedProps, ref);
        }
        function renderContextConsumer(request, task, context, props) {
          {
            if (context._context === void 0) {
              if (context !== context.Consumer) {
                if (!hasWarnedAboutUsingContextAsConsumer) {
                  hasWarnedAboutUsingContextAsConsumer = true;
                  error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                }
              }
            } else {
              context = context._context;
            }
          }
          var render = props.children;
          {
            if (typeof render !== "function") {
              error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
            }
          }
          var newValue = readContext(context);
          var newChildren = render(newValue);
          renderNodeDestructive(request, task, newChildren);
        }
        function renderContextProvider(request, task, type, props) {
          var context = type._context;
          var value = props.value;
          var children = props.children;
          var prevSnapshot;
          {
            prevSnapshot = task.context;
          }
          task.context = pushProvider(context, value);
          renderNodeDestructive(request, task, children);
          task.context = popProvider(context);
          {
            if (prevSnapshot !== task.context) {
              error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
            }
          }
        }
        function renderLazyComponent(request, task, lazyComponent, props, ref) {
          pushBuiltInComponentStackInDEV(task, "Lazy");
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;
          var Component = init(payload);
          var resolvedProps = resolveDefaultProps(Component, props);
          renderElement(request, task, Component, resolvedProps, ref);
          popComponentStackInDEV(task);
        }
        function renderElement(request, task, type, props, ref) {
          if (typeof type === "function") {
            if (shouldConstruct$1(type)) {
              renderClassComponent(request, task, type, props);
              return;
            } else {
              renderIndeterminateComponent(request, task, type, props);
              return;
            }
          }
          if (typeof type === "string") {
            renderHostElement(request, task, type, props);
            return;
          }
          switch (type) {
            case REACT_LEGACY_HIDDEN_TYPE:
            case REACT_DEBUG_TRACING_MODE_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_FRAGMENT_TYPE: {
              renderNodeDestructive(request, task, props.children);
              return;
            }
            case REACT_SUSPENSE_LIST_TYPE: {
              pushBuiltInComponentStackInDEV(task, "SuspenseList");
              renderNodeDestructive(request, task, props.children);
              popComponentStackInDEV(task);
              return;
            }
            case REACT_SCOPE_TYPE: {
              throw new Error("ReactDOMServer does not yet support scope components.");
            }
            case REACT_SUSPENSE_TYPE: {
              {
                renderSuspenseBoundary(request, task, props);
              }
              return;
            }
          }
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE: {
                renderForwardRef(request, task, type, props, ref);
                return;
              }
              case REACT_MEMO_TYPE: {
                renderMemo(request, task, type, props, ref);
                return;
              }
              case REACT_PROVIDER_TYPE: {
                renderContextProvider(request, task, type, props);
                return;
              }
              case REACT_CONTEXT_TYPE: {
                renderContextConsumer(request, task, type, props);
                return;
              }
              case REACT_LAZY_TYPE: {
                renderLazyComponent(request, task, type, props);
                return;
              }
            }
          }
          var info = "";
          {
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
          }
          throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
        }
        function validateIterable(iterable, iteratorFn) {
          {
            if (typeof Symbol === "function" && iterable[Symbol.toStringTag] === "Generator") {
              if (!didWarnAboutGenerators) {
                error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
              }
              didWarnAboutGenerators = true;
            }
            if (iterable.entries === iteratorFn) {
              if (!didWarnAboutMaps) {
                error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
              }
              didWarnAboutMaps = true;
            }
          }
        }
        function renderNodeDestructive(request, task, node) {
          {
            try {
              return renderNodeDestructiveImpl(request, task, node);
            } catch (x) {
              if (typeof x === "object" && x !== null && typeof x.then === "function")
                ;
              else {
                lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
              }
              throw x;
            }
          }
        }
        function renderNodeDestructiveImpl(request, task, node) {
          task.node = node;
          if (typeof node === "object" && node !== null) {
            switch (node.$$typeof) {
              case REACT_ELEMENT_TYPE: {
                var element = node;
                var type = element.type;
                var props = element.props;
                var ref = element.ref;
                renderElement(request, task, type, props, ref);
                return;
              }
              case REACT_PORTAL_TYPE:
                throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
              case REACT_LAZY_TYPE: {
                var lazyNode = node;
                var payload = lazyNode._payload;
                var init = lazyNode._init;
                var resolvedNode;
                {
                  try {
                    resolvedNode = init(payload);
                  } catch (x) {
                    if (typeof x === "object" && x !== null && typeof x.then === "function") {
                      pushBuiltInComponentStackInDEV(task, "Lazy");
                    }
                    throw x;
                  }
                }
                renderNodeDestructive(request, task, resolvedNode);
                return;
              }
            }
            if (isArray(node)) {
              renderChildrenArray(request, task, node);
              return;
            }
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
              {
                validateIterable(node, iteratorFn);
              }
              var iterator = iteratorFn.call(node);
              if (iterator) {
                var step = iterator.next();
                if (!step.done) {
                  var children = [];
                  do {
                    children.push(step.value);
                    step = iterator.next();
                  } while (!step.done);
                  renderChildrenArray(request, task, children);
                  return;
                }
                return;
              }
            }
            var childString = Object.prototype.toString.call(node);
            throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
          }
          if (typeof node === "string") {
            var segment = task.blockedSegment;
            segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
            return;
          }
          if (typeof node === "number") {
            var _segment = task.blockedSegment;
            _segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
            return;
          }
          {
            if (typeof node === "function") {
              error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
            }
          }
        }
        function renderChildrenArray(request, task, children) {
          var totalChildren = children.length;
          for (var i = 0; i < totalChildren; i++) {
            var prevTreeContext = task.treeContext;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
            try {
              renderNode(request, task, children[i]);
            } finally {
              task.treeContext = prevTreeContext;
            }
          }
        }
        function spawnNewSuspendedTask(request, task, x) {
          var segment = task.blockedSegment;
          var insertionIndex = segment.chunks.length;
          var newSegment = createPendingSegment(
            request,
            insertionIndex,
            null,
            segment.formatContext,
            segment.lastPushedText,
            true
          );
          segment.children.push(newSegment);
          segment.lastPushedText = false;
          var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
          {
            if (task.componentStack !== null) {
              newTask.componentStack = task.componentStack.parent;
            }
          }
          var ping = newTask.ping;
          x.then(ping, ping);
        }
        function renderNode(request, task, node) {
          var previousFormatContext = task.blockedSegment.formatContext;
          var previousLegacyContext = task.legacyContext;
          var previousContext = task.context;
          var previousComponentStack = null;
          {
            previousComponentStack = task.componentStack;
          }
          try {
            return renderNodeDestructive(request, task, node);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              spawnNewSuspendedTask(request, task, x);
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              return;
            } else {
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              throw x;
            }
          }
        }
        function erroredTask(request, boundary, segment, error2) {
          var errorDigest = logRecoverableError(request, error2);
          if (boundary === null) {
            fatalError(request, error2);
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              boundary.errorDigest = errorDigest;
              {
                captureBoundaryErrorDetailsDev(boundary, error2);
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function abortTaskSoft(task) {
          var request = this;
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          finishedTask(request, boundary, segment);
        }
        function abortTask(task, request, reason) {
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          if (boundary === null) {
            request.allPendingTasks--;
            if (request.status !== CLOSED) {
              request.status = CLOSED;
              if (request.destination !== null) {
                close(request.destination);
              }
            }
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
              boundary.errorDigest = request.onError(_error);
              {
                var errorPrefix = "The server did not finish this Suspense boundary: ";
                if (_error && typeof _error.message === "string") {
                  _error = errorPrefix + _error.message;
                } else {
                  _error = errorPrefix + String(_error);
                }
                var previousTaskInDev = currentTaskInDEV;
                currentTaskInDEV = task;
                try {
                  captureBoundaryErrorDetailsDev(boundary, _error);
                } finally {
                  currentTaskInDEV = previousTaskInDev;
                }
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return abortTask(fallbackTask, request, reason);
            });
            boundary.fallbackAbortableTasks.clear();
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
        }
        function queueCompletedSegment(boundary, segment) {
          if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
            var childSegment = segment.children[0];
            childSegment.id = segment.id;
            childSegment.parentFlushed = true;
            if (childSegment.status === COMPLETED) {
              queueCompletedSegment(boundary, childSegment);
            }
          } else {
            var completedSegments = boundary.completedSegments;
            completedSegments.push(segment);
          }
        }
        function finishedTask(request, boundary, segment) {
          if (boundary === null) {
            if (segment.parentFlushed) {
              if (request.completedRootSegment !== null) {
                throw new Error("There can only be one root segment. This is a bug in React.");
              }
              request.completedRootSegment = segment;
            }
            request.pendingRootTasks--;
            if (request.pendingRootTasks === 0) {
              request.onShellError = noop$1;
              var onShellReady = request.onShellReady;
              onShellReady();
            }
          } else {
            boundary.pendingTasks--;
            if (boundary.forceClientRender)
              ;
            else if (boundary.pendingTasks === 0) {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                }
              }
              if (boundary.parentFlushed) {
                request.completedBoundaries.push(boundary);
              }
              boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
              boundary.fallbackAbortableTasks.clear();
            } else {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                  var completedSegments = boundary.completedSegments;
                  if (completedSegments.length === 1) {
                    if (boundary.parentFlushed) {
                      request.partialBoundaries.push(boundary);
                    }
                  }
                }
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function retryTask(request, task) {
          var segment = task.blockedSegment;
          if (segment.status !== PENDING) {
            return;
          }
          switchContext(task.context);
          var prevTaskInDEV = null;
          {
            prevTaskInDEV = currentTaskInDEV;
            currentTaskInDEV = task;
          }
          try {
            renderNodeDestructive(request, task, task.node);
            pushSegmentFinale(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
            task.abortSet.delete(task);
            segment.status = COMPLETED;
            finishedTask(request, task.blockedBoundary, segment);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              var ping = task.ping;
              x.then(ping, ping);
            } else {
              task.abortSet.delete(task);
              segment.status = ERRORED;
              erroredTask(request, task.blockedBoundary, segment, x);
            }
          } finally {
            {
              currentTaskInDEV = prevTaskInDEV;
            }
          }
        }
        function performWork(request) {
          if (request.status === CLOSED) {
            return;
          }
          var prevContext = getActiveContext();
          var prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = Dispatcher;
          var prevGetCurrentStackImpl;
          {
            prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
            ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
          }
          var prevResponseState = currentResponseState;
          setCurrentResponseState(request.responseState);
          try {
            var pingedTasks = request.pingedTasks;
            var i;
            for (i = 0; i < pingedTasks.length; i++) {
              var task = pingedTasks[i];
              retryTask(request, task);
            }
            pingedTasks.splice(0, i);
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          } finally {
            setCurrentResponseState(prevResponseState);
            ReactCurrentDispatcher$1.current = prevDispatcher;
            {
              ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
            }
            if (prevDispatcher === Dispatcher) {
              switchContext(prevContext);
            }
          }
        }
        function flushSubtree(request, destination, segment) {
          segment.parentFlushed = true;
          switch (segment.status) {
            case PENDING: {
              var segmentID = segment.id = request.nextSegmentId++;
              segment.lastPushedText = false;
              segment.textEmbedded = false;
              return writePlaceholder(destination, request.responseState, segmentID);
            }
            case COMPLETED: {
              segment.status = FLUSHED;
              var r = true;
              var chunks = segment.chunks;
              var chunkIdx = 0;
              var children = segment.children;
              for (var childIdx = 0; childIdx < children.length; childIdx++) {
                var nextChild = children[childIdx];
                for (; chunkIdx < nextChild.index; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                r = flushSegment(request, destination, nextChild);
              }
              for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              if (chunkIdx < chunks.length) {
                r = writeChunkAndReturn(destination, chunks[chunkIdx]);
              }
              return r;
            }
            default: {
              throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
            }
          }
        }
        function flushSegment(request, destination, segment) {
          var boundary = segment.boundary;
          if (boundary === null) {
            return flushSubtree(request, destination, segment);
          }
          boundary.parentFlushed = true;
          if (boundary.forceClientRender) {
            writeStartClientRenderedSuspenseBoundary(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
            flushSubtree(request, destination, segment);
            return writeEndClientRenderedSuspenseBoundary(destination, request.responseState);
          } else if (boundary.pendingTasks > 0) {
            boundary.rootSegmentID = request.nextSegmentId++;
            if (boundary.completedSegments.length > 0) {
              request.partialBoundaries.push(boundary);
            }
            var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
            writeStartPendingSuspenseBoundary(destination, request.responseState, id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else if (boundary.byteSize > request.progressiveChunkSize) {
            boundary.rootSegmentID = request.nextSegmentId++;
            request.completedBoundaries.push(boundary);
            writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else {
            writeStartCompletedSuspenseBoundary(destination, request.responseState);
            var completedSegments = boundary.completedSegments;
            if (completedSegments.length !== 1) {
              throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
            }
            var contentSegment = completedSegments[0];
            flushSegment(request, destination, contentSegment);
            return writeEndCompletedSuspenseBoundary(destination, request.responseState);
          }
        }
        function flushClientRenderedBoundary(request, destination, boundary) {
          return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
        }
        function flushSegmentContainer(request, destination, segment) {
          writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
          flushSegment(request, destination, segment);
          return writeEndSegment(destination, segment.formatContext);
        }
        function flushCompletedBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            flushPartiallyCompletedSegment(request, destination, boundary, segment);
          }
          completedSegments.length = 0;
          return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
        }
        function flushPartialBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
              i++;
              completedSegments.splice(0, i);
              return false;
            }
          }
          completedSegments.splice(0, i);
          return true;
        }
        function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
          if (segment.status === FLUSHED) {
            return true;
          }
          var segmentID = segment.id;
          if (segmentID === -1) {
            var rootSegmentID = segment.id = boundary.rootSegmentID;
            if (rootSegmentID === -1) {
              throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
            }
            return flushSegmentContainer(request, destination, segment);
          } else {
            flushSegmentContainer(request, destination, segment);
            return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
          }
        }
        function flushCompletedQueues(request, destination) {
          beginWriting();
          try {
            var completedRootSegment = request.completedRootSegment;
            if (completedRootSegment !== null && request.pendingRootTasks === 0) {
              flushSegment(request, destination, completedRootSegment);
              request.completedRootSegment = null;
              writeCompletedRoot(destination, request.responseState);
            }
            var clientRenderedBoundaries = request.clientRenderedBoundaries;
            var i;
            for (i = 0; i < clientRenderedBoundaries.length; i++) {
              var boundary = clientRenderedBoundaries[i];
              if (!flushClientRenderedBoundary(request, destination, boundary)) {
                request.destination = null;
                i++;
                clientRenderedBoundaries.splice(0, i);
                return;
              }
            }
            clientRenderedBoundaries.splice(0, i);
            var completedBoundaries = request.completedBoundaries;
            for (i = 0; i < completedBoundaries.length; i++) {
              var _boundary = completedBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary)) {
                request.destination = null;
                i++;
                completedBoundaries.splice(0, i);
                return;
              }
            }
            completedBoundaries.splice(0, i);
            completeWriting(destination);
            beginWriting(destination);
            var partialBoundaries = request.partialBoundaries;
            for (i = 0; i < partialBoundaries.length; i++) {
              var _boundary2 = partialBoundaries[i];
              if (!flushPartialBoundary(request, destination, _boundary2)) {
                request.destination = null;
                i++;
                partialBoundaries.splice(0, i);
                return;
              }
            }
            partialBoundaries.splice(0, i);
            var largeBoundaries = request.completedBoundaries;
            for (i = 0; i < largeBoundaries.length; i++) {
              var _boundary3 = largeBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary3)) {
                request.destination = null;
                i++;
                largeBoundaries.splice(0, i);
                return;
              }
            }
            largeBoundaries.splice(0, i);
          } finally {
            completeWriting(destination);
            if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
              {
                if (request.abortableTasks.size !== 0) {
                  error("There was still abortable task at the root when we closed. This is a bug in React.");
                }
              }
              close(destination);
            }
          }
        }
        function startWork(request) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
        function startFlowing(request, destination) {
          if (request.status === CLOSING) {
            request.status = CLOSED;
            closeWithError(destination, request.fatalError);
            return;
          }
          if (request.status === CLOSED) {
            return;
          }
          if (request.destination !== null) {
            return;
          }
          request.destination = destination;
          try {
            flushCompletedQueues(request, destination);
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function abort(request, reason) {
          try {
            var abortableTasks = request.abortableTasks;
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, reason);
            });
            abortableTasks.clear();
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function renderToReadableStream2(children, options) {
          return new Promise(function(resolve, reject) {
            var onFatalError;
            var onAllReady;
            var allReady = new Promise(function(res, rej) {
              onAllReady = res;
              onFatalError = rej;
            });
            function onShellReady() {
              var stream = new ReadableStream(
                {
                  type: "bytes",
                  pull: function(controller) {
                    startFlowing(request, controller);
                  },
                  cancel: function(reason) {
                    abort(request);
                  }
                },
                {
                  highWaterMark: 0
                }
              );
              stream.allReady = allReady;
              resolve(stream);
            }
            function onShellError(error2) {
              allReady.catch(function() {
              });
              reject(error2);
            }
            var request = createRequest(children, createResponseState(options ? options.identifierPrefix : void 0, options ? options.nonce : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, onAllReady, onShellReady, onShellError, onFatalError);
            if (options && options.signal) {
              var signal = options.signal;
              var listener = function() {
                abort(request, signal.reason);
                signal.removeEventListener("abort", listener);
              };
              signal.addEventListener("abort", listener);
            }
            startWork(request);
          });
        }
        exports.renderToReadableStream = renderToReadableStream2;
        exports.version = ReactVersion;
      })();
    }
  }
});

// node_modules/react-dom/server.browser.js
var require_server_browser = __commonJS({
  "node_modules/react-dom/server.browser.js"(exports) {
    "use strict";
    var l;
    var s;
    if (false) {
      l = null;
      s = null;
    } else {
      l = require_react_dom_server_legacy_browser_development();
      s = require_react_dom_server_browser_development();
    }
    exports.version = l.version;
    exports.renderToString = l.renderToString;
    exports.renderToStaticMarkup = l.renderToStaticMarkup;
    exports.renderToNodeStream = l.renderToNodeStream;
    exports.renderToStaticNodeStream = l.renderToStaticNodeStream;
    exports.renderToReadableStream = s.renderToReadableStream;
  }
});

// node_modules/react/cjs/react-jsx-dev-runtime.development.js
var require_react_jsx_dev_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-dev-runtime.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React5 = require_react();
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        var didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config, self2) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && self2 && ReactCurrentOwner.current.stateNode !== self2) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        var ReactElement = function(type, key, ref, self2, source, owner, props) {
          var element = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            ref,
            props,
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function jsxDEV5(type, config, maybeKey, source, self2) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self2);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function jsxWithValidation(type, props, key, isStaticChildren, source, self2) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum(source);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV5(type, props, key, source, self2);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        var jsxDEV$1 = jsxWithValidation;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsxDEV = jsxDEV$1;
      })();
    }
  }
});

// node_modules/react/jsx-dev-runtime.js
var require_jsx_dev_runtime = __commonJS({
  "node_modules/react/jsx-dev-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_dev_runtime_development();
    }
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse;
    exports.serialize = serialize;
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var pairs = str.split(";");
      var dec = opt.decode || decode;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var index = pair.indexOf("=");
        if (index < 0) {
          continue;
        }
        var key = pair.substring(0, index).trim();
        if (void 0 == obj[key]) {
          var val = pair.substring(index + 1, pair.length).trim();
          if (val[0] === '"') {
            val = val.slice(1, -1);
          }
          obj[key] = tryDecode(val, dec);
        }
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== "function") {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// node_modules/@remix-run/server-runtime/dist/warnings.js
var require_warnings = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/warnings.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var alreadyWarned = {};
    function warnOnce(condition, message) {
      if (!condition && !alreadyWarned[message]) {
        alreadyWarned[message] = true;
        console.warn(message);
      }
    }
    exports.warnOnce = warnOnce;
  }
});

// node_modules/@remix-run/server-runtime/dist/cookies.js
var require_cookies = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/cookies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cookie = require_cookie();
    var warnings = require_warnings();
    var createCookieFactory = ({
      sign,
      unsign
    }) => (name, cookieOptions = {}) => {
      let {
        secrets,
        ...options
      } = {
        secrets: [],
        path: "/",
        sameSite: "lax",
        ...cookieOptions
      };
      warnOnceAboutExpiresCookie(name, options.expires);
      return {
        get name() {
          return name;
        },
        get isSigned() {
          return secrets.length > 0;
        },
        get expires() {
          return typeof options.maxAge !== "undefined" ? new Date(Date.now() + options.maxAge * 1e3) : options.expires;
        },
        async parse(cookieHeader, parseOptions) {
          if (!cookieHeader)
            return null;
          let cookies = cookie.parse(cookieHeader, {
            ...options,
            ...parseOptions
          });
          return name in cookies ? cookies[name] === "" ? "" : await decodeCookieValue(unsign, cookies[name], secrets) : null;
        },
        async serialize(value, serializeOptions) {
          return cookie.serialize(name, value === "" ? "" : await encodeCookieValue(sign, value, secrets), {
            ...options,
            ...serializeOptions
          });
        }
      };
    };
    var isCookie = (object) => {
      return object != null && typeof object.name === "string" && typeof object.isSigned === "boolean" && typeof object.parse === "function" && typeof object.serialize === "function";
    };
    async function encodeCookieValue(sign, value, secrets) {
      let encoded = encodeData(value);
      if (secrets.length > 0) {
        encoded = await sign(encoded, secrets[0]);
      }
      return encoded;
    }
    async function decodeCookieValue(unsign, value, secrets) {
      if (secrets.length > 0) {
        for (let secret of secrets) {
          let unsignedValue = await unsign(value, secret);
          if (unsignedValue !== false) {
            return decodeData(unsignedValue);
          }
        }
        return null;
      }
      return decodeData(value);
    }
    function encodeData(value) {
      return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))));
    }
    function decodeData(value) {
      try {
        return JSON.parse(decodeURIComponent(myEscape(atob(value))));
      } catch (error) {
        return {};
      }
    }
    function myEscape(value) {
      let str = value.toString();
      let result = "";
      let index = 0;
      let chr, code;
      while (index < str.length) {
        chr = str.charAt(index++);
        if (/[\w*+\-./@]/.exec(chr)) {
          result += chr;
        } else {
          code = chr.charCodeAt(0);
          if (code < 256) {
            result += "%" + hex(code, 2);
          } else {
            result += "%u" + hex(code, 4).toUpperCase();
          }
        }
      }
      return result;
    }
    function hex(code, length) {
      let result = code.toString(16);
      while (result.length < length)
        result = "0" + result;
      return result;
    }
    function myUnescape(value) {
      let str = value.toString();
      let result = "";
      let index = 0;
      let chr, part;
      while (index < str.length) {
        chr = str.charAt(index++);
        if (chr === "%") {
          if (str.charAt(index) === "u") {
            part = str.slice(index + 1, index + 5);
            if (/^[\da-f]{4}$/i.exec(part)) {
              result += String.fromCharCode(parseInt(part, 16));
              index += 5;
              continue;
            }
          } else {
            part = str.slice(index, index + 2);
            if (/^[\da-f]{2}$/i.exec(part)) {
              result += String.fromCharCode(parseInt(part, 16));
              index += 2;
              continue;
            }
          }
        }
        result += chr;
      }
      return result;
    }
    function warnOnceAboutExpiresCookie(name, expires) {
      warnings.warnOnce(!expires, `The "${name}" cookie has an "expires" property set. This will cause the expires value to not be updated when the session is committed. Instead, you should set the expires value when serializing the cookie. You can use \`commitSession(session, { expires })\` if using a session storage object, or \`cookie.serialize("value", { expires })\` if you're using the cookie directly.`);
    }
    exports.createCookieFactory = createCookieFactory;
    exports.isCookie = isCookie;
  }
});

// node_modules/@web3-storage/multipart-parser/esm/src/utils.js
function stringToArray(s) {
  const utf8 = unescape(encodeURIComponent(s));
  return Uint8Array.from(utf8, (_, i) => utf8.charCodeAt(i));
}
function arrayToString(a) {
  const utf8 = String.fromCharCode.apply(null, a);
  return decodeURIComponent(escape(utf8));
}
function mergeArrays(...arrays) {
  const out = new Uint8Array(arrays.reduce((total, arr) => total + arr.length, 0));
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}
function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
var init_utils = __esm({
  "node_modules/@web3-storage/multipart-parser/esm/src/utils.js"() {
  }
});

// node_modules/@web3-storage/multipart-parser/esm/src/search.js
function coerce(a) {
  if (a instanceof Uint8Array) {
    return (index) => a[index];
  }
  return a;
}
function jsmemcmp(buf1, pos1, buf2, pos2, len) {
  const fn1 = coerce(buf1);
  const fn2 = coerce(buf2);
  for (let i = 0; i < len; ++i) {
    if (fn1(pos1 + i) !== fn2(pos2 + i)) {
      return false;
    }
  }
  return true;
}
function createOccurenceTable(s) {
  const table = new Array(256).fill(s.length);
  if (s.length > 1) {
    for (let i = 0; i < s.length - 1; i++) {
      table[s[i]] = s.length - 1 - i;
    }
  }
  return table;
}
var MATCH, StreamSearch, ReadableStreamSearch, EOQ, QueueableStreamSearch;
var init_search = __esm({
  "node_modules/@web3-storage/multipart-parser/esm/src/search.js"() {
    init_utils();
    MATCH = Symbol("Match");
    StreamSearch = class {
      constructor(needle) {
        this._lookbehind = new Uint8Array();
        if (typeof needle === "string") {
          this._needle = needle = stringToArray(needle);
        } else {
          this._needle = needle;
        }
        this._lastChar = needle[needle.length - 1];
        this._occ = createOccurenceTable(needle);
      }
      feed(chunk) {
        let pos = 0;
        let tokens;
        const allTokens = [];
        while (pos !== chunk.length) {
          ;
          [pos, ...tokens] = this._feed(chunk, pos);
          allTokens.push(...tokens);
        }
        return allTokens;
      }
      end() {
        const tail = this._lookbehind;
        this._lookbehind = new Uint8Array();
        return tail;
      }
      _feed(data, bufPos) {
        const tokens = [];
        let pos = -this._lookbehind.length;
        if (pos < 0) {
          while (pos < 0 && pos <= data.length - this._needle.length) {
            const ch = this._charAt(data, pos + this._needle.length - 1);
            if (ch === this._lastChar && this._memcmp(data, pos, this._needle.length - 1)) {
              if (pos > -this._lookbehind.length) {
                tokens.push(this._lookbehind.slice(0, this._lookbehind.length + pos));
              }
              tokens.push(MATCH);
              this._lookbehind = new Uint8Array();
              return [
                pos + this._needle.length,
                ...tokens
              ];
            } else {
              pos += this._occ[ch];
            }
          }
          if (pos < 0) {
            while (pos < 0 && !this._memcmp(data, pos, data.length - pos)) {
              pos++;
            }
          }
          if (pos >= 0) {
            tokens.push(this._lookbehind);
            this._lookbehind = new Uint8Array();
          } else {
            const bytesToCutOff = this._lookbehind.length + pos;
            if (bytesToCutOff > 0) {
              tokens.push(this._lookbehind.slice(0, bytesToCutOff));
              this._lookbehind = this._lookbehind.slice(bytesToCutOff);
            }
            this._lookbehind = Uint8Array.from(new Array(this._lookbehind.length + data.length), (_, i) => this._charAt(data, i - this._lookbehind.length));
            return [
              data.length,
              ...tokens
            ];
          }
        }
        pos += bufPos;
        while (pos <= data.length - this._needle.length) {
          const ch = data[pos + this._needle.length - 1];
          if (ch === this._lastChar && data[pos] === this._needle[0] && jsmemcmp(this._needle, 0, data, pos, this._needle.length - 1)) {
            if (pos > bufPos) {
              tokens.push(data.slice(bufPos, pos));
            }
            tokens.push(MATCH);
            return [
              pos + this._needle.length,
              ...tokens
            ];
          } else {
            pos += this._occ[ch];
          }
        }
        if (pos < data.length) {
          while (pos < data.length && (data[pos] !== this._needle[0] || !jsmemcmp(data, pos, this._needle, 0, data.length - pos))) {
            ++pos;
          }
          if (pos < data.length) {
            this._lookbehind = data.slice(pos);
          }
        }
        if (pos > 0) {
          tokens.push(data.slice(bufPos, pos < data.length ? pos : data.length));
        }
        return [
          data.length,
          ...tokens
        ];
      }
      _charAt(data, pos) {
        if (pos < 0) {
          return this._lookbehind[this._lookbehind.length + pos];
        }
        return data[pos];
      }
      _memcmp(data, pos, len) {
        return jsmemcmp(this._charAt.bind(this, data), pos, this._needle, 0, len);
      }
    };
    ReadableStreamSearch = class {
      constructor(needle, _readableStream) {
        this._readableStream = _readableStream;
        this._search = new StreamSearch(needle);
      }
      async *[Symbol.asyncIterator]() {
        const reader = this._readableStream.getReader();
        try {
          while (true) {
            const result = await reader.read();
            if (result.done) {
              break;
            }
            yield* this._search.feed(result.value);
          }
          const tail = this._search.end();
          if (tail.length) {
            yield tail;
          }
        } finally {
          reader.releaseLock();
        }
      }
    };
    EOQ = Symbol("End of Queue");
    QueueableStreamSearch = class {
      constructor(needle) {
        this._chunksQueue = [];
        this._closed = false;
        this._search = new StreamSearch(needle);
      }
      push(...chunks) {
        if (this._closed) {
          throw new Error("cannot call push after close");
        }
        this._chunksQueue.push(...chunks);
        if (this._notify) {
          this._notify();
        }
      }
      close() {
        if (this._closed) {
          throw new Error("close was already called");
        }
        this._closed = true;
        this._chunksQueue.push(EOQ);
        if (this._notify) {
          this._notify();
        }
      }
      async *[Symbol.asyncIterator]() {
        while (true) {
          let chunk;
          while (!(chunk = this._chunksQueue.shift())) {
            await new Promise((resolve) => this._notify = resolve);
            this._notify = void 0;
          }
          if (chunk === EOQ) {
            break;
          }
          yield* this._search.feed(chunk);
        }
        const tail = this._search.end();
        if (tail.length) {
          yield tail;
        }
      }
    };
  }
});

// node_modules/@web3-storage/multipart-parser/esm/src/index.js
var src_exports = {};
__export(src_exports, {
  iterateMultipart: () => iterateMultipart,
  streamMultipart: () => streamMultipart
});
function parseContentDisposition(header) {
  const parts = header.split(";").map((part) => part.trim());
  if (parts.shift() !== "form-data") {
    throw new Error('malformed content-disposition header: missing "form-data" in `' + JSON.stringify(parts) + "`");
  }
  const out = {};
  for (const part of parts) {
    const kv = part.split("=", 2);
    if (kv.length !== 2) {
      throw new Error("malformed content-disposition header: key-value pair not found - " + part + " in `" + header + "`");
    }
    const [name, value] = kv;
    if (value[0] === '"' && value[value.length - 1] === '"') {
      out[name] = value.slice(1, -1).replace(/\\"/g, '"');
    } else if (value[0] !== '"' && value[value.length - 1] !== '"') {
      out[name] = value;
    } else if (value[0] === '"' && value[value.length - 1] !== '"' || value[0] !== '"' && value[value.length - 1] === '"') {
      throw new Error("malformed content-disposition header: mismatched quotations in `" + header + "`");
    }
  }
  if (!out.name) {
    throw new Error("malformed content-disposition header: missing field name in `" + header + "`");
  }
  return out;
}
function parsePartHeaders(lines) {
  const entries = [];
  let disposition = false;
  let line;
  while (typeof (line = lines.shift()) !== "undefined") {
    const colon = line.indexOf(":");
    if (colon === -1) {
      throw new Error("malformed multipart-form header: missing colon");
    }
    const header = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    switch (header) {
      case "content-disposition":
        disposition = true;
        entries.push(...Object.entries(parseContentDisposition(value)));
        break;
      case "content-type":
        entries.push([
          "contentType",
          value
        ]);
    }
  }
  if (!disposition) {
    throw new Error("malformed multipart-form header: missing content-disposition");
  }
  return Object.fromEntries(entries);
}
async function readHeaderLines(it, needle) {
  let firstChunk = true;
  let lastTokenWasMatch = false;
  const headerLines = [[]];
  const crlfSearch = new StreamSearch(CRLF);
  for (; ; ) {
    const result = await it.next();
    if (result.done) {
      throw new Error("malformed multipart-form data: unexpected end of stream");
    }
    if (firstChunk && result.value !== MATCH && arraysEqual(result.value.slice(0, 2), dash)) {
      return [
        void 0,
        new Uint8Array()
      ];
    }
    let chunk;
    if (result.value !== MATCH) {
      chunk = result.value;
    } else if (!lastTokenWasMatch) {
      chunk = needle;
    } else {
      throw new Error("malformed multipart-form data: unexpected boundary");
    }
    if (!chunk.length) {
      continue;
    }
    if (firstChunk) {
      firstChunk = false;
    }
    const tokens = crlfSearch.feed(chunk);
    for (const [i, token] of tokens.entries()) {
      const isMatch = token === MATCH;
      if (!isMatch && !token.length) {
        continue;
      }
      if (lastTokenWasMatch && isMatch) {
        tokens.push(crlfSearch.end());
        return [
          headerLines.filter((chunks) => chunks.length).map(mergeArrays2).map(arrayToString),
          mergeArrays(...tokens.slice(i + 1).map((token2) => token2 === MATCH ? CRLF : token2))
        ];
      }
      if (lastTokenWasMatch = isMatch) {
        headerLines.push([]);
      } else {
        headerLines[headerLines.length - 1].push(token);
      }
    }
  }
}
async function* streamMultipart(body, boundary) {
  const needle = mergeArrays(dash, stringToArray(boundary));
  const it = new ReadableStreamSearch(needle, body)[Symbol.asyncIterator]();
  for (; ; ) {
    const result = await it.next();
    if (result.done) {
      return;
    }
    if (result.value === MATCH) {
      break;
    }
  }
  const crlfSearch = new StreamSearch(CRLF);
  for (; ; ) {
    let feedChunk = function(chunk) {
      const chunks = [];
      for (const token of crlfSearch.feed(chunk)) {
        if (trailingCRLF) {
          chunks.push(CRLF);
        }
        if (!(trailingCRLF = token === MATCH)) {
          chunks.push(token);
        }
      }
      return mergeArrays(...chunks);
    };
    const [headerLines, tail] = await readHeaderLines(it, needle);
    if (!headerLines) {
      return;
    }
    async function nextToken() {
      const result = await it.next();
      if (result.done) {
        throw new Error("malformed multipart-form data: unexpected end of stream");
      }
      return result;
    }
    let trailingCRLF = false;
    let done = false;
    async function nextChunk() {
      const result = await nextToken();
      let chunk;
      if (result.value !== MATCH) {
        chunk = result.value;
      } else if (!trailingCRLF) {
        chunk = CRLF;
      } else {
        done = true;
        return { value: crlfSearch.end() };
      }
      return { value: feedChunk(chunk) };
    }
    const bufferedChunks = [{ value: feedChunk(tail) }];
    yield {
      ...parsePartHeaders(headerLines),
      data: {
        [Symbol.asyncIterator]() {
          return this;
        },
        async next() {
          for (; ; ) {
            const result = bufferedChunks.shift();
            if (!result) {
              break;
            }
            if (result.value.length > 0) {
              return result;
            }
          }
          for (; ; ) {
            if (done) {
              return {
                done,
                value: void 0
              };
            }
            const result = await nextChunk();
            if (result.value.length > 0) {
              return result;
            }
          }
        }
      }
    };
    while (!done) {
      bufferedChunks.push(await nextChunk());
    }
  }
}
async function* iterateMultipart(body, boundary) {
  for await (const part of streamMultipart(body, boundary)) {
    const chunks = [];
    for await (const chunk of part.data) {
      chunks.push(chunk);
    }
    yield {
      ...part,
      data: mergeArrays(...chunks)
    };
  }
}
var mergeArrays2, dash, CRLF;
var init_src = __esm({
  "node_modules/@web3-storage/multipart-parser/esm/src/index.js"() {
    init_search();
    init_utils();
    mergeArrays2 = Function.prototype.apply.bind(mergeArrays, void 0);
    dash = stringToArray("--");
    CRLF = stringToArray("\r\n");
  }
});

// node_modules/@remix-run/server-runtime/dist/formData.js
var require_formData = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/formData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var multipartParser = (init_src(), __toCommonJS(src_exports));
    function composeUploadHandlers(...handlers) {
      return async (part) => {
        for (let handler of handlers) {
          let value = await handler(part);
          if (typeof value !== "undefined" && value !== null) {
            return value;
          }
        }
        return void 0;
      };
    }
    async function parseMultipartFormData(request, uploadHandler) {
      let contentType = request.headers.get("Content-Type") || "";
      let [type, boundary] = contentType.split(/\s*;\s*boundary=/);
      if (!request.body || !boundary || type !== "multipart/form-data") {
        throw new TypeError("Could not parse content as FormData.");
      }
      let formData = new FormData();
      let parts = multipartParser.streamMultipart(request.body, boundary);
      for await (let part of parts) {
        if (part.done)
          break;
        if (typeof part.filename === "string") {
          part.filename = part.filename.split(/[/\\]/).pop();
        }
        let value = await uploadHandler(part);
        if (typeof value !== "undefined" && value !== null) {
          formData.append(part.name, value);
        }
      }
      return formData;
    }
    exports.composeUploadHandlers = composeUploadHandlers;
    exports.parseMultipartFormData = parseMultipartFormData;
  }
});

// node_modules/@remix-run/server-runtime/dist/responses.js
var require_responses = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/responses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var json = (data, init = {}) => {
      let responseInit = typeof init === "number" ? {
        status: init
      } : init;
      let headers = new Headers(responseInit.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), {
        ...responseInit,
        headers
      });
    };
    var redirect = (url, init = 302) => {
      let responseInit = init;
      if (typeof responseInit === "number") {
        responseInit = {
          status: responseInit
        };
      } else if (typeof responseInit.status === "undefined") {
        responseInit.status = 302;
      }
      let headers = new Headers(responseInit.headers);
      headers.set("Location", url);
      return new Response(null, {
        ...responseInit,
        headers
      });
    };
    function isResponse(value) {
      return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
    }
    var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    function isRedirectResponse2(response) {
      return redirectStatusCodes.has(response.status);
    }
    function isCatchResponse2(response) {
      return response.headers.get("X-Remix-Catch") != null;
    }
    exports.isCatchResponse = isCatchResponse2;
    exports.isRedirectResponse = isRedirectResponse2;
    exports.isResponse = isResponse;
    exports.json = json;
    exports.redirect = redirect;
  }
});

// node_modules/@remix-run/server-runtime/dist/data.js
var require_data = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/data.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var responses = require_responses();
    async function callRouteAction({
      loadContext,
      routeId,
      action,
      params,
      request
    }) {
      if (!action) {
        let response = new Response(null, {
          status: 405
        });
        response.headers.set("X-Remix-Catch", "yes");
        return response;
      }
      let result;
      try {
        result = await action({
          request: stripDataParam(stripIndexParam(request)),
          context: loadContext,
          params
        });
      } catch (error) {
        if (!responses.isResponse(error)) {
          throw error;
        }
        if (!responses.isRedirectResponse(error)) {
          error.headers.set("X-Remix-Catch", "yes");
        }
        result = error;
      }
      if (result === void 0) {
        throw new Error(`You defined an action for route "${routeId}" but didn't return anything from your \`action\` function. Please return a value or \`null\`.`);
      }
      return responses.isResponse(result) ? result : responses.json(result);
    }
    async function callRouteLoader({
      loadContext,
      routeId,
      loader: loader2,
      params,
      request
    }) {
      if (!loader2) {
        throw new Error(`You made a ${request.method} request to ${request.url} but did not provide a default component or \`loader\` for route "${routeId}", so there is no way to handle the request.`);
      }
      let result;
      try {
        result = await loader2({
          request: stripDataParam(stripIndexParam(request)),
          context: loadContext,
          params
        });
      } catch (error) {
        if (!responses.isResponse(error)) {
          throw error;
        }
        if (!responses.isRedirectResponse(error)) {
          error.headers.set("X-Remix-Catch", "yes");
        }
        result = error;
      }
      if (result === void 0) {
        throw new Error(`You defined a loader for route "${routeId}" but didn't return anything from your \`loader\` function. Please return a value or \`null\`.`);
      }
      return responses.isResponse(result) ? result : responses.json(result);
    }
    function stripIndexParam(request) {
      let url = new URL(request.url);
      let indexValues = url.searchParams.getAll("index");
      url.searchParams.delete("index");
      let indexValuesToKeep = [];
      for (let indexValue of indexValues) {
        if (indexValue) {
          indexValuesToKeep.push(indexValue);
        }
      }
      for (let toKeep of indexValuesToKeep) {
        url.searchParams.append("index", toKeep);
      }
      return new Request(url.href, request);
    }
    function stripDataParam(request) {
      let url = new URL(request.url);
      url.searchParams.delete("_data");
      return new Request(url.href, request);
    }
    function extractData2(response) {
      let contentType = response.headers.get("Content-Type");
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        return response.json();
      }
      return response.text();
    }
    exports.callRouteAction = callRouteAction;
    exports.callRouteLoader = callRouteLoader;
    exports.extractData = extractData2;
  }
});

// node_modules/@remix-run/server-runtime/dist/entry.js
var require_entry = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/entry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createEntryMatches(matches, routes2) {
      return matches.map((match) => ({
        params: match.params,
        pathname: match.pathname,
        route: routes2[match.route.id]
      }));
    }
    function createEntryRouteModules(manifest2) {
      return Object.keys(manifest2).reduce((memo, routeId) => {
        memo[routeId] = manifest2[routeId].module;
        return memo;
      }, {});
    }
    exports.createEntryMatches = createEntryMatches;
    exports.createEntryRouteModules = createEntryRouteModules;
  }
});

// node_modules/@remix-run/server-runtime/dist/errors.js
var require_errors = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function serializeError(error) {
      return {
        message: error.message,
        stack: error.stack
      };
    }
    exports.serializeError = serializeError;
  }
});

// node_modules/set-cookie-parser/lib/set-cookie.js
var require_set_cookie = __commonJS({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key === "expires") {
          cookie.expires = new Date(value2);
        } else if (key === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key === "secure") {
          cookie.secure = true;
        } else if (key === "httponly") {
          cookie.httpOnly = true;
        } else if (key === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key] = value2;
        }
      });
      return cookie;
    }
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    function parse(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers && input.headers["set-cookie"]) {
        input = input.headers["set-cookie"];
      } else if (input.headers) {
        var sch = input.headers[Object.keys(input.headers).find(function(key) {
          return key.toLowerCase() === "set-cookie";
        })];
        if (!sch && input.headers.cookie && !options.silent) {
          console.warn(
            "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
          );
        }
        input = sch;
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    module.exports = parse;
    module.exports.parse = parse;
    module.exports.parseString = parseString;
    module.exports.splitCookiesString = splitCookiesString;
  }
});

// node_modules/@remix-run/server-runtime/dist/headers.js
var require_headers = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/headers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var setCookieParser = require_set_cookie();
    function getDocumentHeaders(build, matches, routeLoaderResponses, actionResponse) {
      return matches.reduce((parentHeaders, match, index) => {
        let routeModule = build.routes[match.route.id].module;
        let routeLoaderResponse = routeLoaderResponses[match.route.id];
        let loaderHeaders = routeLoaderResponse ? routeLoaderResponse.headers : new Headers();
        let actionHeaders = actionResponse ? actionResponse.headers : new Headers();
        let headers = new Headers(routeModule.headers ? typeof routeModule.headers === "function" ? routeModule.headers({
          loaderHeaders,
          parentHeaders,
          actionHeaders
        }) : routeModule.headers : void 0);
        prependCookies(actionHeaders, headers);
        prependCookies(loaderHeaders, headers);
        prependCookies(parentHeaders, headers);
        return headers;
      }, new Headers());
    }
    function prependCookies(parentHeaders, childHeaders) {
      let parentSetCookieString = parentHeaders.get("Set-Cookie");
      if (parentSetCookieString) {
        let cookies = setCookieParser.splitCookiesString(parentSetCookieString);
        cookies.forEach((cookie) => {
          childHeaders.append("Set-Cookie", cookie);
        });
      }
    }
    exports.getDocumentHeaders = getDocumentHeaders;
  }
});

// node_modules/@remix-run/server-runtime/dist/mode.js
var require_mode = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/mode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerMode = void 0;
    (function(ServerMode) {
      ServerMode["Development"] = "development";
      ServerMode["Production"] = "production";
      ServerMode["Test"] = "test";
    })(exports.ServerMode || (exports.ServerMode = {}));
    function isServerMode(value) {
      return value === exports.ServerMode.Development || value === exports.ServerMode.Production || value === exports.ServerMode.Test;
    }
    exports.isServerMode = isServerMode;
  }
});

// node_modules/@remix-run/server-runtime/dist/routeMatching.js
var require_routeMatching = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/routeMatching.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var reactRouterDom = require_main3();
    function matchServerRoutes(routes2, pathname) {
      let matches = reactRouterDom.matchRoutes(routes2, pathname);
      if (!matches)
        return null;
      return matches.map((match) => ({
        params: match.params,
        pathname: match.pathname,
        route: match.route
      }));
    }
    exports.matchServerRoutes = matchServerRoutes;
  }
});

// node_modules/@remix-run/server-runtime/dist/routes.js
var require_routes = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/routes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createRoutes(manifest2, parentId) {
      return Object.entries(manifest2).filter(([, route]) => route.parentId === parentId).map(([id, route]) => ({
        ...route,
        children: createRoutes(manifest2, id)
      }));
    }
    exports.createRoutes = createRoutes;
  }
});

// node_modules/@remix-run/server-runtime/dist/markup.js
var require_markup = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/markup.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ESCAPE_LOOKUP = {
      "&": "\\u0026",
      ">": "\\u003e",
      "<": "\\u003c",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
    function escapeHtml(html) {
      return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
    }
    exports.escapeHtml = escapeHtml;
  }
});

// node_modules/@remix-run/server-runtime/dist/serverHandoff.js
var require_serverHandoff = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/serverHandoff.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var markup = require_markup();
    function createServerHandoffString(serverHandoff) {
      return markup.escapeHtml(JSON.stringify(serverHandoff));
    }
    exports.createServerHandoffString = createServerHandoffString;
  }
});

// node_modules/@remix-run/server-runtime/dist/server.js
var require_server = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/server.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var data = require_data();
    var entry2 = require_entry();
    var errors = require_errors();
    var headers = require_headers();
    var mode = require_mode();
    var routeMatching = require_routeMatching();
    var routes2 = require_routes();
    var responses = require_responses();
    var serverHandoff = require_serverHandoff();
    var createRequestHandler2 = (build, mode$1) => {
      let routes$1 = routes2.createRoutes(build.routes);
      let serverMode = mode.isServerMode(mode$1) ? mode$1 : mode.ServerMode.Production;
      return async function requestHandler(request, loadContext = {}) {
        let url = new URL(request.url);
        let matches = routeMatching.matchServerRoutes(routes$1, url.pathname);
        let response;
        if (url.searchParams.has("_data")) {
          let responsePromise = handleDataRequest({
            request,
            loadContext,
            matches,
            serverMode
          });
          let routeId = url.searchParams.get("_data");
          response = await responsePromise;
          if (build.entry.module.handleDataRequest) {
            let match = matches.find((match2) => match2.route.id == routeId);
            response = await build.entry.module.handleDataRequest(response, {
              context: loadContext,
              params: match.params,
              request
            });
          }
        } else if (matches && matches[matches.length - 1].route.module.default == null) {
          let responsePromise = handleResourceRequest({
            request,
            loadContext,
            matches,
            serverMode
          });
          response = await responsePromise;
        } else {
          response = await handleDocumentRequest({
            build,
            loadContext,
            matches,
            request,
            routes: routes$1,
            serverMode
          });
        }
        if (request.method === "HEAD") {
          return new Response(null, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
          });
        }
        return response;
      };
    };
    async function handleDataRequest({
      loadContext,
      matches,
      request,
      serverMode
    }) {
      if (!isValidRequestMethod(request)) {
        return errorBoundaryError(new Error(`Invalid request method "${request.method}"`), 405);
      }
      let url = new URL(request.url);
      if (!matches) {
        return errorBoundaryError(new Error(`No route matches URL "${url.pathname}"`), 404);
      }
      let response;
      let match;
      try {
        if (isActionRequest(request)) {
          match = getRequestMatch(url, matches);
          response = await data.callRouteAction({
            loadContext,
            action: match.route.module.action,
            routeId: match.route.id,
            params: match.params,
            request
          });
        } else {
          let routeId = url.searchParams.get("_data");
          if (!routeId) {
            return errorBoundaryError(new Error(`Missing route id in ?_data`), 403);
          }
          let tempMatch = matches.find((match2) => match2.route.id === routeId);
          if (!tempMatch) {
            return errorBoundaryError(new Error(`Route "${routeId}" does not match URL "${url.pathname}"`), 403);
          }
          match = tempMatch;
          response = await data.callRouteLoader({
            loadContext,
            loader: match.route.module.loader,
            routeId: match.route.id,
            params: match.params,
            request
          });
        }
        if (responses.isRedirectResponse(response)) {
          let headers2 = new Headers(response.headers);
          headers2.set("X-Remix-Redirect", headers2.get("Location"));
          headers2.delete("Location");
          if (response.headers.get("Set-Cookie") !== null) {
            headers2.set("X-Remix-Revalidate", "yes");
          }
          return new Response(null, {
            status: 204,
            headers: headers2
          });
        }
        return response;
      } catch (error) {
        if (serverMode !== mode.ServerMode.Test) {
          console.error(error);
        }
        if (serverMode === mode.ServerMode.Development && error instanceof Error) {
          return errorBoundaryError(error, 500);
        }
        return errorBoundaryError(new Error("Unexpected Server Error"), 500);
      }
    }
    async function handleDocumentRequest({
      build,
      loadContext,
      matches,
      request,
      routes: routes3,
      serverMode
    }) {
      let url = new URL(request.url);
      let appState = {
        trackBoundaries: true,
        trackCatchBoundaries: true,
        catchBoundaryRouteId: null,
        renderBoundaryRouteId: null,
        loaderBoundaryRouteId: null,
        error: void 0,
        catch: void 0
      };
      if (!isValidRequestMethod(request)) {
        matches = null;
        appState.trackCatchBoundaries = false;
        appState.catch = {
          data: null,
          status: 405,
          statusText: "Method Not Allowed"
        };
      } else if (!matches) {
        appState.trackCatchBoundaries = false;
        appState.catch = {
          data: null,
          status: 404,
          statusText: "Not Found"
        };
      }
      let actionStatus;
      let actionData;
      let actionMatch;
      let actionResponse;
      if (matches && isActionRequest(request)) {
        actionMatch = getRequestMatch(url, matches);
        try {
          actionResponse = await data.callRouteAction({
            loadContext,
            action: actionMatch.route.module.action,
            routeId: actionMatch.route.id,
            params: actionMatch.params,
            request
          });
          if (responses.isRedirectResponse(actionResponse)) {
            return actionResponse;
          }
          actionStatus = {
            status: actionResponse.status,
            statusText: actionResponse.statusText
          };
          if (responses.isCatchResponse(actionResponse)) {
            appState.catchBoundaryRouteId = getDeepestRouteIdWithBoundary(matches, "CatchBoundary");
            appState.trackCatchBoundaries = false;
            appState.catch = {
              ...actionStatus,
              data: await data.extractData(actionResponse)
            };
          } else {
            actionData = {
              [actionMatch.route.id]: await data.extractData(actionResponse)
            };
          }
        } catch (error) {
          appState.loaderBoundaryRouteId = getDeepestRouteIdWithBoundary(matches, "ErrorBoundary");
          appState.trackBoundaries = false;
          appState.error = await errors.serializeError(error);
          if (serverMode !== mode.ServerMode.Test) {
            console.error(`There was an error running the action for route ${actionMatch.route.id}`);
          }
        }
      }
      let routeModules = entry2.createEntryRouteModules(build.routes);
      let matchesToLoad = matches || [];
      if (appState.catch) {
        matchesToLoad = getMatchesUpToDeepestBoundary(matchesToLoad, "CatchBoundary").slice(0, -1);
      } else if (appState.error) {
        matchesToLoad = getMatchesUpToDeepestBoundary(matchesToLoad, "ErrorBoundary").slice(0, -1);
      }
      let loaderRequest = new Request(request.url, {
        body: null,
        headers: request.headers,
        method: request.method,
        redirect: request.redirect,
        signal: request.signal
      });
      let routeLoaderResults = await Promise.allSettled(matchesToLoad.map((match) => match.route.module.loader ? data.callRouteLoader({
        loadContext,
        loader: match.route.module.loader,
        routeId: match.route.id,
        params: match.params,
        request: loaderRequest
      }) : Promise.resolve(void 0)));
      let actionCatch = appState.catch;
      let actionError = appState.error;
      let actionCatchBoundaryRouteId = appState.catchBoundaryRouteId;
      let actionLoaderBoundaryRouteId = appState.loaderBoundaryRouteId;
      appState.catch = void 0;
      appState.error = void 0;
      let routeLoaderResponses = {};
      let loaderStatusCodes = [];
      let routeData = {};
      for (let index = 0; index < matchesToLoad.length; index++) {
        let match = matchesToLoad[index];
        let result = routeLoaderResults[index];
        let error = result.status === "rejected" ? result.reason : void 0;
        let response = result.status === "fulfilled" ? result.value : void 0;
        let isRedirect = response ? responses.isRedirectResponse(response) : false;
        let isCatch = response ? responses.isCatchResponse(response) : false;
        if (appState.catch || appState.error) {
          break;
        }
        if (!actionCatch && !actionError && response && isRedirect) {
          return response;
        }
        if (match.route.module.CatchBoundary) {
          appState.catchBoundaryRouteId = match.route.id;
        }
        if (match.route.module.ErrorBoundary) {
          appState.loaderBoundaryRouteId = match.route.id;
        }
        if (error) {
          loaderStatusCodes.push(500);
          appState.trackBoundaries = false;
          appState.error = await errors.serializeError(error);
          if (serverMode !== mode.ServerMode.Test) {
            console.error(`There was an error running the data loader for route ${match.route.id}`);
          }
          break;
        } else if (response) {
          routeLoaderResponses[match.route.id] = response;
          loaderStatusCodes.push(response.status);
          if (isCatch) {
            appState.trackCatchBoundaries = false;
            appState.catch = {
              data: await data.extractData(response),
              status: response.status,
              statusText: response.statusText
            };
            break;
          } else {
            routeData[match.route.id] = await data.extractData(response);
          }
        }
      }
      if (!appState.catch) {
        appState.catchBoundaryRouteId = actionCatchBoundaryRouteId;
      }
      if (!appState.error) {
        appState.loaderBoundaryRouteId = actionLoaderBoundaryRouteId;
      }
      appState.catch = actionCatch || appState.catch;
      appState.error = actionError || appState.error;
      let renderableMatches = getRenderableMatches(matches, appState);
      if (!renderableMatches) {
        renderableMatches = [];
        let root = routes3[0];
        if (root !== null && root !== void 0 && root.module.CatchBoundary) {
          appState.catchBoundaryRouteId = "root";
          renderableMatches.push({
            params: {},
            pathname: "",
            route: routes3[0]
          });
        }
      }
      let notOkResponse = actionStatus && actionStatus.status !== 200 ? actionStatus.status : loaderStatusCodes.find((status) => status !== 200);
      let responseStatusCode = appState.error ? 500 : typeof notOkResponse === "number" ? notOkResponse : appState.catch ? appState.catch.status : 200;
      let responseHeaders = headers.getDocumentHeaders(build, renderableMatches, routeLoaderResponses, actionResponse);
      let entryMatches = entry2.createEntryMatches(renderableMatches, build.assets.routes);
      let serverHandoff$1 = {
        actionData,
        appState,
        matches: entryMatches,
        routeData
      };
      let entryContext = {
        ...serverHandoff$1,
        manifest: build.assets,
        routeModules,
        serverHandoffString: serverHandoff.createServerHandoffString(serverHandoff$1)
      };
      let handleDocumentRequest2 = build.entry.module.default;
      try {
        return await handleDocumentRequest2(request, responseStatusCode, responseHeaders, entryContext);
      } catch (error) {
        responseStatusCode = 500;
        appState.trackBoundaries = false;
        appState.error = await errors.serializeError(error);
        entryContext.serverHandoffString = serverHandoff.createServerHandoffString(serverHandoff$1);
        try {
          return await handleDocumentRequest2(request, responseStatusCode, responseHeaders, entryContext);
        } catch (error2) {
          return returnLastResortErrorResponse(error2, serverMode);
        }
      }
    }
    async function handleResourceRequest({
      loadContext,
      matches,
      request,
      serverMode
    }) {
      let match = matches.slice(-1)[0];
      try {
        if (isActionRequest(request)) {
          return await data.callRouteAction({
            loadContext,
            action: match.route.module.action,
            routeId: match.route.id,
            params: match.params,
            request
          });
        } else {
          return await data.callRouteLoader({
            loadContext,
            loader: match.route.module.loader,
            routeId: match.route.id,
            params: match.params,
            request
          });
        }
      } catch (error) {
        return returnLastResortErrorResponse(error, serverMode);
      }
    }
    var validActionMethods = /* @__PURE__ */ new Set(["POST", "PUT", "PATCH", "DELETE"]);
    function isActionRequest({
      method
    }) {
      return validActionMethods.has(method.toUpperCase());
    }
    var validRequestMethods = /* @__PURE__ */ new Set(["GET", "HEAD", ...validActionMethods]);
    function isValidRequestMethod({
      method
    }) {
      return validRequestMethods.has(method.toUpperCase());
    }
    async function errorBoundaryError(error, status) {
      return responses.json(await errors.serializeError(error), {
        status,
        headers: {
          "X-Remix-Error": "yes"
        }
      });
    }
    function isIndexRequestUrl(url) {
      return url.searchParams.getAll("index").some((param) => param === "");
    }
    function getRequestMatch(url, matches) {
      let match = matches.slice(-1)[0];
      if (isIndexRequestUrl(url) && match.route.id.endsWith("/index")) {
        return match;
      }
      return getPathContributingMatches(matches).slice(-1)[0];
    }
    function getPathContributingMatches(matches) {
      return matches.filter((match, index) => index === 0 || !match.route.index && match.route.path && match.route.path.length > 0);
    }
    function getDeepestRouteIdWithBoundary(matches, key) {
      let matched = getMatchesUpToDeepestBoundary(matches, key).slice(-1)[0];
      return matched ? matched.route.id : null;
    }
    function getMatchesUpToDeepestBoundary(matches, key) {
      let deepestBoundaryIndex = -1;
      matches.forEach((match, index) => {
        if (match.route.module[key]) {
          deepestBoundaryIndex = index;
        }
      });
      if (deepestBoundaryIndex === -1) {
        return [];
      }
      return matches.slice(0, deepestBoundaryIndex + 1);
    }
    function getRenderableMatches(matches, appState) {
      if (!matches) {
        return null;
      }
      if (!appState.catch && !appState.error) {
        return matches;
      }
      let lastRenderableIndex = -1;
      matches.forEach((match, index) => {
        let id = match.route.id;
        if (appState.renderBoundaryRouteId === id || appState.loaderBoundaryRouteId === id || appState.catchBoundaryRouteId === id) {
          lastRenderableIndex = index;
        }
      });
      return matches.slice(0, lastRenderableIndex + 1);
    }
    function returnLastResortErrorResponse(error, serverMode) {
      if (serverMode !== mode.ServerMode.Test) {
        console.error(error);
      }
      let message = "Unexpected Server Error";
      if (serverMode !== mode.ServerMode.Production) {
        message += `

${String(error)}`;
      }
      return new Response(message, {
        status: 500,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }
    exports.createRequestHandler = createRequestHandler2;
  }
});

// node_modules/@remix-run/server-runtime/dist/sessions.js
var require_sessions = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/sessions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cookies = require_cookies();
    var warnings = require_warnings();
    function flash(name) {
      return `__flash_${name}__`;
    }
    var createSession = (initialData = {}, id = "") => {
      let map = new Map(Object.entries(initialData));
      return {
        get id() {
          return id;
        },
        get data() {
          return Object.fromEntries(map);
        },
        has(name) {
          return map.has(name) || map.has(flash(name));
        },
        get(name) {
          if (map.has(name))
            return map.get(name);
          let flashName = flash(name);
          if (map.has(flashName)) {
            let value = map.get(flashName);
            map.delete(flashName);
            return value;
          }
          return void 0;
        },
        set(name, value) {
          map.set(name, value);
        },
        flash(name, value) {
          map.set(flash(name), value);
        },
        unset(name) {
          map.delete(name);
        }
      };
    };
    var isSession = (object) => {
      return object != null && typeof object.id === "string" && typeof object.data !== "undefined" && typeof object.has === "function" && typeof object.get === "function" && typeof object.set === "function" && typeof object.flash === "function" && typeof object.unset === "function";
    };
    var createSessionStorageFactory = (createCookie) => ({
      cookie: cookieArg,
      createData,
      readData,
      updateData,
      deleteData
    }) => {
      let cookie = cookies.isCookie(cookieArg) ? cookieArg : createCookie((cookieArg === null || cookieArg === void 0 ? void 0 : cookieArg.name) || "__session", cookieArg);
      warnOnceAboutSigningSessionCookie(cookie);
      return {
        async getSession(cookieHeader, options) {
          let id = cookieHeader && await cookie.parse(cookieHeader, options);
          let data = id && await readData(id);
          return createSession(data || {}, id || "");
        },
        async commitSession(session, options) {
          let {
            id,
            data
          } = session;
          if (id) {
            await updateData(id, data, cookie.expires);
          } else {
            id = await createData(data, cookie.expires);
          }
          return cookie.serialize(id, options);
        },
        async destroySession(session, options) {
          await deleteData(session.id);
          return cookie.serialize("", {
            ...options,
            expires: new Date(0)
          });
        }
      };
    };
    function warnOnceAboutSigningSessionCookie(cookie) {
      warnings.warnOnce(cookie.isSigned, `The "${cookie.name}" cookie is not signed, but session cookies should be signed to prevent tampering on the client before they are sent back to the server. See https://remix.run/api/remix#signing-cookies for more information.`);
    }
    exports.createSession = createSession;
    exports.createSessionStorageFactory = createSessionStorageFactory;
    exports.isSession = isSession;
    exports.warnOnceAboutSigningSessionCookie = warnOnceAboutSigningSessionCookie;
  }
});

// node_modules/@remix-run/server-runtime/dist/sessions/cookieStorage.js
var require_cookieStorage = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/sessions/cookieStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cookies = require_cookies();
    var sessions = require_sessions();
    var createCookieSessionStorageFactory = (createCookie) => ({
      cookie: cookieArg
    } = {}) => {
      let cookie = cookies.isCookie(cookieArg) ? cookieArg : createCookie((cookieArg === null || cookieArg === void 0 ? void 0 : cookieArg.name) || "__session", cookieArg);
      sessions.warnOnceAboutSigningSessionCookie(cookie);
      return {
        async getSession(cookieHeader, options) {
          return sessions.createSession(cookieHeader && await cookie.parse(cookieHeader, options) || {});
        },
        async commitSession(session, options) {
          let serializedCookie = await cookie.serialize(session.data, options);
          if (serializedCookie.length > 4096) {
            throw new Error("Cookie length will exceed browser maximum. Length: " + serializedCookie.length);
          }
          return serializedCookie;
        },
        async destroySession(_session, options) {
          return cookie.serialize("", {
            ...options,
            expires: new Date(0)
          });
        }
      };
    };
    exports.createCookieSessionStorageFactory = createCookieSessionStorageFactory;
  }
});

// node_modules/@remix-run/server-runtime/dist/sessions/memoryStorage.js
var require_memoryStorage = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/sessions/memoryStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var createMemorySessionStorageFactory = (createSessionStorage) => ({
      cookie
    } = {}) => {
      let uniqueId = 0;
      let map = /* @__PURE__ */ new Map();
      return createSessionStorage({
        cookie,
        async createData(data, expires) {
          let id = (++uniqueId).toString();
          map.set(id, {
            data,
            expires
          });
          return id;
        },
        async readData(id) {
          if (map.has(id)) {
            let {
              data,
              expires
            } = map.get(id);
            if (!expires || expires > new Date()) {
              return data;
            }
            if (expires)
              map.delete(id);
          }
          return null;
        },
        async updateData(id, data, expires) {
          map.set(id, {
            data,
            expires
          });
        },
        async deleteData(id) {
          map.delete(id);
        }
      });
    };
    exports.createMemorySessionStorageFactory = createMemorySessionStorageFactory;
  }
});

// node_modules/@remix-run/server-runtime/dist/upload/errors.js
var require_errors2 = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/upload/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaxPartSizeExceededError = class extends Error {
      constructor(field, maxBytes) {
        super(`Field "${field}" exceeded upload size of ${maxBytes} bytes.`);
        this.field = field;
        this.maxBytes = maxBytes;
      }
    };
    exports.MaxPartSizeExceededError = MaxPartSizeExceededError;
  }
});

// node_modules/@remix-run/server-runtime/dist/upload/memoryUploadHandler.js
var require_memoryUploadHandler = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/upload/memoryUploadHandler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var errors = require_errors2();
    function createMemoryUploadHandler({
      filter,
      maxPartSize = 3e6
    } = {}) {
      return async ({
        filename,
        contentType,
        name,
        data
      }) => {
        if (filter && !await filter({
          filename,
          contentType,
          name
        })) {
          return void 0;
        }
        let size = 0;
        let chunks = [];
        for await (let chunk of data) {
          size += chunk.byteLength;
          if (size > maxPartSize) {
            throw new errors.MaxPartSizeExceededError(name, maxPartSize);
          }
          chunks.push(chunk);
        }
        if (typeof filename === "string") {
          return new File(chunks, filename, {
            type: contentType
          });
        }
        return await new Blob(chunks, {
          type: contentType
        }).text();
      };
    }
    exports.createMemoryUploadHandler = createMemoryUploadHandler;
  }
});

// node_modules/@remix-run/server-runtime/dist/index.js
var require_dist = __commonJS({
  "node_modules/@remix-run/server-runtime/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cookies = require_cookies();
    var formData = require_formData();
    var responses = require_responses();
    var server = require_server();
    var sessions = require_sessions();
    var cookieStorage = require_cookieStorage();
    var memoryStorage = require_memoryStorage();
    var memoryUploadHandler = require_memoryUploadHandler();
    var errors = require_errors2();
    exports.createCookieFactory = cookies.createCookieFactory;
    exports.isCookie = cookies.isCookie;
    exports.unstable_composeUploadHandlers = formData.composeUploadHandlers;
    exports.unstable_parseMultipartFormData = formData.parseMultipartFormData;
    exports.json = responses.json;
    exports.redirect = responses.redirect;
    exports.createRequestHandler = server.createRequestHandler;
    exports.createSession = sessions.createSession;
    exports.createSessionStorageFactory = sessions.createSessionStorageFactory;
    exports.isSession = sessions.isSession;
    exports.createCookieSessionStorageFactory = cookieStorage.createCookieSessionStorageFactory;
    exports.createMemorySessionStorageFactory = memoryStorage.createMemorySessionStorageFactory;
    exports.unstable_createMemoryUploadHandler = memoryUploadHandler.createMemoryUploadHandler;
    exports.MaxPartSizeExceededError = errors.MaxPartSizeExceededError;
  }
});

// node_modules/@remix-run/cloudflare/dist/crypto.js
var require_crypto = __commonJS({
  "node_modules/@remix-run/cloudflare/dist/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var encoder = new TextEncoder();
    var sign = async (value, secret) => {
      let key = await createKey(secret, ["sign"]);
      let data = encoder.encode(value);
      let signature = await crypto.subtle.sign("HMAC", key, data);
      let hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=+$/, "");
      return value + "." + hash;
    };
    var unsign = async (signed, secret) => {
      let index = signed.lastIndexOf(".");
      let value = signed.slice(0, index);
      let hash = signed.slice(index + 1);
      let key = await createKey(secret, ["verify"]);
      let data = encoder.encode(value);
      let signature = byteStringToUint8Array(atob(hash));
      let valid = await crypto.subtle.verify("HMAC", key, signature, data);
      return valid ? value : false;
    };
    async function createKey(secret, usages) {
      let key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
        name: "HMAC",
        hash: "SHA-256"
      }, false, usages);
      return key;
    }
    function byteStringToUint8Array(byteString) {
      let array = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
      }
      return array;
    }
    exports.sign = sign;
    exports.unsign = unsign;
  }
});

// node_modules/@remix-run/cloudflare/dist/implementations.js
var require_implementations = __commonJS({
  "node_modules/@remix-run/cloudflare/dist/implementations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serverRuntime = require_dist();
    var crypto2 = require_crypto();
    var createCookie = serverRuntime.createCookieFactory({
      sign: crypto2.sign,
      unsign: crypto2.unsign
    });
    var createCookieSessionStorage = serverRuntime.createCookieSessionStorageFactory(createCookie);
    var createSessionStorage = serverRuntime.createSessionStorageFactory(createCookie);
    var createMemorySessionStorage = serverRuntime.createMemorySessionStorageFactory(createSessionStorage);
    exports.createCookie = createCookie;
    exports.createCookieSessionStorage = createCookieSessionStorage;
    exports.createMemorySessionStorage = createMemorySessionStorage;
    exports.createSessionStorage = createSessionStorage;
  }
});

// node_modules/@remix-run/cloudflare/dist/sessions/cloudflareKVSessionStorage.js
var require_cloudflareKVSessionStorage = __commonJS({
  "node_modules/@remix-run/cloudflare/dist/sessions/cloudflareKVSessionStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var implementations = require_implementations();
    function createCloudflareKVSessionStorage({
      cookie,
      kv
    }) {
      return implementations.createSessionStorage({
        cookie,
        async createData(data, expires) {
          while (true) {
            let randomBytes = new Uint8Array(8);
            crypto.getRandomValues(randomBytes);
            let id = [...randomBytes].map((x) => x.toString(16).padStart(2, "0")).join("");
            if (await kv.get(id, "json")) {
              continue;
            }
            await kv.put(id, JSON.stringify(data), {
              expiration: expires ? Math.round(expires.getTime() / 1e3) : void 0
            });
            return id;
          }
        },
        async readData(id) {
          let session = await kv.get(id);
          if (!session) {
            return null;
          }
          return JSON.parse(session);
        },
        async updateData(id, data, expires) {
          await kv.put(id, JSON.stringify(data), {
            expiration: expires ? Math.round(expires.getTime() / 1e3) : void 0
          });
        },
        async deleteData(id) {
          await kv.delete(id);
        }
      });
    }
    exports.createCloudflareKVSessionStorage = createCloudflareKVSessionStorage;
  }
});

// node_modules/@remix-run/cloudflare/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@remix-run/cloudflare/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cloudflareKVSessionStorage = require_cloudflareKVSessionStorage();
    var implementations = require_implementations();
    var serverRuntime = require_dist();
    exports.createCloudflareKVSessionStorage = cloudflareKVSessionStorage.createCloudflareKVSessionStorage;
    exports.createCookie = implementations.createCookie;
    exports.createCookieSessionStorage = implementations.createCookieSessionStorage;
    exports.createMemorySessionStorage = implementations.createMemorySessionStorage;
    exports.createSessionStorage = implementations.createSessionStorage;
    Object.defineProperty(exports, "MaxPartSizeExceededError", {
      enumerable: true,
      get: function() {
        return serverRuntime.MaxPartSizeExceededError;
      }
    });
    Object.defineProperty(exports, "createRequestHandler", {
      enumerable: true,
      get: function() {
        return serverRuntime.createRequestHandler;
      }
    });
    Object.defineProperty(exports, "createSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.createSession;
      }
    });
    Object.defineProperty(exports, "isCookie", {
      enumerable: true,
      get: function() {
        return serverRuntime.isCookie;
      }
    });
    Object.defineProperty(exports, "isSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.isSession;
      }
    });
    Object.defineProperty(exports, "json", {
      enumerable: true,
      get: function() {
        return serverRuntime.json;
      }
    });
    Object.defineProperty(exports, "redirect", {
      enumerable: true,
      get: function() {
        return serverRuntime.redirect;
      }
    });
    Object.defineProperty(exports, "unstable_composeUploadHandlers", {
      enumerable: true,
      get: function() {
        return serverRuntime.unstable_composeUploadHandlers;
      }
    });
    Object.defineProperty(exports, "unstable_createMemoryUploadHandler", {
      enumerable: true,
      get: function() {
        return serverRuntime.unstable_createMemoryUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_parseMultipartFormData", {
      enumerable: true,
      get: function() {
        return serverRuntime.unstable_parseMultipartFormData;
      }
    });
  }
});

// node_modules/mime/Mime.js
var require_Mime = __commonJS({
  "node_modules/mime/Mime.js"(exports, module) {
    "use strict";
    function Mime() {
      this._types = /* @__PURE__ */ Object.create(null);
      this._extensions = /* @__PURE__ */ Object.create(null);
      for (let i = 0; i < arguments.length; i++) {
        this.define(arguments[i]);
      }
      this.define = this.define.bind(this);
      this.getType = this.getType.bind(this);
      this.getExtension = this.getExtension.bind(this);
    }
    Mime.prototype.define = function(typeMap, force) {
      for (let type in typeMap) {
        let extensions = typeMap[type].map(function(t) {
          return t.toLowerCase();
        });
        type = type.toLowerCase();
        for (let i = 0; i < extensions.length; i++) {
          const ext = extensions[i];
          if (ext[0] === "*") {
            continue;
          }
          if (!force && ext in this._types) {
            throw new Error(
              'Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".'
            );
          }
          this._types[ext] = type;
        }
        if (force || !this._extensions[type]) {
          const ext = extensions[0];
          this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
        }
      }
    };
    Mime.prototype.getType = function(path) {
      path = String(path);
      let last = path.replace(/^.*[/\\]/, "").toLowerCase();
      let ext = last.replace(/^.*\./, "").toLowerCase();
      let hasPath = last.length < path.length;
      let hasDot = ext.length < last.length - 1;
      return (hasDot || !hasPath) && this._types[ext] || null;
    };
    Mime.prototype.getExtension = function(type) {
      type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
      return type && this._extensions[type.toLowerCase()] || null;
    };
    module.exports = Mime;
  }
});

// node_modules/mime/types/standard.js
var require_standard = __commonJS({
  "node_modules/mime/types/standard.js"(exports, module) {
    module.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
  }
});

// node_modules/mime/types/other.js
var require_other = __commonJS({
  "node_modules/mime/types/other.js"(exports, module) {
    module.exports = { "application/prs.cww": ["cww"], "application/vnd.1000minds.decision-model+xml": ["1km"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.keynote": ["key"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.numbers": ["numbers"], "application/vnd.apple.pages": ["pages"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.balsamiq.bmml+xml": ["bmml"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.citationstyles.style+xml": ["csl"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dbf": ["dbf"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mapbox-vector-tile": ["mvt"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["*stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.ac+xml": ["*ac"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openblox.game+xml": ["obgx"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openstreetmap.data+xml": ["osm"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.rar": ["rar"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.software602.filler.form+xml": ["fo"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.syncml.dmddf+xml": ["ddf"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": ["*dmg"], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": ["*bdoc"], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["*deb", "udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": ["*iso"], "application/x-iwork-keynote-sffkey": ["*key"], "application/x-iwork-numbers-sffnumbers": ["*numbers"], "application/x-iwork-pages-sffpages": ["*pages"], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-keepass2": ["kdbx"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": ["*exe"], "application/x-msdownload": ["*exe", "*dll", "com", "bat", "*msi"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["*wmf", "*wmz", "*emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": ["*prc", "*pdb"], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["*rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["*obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["*xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": ["*m4a"], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": ["*ra"], "audio/x-wav": ["*wav"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "image/prs.btif": ["btif"], "image/prs.pti": ["pti"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.airzip.accelerator.azv": ["azv"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": ["*sub"], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.microsoft.icon": ["ico"], "image/vnd.ms-dds": ["dds"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.pco.b16": ["b16"], "image/vnd.tencent.tap": ["tap"], "image/vnd.valve.source.texture": ["vtf"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/vnd.zbrush.pcx": ["pcx"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["*ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": ["*bmp"], "image/x-pcx": ["*pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/vnd.wfa.wsc": ["wsc"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.opengex": ["ogex"], "model/vnd.parasolid.transmit.binary": ["x_b"], "model/vnd.parasolid.transmit.text": ["x_t"], "model/vnd.sap.vds": ["vds"], "model/vnd.usdz+zip": ["usdz"], "model/vnd.valve.source.compiled-map": ["bsp"], "model/vnd.vtu": ["vtu"], "text/prs.lines.tag": ["dsc"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": ["*org"], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] };
  }
});

// node_modules/mime/index.js
var require_mime = __commonJS({
  "node_modules/mime/index.js"(exports, module) {
    "use strict";
    var Mime = require_Mime();
    module.exports = new Mime(require_standard(), require_other());
  }
});

// node_modules/@cloudflare/kv-asset-handler/dist/types.js
var require_types = __commonJS({
  "node_modules/@cloudflare/kv-asset-handler/dist/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InternalError = exports.NotFoundError = exports.MethodNotAllowedError = exports.KVError = void 0;
    var KVError = class extends Error {
      constructor(message, status = 500) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = KVError.name;
        this.status = status;
      }
    };
    exports.KVError = KVError;
    var MethodNotAllowedError2 = class extends KVError {
      constructor(message = `Not a valid request method`, status = 405) {
        super(message, status);
      }
    };
    exports.MethodNotAllowedError = MethodNotAllowedError2;
    var NotFoundError2 = class extends KVError {
      constructor(message = `Not Found`, status = 404) {
        super(message, status);
      }
    };
    exports.NotFoundError = NotFoundError2;
    var InternalError = class extends KVError {
      constructor(message = `Internal Error in KV Asset Handler`, status = 500) {
        super(message, status);
      }
    };
    exports.InternalError = InternalError;
  }
});

// node_modules/@cloudflare/kv-asset-handler/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/@cloudflare/kv-asset-handler/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InternalError = exports.NotFoundError = exports.MethodNotAllowedError = exports.serveSinglePageApp = exports.mapRequestToAsset = exports.getAssetFromKV = void 0;
    var mime = require_mime();
    var types_1 = require_types();
    Object.defineProperty(exports, "MethodNotAllowedError", { enumerable: true, get: function() {
      return types_1.MethodNotAllowedError;
    } });
    Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function() {
      return types_1.NotFoundError;
    } });
    Object.defineProperty(exports, "InternalError", { enumerable: true, get: function() {
      return types_1.InternalError;
    } });
    var defaultCacheControl = {
      browserTTL: null,
      edgeTTL: 2 * 60 * 60 * 24,
      bypassCache: false
    };
    var parseStringAsObject = (maybeString) => typeof maybeString === "string" ? JSON.parse(maybeString) : maybeString;
    var getAssetFromKVDefaultOptions = {
      ASSET_NAMESPACE: typeof __STATIC_CONTENT !== "undefined" ? __STATIC_CONTENT : void 0,
      ASSET_MANIFEST: typeof __STATIC_CONTENT_MANIFEST !== "undefined" ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : {},
      cacheControl: defaultCacheControl,
      defaultMimeType: "text/plain",
      defaultDocument: "index.html",
      pathIsEncoded: false
    };
    function assignOptions(options) {
      return Object.assign({}, getAssetFromKVDefaultOptions, options);
    }
    var mapRequestToAsset = (request, options) => {
      options = assignOptions(options);
      const parsedUrl = new URL(request.url);
      let pathname = parsedUrl.pathname;
      if (pathname.endsWith("/")) {
        pathname = pathname.concat(options.defaultDocument);
      } else if (!mime.getType(pathname)) {
        pathname = pathname.concat("/" + options.defaultDocument);
      }
      parsedUrl.pathname = pathname;
      return new Request(parsedUrl.toString(), request);
    };
    exports.mapRequestToAsset = mapRequestToAsset;
    function serveSinglePageApp(request, options) {
      options = assignOptions(options);
      request = mapRequestToAsset(request, options);
      const parsedUrl = new URL(request.url);
      if (parsedUrl.pathname.endsWith(".html")) {
        return new Request(`${parsedUrl.origin}/${options.defaultDocument}`, request);
      } else {
        return request;
      }
    }
    exports.serveSinglePageApp = serveSinglePageApp;
    var getAssetFromKV2 = async (event, options) => {
      options = assignOptions(options);
      const request = event.request;
      const ASSET_NAMESPACE = options.ASSET_NAMESPACE;
      const ASSET_MANIFEST = parseStringAsObject(options.ASSET_MANIFEST);
      if (typeof ASSET_NAMESPACE === "undefined") {
        throw new types_1.InternalError(`there is no KV namespace bound to the script`);
      }
      const rawPathKey = new URL(request.url).pathname.replace(/^\/+/, "");
      let pathIsEncoded = options.pathIsEncoded;
      let requestKey;
      if (options.mapRequestToAsset) {
        requestKey = options.mapRequestToAsset(request);
      } else if (ASSET_MANIFEST[rawPathKey]) {
        requestKey = request;
      } else if (ASSET_MANIFEST[decodeURIComponent(rawPathKey)]) {
        pathIsEncoded = true;
        requestKey = request;
      } else {
        const mappedRequest = mapRequestToAsset(request);
        const mappedRawPathKey = new URL(mappedRequest.url).pathname.replace(/^\/+/, "");
        if (ASSET_MANIFEST[decodeURIComponent(mappedRawPathKey)]) {
          pathIsEncoded = true;
          requestKey = mappedRequest;
        } else {
          requestKey = mapRequestToAsset(request, options);
        }
      }
      const SUPPORTED_METHODS = ["GET", "HEAD"];
      if (!SUPPORTED_METHODS.includes(requestKey.method)) {
        throw new types_1.MethodNotAllowedError(`${requestKey.method} is not a valid request method`);
      }
      const parsedUrl = new URL(requestKey.url);
      const pathname = pathIsEncoded ? decodeURIComponent(parsedUrl.pathname) : parsedUrl.pathname;
      let pathKey = pathname.replace(/^\/+/, "");
      const cache = caches.default;
      let mimeType = mime.getType(pathKey) || options.defaultMimeType;
      if (mimeType.startsWith("text") || mimeType === "application/javascript") {
        mimeType += "; charset=utf-8";
      }
      let shouldEdgeCache = false;
      if (typeof ASSET_MANIFEST !== "undefined") {
        if (ASSET_MANIFEST[pathKey]) {
          pathKey = ASSET_MANIFEST[pathKey];
          shouldEdgeCache = true;
        }
      }
      let cacheKey = new Request(`${parsedUrl.origin}/${pathKey}`, request);
      const evalCacheOpts = (() => {
        switch (typeof options.cacheControl) {
          case "function":
            return options.cacheControl(request);
          case "object":
            return options.cacheControl;
          default:
            return defaultCacheControl;
        }
      })();
      const formatETag = (entityId = pathKey, validatorType = "strong") => {
        if (!entityId) {
          return "";
        }
        switch (validatorType) {
          case "weak":
            if (!entityId.startsWith("W/")) {
              return `W/${entityId}`;
            }
            return entityId;
          case "strong":
            if (entityId.startsWith(`W/"`)) {
              entityId = entityId.replace("W/", "");
            }
            if (!entityId.endsWith(`"`)) {
              entityId = `"${entityId}"`;
            }
            return entityId;
          default:
            return "";
        }
      };
      options.cacheControl = Object.assign({}, defaultCacheControl, evalCacheOpts);
      if (options.cacheControl.bypassCache || options.cacheControl.edgeTTL === null || request.method == "HEAD") {
        shouldEdgeCache = false;
      }
      const shouldSetBrowserCache = typeof options.cacheControl.browserTTL === "number";
      let response = null;
      if (shouldEdgeCache) {
        response = await cache.match(cacheKey);
      }
      if (response) {
        if (response.status > 300 && response.status < 400) {
          if (response.body && "cancel" in Object.getPrototypeOf(response.body)) {
            response.body.cancel();
          } else {
          }
          response = new Response(null, response);
        } else {
          let opts = {
            headers: new Headers(response.headers),
            status: 0,
            statusText: ""
          };
          opts.headers.set("cf-cache-status", "HIT");
          if (response.status) {
            opts.status = response.status;
            opts.statusText = response.statusText;
          } else if (opts.headers.has("Content-Range")) {
            opts.status = 206;
            opts.statusText = "Partial Content";
          } else {
            opts.status = 200;
            opts.statusText = "OK";
          }
          response = new Response(response.body, opts);
        }
      } else {
        const body = await ASSET_NAMESPACE.get(pathKey, "arrayBuffer");
        if (body === null) {
          throw new types_1.NotFoundError(`could not find ${pathKey} in your content namespace`);
        }
        response = new Response(body);
        if (shouldEdgeCache) {
          response.headers.set("Accept-Ranges", "bytes");
          response.headers.set("Content-Length", body.length);
          if (!response.headers.has("etag")) {
            response.headers.set("etag", formatETag(pathKey, "strong"));
          }
          response.headers.set("Cache-Control", `max-age=${options.cacheControl.edgeTTL}`);
          event.waitUntil(cache.put(cacheKey, response.clone()));
          response.headers.set("CF-Cache-Status", "MISS");
        }
      }
      response.headers.set("Content-Type", mimeType);
      if (response.status === 304) {
        let etag = formatETag(response.headers.get("etag"), "strong");
        let ifNoneMatch = cacheKey.headers.get("if-none-match");
        let proxyCacheStatus = response.headers.get("CF-Cache-Status");
        if (etag) {
          if (ifNoneMatch && ifNoneMatch === etag && proxyCacheStatus === "MISS") {
            response.headers.set("CF-Cache-Status", "EXPIRED");
          } else {
            response.headers.set("CF-Cache-Status", "REVALIDATED");
          }
          response.headers.set("etag", formatETag(etag, "weak"));
        }
      }
      if (shouldSetBrowserCache) {
        response.headers.set("Cache-Control", `max-age=${options.cacheControl.browserTTL}`);
      } else {
        response.headers.delete("Cache-Control");
      }
      return response;
    };
    exports.getAssetFromKV = getAssetFromKV2;
  }
});

// build/index.js
var build_exports = {};
__export(build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});

// node_modules/@remix-run/react/dist/esm/_virtual/_rollupPluginBabelHelpers.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// node_modules/@remix-run/react/dist/esm/components.js
var React2 = __toESM(require_react());
var import_react_router_dom2 = __toESM(require_main3());
var import_history3 = __toESM(require_main());

// node_modules/@remix-run/react/dist/esm/errorBoundaries.js
var import_react = __toESM(require_react());
var RemixErrorBoundary = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error || null,
      location: props.location
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location) {
      return {
        error: props.error || null,
        location: props.location
      };
    }
    return {
      error: props.error || state.error,
      location: state.location
    };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ import_react.default.createElement(this.props.component, {
        error: this.state.error
      });
    } else {
      return this.props.children;
    }
  }
};
function RemixRootDefaultErrorBoundary({
  error
}) {
  console.error(error);
  return /* @__PURE__ */ import_react.default.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ import_react.default.createElement("head", null, /* @__PURE__ */ import_react.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  }), /* @__PURE__ */ import_react.default.createElement("title", null, "Application Error!")), /* @__PURE__ */ import_react.default.createElement("body", null, /* @__PURE__ */ import_react.default.createElement("main", {
    style: {
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }
  }, /* @__PURE__ */ import_react.default.createElement("h1", {
    style: {
      fontSize: "24px"
    }
  }, "Application Error"), /* @__PURE__ */ import_react.default.createElement("pre", {
    style: {
      padding: "2rem",
      background: "hsla(10, 50%, 50%, 0.1)",
      color: "red",
      overflow: "auto"
    }
  }, error.stack)), /* @__PURE__ */ import_react.default.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
              );
            `
    }
  })));
}
var RemixCatchContext = /* @__PURE__ */ import_react.default.createContext(void 0);
function useCatch() {
  return (0, import_react.useContext)(RemixCatchContext);
}
function RemixCatchBoundary({
  catch: catchVal,
  component: Component,
  children
}) {
  if (catchVal) {
    return /* @__PURE__ */ import_react.default.createElement(RemixCatchContext.Provider, {
      value: catchVal
    }, /* @__PURE__ */ import_react.default.createElement(Component, null));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, children);
}
function RemixRootDefaultCatchBoundary() {
  let caught = useCatch();
  return /* @__PURE__ */ import_react.default.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ import_react.default.createElement("head", null, /* @__PURE__ */ import_react.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  }), /* @__PURE__ */ import_react.default.createElement("title", null, "Unhandled Thrown Response!")), /* @__PURE__ */ import_react.default.createElement("body", null, /* @__PURE__ */ import_react.default.createElement("h1", {
    style: {
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }
  }, caught.status, " ", caught.statusText), /* @__PURE__ */ import_react.default.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws 404s (and other responses). Check out https://remix.run/guides/not-found for more information."
              );
            `
    }
  })));
}

// node_modules/@remix-run/react/dist/esm/invariant.js
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}

// node_modules/@remix-run/react/dist/esm/links.js
var import_history = __toESM(require_main());

// node_modules/@remix-run/react/dist/esm/routeModules.js
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    window.location.reload();
    return new Promise(() => {
    });
  }
}

// node_modules/@remix-run/react/dist/esm/links.js
function getLinksForMatches(matches, routeModules, manifest2) {
  let descriptors = matches.map((match) => {
    var _module$links;
    let module = routeModules[match.route.id];
    return ((_module$links = module.links) === null || _module$links === void 0 ? void 0 : _module$links.call(module)) || [];
  }).flat(1);
  let preloads = getCurrentPageModulePreloadHrefs(matches, manifest2);
  return dedupe(descriptors, preloads);
}
async function prefetchStyleLinks(routeModule) {
  if (!routeModule.links)
    return;
  let descriptors = routeModule.links();
  if (!descriptors)
    return;
  let styleLinks = [];
  for (let descriptor of descriptors) {
    if (!isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet") {
      styleLinks.push({
        ...descriptor,
        rel: "preload",
        as: "style"
      });
    }
  }
  let matchingLinks = styleLinks.filter((link) => !link.media || window.matchMedia(link.media).matches);
  await Promise.all(matchingLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
  return new Promise((resolve) => {
    let link = document.createElement("link");
    Object.assign(link, descriptor);
    function removeLink() {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }
    link.onload = () => {
      removeLink();
      resolve();
    };
    link.onerror = () => {
      removeLink();
      resolve();
    };
    document.head.appendChild(link);
  });
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null)
    return false;
  if (object.href == null) {
    return object.rel === "preload" && (typeof object.imageSrcSet === "string" || typeof object.imagesrcset === "string") && (typeof object.imageSizes === "string" || typeof object.imagesizes === "string");
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getStylesheetPrefetchLinks(matches, routeModules) {
  let links2 = await Promise.all(matches.map(async (match) => {
    let mod = await loadRouteModule(match.route, routeModules);
    return mod.links ? mod.links() : [];
  }));
  return links2.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map((link) => link.rel === "preload" ? {
    ...link,
    rel: "prefetch"
  } : {
    ...link,
    rel: "prefetch",
    as: "style"
  });
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, location, mode) {
  let path = parsePathPatch(page);
  let isNew = (match, index) => {
    if (!currentMatches[index])
      return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    var _currentMatches$index;
    return currentMatches[index].pathname !== match.pathname || ((_currentMatches$index = currentMatches[index].route.path) === null || _currentMatches$index === void 0 ? void 0 : _currentMatches$index.endsWith("*")) && currentMatches[index].params["*"] !== match.params["*"];
  };
  let newMatches = mode === "data" && location.search !== path.search ? nextMatches.filter((match, index) => {
    if (!match.route.hasLoader) {
      return false;
    }
    if (isNew(match, index) || matchPathChanged(match, index)) {
      return true;
    }
    if (match.route.shouldReload) {
      return match.route.shouldReload({
        params: match.params,
        prevUrl: new URL(location.pathname + location.search + location.hash, window.origin),
        url: new URL(page, window.origin)
      });
    }
    return true;
  }) : nextMatches.filter((match, index) => {
    return (mode === "assets" || match.route.hasLoader) && (isNew(match, index) || matchPathChanged(match, index));
  });
  return newMatches;
}
function getDataLinkHrefs(page, matches, manifest2) {
  let path = parsePathPatch(page);
  return dedupeHrefs(matches.filter((match) => manifest2.routes[match.route.id].hasLoader).map((match) => {
    let {
      pathname,
      search
    } = path;
    let searchParams = new URLSearchParams(search);
    searchParams.set("_data", match.route.id);
    return `${pathname}?${searchParams}`;
  }));
}
function getModuleLinkHrefs(matches, manifestPatch) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifestPatch.routes[match.route.id];
    let hrefs = [route.module];
    if (route.imports) {
      hrefs = hrefs.concat(route.imports);
    }
    return hrefs;
  }).flat(1));
}
function getCurrentPageModulePreloadHrefs(matches, manifest2) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifest2.routes[match.route.id];
    let hrefs = [route.module];
    if (route.imports) {
      hrefs = hrefs.concat(route.imports);
    }
    return hrefs;
  }).flat(1));
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function dedupe(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let str = JSON.stringify(descriptor);
    if (!set.has(str)) {
      set.add(str);
      deduped.push(descriptor);
    }
    return deduped;
  }, []);
}
function parsePathPatch(href) {
  let path = (0, import_history.parsePath)(href);
  if (path.search === void 0)
    path.search = "";
  return path;
}

// node_modules/@remix-run/react/dist/esm/markup.js
function createHtml(html) {
  return {
    __html: html
  };
}

// node_modules/@remix-run/react/dist/esm/routes.js
var React = __toESM(require_react());

// node_modules/@remix-run/react/dist/esm/data.js
function isCatchResponse(response) {
  return response instanceof Response && response.headers.get("X-Remix-Catch") != null;
}
function isErrorResponse(response) {
  return response instanceof Response && response.headers.get("X-Remix-Error") != null;
}
function isRedirectResponse(response) {
  return response instanceof Response && response.headers.get("X-Remix-Redirect") != null;
}
async function fetchData(url, routeId, signal, submission) {
  url.searchParams.set("_data", routeId);
  let init = submission ? getActionInit(submission, signal) : {
    credentials: "same-origin",
    signal
  };
  let response = await fetch(url.href, init);
  if (isErrorResponse(response)) {
    let data = await response.json();
    let error = new Error(data.message);
    error.stack = data.stack;
    return error;
  }
  return response;
}
async function extractData(response) {
  let contentType = response.headers.get("Content-Type");
  if (contentType && /\bapplication\/json\b/.test(contentType)) {
    return response.json();
  }
  return response.text();
}
function getActionInit(submission, signal) {
  let {
    encType,
    method,
    formData
  } = submission;
  let headers = void 0;
  let body = formData;
  if (encType === "application/x-www-form-urlencoded") {
    body = new URLSearchParams();
    for (let [key, value] of formData) {
      invariant(typeof value === "string", `File inputs are not supported with encType "application/x-www-form-urlencoded", please use "multipart/form-data" instead.`);
      body.append(key, value);
    }
    headers = {
      "Content-Type": encType
    };
  }
  return {
    method,
    body,
    signal,
    credentials: "same-origin",
    headers
  };
}

// node_modules/@remix-run/react/dist/esm/transition.js
var import_history2 = __toESM(require_main());

// node_modules/@remix-run/react/dist/esm/routeMatching.js
var import_react_router_dom = __toESM(require_main3());
function matchClientRoutes(routes2, location) {
  let matches = (0, import_react_router_dom.matchRoutes)(routes2, location);
  if (!matches)
    return null;
  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route
  }));
}

// node_modules/@remix-run/react/dist/esm/transition.js
var CatchValue = class {
  constructor(status, statusText, data) {
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
};
function isActionSubmission(submission) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(submission.method);
}
function isLoaderSubmission(submission) {
  return submission.method === "GET";
}
function isRedirectLocation(location) {
  return Boolean(location.state) && location.state.isRedirect;
}
function isLoaderRedirectLocation(location) {
  return isRedirectLocation(location) && location.state.type === "loader";
}
function isActionRedirectLocation(location) {
  return isRedirectLocation(location) && location.state.type === "action";
}
function isFetchActionRedirect(location) {
  return isRedirectLocation(location) && location.state.type === "fetchAction";
}
function isLoaderSubmissionRedirectLocation(location) {
  return isRedirectLocation(location) && location.state.type === "loaderSubmission";
}
var TransitionRedirect = class {
  constructor(location, setCookie) {
    this.setCookie = setCookie;
    this.location = typeof location === "string" ? location : location.pathname + location.search;
  }
};
var IDLE_TRANSITION = {
  state: "idle",
  submission: void 0,
  location: void 0,
  type: "idle"
};
var IDLE_FETCHER = {
  state: "idle",
  type: "init",
  data: void 0,
  submission: void 0
};
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
var isServer = !isBrowser;
function createTransitionManager(init) {
  let {
    routes: routes2
  } = init;
  let pendingNavigationController;
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let navigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let subscribers = /* @__PURE__ */ new Set();
  let matches = matchClientRoutes(routes2, init.location);
  if (!matches) {
    matches = [{
      params: {},
      pathname: "",
      route: routes2[0]
    }];
  }
  let state = {
    location: init.location,
    loaderData: init.loaderData || {},
    actionData: init.actionData,
    catch: init.catch,
    error: init.error,
    catchBoundaryId: init.catchBoundaryId || null,
    errorBoundaryId: init.errorBoundaryId || null,
    matches,
    nextMatches: void 0,
    transition: IDLE_TRANSITION,
    fetchers: /* @__PURE__ */ new Map()
  };
  function update(updates) {
    if (updates.transition) {
      if (updates.transition === IDLE_TRANSITION) {
        pendingNavigationController = void 0;
      }
    }
    state = Object.assign({}, state, updates);
    for (let subscriber of subscribers.values()) {
      subscriber(state);
    }
  }
  function getState() {
    return state;
  }
  function getFetcher(key) {
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function setFetcher(key, fetcher) {
    state.fetchers.set(key, fetcher);
  }
  function deleteFetcher(key) {
    if (fetchControllers.has(key))
      abortFetcher(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    state.fetchers.delete(key);
  }
  async function send(event) {
    switch (event.type) {
      case "navigation": {
        let {
          action,
          location,
          submission
        } = event;
        let matches2 = matchClientRoutes(routes2, location);
        if (!matches2) {
          matches2 = [{
            params: {},
            pathname: "",
            route: routes2[0]
          }];
          await handleNotFoundNavigation(location, matches2);
        } else if (!submission && isHashChangeOnly(location)) {
          await handleHashChange(location, matches2);
        } else if (action === import_history2.Action.Pop) {
          await handleLoad(location, matches2);
        } else if (submission && isActionSubmission(submission)) {
          await handleActionSubmissionNavigation(location, submission, matches2);
        } else if (submission && isLoaderSubmission(submission)) {
          await handleLoaderSubmissionNavigation(location, submission, matches2);
        } else if (isActionRedirectLocation(location)) {
          await handleActionRedirect(location, matches2);
        } else if (isLoaderSubmissionRedirectLocation(location)) {
          await handleLoaderSubmissionRedirect(location, matches2);
        } else if (isLoaderRedirectLocation(location)) {
          await handleLoaderRedirect(location, matches2);
        } else if (isFetchActionRedirect(location)) {
          await handleFetchActionRedirect(location, matches2);
        } else {
          await handleLoad(location, matches2);
        }
        navigationLoadId = -1;
        break;
      }
      case "fetcher": {
        if (isServer) {
          throw new Error("a fetcher was called during the server render, but it shouldn't be. You are likely calling useFetcher.load() or useFetcher.submit() in the body of your component. Try moving it to a useEffect or a callback.");
        }
        let {
          key,
          submission,
          href
        } = event;
        let matches2 = matchClientRoutes(routes2, href);
        invariant(matches2, "No matches found");
        if (fetchControllers.has(key))
          abortFetcher(key);
        let match = getRequestMatch(new URL(href, window.location.href), matches2);
        if (submission && isActionSubmission(submission)) {
          await handleActionFetchSubmission(key, submission, match);
        } else if (submission && isLoaderSubmission(submission)) {
          await handleLoaderFetchSubmission(href, key, submission, match);
        } else {
          await handleLoaderFetch(href, key, match);
        }
        break;
      }
      default: {
        throw new Error(`Unknown data event type: ${event.type}`);
      }
    }
  }
  function dispose() {
    abortNormalNavigation();
    for (let [, controller] of fetchControllers) {
      controller.abort();
    }
  }
  function isIndexRequestUrl(url) {
    for (let param of url.searchParams.getAll("index")) {
      if (param === "") {
        return true;
      }
    }
    return false;
  }
  function getRequestMatch(url, matches2) {
    let match = matches2.slice(-1)[0];
    if (isIndexRequestUrl(url) && match.route.index) {
      return match;
    }
    return getPathContributingMatches(matches2).slice(-1)[0];
  }
  function getPathContributingMatches(matches2) {
    return matches2.filter((match, index) => index === 0 || !match.route.index && match.route.path && match.route.path.length > 0);
  }
  async function handleActionFetchSubmission(key, submission, match) {
    let currentFetcher = state.fetchers.get(key);
    let fetcher = {
      state: "submitting",
      type: "actionSubmission",
      submission,
      data: (currentFetcher === null || currentFetcher === void 0 ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callAction(submission, match, controller.signal);
    if (controller.signal.aborted) {
      return;
    }
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: true,
        type: "fetchAction",
        setCookie: result.value.setCookie
      };
      fetchRedirectIds.add(key);
      init.onRedirect(result.value.location, locationState);
      let loadingFetcher = {
        state: "loading",
        type: "actionRedirect",
        submission,
        data: void 0
      };
      setFetcher(key, loadingFetcher);
      update({
        fetchers: new Map(state.fetchers)
      });
      return;
    }
    if (maybeBailOnError(match, key, result)) {
      return;
    }
    if (await maybeBailOnCatch(match, key, result)) {
      return;
    }
    let loadFetcher = {
      state: "loading",
      type: "actionReload",
      data: result.value,
      submission
    };
    setFetcher(key, loadFetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
    let maybeActionErrorResult = isErrorResult(result) ? result : void 0;
    let maybeActionCatchResult = isCatchResult(result) ? result : void 0;
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let matchesToLoad = state.nextMatches || state.matches;
    let results = await callLoaders(state, state.transition.location || state.location, matchesToLoad, controller.signal, maybeActionErrorResult, maybeActionCatchResult, submission, match.route.id, loadFetcher);
    if (controller.signal.aborted) {
      return;
    }
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    let redirect = findRedirect(results);
    if (redirect) {
      let locationState = {
        isRedirect: true,
        type: "loader",
        setCookie: redirect.setCookie
      };
      init.onRedirect(redirect.location, locationState);
      return;
    }
    let [error, errorBoundaryId] = findErrorAndBoundaryId(results, state.matches, maybeActionErrorResult);
    let [catchVal, catchBoundaryId] = await findCatchAndBoundaryId(results, state.matches, maybeActionCatchResult) || [];
    let doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher);
    let abortedKeys = abortStaleFetchLoads(loadId);
    if (abortedKeys) {
      markFetchersDone(abortedKeys);
    }
    let yeetedNavigation = yeetStaleNavigationLoad(loadId);
    if (yeetedNavigation) {
      let {
        transition
      } = state;
      invariant(transition.state === "loading", "Expected loading transition");
      update({
        location: transition.location,
        matches: state.nextMatches,
        error,
        errorBoundaryId,
        catch: catchVal,
        catchBoundaryId,
        loaderData: makeLoaderData(state, results, matchesToLoad),
        actionData: transition.type === "actionReload" ? state.actionData : void 0,
        transition: IDLE_TRANSITION,
        fetchers: new Map(state.fetchers)
      });
    } else {
      update({
        fetchers: new Map(state.fetchers),
        error,
        errorBoundaryId,
        loaderData: makeLoaderData(state, results, matchesToLoad)
      });
    }
  }
  function yeetStaleNavigationLoad(landedId) {
    let isLoadingNavigation = state.transition.state === "loading";
    if (isLoadingNavigation && navigationLoadId < landedId) {
      abortNormalNavigation();
      return true;
    }
    return false;
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = {
        state: "idle",
        type: "done",
        data: fetcher.data,
        submission: void 0
      };
      setFetcher(key, doneFetcher);
    }
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, `Expected fetcher: ${key}`);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    return yeetedKeys.length ? yeetedKeys : false;
  }
  async function handleLoaderFetchSubmission(href, key, submission, match) {
    let currentFetcher = state.fetchers.get(key);
    let fetcher = {
      state: "submitting",
      type: "loaderSubmission",
      submission,
      data: (currentFetcher === null || currentFetcher === void 0 ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callLoader(match, createUrl(href), controller.signal);
    fetchControllers.delete(key);
    if (controller.signal.aborted) {
      return;
    }
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: true,
        type: "loader",
        setCookie: result.value.setCookie
      };
      init.onRedirect(result.value.location, locationState);
      return;
    }
    if (maybeBailOnError(match, key, result)) {
      return;
    }
    if (await maybeBailOnCatch(match, key, result)) {
      return;
    }
    let doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
  }
  async function handleLoaderFetch(href, key, match) {
    let currentFetcher = state.fetchers.get(key);
    let fetcher = {
      state: "loading",
      type: "normalLoad",
      submission: void 0,
      data: (currentFetcher === null || currentFetcher === void 0 ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callLoader(match, createUrl(href), controller.signal);
    if (controller.signal.aborted)
      return;
    fetchControllers.delete(key);
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: true,
        type: "loader",
        setCookie: result.value.setCookie
      };
      init.onRedirect(result.value.location, locationState);
      return;
    }
    if (maybeBailOnError(match, key, result)) {
      return;
    }
    if (await maybeBailOnCatch(match, key, result)) {
      return;
    }
    let doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher);
    update({
      fetchers: new Map(state.fetchers)
    });
  }
  async function maybeBailOnCatch(match, key, result) {
    if (isCatchResult(result)) {
      let catchBoundaryId = findNearestCatchBoundary(match, state.matches);
      state.fetchers.delete(key);
      update({
        transition: IDLE_TRANSITION,
        fetchers: new Map(state.fetchers),
        catch: {
          data: result.value.data,
          status: result.value.status,
          statusText: result.value.statusText
        },
        catchBoundaryId
      });
      return true;
    }
    return false;
  }
  function maybeBailOnError(match, key, result) {
    if (isErrorResult(result)) {
      let errorBoundaryId = findNearestBoundary(match, state.matches);
      state.fetchers.delete(key);
      update({
        fetchers: new Map(state.fetchers),
        error: result.value,
        errorBoundaryId
      });
      return true;
    }
    return false;
  }
  async function handleNotFoundNavigation(location, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "loading",
      type: "normalLoad",
      submission: void 0,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await Promise.resolve();
    let catchBoundaryId = findNearestCatchBoundary(matches2[0], matches2);
    update({
      location,
      matches: matches2,
      catch: {
        data: null,
        status: 404,
        statusText: "Not Found"
      },
      catchBoundaryId,
      transition: IDLE_TRANSITION
    });
  }
  async function handleActionSubmissionNavigation(location, submission, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "submitting",
      type: "actionSubmission",
      submission,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    let controller = new AbortController();
    pendingNavigationController = controller;
    let actionMatches = matches2;
    let leafMatch = getRequestMatch(createUrl(submission.action), actionMatches);
    let result = await callAction(submission, leafMatch, controller.signal);
    if (controller.signal.aborted) {
      return;
    }
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: true,
        type: "action",
        setCookie: result.value.setCookie
      };
      init.onRedirect(result.value.location, locationState);
      return;
    }
    let catchVal, catchBoundaryId;
    if (isCatchResult(result)) {
      [catchVal, catchBoundaryId] = await findCatchAndBoundaryId([result], actionMatches, result) || [];
    }
    let loadTransition = {
      state: "loading",
      type: "actionReload",
      submission,
      location
    };
    update({
      transition: loadTransition,
      actionData: {
        [leafMatch.route.id]: result.value
      }
    });
    await loadPageData(location, matches2, submission, leafMatch.route.id, result, catchVal, catchBoundaryId);
  }
  async function handleLoaderSubmissionNavigation(location, submission, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "submitting",
      type: "loaderSubmission",
      submission,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2, submission);
  }
  async function handleHashChange(location, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "loading",
      type: "normalLoad",
      submission: void 0,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await Promise.resolve();
    update({
      location,
      matches: matches2,
      transition: IDLE_TRANSITION
    });
  }
  async function handleLoad(location, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "loading",
      type: "normalLoad",
      submission: void 0,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2);
  }
  async function handleLoaderRedirect(location, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "loading",
      type: "normalRedirect",
      submission: void 0,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2);
  }
  async function handleLoaderSubmissionRedirect(location, matches2) {
    abortNormalNavigation();
    invariant(state.transition.type === "loaderSubmission", `Unexpected transition: ${JSON.stringify(state.transition)}`);
    let {
      submission
    } = state.transition;
    let transition = {
      state: "loading",
      type: "loaderSubmissionRedirect",
      submission,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2, submission);
  }
  async function handleFetchActionRedirect(location, matches2) {
    abortNormalNavigation();
    let transition = {
      state: "loading",
      type: "fetchActionRedirect",
      submission: void 0,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2);
  }
  async function handleActionRedirect(location, matches2) {
    abortNormalNavigation();
    invariant(state.transition.type === "actionSubmission" || state.transition.type === "actionReload" || state.transition.type === "actionRedirect", `Unexpected transition: ${JSON.stringify(state.transition)}`);
    let {
      submission
    } = state.transition;
    let transition = {
      state: "loading",
      type: "actionRedirect",
      submission,
      location
    };
    update({
      transition,
      nextMatches: matches2
    });
    await loadPageData(location, matches2, submission);
  }
  function isHashChangeOnly(location) {
    return createHref(state.location) === createHref(location) && state.location.hash !== location.hash;
  }
  async function loadPageData(location, matches2, submission, submissionRouteId, actionResult, catchVal, catchBoundaryId) {
    let maybeActionErrorResult = actionResult && isErrorResult(actionResult) ? actionResult : void 0;
    let maybeActionCatchResult = actionResult && isCatchResult(actionResult) ? actionResult : void 0;
    let controller = new AbortController();
    pendingNavigationController = controller;
    navigationLoadId = ++incrementingLoadId;
    let results = await callLoaders(state, location, matches2, controller.signal, maybeActionErrorResult, maybeActionCatchResult, submission, submissionRouteId, void 0, catchBoundaryId);
    if (controller.signal.aborted) {
      return;
    }
    let redirect = findRedirect(results);
    if (redirect) {
      if (state.transition.type === "actionReload" || isActionRedirectLocation(location)) {
        let locationState = {
          isRedirect: true,
          type: "action",
          setCookie: redirect.setCookie
        };
        init.onRedirect(redirect.location, locationState);
      } else if (state.transition.type === "loaderSubmission") {
        let locationState = {
          isRedirect: true,
          type: "loaderSubmission",
          setCookie: redirect.setCookie
        };
        init.onRedirect(redirect.location, locationState);
      } else {
        var _location$state;
        let locationState = {
          isRedirect: true,
          type: "loader",
          setCookie: redirect.setCookie || ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.setCookie) === true
        };
        init.onRedirect(redirect.location, locationState);
      }
      return;
    }
    let [error, errorBoundaryId] = findErrorAndBoundaryId(results, matches2, maybeActionErrorResult);
    [catchVal, catchBoundaryId] = await findCatchAndBoundaryId(results, matches2, maybeActionErrorResult) || [catchVal, catchBoundaryId];
    markFetchRedirectsDone();
    let abortedIds = abortStaleFetchLoads(navigationLoadId);
    if (abortedIds) {
      markFetchersDone(abortedIds);
    }
    update({
      location,
      matches: matches2,
      error,
      errorBoundaryId,
      catch: catchVal,
      catchBoundaryId,
      loaderData: makeLoaderData(state, results, matches2),
      actionData: state.transition.type === "actionReload" ? state.actionData : void 0,
      transition: IDLE_TRANSITION,
      fetchers: abortedIds ? new Map(state.fetchers) : state.fetchers
    });
  }
  function abortNormalNavigation() {
    if (pendingNavigationController) {
      pendingNavigationController.abort();
    }
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, `Expected fetch controller: ${key}`);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, `Expected fetcher: ${key}`);
      if (fetcher.type === "actionRedirect") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
      }
    }
    markFetchersDone(doneKeys);
  }
  function subscribe(subscriber) {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }
  return {
    subscribe,
    send,
    getState,
    getFetcher,
    deleteFetcher,
    dispose,
    get _internalFetchControllers() {
      return fetchControllers;
    }
  };
}
async function callLoaders(state, location, matches, signal, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId) {
  let url = createUrl(createHref(location));
  let matchesToLoad = filterMatchesToLoad(state, location, matches, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId);
  return Promise.all(matchesToLoad.map((match) => callLoader(match, url, signal)));
}
async function callLoader(match, url, signal) {
  invariant(match.route.loader, `Expected loader for ${match.route.id}`);
  try {
    let {
      params
    } = match;
    let value = await match.route.loader({
      params,
      url,
      signal
    });
    return {
      match,
      value
    };
  } catch (error) {
    return {
      match,
      value: error
    };
  }
}
async function callAction(submission, match, signal) {
  try {
    let value = await match.route.action({
      url: createUrl(submission.action),
      params: match.params,
      submission,
      signal
    });
    return {
      match,
      value
    };
  } catch (error) {
    return {
      match,
      value: error
    };
  }
}
function filterMatchesToLoad(state, location, matches, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId) {
  var _location$state2;
  if (catchBoundaryId || submissionRouteId && (actionCatchResult || actionErrorResult)) {
    let foundProblematicRoute = false;
    matches = matches.filter((match) => {
      if (foundProblematicRoute) {
        return false;
      }
      if (match.route.id === submissionRouteId || match.route.id === catchBoundaryId) {
        foundProblematicRoute = true;
        return false;
      }
      return true;
    });
  }
  let isNew = (match, index) => {
    if (!state.matches[index])
      return true;
    return match.route.id !== state.matches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    var _state$matches$index$;
    return state.matches[index].pathname !== match.pathname || ((_state$matches$index$ = state.matches[index].route.path) === null || _state$matches$index$ === void 0 ? void 0 : _state$matches$index$.endsWith("*")) && state.matches[index].params["*"] !== match.params["*"];
  };
  let url = createUrl(createHref(location));
  let filterByRouteProps = (match, index) => {
    if (!match.route.loader) {
      return false;
    }
    if (isNew(match, index) || matchPathChanged(match, index)) {
      return true;
    }
    if (match.route.shouldReload) {
      let prevUrl = createUrl(createHref(state.location));
      return match.route.shouldReload({
        prevUrl,
        url,
        submission,
        params: match.params
      });
    }
    return true;
  };
  let isInRootCatchBoundary = state.matches.length === 1;
  if (isInRootCatchBoundary) {
    return matches.filter((match) => !!match.route.loader);
  }
  if ((fetcher === null || fetcher === void 0 ? void 0 : fetcher.type) === "actionReload") {
    return matches.filter(filterByRouteProps);
  } else if (state.transition.type === "actionReload" || state.transition.type === "actionRedirect" || state.transition.type === "fetchActionRedirect" || createHref(url) === createHref(state.location) || url.searchParams.toString() !== state.location.search.substring(1) || (_location$state2 = location.state) !== null && _location$state2 !== void 0 && _location$state2.setCookie) {
    return matches.filter(filterByRouteProps);
  }
  return matches.filter((match, index, arr) => {
    var _location$state3;
    if ((actionErrorResult || actionCatchResult) && arr.length - 1 === index) {
      return false;
    }
    return match.route.loader && (isNew(match, index) || matchPathChanged(match, index) || ((_location$state3 = location.state) === null || _location$state3 === void 0 ? void 0 : _location$state3.setCookie));
  });
}
function isRedirectResult(result) {
  return result.value instanceof TransitionRedirect;
}
function createHref(location) {
  return location.pathname + location.search;
}
function findRedirect(results) {
  for (let result of results) {
    if (isRedirectResult(result)) {
      return result.value;
    }
  }
  return null;
}
async function findCatchAndBoundaryId(results, matches, actionCatchResult) {
  let loaderCatchResult;
  for (let result of results) {
    if (isCatchResult(result)) {
      loaderCatchResult = result;
      break;
    }
  }
  let extractCatchData = async (res) => ({
    status: res.status,
    statusText: res.statusText,
    data: res.data
  });
  if (actionCatchResult && loaderCatchResult) {
    let boundaryId = findNearestCatchBoundary(loaderCatchResult.match, matches);
    return [await extractCatchData(actionCatchResult.value), boundaryId];
  }
  if (loaderCatchResult) {
    let boundaryId = findNearestCatchBoundary(loaderCatchResult.match, matches);
    return [await extractCatchData(loaderCatchResult.value), boundaryId];
  }
  return null;
}
function findErrorAndBoundaryId(results, matches, actionErrorResult) {
  let loaderErrorResult;
  for (let result of results) {
    if (isErrorResult(result)) {
      loaderErrorResult = result;
      break;
    }
  }
  if (actionErrorResult && loaderErrorResult) {
    let boundaryId = findNearestBoundary(loaderErrorResult.match, matches);
    return [actionErrorResult.value, boundaryId];
  }
  if (actionErrorResult) {
    let boundaryId = findNearestBoundary(actionErrorResult.match, matches);
    return [actionErrorResult.value, boundaryId];
  }
  if (loaderErrorResult) {
    let boundaryId = findNearestBoundary(loaderErrorResult.match, matches);
    return [loaderErrorResult.value, boundaryId];
  }
  return [void 0, void 0];
}
function findNearestCatchBoundary(matchWithError, matches) {
  let nearestBoundaryId = null;
  for (let match of matches) {
    if (match.route.CatchBoundary) {
      nearestBoundaryId = match.route.id;
    }
    if (match === matchWithError) {
      break;
    }
  }
  return nearestBoundaryId;
}
function findNearestBoundary(matchWithError, matches) {
  let nearestBoundaryId = null;
  for (let match of matches) {
    if (match.route.ErrorBoundary) {
      nearestBoundaryId = match.route.id;
    }
    if (match === matchWithError) {
      break;
    }
  }
  return nearestBoundaryId;
}
function makeLoaderData(state, results, matches) {
  let newData = {};
  for (let {
    match,
    value
  } of results) {
    newData[match.route.id] = value;
  }
  let loaderData = {};
  for (let {
    route
  } of matches) {
    let value = newData[route.id] !== void 0 ? newData[route.id] : state.loaderData[route.id];
    if (value !== void 0) {
      loaderData[route.id] = value;
    }
  }
  return loaderData;
}
function isCatchResult(result) {
  return result.value instanceof CatchValue;
}
function isErrorResult(result) {
  return result.value instanceof Error;
}
function createUrl(href) {
  return new URL(href, window.location.origin);
}

// node_modules/@remix-run/react/dist/esm/routes.js
function createClientRoute(entryRoute, routeModulesCache, Component) {
  return {
    caseSensitive: !!entryRoute.caseSensitive,
    element: /* @__PURE__ */ React.createElement(Component, {
      id: entryRoute.id
    }),
    id: entryRoute.id,
    path: entryRoute.path,
    index: entryRoute.index,
    module: entryRoute.module,
    loader: createLoader(entryRoute, routeModulesCache),
    action: createAction(entryRoute, routeModulesCache),
    shouldReload: createShouldReload(entryRoute, routeModulesCache),
    ErrorBoundary: entryRoute.hasErrorBoundary,
    CatchBoundary: entryRoute.hasCatchBoundary,
    hasLoader: entryRoute.hasLoader
  };
}
function createClientRoutes(routeManifest, routeModulesCache, Component, parentId) {
  return Object.keys(routeManifest).filter((key) => routeManifest[key].parentId === parentId).map((key) => {
    let route = createClientRoute(routeManifest[key], routeModulesCache, Component);
    let children = createClientRoutes(routeManifest, routeModulesCache, Component, route.id);
    if (children.length > 0)
      route.children = children;
    return route;
  });
}
function createShouldReload(route, routeModules) {
  let shouldReload = (arg) => {
    let module = routeModules[route.id];
    invariant(module, `Expected route module to be loaded for ${route.id}`);
    if (module.unstable_shouldReload) {
      return module.unstable_shouldReload(arg);
    }
    return true;
  };
  return shouldReload;
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
  let routeModule = await loadRouteModule(route, routeModules);
  await prefetchStyleLinks(routeModule);
  return routeModule;
}
function createLoader(route, routeModules) {
  let loader2 = async ({
    url,
    signal,
    submission
  }) => {
    if (route.hasLoader) {
      let [result] = await Promise.all([fetchData(url, route.id, signal, submission), loadRouteModuleWithBlockingLinks(route, routeModules)]);
      if (result instanceof Error)
        throw result;
      let redirect = await checkRedirect(result);
      if (redirect)
        return redirect;
      if (isCatchResponse(result)) {
        throw new CatchValue(result.status, result.statusText, await extractData(result));
      }
      return extractData(result);
    } else {
      await loadRouteModuleWithBlockingLinks(route, routeModules);
    }
  };
  return loader2;
}
function createAction(route, routeModules) {
  let action = async ({
    url,
    signal,
    submission
  }) => {
    if (!route.hasAction) {
      console.error(`Route "${route.id}" does not have an action, but you are trying to submit to it. To fix this, please add an \`action\` function to the route`);
    }
    let result = await fetchData(url, route.id, signal, submission);
    if (result instanceof Error) {
      throw result;
    }
    let redirect = await checkRedirect(result);
    if (redirect)
      return redirect;
    await loadRouteModuleWithBlockingLinks(route, routeModules);
    if (isCatchResponse(result)) {
      throw new CatchValue(result.status, result.statusText, await extractData(result));
    }
    return extractData(result);
  };
  return action;
}
async function checkRedirect(response) {
  if (isRedirectResponse(response)) {
    let url = new URL(response.headers.get("X-Remix-Redirect"), window.location.origin);
    if (url.origin !== window.location.origin) {
      await new Promise(() => {
        window.location.replace(url.href);
      });
    } else {
      return new TransitionRedirect(url.pathname + url.search + url.hash, response.headers.get("X-Remix-Revalidate") !== null);
    }
  }
  return null;
}

// node_modules/@remix-run/react/dist/esm/components.js
var RemixEntryContext = /* @__PURE__ */ React2.createContext(void 0);
function useRemixEntryContext() {
  let context = React2.useContext(RemixEntryContext);
  invariant(context, "You must render this element inside a <Remix> element");
  return context;
}
function RemixEntry({
  context: entryContext,
  action,
  location: historyLocation,
  navigator: _navigator,
  static: staticProp = false
}) {
  let {
    manifest: manifest2,
    routeData: documentLoaderData,
    actionData: documentActionData,
    routeModules,
    serverHandoffString,
    appState: entryComponentDidCatchEmulator
  } = entryContext;
  let clientRoutes = React2.useMemo(() => createClientRoutes(manifest2.routes, routeModules, RemixRoute), [manifest2, routeModules]);
  let [clientState, setClientState] = React2.useState(entryComponentDidCatchEmulator);
  let [transitionManager] = React2.useState(() => {
    return createTransitionManager({
      routes: clientRoutes,
      actionData: documentActionData,
      loaderData: documentLoaderData,
      location: historyLocation,
      catch: entryComponentDidCatchEmulator.catch,
      catchBoundaryId: entryComponentDidCatchEmulator.catchBoundaryRouteId,
      onRedirect: _navigator.replace
    });
  });
  React2.useEffect(() => {
    let subscriber = (state) => {
      setClientState({
        catch: state.catch,
        error: state.error,
        catchBoundaryRouteId: state.catchBoundaryId,
        loaderBoundaryRouteId: state.errorBoundaryId,
        renderBoundaryRouteId: null,
        trackBoundaries: false,
        trackCatchBoundaries: false
      });
    };
    return transitionManager.subscribe(subscriber);
  }, [transitionManager]);
  let navigator = React2.useMemo(() => {
    let push = (to, state) => {
      return transitionManager.getState().transition.state !== "idle" ? _navigator.replace(to, state) : _navigator.push(to, state);
    };
    return {
      ..._navigator,
      push
    };
  }, [_navigator, transitionManager]);
  let {
    location,
    matches,
    loaderData,
    actionData
  } = transitionManager.getState();
  React2.useEffect(() => {
    let {
      location: location2
    } = transitionManager.getState();
    if (historyLocation === location2)
      return;
    transitionManager.send({
      type: "navigation",
      location: historyLocation,
      submission: consumeNextNavigationSubmission(),
      action
    });
  }, [transitionManager, historyLocation, action]);
  let ssrErrorBeforeRoutesRendered = clientState.error && clientState.renderBoundaryRouteId === null && clientState.loaderBoundaryRouteId === null ? deserializeError(clientState.error) : void 0;
  let ssrCatchBeforeRoutesRendered = clientState.catch && clientState.catchBoundaryRouteId === null ? clientState.catch : void 0;
  return /* @__PURE__ */ React2.createElement(RemixEntryContext.Provider, {
    value: {
      matches,
      manifest: manifest2,
      appState: clientState,
      routeModules,
      serverHandoffString,
      clientRoutes,
      routeData: loaderData,
      actionData,
      transitionManager
    }
  }, /* @__PURE__ */ React2.createElement(RemixErrorBoundary, {
    location,
    component: RemixRootDefaultErrorBoundary,
    error: ssrErrorBeforeRoutesRendered
  }, /* @__PURE__ */ React2.createElement(RemixCatchBoundary, {
    location,
    component: RemixRootDefaultCatchBoundary,
    catch: ssrCatchBeforeRoutesRendered
  }, /* @__PURE__ */ React2.createElement(import_react_router_dom2.Router, {
    navigationType: action,
    location,
    navigator,
    static: staticProp
  }, /* @__PURE__ */ React2.createElement(Routes, null)))));
}
function deserializeError(data) {
  let error = new Error(data.message);
  error.stack = data.stack;
  return error;
}
function Routes() {
  let {
    clientRoutes
  } = useRemixEntryContext();
  let element = (0, import_react_router_dom2.useRoutes)(clientRoutes) || clientRoutes[0].element;
  return element;
}
var RemixRouteContext = /* @__PURE__ */ React2.createContext(void 0);
function useRemixRouteContext() {
  let context = React2.useContext(RemixRouteContext);
  invariant(context, "You must render this element in a remix route element");
  return context;
}
function DefaultRouteComponent({
  id
}) {
  throw new Error(`Route "${id}" has no component! Please go add a \`default\` export in the route module file.
If you were trying to navigate or submit to a resource route, use \`<a>\` instead of \`<Link>\` or \`<Form reloadDocument>\`.`);
}
function RemixRoute({
  id
}) {
  let location = (0, import_react_router_dom2.useLocation)();
  let {
    routeData,
    routeModules,
    appState
  } = useRemixEntryContext();
  invariant(routeData, "Cannot initialize 'routeData'. This normally occurs when you have server code in your client modules.\nCheck this link for more details:\nhttps://remix.run/pages/gotchas#server-code-in-client-bundles");
  invariant(routeModules, "Cannot initialize 'routeModules'. This normally occurs when you have server code in your client modules.\nCheck this link for more details:\nhttps://remix.run/pages/gotchas#server-code-in-client-bundles");
  let data = routeData[id];
  let {
    default: Component,
    CatchBoundary: CatchBoundary2,
    ErrorBoundary: ErrorBoundary2
  } = routeModules[id];
  let element = Component ? /* @__PURE__ */ React2.createElement(Component, null) : /* @__PURE__ */ React2.createElement(DefaultRouteComponent, {
    id
  });
  let context = {
    data,
    id
  };
  if (CatchBoundary2) {
    let maybeServerCaught = appState.catch && appState.catchBoundaryRouteId === id ? appState.catch : void 0;
    if (appState.trackCatchBoundaries) {
      appState.catchBoundaryRouteId = id;
    }
    context = maybeServerCaught ? {
      id,
      get data() {
        console.error("You cannot `useLoaderData` in a catch boundary.");
        return void 0;
      }
    } : {
      id,
      data
    };
    element = /* @__PURE__ */ React2.createElement(RemixCatchBoundary, {
      location,
      component: CatchBoundary2,
      catch: maybeServerCaught
    }, element);
  }
  if (ErrorBoundary2) {
    let maybeServerRenderError = appState.error && (appState.renderBoundaryRouteId === id || appState.loaderBoundaryRouteId === id) ? deserializeError(appState.error) : void 0;
    if (appState.trackBoundaries) {
      appState.renderBoundaryRouteId = id;
    }
    context = maybeServerRenderError ? {
      id,
      get data() {
        console.error("You cannot `useLoaderData` in an error boundary.");
        return void 0;
      }
    } : {
      id,
      data
    };
    element = /* @__PURE__ */ React2.createElement(RemixErrorBoundary, {
      location,
      component: ErrorBoundary2,
      error: maybeServerRenderError
    }, element);
  }
  return /* @__PURE__ */ React2.createElement(RemixRouteContext.Provider, {
    value: context
  }, element);
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let [maybePrefetch, setMaybePrefetch] = React2.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React2.useState(false);
  let {
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onTouchStart
  } = theirElementProps;
  React2.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
  }, [prefetch]);
  let setIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(true);
    }
  };
  let cancelIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(false);
      setShouldPrefetch(false);
    }
  };
  React2.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  return [shouldPrefetch, {
    onFocus: composeEventHandlers(onFocus, setIntent),
    onBlur: composeEventHandlers(onBlur, cancelIntent),
    onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
    onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
    onTouchStart: composeEventHandlers(onTouchStart, setIntent)
  }];
}
var NavLink = /* @__PURE__ */ React2.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let href = (0, import_react_router_dom2.useHref)(to);
  let [shouldPrefetch, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(import_react_router_dom2.NavLink, _extends({
    ref: forwardedRef,
    to
  }, props, prefetchHandlers)), shouldPrefetch ? /* @__PURE__ */ React2.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
NavLink.displayName = "NavLink";
var Link = /* @__PURE__ */ React2.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let href = (0, import_react_router_dom2.useHref)(to);
  let [shouldPrefetch, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(import_react_router_dom2.Link, _extends({
    ref: forwardedRef,
    to
  }, props, prefetchHandlers)), shouldPrefetch ? /* @__PURE__ */ React2.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
Link.displayName = "Link";
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function Links() {
  let {
    matches,
    routeModules,
    manifest: manifest2
  } = useRemixEntryContext();
  let links2 = React2.useMemo(() => getLinksForMatches(matches, routeModules, manifest2), [matches, routeModules, manifest2]);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, links2.map((link) => {
    if (isPageLinkDescriptor(link)) {
      return /* @__PURE__ */ React2.createElement(PrefetchPageLinks, _extends({
        key: link.page
      }, link));
    }
    let imageSrcSet = null;
    if ("useId" in React2) {
      if (link.imagesrcset) {
        link.imageSrcSet = imageSrcSet = link.imagesrcset;
        delete link.imagesrcset;
      }
      if (link.imagesizes) {
        link.imageSizes = link.imagesizes;
        delete link.imagesizes;
      }
    } else {
      if (link.imageSrcSet) {
        link.imagesrcset = imageSrcSet = link.imageSrcSet;
        delete link.imageSrcSet;
      }
      if (link.imageSizes) {
        link.imagesizes = link.imageSizes;
        delete link.imageSizes;
      }
    }
    return /* @__PURE__ */ React2.createElement("link", _extends({
      key: link.rel + (link.href || "") + (imageSrcSet || "")
    }, link));
  }));
}
function PrefetchPageLinks({
  page,
  ...dataLinkProps
}) {
  let {
    clientRoutes
  } = useRemixEntryContext();
  let matches = React2.useMemo(() => matchClientRoutes(clientRoutes, page), [clientRoutes, page]);
  if (!matches) {
    console.warn(`Tried to prefetch ${page} but no routes matched.`);
    return null;
  }
  return /* @__PURE__ */ React2.createElement(PrefetchPageLinksImpl, _extends({
    page,
    matches
  }, dataLinkProps));
}
function usePrefetchedStylesheets(matches) {
  let {
    routeModules
  } = useRemixEntryContext();
  let [styleLinks, setStyleLinks] = React2.useState([]);
  React2.useEffect(() => {
    let interrupted = false;
    getStylesheetPrefetchLinks(matches, routeModules).then((links2) => {
      if (!interrupted)
        setStyleLinks(links2);
    });
    return () => {
      interrupted = true;
    };
  }, [matches, routeModules]);
  return styleLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = (0, import_react_router_dom2.useLocation)();
  let {
    matches,
    manifest: manifest2
  } = useRemixEntryContext();
  let newMatchesForData = React2.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, location, "data"), [page, nextMatches, matches, location]);
  let newMatchesForAssets = React2.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, location, "assets"), [page, nextMatches, matches, location]);
  let dataHrefs = React2.useMemo(() => getDataLinkHrefs(page, newMatchesForData, manifest2), [newMatchesForData, page, manifest2]);
  let moduleHrefs = React2.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest2), [newMatchesForAssets, manifest2]);
  let styleLinks = usePrefetchedStylesheets(newMatchesForAssets);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React2.createElement("link", _extends({
    key: href,
    rel: "prefetch",
    as: "fetch",
    href
  }, linkProps))), moduleHrefs.map((href) => /* @__PURE__ */ React2.createElement("link", _extends({
    key: href,
    rel: "modulepreload",
    href
  }, linkProps))), styleLinks.map((link) => /* @__PURE__ */ React2.createElement("link", _extends({
    key: link.href
  }, link))));
}
function Meta() {
  let {
    matches,
    routeData,
    routeModules
  } = useRemixEntryContext();
  let location = (0, import_react_router_dom2.useLocation)();
  let meta3 = {};
  let parentsData = {};
  for (let match of matches) {
    let routeId = match.route.id;
    let data = routeData[routeId];
    let params = match.params;
    let routeModule = routeModules[routeId];
    if (routeModule.meta) {
      let routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
        data,
        parentsData,
        params,
        location
      }) : routeModule.meta;
      Object.assign(meta3, routeMeta);
    }
    parentsData[routeId] = data;
  }
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, Object.entries(meta3).map(([name, value]) => {
    if (!value) {
      return null;
    }
    if (["charset", "charSet"].includes(name)) {
      return /* @__PURE__ */ React2.createElement("meta", {
        key: "charset",
        charSet: value
      });
    }
    if (name === "title") {
      return /* @__PURE__ */ React2.createElement("title", {
        key: "title"
      }, String(value));
    }
    let isOpenGraphTag = /^(og|music|video|article|book|profile|fb):.+$/.test(name);
    return [value].flat().map((content) => {
      if (isOpenGraphTag) {
        return /* @__PURE__ */ React2.createElement("meta", {
          property: name,
          content,
          key: name + content
        });
      }
      if (typeof content === "string") {
        return /* @__PURE__ */ React2.createElement("meta", {
          name,
          content,
          key: name + content
        });
      }
      return /* @__PURE__ */ React2.createElement("meta", _extends({
        key: name + JSON.stringify(content)
      }, content));
    });
  }));
}
var isHydrated = false;
function Scripts(props) {
  let {
    manifest: manifest2,
    matches,
    pendingLocation,
    clientRoutes,
    serverHandoffString
  } = useRemixEntryContext();
  React2.useEffect(() => {
    isHydrated = true;
  }, []);
  let initialScripts = React2.useMemo(() => {
    let contextScript = serverHandoffString ? `window.__remixContext = ${serverHandoffString};` : "";
    let routeModulesScript = `${matches.map((match, index) => `import ${JSON.stringify(manifest2.url)};
import * as route${index} from ${JSON.stringify(manifest2.routes[match.route.id].module)};`).join("\n")}
window.__remixRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest2.entry.module)});`;
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("script", _extends({}, props, {
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: createHtml(contextScript),
      type: void 0
    })), /* @__PURE__ */ React2.createElement("script", _extends({}, props, {
      dangerouslySetInnerHTML: createHtml(routeModulesScript),
      type: "module",
      async: true
    })));
  }, []);
  let nextMatches = React2.useMemo(() => {
    if (pendingLocation) {
      let matches2 = matchClientRoutes(clientRoutes, pendingLocation);
      invariant(matches2, `No routes match path "${pendingLocation.pathname}"`);
      return matches2;
    }
    return [];
  }, [pendingLocation, clientRoutes]);
  let routePreloads = matches.concat(nextMatches).map((match) => {
    let route = manifest2.routes[match.route.id];
    return (route.imports || []).concat([route.module]);
  }).flat(1);
  let preloads = manifest2.entry.imports.concat(routePreloads);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("link", {
    rel: "modulepreload",
    href: manifest2.url,
    crossOrigin: props.crossOrigin
  }), /* @__PURE__ */ React2.createElement("link", {
    rel: "modulepreload",
    href: manifest2.entry.module,
    crossOrigin: props.crossOrigin
  }), dedupe2(preloads).map((path) => /* @__PURE__ */ React2.createElement("link", {
    key: path,
    rel: "modulepreload",
    href: path,
    crossOrigin: props.crossOrigin
  })), isHydrated ? null : initialScripts);
}
function dedupe2(array) {
  return [...new Set(array)];
}
var Form = /* @__PURE__ */ React2.forwardRef((props, ref) => {
  return /* @__PURE__ */ React2.createElement(FormImpl, _extends({}, props, {
    ref
  }));
});
Form.displayName = "Form";
var FormImpl = /* @__PURE__ */ React2.forwardRef(({
  reloadDocument = false,
  replace = false,
  method = "get",
  action,
  encType = "application/x-www-form-urlencoded",
  fetchKey,
  onSubmit,
  ...props
}, forwardedRef) => {
  let submit = useSubmitImpl(fetchKey);
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let formAction = useFormAction(action);
  return /* @__PURE__ */ React2.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    encType,
    onSubmit: reloadDocument ? void 0 : (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented)
        return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = (submitter === null || submitter === void 0 ? void 0 : submitter.formMethod) || method;
      submit(submitter || event.currentTarget, {
        method: submitMethod,
        replace
      });
    }
  }, props));
});
FormImpl.displayName = "FormImpl";
function useFormAction(action, method = "get") {
  let {
    id
  } = useRemixRouteContext();
  let resolvedPath = (0, import_react_router_dom2.useResolvedPath)(action ? action : ".");
  let location = (0, import_react_router_dom2.useLocation)();
  let {
    search,
    hash
  } = resolvedPath;
  let isIndexRoute = id.endsWith("/index");
  if (action == null) {
    search = location.search;
    hash = location.hash;
    if (isIndexRoute) {
      let params = new URLSearchParams(search);
      params.delete("index");
      search = params.toString() ? `?${params.toString()}` : "";
    }
  }
  if ((action == null || action === ".") && isIndexRoute) {
    search = search ? search.replace(/^\?/, "?index&") : "?index";
  }
  return (0, import_history3.createPath)({
    pathname: resolvedPath.pathname,
    search,
    hash
  });
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function useSubmitImpl(key) {
  let navigate = (0, import_react_router_dom2.useNavigate)();
  let defaultAction = useFormAction();
  let {
    transitionManager
  } = useRemixEntryContext();
  return React2.useCallback((target, options = {}) => {
    let method;
    let action;
    let encType;
    let formData;
    if (isFormElement(target)) {
      let submissionTrigger = options.submissionTrigger;
      method = options.method || target.getAttribute("method") || defaultMethod;
      action = options.action || target.getAttribute("action") || defaultAction;
      encType = options.encType || target.getAttribute("enctype") || defaultEncType;
      formData = new FormData(target);
      if (submissionTrigger && submissionTrigger.name) {
        formData.append(submissionTrigger.name, submissionTrigger.value);
      }
    } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
      let form = target.form;
      if (form == null) {
        throw new Error(`Cannot submit a <button> without a <form>`);
      }
      method = options.method || target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
      action = options.action || target.getAttribute("formaction") || form.getAttribute("action") || defaultAction;
      encType = options.encType || target.getAttribute("formenctype") || form.getAttribute("enctype") || defaultEncType;
      formData = new FormData(form);
      if (target.name) {
        formData.append(target.name, target.value);
      }
    } else {
      if (isHtmlElement(target)) {
        throw new Error(`Cannot submit element that is not <form>, <button>, or <input type="submit|image">`);
      }
      method = options.method || "get";
      action = options.action || defaultAction;
      encType = options.encType || "application/x-www-form-urlencoded";
      if (target instanceof FormData) {
        formData = target;
      } else {
        formData = new FormData();
        if (target instanceof URLSearchParams) {
          for (let [name, value] of target) {
            formData.append(name, value);
          }
        } else if (target != null) {
          for (let name of Object.keys(target)) {
            formData.append(name, target[name]);
          }
        }
      }
    }
    if (typeof document === "undefined") {
      throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
    }
    let {
      protocol,
      host
    } = window.location;
    let url = new URL(action, `${protocol}//${host}`);
    if (method.toLowerCase() === "get") {
      let params = new URLSearchParams();
      let hasParams = false;
      for (let [name, value] of formData) {
        if (typeof value === "string") {
          hasParams = true;
          params.append(name, value);
        } else {
          throw new Error(`Cannot submit binary form data using GET`);
        }
      }
      let isIndexAction = new URLSearchParams(url.search).getAll("index").some((v) => v === "");
      if (key != null && isIndexAction) {
        hasParams = true;
        params.append("index", "");
      }
      url.search = hasParams ? `?${params.toString()}` : "";
    }
    let submission = {
      formData,
      action: url.pathname + url.search,
      method: method.toUpperCase(),
      encType,
      key: Math.random().toString(36).substr(2, 8)
    };
    if (key) {
      transitionManager.send({
        type: "fetcher",
        href: submission.action,
        submission,
        key
      });
    } else {
      setNextNavigationSubmission(submission);
      navigate(url.pathname + url.search, {
        replace: options.replace
      });
    }
  }, [defaultAction, key, navigate, transitionManager]);
}
var nextNavigationSubmission;
function setNextNavigationSubmission(submission) {
  nextNavigationSubmission = submission;
}
function consumeNextNavigationSubmission() {
  let submission = nextNavigationSubmission;
  nextNavigationSubmission = void 0;
  return submission;
}
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function useBeforeUnload(callback) {
  React2.useEffect(() => {
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [callback]);
}
function useTransition() {
  let {
    transitionManager
  } = useRemixEntryContext();
  return transitionManager.getState().transition;
}
var LiveReload = false ? () => null : function LiveReload2({
  port = Number("8002"),
  nonce = void 0
}) {
  let js = String.raw;
  return /* @__PURE__ */ React2.createElement("script", {
    nonce,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: js`
                function remixLiveReloadConnect(config) {
                  let protocol = location.protocol === "https:" ? "wss:" : "ws:";
                  let host = location.hostname;
                  let socketPath = protocol + "//" + host + ":" + ${String(port)} + "/socket";

                  let ws = new WebSocket(socketPath);
                  ws.onmessage = (message) => {
                    let event = JSON.parse(message.data);
                    if (event.type === "LOG") {
                      console.log(event.message);
                    }
                    if (event.type === "RELOAD") {
                      console.log("💿 Reloading window ...");
                      window.location.reload();
                    }
                  };
                  ws.onopen = () => {
                    if (config && typeof config.onOpen === "function") {
                      config.onOpen();
                    }
                  };
                  ws.onclose = (error) => {
                    console.log("Remix dev asset server web socket closed. Reconnecting...");
                    setTimeout(
                      () =>
                        remixLiveReloadConnect({
                          onOpen: () => window.location.reload(),
                        }),
                      1000
                    );
                  };
                  ws.onerror = (error) => {
                    console.log("Remix dev asset server web socket error:");
                    console.error(error);
                  };
                }
                remixLiveReloadConnect();
              `
    }
  });
};

// node_modules/@remix-run/react/dist/esm/index.js
var import_react_router_dom4 = __toESM(require_main3());

// node_modules/@remix-run/react/dist/esm/scroll-restoration.js
var React3 = __toESM(require_react());
var import_react_router_dom3 = __toESM(require_main3());
var STORAGE_KEY = "positions";
var positions = {};
if (typeof document !== "undefined") {
  let sessionPositions = sessionStorage.getItem(STORAGE_KEY);
  if (sessionPositions) {
    positions = JSON.parse(sessionPositions);
  }
}
function ScrollRestoration({
  nonce = void 0
}) {
  useScrollRestoration();
  React3.useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);
  useBeforeUnload(React3.useCallback(() => {
    window.history.scrollRestoration = "auto";
  }, []));
  let restoreScroll = ((STORAGE_KEY2) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({
        key
      }, "");
    }
    try {
      let positions2 = JSON.parse(sessionStorage.getItem(STORAGE_KEY2) || "{}");
      let storedY = positions2[window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(STORAGE_KEY2);
    }
  }).toString();
  return /* @__PURE__ */ React3.createElement("script", {
    nonce,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: `(${restoreScroll})(${JSON.stringify(STORAGE_KEY)})`
    }
  });
}
var hydrated = false;
function useScrollRestoration() {
  let location = (0, import_react_router_dom3.useLocation)();
  let transition = useTransition();
  let wasSubmissionRef = React3.useRef(false);
  React3.useEffect(() => {
    if (transition.submission) {
      wasSubmissionRef.current = true;
    }
  }, [transition]);
  React3.useEffect(() => {
    if (transition.location) {
      positions[location.key] = window.scrollY;
    }
  }, [transition, location]);
  useBeforeUnload(React3.useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, []));
  if (typeof document !== "undefined") {
    React3.useLayoutEffect(() => {
      if (!hydrated) {
        hydrated = true;
        return;
      }
      let y = positions[location.key];
      if (y != void 0) {
        window.scrollTo(0, y);
        return;
      }
      if (location.hash) {
        let el = document.getElementById(location.hash.slice(1));
        if (el) {
          el.scrollIntoView();
          return;
        }
      }
      if (wasSubmissionRef.current === true) {
        wasSubmissionRef.current = false;
        return;
      }
      window.scrollTo(0, 0);
    }, [location]);
  }
  React3.useEffect(() => {
    if (transition.submission) {
      wasSubmissionRef.current = true;
    }
  }, [transition]);
}

// node_modules/@remix-run/react/dist/esm/server.js
var import_history4 = __toESM(require_main());
var React4 = __toESM(require_react());
function RemixServer({
  context,
  url
}) {
  if (typeof url === "string") {
    url = new URL(url);
  }
  let location = {
    pathname: url.pathname,
    search: url.search,
    hash: "",
    state: null,
    key: "default"
  };
  let staticNavigator = {
    createHref(to) {
      return typeof to === "string" ? to : (0, import_history4.createPath)(to);
    },
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    },
    block() {
      throw new Error(`You cannot use navigator.block() on the server because it is a stateless environment.`);
    }
  };
  return /* @__PURE__ */ React4.createElement(RemixEntry, {
    context,
    action: import_history4.Action.Pop,
    location,
    navigator: staticNavigator,
    static: true
  });
}

// node_modules/isbot/index.mjs
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}
var list = [
  " daum[ /]",
  " deusu/",
  "(?:^| )site",
  "@[a-z]",
  "\\(at\\)[a-z]",
  "\\(github\\.com/",
  "\\[at\\][a-z]",
  "^12345",
  "^<",
  "^[\\w \\.\\-\\(\\)]+(/v?\\d+(\\.\\d+)?(\\.\\d{1,10})?)?$",
  "^[^ ]{50,}$",
  "^active",
  "^ad muncher",
  "^anglesharp/",
  "^anonymous",
  "^avsdevicesdk/",
  "^axios/",
  "^bidtellect/",
  "^biglotron",
  "^castro",
  "^clamav[ /]",
  "^cobweb/",
  "^coccoc",
  "^custom",
  "^ddg[_-]android",
  "^discourse",
  "^dispatch/\\d",
  "^downcast/",
  "^duckduckgo",
  "^facebook",
  "^fdm[ /]\\d",
  "^getright/",
  "^gozilla/",
  "^hatena",
  "^hobbit",
  "^hotzonu",
  "^hwcdn/",
  "^jeode/",
  "^jetty/",
  "^jigsaw",
  "^linkdex",
  "^lwp[-: ]",
  "^metauri",
  "^microsoft bits",
  "^movabletype",
  "^mozilla/\\d\\.\\d \\(compatible;?\\)$",
  "^mozilla/\\d\\.\\d \\w*$",
  "^navermailapp",
  "^netsurf",
  "^offline explorer",
  "^phantom",
  "^php",
  "^postman",
  "^postrank",
  "^python",
  "^read",
  "^reed",
  "^restsharp/",
  "^snapchat",
  "^space bison",
  "^svn",
  "^swcd ",
  "^taringa",
  "^test certificate info",
  "^thumbor/",
  "^tumblr/",
  "^user-agent:mozilla",
  "^valid",
  "^venus/fedoraplanet",
  "^w3c",
  "^webbandit/",
  "^webcopier",
  "^wget",
  "^whatsapp",
  "^xenu link sleuth",
  "^yahoo",
  "^yandex",
  "^zdm/\\d",
  "^zoom marketplace/",
  "^{{.*}}$",
  "adbeat\\.com",
  "appinsights",
  "archive",
  "ask jeeves/teoma",
  "bit\\.ly/",
  "bluecoat drtr",
  "bot",
  "browsex",
  "burpcollaborator",
  "capture",
  "catch",
  "check",
  "chrome-lighthouse",
  "chromeframe",
  "client",
  "cloud",
  "crawl",
  "dareboost",
  "datanyze",
  "dataprovider",
  "dejaclick",
  "dmbrowser",
  "download",
  "evc-batch/",
  "feed",
  "firephp",
  "freesafeip",
  "ghost",
  "gomezagent",
  "google",
  "headlesschrome/",
  "http",
  "httrack",
  "hubspot marketing grader",
  "hydra",
  "ibisbrowser",
  "images",
  "iplabel",
  "ips-agent",
  "java",
  "library",
  "mail\\.ru/",
  "manager",
  "monitor",
  "morningscore/",
  "neustar wpm",
  "news",
  "nutch",
  "offbyone",
  "optimize",
  "pageburst",
  "pagespeed",
  "perl",
  "pingdom",
  "powermarks",
  "preview",
  "proxy",
  "ptst[ /]\\d",
  "reader",
  "rexx;",
  "rigor",
  "rss",
  "scan",
  "scrape",
  "search",
  "serp ?reputation ?management",
  "server",
  "sogou",
  "sparkler/",
  "spider",
  "statuscake",
  "stumbleupon\\.com",
  "supercleaner",
  "synapse",
  "synthetic",
  "taginspector/",
  "torrent",
  "tracemyfile",
  "transcoder",
  "trendsmapresolver",
  "twingly recon",
  "url",
  "virtuoso",
  "wappalyzer",
  "webglance",
  "webkit2png",
  "websitemetadataretriever",
  "whatcms/",
  "wordpress",
  "zgrab"
];
function amend(list2) {
  try {
    new RegExp("(?<! cu)bot").test("dangerbot");
  } catch (error) {
    return list2;
  }
  [
    ["bot", "(?<! cu)bot"],
    ["google", "(?<! (?:channel/|google/))google(?!(app|/google| pixel))"],
    ["http", "(?<!(?:lib))http"],
    ["java", "java(?!;)"],
    ["search", "(?<! ya(?:yandex)?)search"]
  ].forEach(function(_ref) {
    var _ref2 = _slicedToArray(_ref, 2), search = _ref2[0], replace = _ref2[1];
    var index = list2.lastIndexOf(search);
    if (~index) {
      list2.splice(index, 1, replace);
    }
  });
  return list2;
}
amend(list);
var flags = "i";
var _list = /* @__PURE__ */ new WeakMap();
var _pattern = /* @__PURE__ */ new WeakMap();
var _update = /* @__PURE__ */ new WeakSet();
var _index = /* @__PURE__ */ new WeakSet();
var Isbot = /* @__PURE__ */ function() {
  function Isbot2(patterns) {
    var _this = this;
    _classCallCheck(this, Isbot2);
    _classPrivateMethodInitSpec(this, _index);
    _classPrivateMethodInitSpec(this, _update);
    _classPrivateFieldInitSpec(this, _list, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _pattern, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _list, patterns || list.slice());
    _classPrivateMethodGet(this, _update, _update2).call(this);
    var isbot2 = function isbot3(ua) {
      return _this.test(ua);
    };
    return Object.defineProperties(isbot2, Object.entries(Object.getOwnPropertyDescriptors(Isbot2.prototype)).reduce(function(accumulator, _ref) {
      var _ref2 = _slicedToArray(_ref, 2), prop = _ref2[0], descriptor = _ref2[1];
      if (typeof descriptor.value === "function") {
        Object.assign(accumulator, _defineProperty({}, prop, {
          value: _this[prop].bind(_this)
        }));
      }
      if (typeof descriptor.get === "function") {
        Object.assign(accumulator, _defineProperty({}, prop, {
          get: function get() {
            return _this[prop];
          }
        }));
      }
      return accumulator;
    }, {}));
  }
  _createClass(Isbot2, [{
    key: "pattern",
    get: function get() {
      return new RegExp(_classPrivateFieldGet(this, _pattern));
    }
  }, {
    key: "test",
    value: function test(ua) {
      return Boolean(ua) && _classPrivateFieldGet(this, _pattern).test(ua);
    }
  }, {
    key: "find",
    value: function find() {
      var ua = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var match = ua.match(_classPrivateFieldGet(this, _pattern));
      return match && match[0];
    }
  }, {
    key: "matches",
    value: function matches() {
      var ua = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return _classPrivateFieldGet(this, _list).filter(function(entry2) {
        return new RegExp(entry2, flags).test(ua);
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      var ua = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      this.exclude(this.matches(ua));
    }
  }, {
    key: "extend",
    value: function extend() {
      var _this2 = this;
      var filters = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      [].push.apply(_classPrivateFieldGet(this, _list), filters.filter(function(rule) {
        return _classPrivateMethodGet(_this2, _index, _index2).call(_this2, rule) === -1;
      }).map(function(filter) {
        return filter.toLowerCase();
      }));
      _classPrivateMethodGet(this, _update, _update2).call(this);
    }
  }, {
    key: "exclude",
    value: function exclude() {
      var filters = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      var length = filters.length;
      while (length--) {
        var index = _classPrivateMethodGet(this, _index, _index2).call(this, filters[length]);
        if (index > -1) {
          _classPrivateFieldGet(this, _list).splice(index, 1);
        }
      }
      _classPrivateMethodGet(this, _update, _update2).call(this);
    }
  }, {
    key: "spawn",
    value: function spawn(list2) {
      return new Isbot2(list2 || _classPrivateFieldGet(this, _list));
    }
  }]);
  return Isbot2;
}();
function _update2() {
  _classPrivateFieldSet(this, _pattern, new RegExp(_classPrivateFieldGet(this, _list).join("|"), flags));
}
function _index2(rule) {
  return _classPrivateFieldGet(this, _list).indexOf(rule.toLowerCase());
}
var isbot = new Isbot();

// build/index.js
var import_server2 = __toESM(require_server_browser());
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
var import_react5 = __toESM(require_react());
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime());
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime());
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var entry_server_exports = {};
__export2(entry_server_exports, {
  default: () => handleRequest
});
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let body = await (0, import_server2.renderToReadableStream)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RemixServer, {
      context: remixContext,
      url: request.url
    }, void 0, false, {
      fileName: "app/entry.server.tsx",
      lineNumber: 13,
      columnNumber: 5
    }, this),
    {
      onError: (error) => {
        responseStatusCode = 500, console.error(error);
      },
      signal: request.signal
    }
  );
  isbot(request.headers.get("User-Agent")) && await body.allReady;
  let headers = new Headers(responseHeaders);
  return headers.set("Content-Type", "text/html"), new Response(body, {
    status: responseStatusCode,
    headers
  });
}
var root_exports = {};
__export2(root_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
function useProgress() {
  let el = (0, import_react5.useRef)(), timeout = (0, import_react5.useRef)(), { location } = useTransition();
  return (0, import_react5.useEffect)(() => {
    if (!location || !el.current)
      return;
    timeout.current && clearTimeout(timeout.current), el.current.style.width = "0%";
    let updateWidth = (ms) => {
      timeout.current = setTimeout(() => {
        let width = parseFloat(el.current.style.width), percent = isNaN(width) ? 0 : 10 + 0.9 * width;
        el.current.style.width = `${percent}%`, updateWidth(100);
      }, ms);
    };
    return updateWidth(300), () => {
      clearTimeout(timeout.current), el.current.style.width !== "0%" && (el.current.style.width = "100%", timeout.current = setTimeout(() => {
        var _a;
        ((_a = el.current) == null ? void 0 : _a.style.width) === "100%" && (el.current.style.width = "");
      }, 200));
    };
  }, [location]), el;
}
function Progress() {
  let progress = useProgress();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", {
    className: "fixed top-0 left-0 right-0 h-1 flex",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", {
      ref: progress,
      className: "transition-all ease-out bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
    }, void 0, false, {
      fileName: "app/components/Progress.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: "app/components/Progress.tsx",
    lineNumber: 59,
    columnNumber: 5
  }, this);
}
var Progress_default = Progress;
var global_default = "/build/_assets/global-G4MCVX7O.css";
var links = () => [{ rel: "stylesheet", href: global_default }];
var meta = () => ({
  viewport: "width=device-width, initial-scale=1"
});
var loader = async () => ({ date: new Date() });
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Document, {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Progress_default, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {
        className: "min-h-screen grid md:grid-cols-layout auto-rows-min bg-primary font-open-sans text-primary py-4 md:py-0 md:pl-4 gap-4",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("header", {
            className: "px-4 md:px-0 flex flex-row md:flex-col items-center",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, {
                className: "block no-underline",
                to: "/",
                prefetch: "intent",
                children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("img", {
                  className: "w-12 md:w-24 lg:w-32 md:py-4",
                  src: "/assets/logo.svg",
                  alt: "logo"
                }, void 0, false, {
                  fileName: "app/root.tsx",
                  lineNumber: 42,
                  columnNumber: 13
                }, this)
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 41,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, {
                className: "block no-underline",
                to: "/",
                prefetch: "intent",
                children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", {
                  className: "p-4 md:p-0 uppercase",
                  children: "Edmund.dev"
                }, void 0, false, {
                  fileName: "app/root.tsx",
                  lineNumber: 49,
                  columnNumber: 13
                }, this)
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 48,
                columnNumber: 11
              }, this)
            ]
          }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("main", {
            className: "px-4 md:px-0 md:py-4 md:pr-4 md:row-span-4 md:h-screen overflow-y-scroll",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react_router_dom4.Outlet, {}, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 53,
              columnNumber: 11
            }, this)
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 52,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("nav", {
            className: "sticky bottom-0 md:static font-light text-center text-xs md:text-base bg-white md:bg-transparent flex flex-row md:flex-col items-center shadow md:shadow-none",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NavLink, {
                className: (isActive) => `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${isActive ? "font-normal" : ""}`.trim(),
                to: "/articles",
                prefetch: "intent",
                children: "Articles"
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 56,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NavLink, {
                className: (isActive) => `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${isActive ? "font-normal" : ""}`.trim(),
                to: "/bookmarks",
                prefetch: "intent",
                children: "Bookmarks"
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 67,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NavLink, {
                className: (isActive) => `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${isActive ? "font-normal" : ""}`.trim(),
                to: "/projects",
                prefetch: "intent",
                children: "Projects"
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 78,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NavLink, {
                className: (isActive) => `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${isActive ? "font-normal" : ""}`.trim(),
                to: "/snapshots",
                prefetch: "intent",
                children: "Snapshots"
              }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 89,
                columnNumber: 11
              }, this)
            ]
          }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 55,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("footer", {
            className: "text-center",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("address", {
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", {
                  className: "inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary",
                  href: "mailto:contact@edmund.dev",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", {
                    "aria-hidden": "true",
                    focusable: "false",
                    "data-prefix": "far",
                    "data-icon": "at",
                    className: "w-6 h-6",
                    role: "img",
                    viewBox: "0 0 512 512",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", {
                      fill: "currentColor",
                      d: "M504 232C504 95.751 394.053 8 256 8 118.94 8 8 118.919 8 256c0 137.059 110.919 248 248 248 52.926 0 104.681-17.079 147.096-48.321 5.501-4.052 6.423-11.924 2.095-17.211l-15.224-18.597c-4.055-4.954-11.249-5.803-16.428-2.041C339.547 442.517 298.238 456 256 456c-110.28 0-200-89.72-200-200S145.72 56 256 56c109.469 0 200 65.02 200 176 0 63.106-42.478 98.29-83.02 98.29-19.505 0-20.133-12.62-16.366-31.463l28.621-148.557c1.426-7.402-4.245-14.27-11.783-14.27h-39.175a12.005 12.005 0 0 0-11.784 9.735c-1.102 5.723-1.661 8.336-2.28 13.993-11.923-19.548-35.878-31.068-65.202-31.068C183.412 128.66 120 191.149 120 281.53c0 61.159 32.877 102.11 93.18 102.11 29.803 0 61.344-16.833 79.749-42.239 4.145 30.846 28.497 38.01 59.372 38.01C451.467 379.41 504 315.786 504 232zm-273.9 97.35c-28.472 0-45.47-19.458-45.47-52.05 0-57.514 39.56-93.41 74.61-93.41 30.12 0 45.471 21.532 45.471 51.58 0 46.864-33.177 93.88-74.611 93.88z"
                    }, void 0, false, {
                      fileName: "app/root.tsx",
                      lineNumber: 116,
                      columnNumber: 17
                    }, this)
                  }, void 0, false, {
                    fileName: "app/root.tsx",
                    lineNumber: 107,
                    columnNumber: 15
                  }, this)
                }, void 0, false, {
                  fileName: "app/root.tsx",
                  lineNumber: 103,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", {
                  className: "inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary",
                  href: "https://github.com/edmundhung",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", {
                    "aria-hidden": "true",
                    focusable: "false",
                    "data-prefix": "fab",
                    "data-icon": "github",
                    className: "w-6 h-6",
                    role: "img",
                    viewBox: "0 0 496 512",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", {
                      fill: "currentColor",
                      d: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                    }, void 0, false, {
                      fileName: "app/root.tsx",
                      lineNumber: 137,
                      columnNumber: 17
                    }, this)
                  }, void 0, false, {
                    fileName: "app/root.tsx",
                    lineNumber: 128,
                    columnNumber: 15
                  }, this)
                }, void 0, false, {
                  fileName: "app/root.tsx",
                  lineNumber: 122,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", {
                  className: "inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary",
                  href: "https://www.linkedin.com/in/edhung",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", {
                    "aria-hidden": "true",
                    focusable: "false",
                    "data-prefix": "fab",
                    "data-icon": "linkedin",
                    className: "w-6 h-6",
                    role: "img",
                    viewBox: "0 0 448 512",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", {
                      fill: "currentColor",
                      d: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                    }, void 0, false, {
                      fileName: "app/root.tsx",
                      lineNumber: 158,
                      columnNumber: 17
                    }, this)
                  }, void 0, false, {
                    fileName: "app/root.tsx",
                    lineNumber: 149,
                    columnNumber: 15
                  }, this)
                }, void 0, false, {
                  fileName: "app/root.tsx",
                  lineNumber: 143,
                  columnNumber: 13
                }, this)
              ]
            }, void 0, true, {
              fileName: "app/root.tsx",
              lineNumber: 102,
              columnNumber: 11
            }, this)
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 101,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 7
      }, this)
    ]
  }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 37,
    columnNumber: 5
  }, this);
}
function Document({
  children,
  title
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("head", {
        children: [
          title ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("title", {
            children: title
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 181,
            columnNumber: 18
          }, this) : null,
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            charSet: "utf-8"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 182,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            name: "apple-mobile-web-app-title",
            content: "Edmund.dev"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 183,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            name: "application-name",
            content: "Edmund.dev"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 184,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            name: "msapplication-TileColor",
            content: "#ebece5"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 185,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            name: "theme-color",
            content: "#383835"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 186,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 187,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Meta, {}, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 191,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("link", {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 192,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("link", {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicon-32x32.png"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 197,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("link", {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicon-16x16.png"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 203,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("link", {
            rel: "manifest",
            href: "/site.webmanifest"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 209,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("link", {
            rel: "mask-icon",
            href: "/safari-pinned-tab.svg",
            color: "#ebece5"
          }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 210,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Links, {}, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 211,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 180,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("body", {
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ScrollRestoration, {}, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 215,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Scripts, {}, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 216,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(LiveReload, {}, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 217,
            columnNumber: 52
          }, this)
        ]
      }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 213,
        columnNumber: 7
      }, this)
    ]
  }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 179,
    columnNumber: 5
  }, this);
}
function CatchBoundary() {
  let caught = useCatch(), message = `${caught.status} ${caught.statusText}`;
  switch (caught.status) {
    case 404:
      return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Document, {
        title: caught.statusText,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {
          className: "min-h-screen bg-primary font-open-sans text-primary py-4 flex flex-col justify-center items-center",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("img", {
              className: "w-32 py-4",
              src: "/assets/logo.svg",
              alt: "logo"
            }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 232,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", {
              children: "Oops!"
            }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 233,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", {
              className: "p-4",
              children: message
            }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 234,
              columnNumber: 13
            }, this)
          ]
        }, void 0, true, {
          fileName: "app/root.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this)
      }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 230,
        columnNumber: 9
      }, this);
    default:
      throw new Error(`${caught.status} ${caught.statusText}`);
  }
}
function ErrorBoundary({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Document, {
    title: "It happens",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {
      className: "min-h-screen bg-primary font-open-sans text-primary py-4 flex flex-col justify-center items-center",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("img", {
          className: "w-32 py-4",
          src: "/assets/logo.svg",
          alt: "logo"
        }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 249,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", {
          children: "Well...it happens!"
        }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 250,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", {
          className: "p-4",
          children: "500 Internal server error"
        }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 251,
          columnNumber: 9
        }, this)
      ]
    }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 248,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: "app/root.tsx",
    lineNumber: 247,
    columnNumber: 5
  }, this);
}
var routes_exports = {};
__export2(routes_exports, {
  default: () => Index,
  meta: () => meta2
});
function clearMeta(meta3) {
  let entries = Object.entries(meta3).filter(
    ([key, value]) => typeof value < "u" && value.trim() !== ""
  );
  return Object.fromEntries(entries);
}
function createMetaEnhancer(defaultOptions) {
  return (meta3, options = {}) => {
    let {
      siteName,
      baseURL,
      pathname,
      author,
      type,
      twitterCard,
      twitterSite
    } = { ...defaultOptions, ...options }, title = meta3.title ? `${meta3.title} - ${siteName}` : siteName, url = pathname === "/" ? baseURL : `${baseURL}${pathname}`;
    return clearMeta({
      ...meta3,
      title,
      author: meta3.author ?? author,
      "og:title": title,
      "og:description": meta3.description,
      "og:image": meta3.image,
      "og:type": type,
      "og:site_name": siteName,
      "og:url": url,
      "twitter:card": twitterCard,
      "twitter:site": twitterSite,
      "twitter:title": title,
      "twitter:description": meta3.description,
      "twitter:image": meta3.image
    });
  };
}
var enhanceMeta = createMetaEnhancer({
  siteName: "Edmund.dev",
  baseURL: "https://edmund.dev",
  author: "Edmund Hung",
  type: "website",
  twitterCard: "summary",
  twitterSite: "@ed____hung"
});
var meta2 = ({ location }) => {
  let baseMeta = {
    description: "I'm Edmund, a web engineer specialised in frontend development. Currently working as a frontend developer at @PPRO. Enjoy biking and photography in my leisure time.",
    keywords: ["web", "engineer", "react"].join(",")
  };
  return enhanceMeta(baseMeta, {
    pathname: location.pathname
  });
};
function Index() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", {}, void 0, false, {
    fileName: "app/routes/index.tsx",
    lineNumber: 18,
    columnNumber: 5
  }, this);
}
var assets_manifest_default = { version: "15c99a38", entry: { module: "/build/entry.client-GVO5CWJT.js", imports: ["/build/_shared/chunk-U5IDLJTO.js", "/build/_shared/chunk-IE366Y5W.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-QLUCPPOW.js", imports: void 0, hasAction: false, hasLoader: true, hasCatchBoundary: true, hasErrorBoundary: true }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: true, caseSensitive: void 0, module: "/build/routes/index-TTIMVOTQ.js", imports: void 0, hasAction: false, hasLoader: false, hasCatchBoundary: false, hasErrorBoundary: false } }, url: "/build/manifest-15C99A38.js" };
var assetsBuildDirectory = "public/build";
var publicPath = "/build/";
var entry = { module: entry_server_exports };
var routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};

// worker/adapter.ts
var import_cloudflare = __toESM(require_dist2());
var import_kv_asset_handler = __toESM(require_dist3());
import manifest from "__STATIC_CONTENT_MANIFEST";
var assetManifest = JSON.parse(manifest);
function createRequestHandler({
  build,
  getLoadContext
}) {
  let handleRequest3 = (0, import_cloudflare.createRequestHandler)(build, "development");
  return (request, env, ctx) => {
    let loadContext = typeof getLoadContext === "function" ? getLoadContext(request, env, ctx) : void 0;
    return handleRequest3(request, loadContext);
  };
}
async function handleAsset(request, env, ctx) {
  try {
    return await (0, import_kv_asset_handler.getAssetFromKV)(
      {
        request,
        waitUntil(promise) {
          return ctx.waitUntil(promise);
        }
      },
      {
        cacheControl(request2) {
          const url = new URL(request2.url);
          if (url.pathname.startsWith("/build")) {
            return {
              browserTTL: 60 * 60 * 24 * 365,
              edgeTTL: 60 * 60 * 24 * 365
            };
          }
          return {
            browserTTL: 60 * 10,
            edgeTTL: 60 * 10
          };
        },
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest
      }
    );
  } catch (error) {
    if (error instanceof import_kv_asset_handler.MethodNotAllowedError || error instanceof import_kv_asset_handler.NotFoundError) {
      return new Response("Not Found", { status: 404 });
    }
    throw error;
  }
}

// worker/index.ts
var handleRequest2 = createRequestHandler({
  build: build_exports,
  getLoadContext(request, env, ctx) {
    return { env, ctx };
  }
});
var worker = {
  async fetch(request, env, ctx) {
    try {
      let response = await handleAsset(request, env, ctx);
      if (response.status === 404) {
        response = await handleRequest2(request, env, ctx);
      }
      return response;
    } catch (exception) {
      if (true) {
        return new Response(`${exception}`, { status: 500 });
      }
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
var worker_default = worker;
export {
  worker_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/**
 * @license React
 * react-dom-server-legacy.browser.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-server.browser.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @remix-run/cloudflare v1.7.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/react v1.7.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/server-runtime v1.7.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router DOM v6.3.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router v6.3.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
//# sourceMappingURL=worker.mjs.map
