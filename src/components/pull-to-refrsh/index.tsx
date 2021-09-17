// @ts-ignore
import React, {memo, useEffect, useRef, useState} from 'react';
import './index.scss';
import {View} from '@tarojs/components';
import {bindEvents, PullDownStatus, setAnimation, unbindEvents, isShallowEqual} from './util';
import useTouch from '../../hooks/useTouch';
import RHeader from './RHeader';

interface RefreshProps {
  style?: any; // 自定义的样式
  distanceToRefresh?: number; // 触发刷新的距离
  refresh: () => Promise<any>; // 刷新的函数
  duration?: number; // 动画时间
  stayTime?: number; // 延迟时间
  headerHeight?: number; // 头部加载的高度
  loadMore?: () => void; // 加载更多
  maxDistance?: number; // 最大限制距离
  children;
}

export default (props: RefreshProps) => {
  const {
    children,
    style = {},
    distanceToRefresh = 56,
    duration = 250,
    headerHeight = 56,
    stayTime = 300,
    maxDistance = 3000,
    refresh
  } = props;

  const touch = useTouch();
  const wrapRef = useRef<HTMLElement>();
  const bodyRef = useRef<HTMLElement>();

  const [height, setHeight] = useState(0);
  const ptRefresh = useRef<string>();
  const isEdge = useRef<boolean>();

  ptRefresh.current = PullDownStatus.init;

  const update = (headerHeight: number, status?: string) => {
    setHeight(headerHeight);
    let t = status;
    if (!t) {
      if (headerHeight === 0) {
        t = PullDownStatus.init;
      } else if (headerHeight < distanceToRefresh) {
        t = PullDownStatus.pulling;
      } else {
        t = PullDownStatus.loosing;
      }
    }
    ptRefresh.current = t;
  };

  useEffect(() => {
    setAnimation(bodyRef.current.style, {
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
      console.log(res);
    });
  };

  const canRefresh = () => {
    return (
      ptRefresh.current !== PullDownStatus.loading &&
      ptRefresh.current !== PullDownStatus.finish
    );
  };


  const checkIsEdge = () => {
    // iOS下 scrollTop 会出现bounce，导致出现负值
    isEdge.current = Math.max(wrapRef?.current?.scrollTop, 0) === 0;
    return isEdge.current;
  };

  const ease = (distanceY: number) => {
    const availHeight = window.screen.availHeight;
    return (availHeight / 2.5) * Math.sin(distanceY / availHeight * (Math.PI / 2));
  };

  const onTouchStart = e => {
    if (!canRefresh()) {
      return;
    }
    if (checkIsEdge()) {
      touch.start(e);
    }
  };


  const onTouchMove = e => {
    if (!canRefresh()) {
      return;
    }
    if (!isEdge.current) {
      if (checkIsEdge()) {
        touch.start(e);
      }
    }
    touch.move(e);
    if (touch.offsetX.current > 20 * window.devicePixelRatio) {
      return;
    }

    if (touch.deltaY.current >= 0 && wrapRef.current.scrollTop <= 0) {
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
    bindEvents(bodyRef.current, bodyRefEvents);
  };

  const destroy = () => {
    unbindEvents(bodyRef.current, bodyRefEvents);
  };

  useEffect(() => {
    console.log('执行了');
    init();
    return () => {
      console.log('销毁了');
      destroy();
    };
  }, []);

  return (
    <View className="container" ref={wrapRef} style={style}>
      <View className="body" ref={bodyRef}>
        <View className="header" style={{height: headerHeight + 'px'}}>
          <RHeader status={ptRefresh.current}/>
        </View>
        <View className="children">{children}</View>
      </View>
    </View>
  );
};
