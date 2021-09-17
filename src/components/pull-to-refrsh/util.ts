let passiveIfSupported = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      passiveIfSupported = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (e) {
  // empty
}

export const bindEvents = (ele: HTMLElement, events) => {
  Object.keys(events).forEach((event) => {
    const handle = events[event];
    ele.addEventListener(
      event,
      handle,
      passiveIfSupported ? {passive: false} : false
    );
  });
};

export const unbindEvents = (ele: HTMLElement, events) => {
  Object.keys(events).forEach((event) => {
    const handle = events[event];
    ele.removeEventListener(event, handle);
  });
};

export function addEvent(obj, type, fn) {
  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function () { obj['e' + type + fn](window.event); };
    obj.attachEvent('on' + type, obj[type + fn]);
  } else
    obj.addEventListener(type, fn, false, {passive: false});
}

export function removeEvent(obj, type, fn) {
  if (obj.detachEvent) {
    obj.detachEvent('on' + type, obj[type + fn]);
    obj[type + fn] = null;
  } else
    obj.removeEventListener(type, fn, false);
}

export const PullDownStatus = {
  init: 'init', // 未下拉状态
  pulling: 'pulling', // 下拉可以刷新
  loosing: 'loosing', // 释放可以刷新
  loading: 'loading', // 刷新中
  finish: 'finish', // 完成刷新
};

export const setAnimation = (style, {transform, transitionDuration}) => {
  style.transitionDuration = transitionDuration;
  style.webkitTransitionDuration = transitionDuration;
  style.MozTransitionDuration = transitionDuration;

  style.transform = transform;
  style.webkitTransform = transform;
  style.MozTransform = transform;
};

export const isShallowEqual = (a, b) => {
  return Object.keys(a).every((key) => {
    if (a[key] instanceof Function && b[key] instanceof Function) return true;
    return a[key] === b[key];
  });
};
