import React, {memo, useEffect, useRef, useState} from 'react';
import './index.scss';
import {View} from '@tarojs/components';
import {bindEvents, PullDownStatus, setAnimation, unbindEvents} from './util';
import useTouch from '../../hooks/useTouch';

// import RHeader from './RHeader';

interface RefreshProps {
  style?: any; // 自定义container的样式
  distanceToRefresh?: number; // 触发刷新的距离
  refresh: () => Promise<any>; // 刷新的函数
  duration?: number; // 下拉动画时间
  stayTime?: number; // loading加载时间
  headerHeight?: number; // 头部加载的高度
  radius?: number,  // loading的大小 最好 24
  stroke?: number,  // border大小
  loadColor?: string // border color
  loadText?: any  // loading 文字 或图
  children: any;
}

export default (props: RefreshProps) => {
  const {
    children,
    style = {},
    distanceToRefresh = 56,
    duration = 100, // 100ms过渡最佳
    headerHeight = 56,
    stayTime = 300,
    refresh
  } = props;

  const touch = useTouch();
  const wrapRef = useRef<HTMLElement>();
  const bodyRef = useRef<HTMLElement>();
  const [height, setHeight] = useState(0);
  const ptRefresh = useRef<string>();
  const isIos = useRef<boolean>();

  ptRefresh.current = PullDownStatus.init;
  const [sendStatus, setSendStatus] = useState<string>(PullDownStatus.init);

  const update = (distanceY: number, status?: string) => {
    setHeight(distanceY);
    let t = status;
    if (!t) {
      if (distanceY === 0) {
        t = PullDownStatus.init;
      } else if (distanceY < distanceToRefresh) {
        t = PullDownStatus.pulling;
      } else {
        t = PullDownStatus.loosing;
      }
    }
    setSendStatus(t);
    ptRefresh.current = t;
  };

  useEffect(() => {
    setAnimation(bodyRef?.current?.style, {
      transitionDuration: `${duration}ms`,
      transform: `translate3d(0px,${height}px,1px)`
    });
  }, [height]);


  const invokeRefresh = () => {
    refresh().then((res) => {
      update(headerHeight, PullDownStatus.finish);
      setTimeout(() => {
        update(0);
      }, stayTime);
    }).catch((e) => {});
  };

  const canRefresh = () => {
    return (
      ptRefresh.current !== PullDownStatus.loading &&
      ptRefresh.current !== PullDownStatus.finish
    );
  };

  const checkIsIos = () => {
    // iOS下 scrollTop 会出现bounce，导致出现负值
    isIos.current = Math.max(wrapRef?.current?.scrollTop as number, 0) === 0;
    return isIos.current;
  };

  const ease = (distanceY: number) => {
    const availHeight = window.screen.availHeight;
    return (availHeight / 2.5) * Math.sin(distanceY / availHeight * (Math.PI / 2));
  };

  const onTouchStart = (e: Event) => {
    if (!canRefresh()) {
      return;
    }
    if (checkIsIos()) {
      touch.start(e);
    }
  };

  const onTouchMove = (e: Event) => {
    if (!canRefresh()) {
      return;
    }
    if (!isIos.current) {
      if (checkIsIos()) {
        touch.start(e);
      }
    }
    touch.move(e);
    if (touch.offsetX.current > 20 * window.devicePixelRatio) {
      return;
    }

    if (touch.deltaY.current >= 0 && wrapRef.current && wrapRef.current.scrollTop <= 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const distanceY = ease(touch.offsetY.current);
      update(distanceY);
    }
  };

  const onTouchEnd = () => {
    if (!canRefresh()) {
      return;
    }
    if (touch.offsetY.current) {
      if (ptRefresh.current === PullDownStatus.loosing) {
        update(headerHeight, PullDownStatus.loading);
        invokeRefresh();
        touch.reset();
      } else {
        update(0);
      }
    }
  };

  const bodyRefEvents = {
    touchstart: onTouchStart,
    touchmove: onTouchMove,
    touchend: onTouchEnd,
    touchcancel: onTouchEnd
  };

  const init = () => {
    if (bodyRef.current) {bindEvents(bodyRef.current, bodyRefEvents);}
  };

  const destroy = () => {
    if (bodyRef.current) {unbindEvents(bodyRef.current, bodyRefEvents);}
  };

  useEffect(() => {
    init();
    return () => {
      destroy();
    };
  }, []);

  const {radius = 25, stroke = 4, loadColor, loadText = '...'} = props;
  const [progress, setProgress] = useState(0);
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  useEffect(() => {
    if (height === 0) {
      setProgress(item => item = 0);
    }
    setProgress(item => item = height);
    if (height > 100 || height === 56) {
      setProgress(item => item = 100);
      return;
    }
  }, [height]);


  return (
    <View className="yzy-pullToRefresh-container" ref={wrapRef} style={style}>
      <View className="yzy-pullToRefresh-body" ref={bodyRef}>
        <View className="yzy-pullToRefresh-header" style={{height: headerHeight + 'px'}}>
          {/*<RHeader status={sendStatus}/>*/}
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
          <View className="yzy-pullToRefresh-svg-box">{loadText}</View>
        </View>
        <View className="yzy-pullToRefresh-children">{children}</View>
      </View>
    </View>
  );
};
