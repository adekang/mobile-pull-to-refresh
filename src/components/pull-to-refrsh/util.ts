let passiveIfSupported = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      passiveIfSupported = true;
    },
  });
  // @ts-ignore
  window.addEventListener('test', null, opts);
} catch (e) {
  // empty
}

// @ts-ignore
export const bindEvents = (ele: HTMLElement, events) => {
  Object.keys(events).forEach(event => {
    const handle = events[event];
    ele.addEventListener(event, handle, passiveIfSupported ? {passive: false} : false);
  });
};

// @ts-ignore
export const unbindEvents = (ele: HTMLElement, events) => {
  Object.keys(events).forEach(event => {
    const handle = events[event];
    ele.removeEventListener(event, handle);
  });
};

export const PullDownStatus = {
  init: 'init', // 未下拉状态
  pulling: 'pulling', // 下拉可以刷新
  loosing: 'loosing', // 释放可以刷新
  loading: 'loading', // 刷新中
  finish: 'finish', // 完成刷新
};

// @ts-ignore
export const setAnimation = (style, {transform, transitionDuration}) => {
  style.transitionDuration = transitionDuration;
  style.webkitTransitionDuration = transitionDuration;
  style.MozTransitionDuration = transitionDuration;
  style.transform = transform;
  style.webkitTransform = transform;
  style.MozTransform = transform;
};

export function debounce(fn: any, delay: number): any {
  console.log(fn);

  let timerId: any = null;
  return function () {
    // @ts-ignore
    const context = this;
    if (timerId) {
      window.clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(context, arguments);
      timerId = null;
    }, delay);
  };
}
