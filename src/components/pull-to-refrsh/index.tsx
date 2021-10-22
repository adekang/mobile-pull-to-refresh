import React, {useRef, useEffect, useState} from 'react';
import classNames from 'classnames';
import './index.scss';
import {View} from '@tarojs/components';
import {bindEvents, unbindEvents} from './util';
import useTouch from '../../hooks/useTouch';


const isWebView =
  typeof navigator !== 'undefined' &&
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

function setTransform(nodeStyle: any, value: any) {
  nodeStyle.transform = value;
  nodeStyle.webkitTransform = value;
  nodeStyle.MozTransform = value;
}

interface Props {
  distanceToRefresh: number;
  onRefresh: () => void;
  getScrollContainer: boolean;
  children: any;
  className: string;
  loadColor: string;
}

const PullDownStatus = {
  init: 'init', // 未下拉状态
  pulling: 'pulling', // 下拉可以刷新
  // loosing: 'loosing', // 释放可以刷新
  loading: 'loading', // 刷新中
  finish: 'finish', // 完成刷新
};

const PullToRefresh: React.FC<Props> = props => {
  const {distanceToRefresh, onRefresh, children, getScrollContainer, className} = props;
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const contentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const touch = useTouch();
  const dragOnEdge = useRef(false);
  const ptRefresh = useRef<string>(PullDownStatus.init);
  const [height, setHeight] = useState(0);

  // 活动距离设置
  const easing = (dy: number) => {
    const ratio = dy / window.screen.height;
    dy *= (1 - ratio) * 0.6;

    return dy;
  };

  //  获得父级框架
  const scrollContainer = () => {
    return document.querySelector('.taro-tabbar__panel') || document.body;
  };

  const isEdge = (ele: Element) => {
    const container = scrollContainer();
    console.log(container.scrollTop);
    //  如果时全屏滑动
    if (container && container === document.body) {
      // In chrome61 `document.body.scrollTop` is invalid
      const scrollNode = document.scrollingElement ? document.scrollingElement : document.body;

      return scrollNode.scrollTop <= 0;
    }
    // 是局部滑动
    return ele.scrollTop <= 0;
  };

  //  滑动效果
  const contentStyle = (dy: number) => {
    if (contentRef.current) {
      if (dy) {
        setTransform(contentRef.current.style, `translate3d(0px,${dy}px,0)`);
      } else {
        setTransform(contentRef.current.style, '');
      }
    }
  };

  const reset = () => {
    setHeight(0);
    update(0);
    contentStyle(0);
  };

  const triggerPullToRefresh = () => {
    if (!dragOnEdge.current) {
      ptRefresh.current = PullDownStatus.init;
    } else {
      ptRefresh.current = PullDownStatus.finish;
      reset();
    }
  };

  const update = (dy: number, status?: string) => {
    let t = status;
    if (!t) {
      if (dy === 0) {
        t = PullDownStatus.init;
      } else if (dy < distanceToRefresh) {
        t = PullDownStatus.pulling;
      } else {
        t = PullDownStatus.loading;
      }
    }
    ptRefresh.current = t;
  };

  const onTouchStart = (e: TouchEvent) => {
    const ele = scrollContainer();
    if (isEdge(ele)) {
      touch.start(e);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    //  控制header滑动距离
    if (ptRefresh.current === 'loading') return;

    const ele = scrollContainer();
    touch.move(e);
    if (touch.offsetX.current > 20 * window.devicePixelRatio) return;

    if (touch.startY.current > touch.moveY.current) return;

    if (!ele) return;
    console.log(isEdge(ele));

    if (isEdge(ele)) {
      if (!dragOnEdge.current) {
        dragOnEdge.current = true;
      }

      if (e.cancelable) {
        e.preventDefault;
      }

      const distanceY = easing(touch.offsetY.current);
      setHeight(distanceY);
      contentStyle(distanceY);
      update(distanceY);

      if (isWebView && e.changedTouches[0].clientY < 0) {
        onTouchEnd();
      }
    }
  };
  let canRefresh = false;

  const invokeRefresh = () => {
    let id: any = setTimeout(() => {
      if (canRefresh) {
        onRefresh();
      }
      canRefresh = false;
      update(100, PullDownStatus.finish);
      reset();
      id = null;
    }, 2000);
  };

  const onTouchEnd = () => {
    if (dragOnEdge.current) {
      dragOnEdge.current = false;
    }
    if (ptRefresh.current === 'loading') {
      contentStyle(56);
      canRefresh = true;
      invokeRefresh();
      touch.reset();
    } else {
      reset();
    }
  };

  const bodyRefEvents = {
    touchstart: onTouchStart,
    touchmove: onTouchMove,
    touchend: onTouchEnd,
    touchcancel: onTouchEnd,
  };

  const init = (ele: Element | null) => {
    if (ele) {
      triggerPullToRefresh();
      bindEvents(ele as HTMLElement, bodyRefEvents);
    }
  };

  const destroy = (ele: Element | null) => {
    if (ele) {
      unbindEvents(ele as HTMLElement, bodyRefEvents);
    }
  };

  useEffect(() => {
    init(scrollContainer());
    return () => {
      destroy(scrollContainer());
    };
  }, []);

  // 控制圆圈效果
  const {loadColor} = props;
  const radius = 25;
  const stroke = 4;
  const [progress, setProgress] = useState(0);
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (height === 0) {
      setProgress(item => (item = 0));
    }
    setProgress(item => (item = height));
    if (height > 100 || height === 56) {
      setProgress(item => (item = 100));
      return;
    }
  }, [height]);

  const prefixCls = 'lu';
  const cla = classNames(`${prefixCls}-content`, !dragOnEdge.current && `${prefixCls}-transition`);
  return (
    <View ref={containerRef} className={classNames(prefixCls, className, `${prefixCls}-down`)}>
      <View className={`${prefixCls}-content-wrapper`}>
        <View ref={contentRef} className={cla}>
          <View className={`${prefixCls}-indicator`} style={{minHeight: distanceToRefresh + 'px'}}>
            <svg
              height={radius * 2}
              width={radius * 2}
              className="yzy-pullToRefresh-svg"
            >
              <circle
                stroke={loadColor}
                fill="none"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            {/*<div>{loadText()}</div>*/}
          </View>
          {children}
        </View>
      </View>
    </View>
  );
};

export default PullToRefresh;

