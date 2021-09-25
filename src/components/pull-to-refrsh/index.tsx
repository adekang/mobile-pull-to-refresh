import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { View } from "@tarojs/components";
import { bindEvents, PullDownStatus, setAnimation, unbindEvents } from "./util";
import useTouch from "@/hooks/useTouch";

interface RefreshProps {
  distanceToRefresh?: number; // 触发刷新的距离
  refresh: () => void; // 刷新的函数
  stayTime?: number; // loading加载时间
  headerHeight?: number; // 头部加载的高度
  radius?: number; // loading的大小 最好 24
  stroke?: number; // border大小
  loadColor?: string; // border color
  loadText?: any; // loading 文字 或图
  children: any;
}

export default (props: RefreshProps) => {
  const {
    children,
    distanceToRefresh = 56,
    headerHeight = 56,
    stayTime = 300,
    refresh
  } = props;

  const touch = useTouch();
  const wrapRef = useRef<HTMLElement>();
  const bodyRef = useRef<HTMLElement>();
  const [height, setHeight] = useState(0);
  const ptRefresh = useRef<string>();
  const isEdge = useRef<boolean>();
  const moveX = useRef<number>();
  const wrapRefTop = useRef<number>();

  ptRefresh.current = PullDownStatus.init;
  const [, setSendStatus] = useState<string>(PullDownStatus.init);

  // 状态改变函数
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
    const duration = 100;
    setAnimation(bodyRef.current?.style, {
      transitionDuration: `${duration}ms`,
      transform: `translate3d(0px,${height}px,1px)`
    });
  }, [height]);

  const invokeRefresh = () => {
    refresh();
    update(headerHeight, PullDownStatus.finish);
    setTimeout(() => {
      update(0);
    }, stayTime);
  };

  const canRefresh = () => {
    return (
      ptRefresh.current !== PullDownStatus.loading &&
      ptRefresh.current !== PullDownStatus.finish
    );
  };

  const checkIsEdge = () => {
    // iOS下 scrollTop 会出现bounce，导致出现负值
    isEdge.current = Math.max(wrapRef?.current?.scrollTop as number, 0) === 0;
    return isEdge.current;
  };

  const ease = (distanceY: number) => {
    const availHeight = window.screen.availHeight;
    return (
      (availHeight / 2.5) * Math.sin((distanceY / availHeight) * (Math.PI / 2))
    );
  };

  const onTouchStart = (e: Event) => {
    if (!canRefresh()) {
      return;
    }
    if (checkIsEdge()) {
      touch.start(e);
    }
  };

  useEffect(() => {
    wrapRefTop.current = wrapRef.current?.getBoundingClientRect().top;
  }, []);

  const onTouchMove = (e: TouchEvent, ele: HTMLElement) => {
    if (!canRefresh()) {
      return;
    }
    if (
      (wrapRefTop.current as number) >
      (wrapRef.current?.getBoundingClientRect().top as number)
    )
      return;
    if (!isEdge.current) {
      if (checkIsEdge()) {
        touch.start(e);
      }
    }
    touch.move(e);
    if (touch.offsetX.current > 20 * window.devicePixelRatio) {
      return;
    }

    moveX.current = e.touches[0].clientY;

    if (touch.startY.current > moveX.current) return;
    if (touch.deltaY.current >= 0) {
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
    if (bodyRef.current) {
      bindEvents(bodyRef.current, bodyRefEvents);
    }
  };

  const destroy = () => {
    if (bodyRef.current) {
      unbindEvents(bodyRef.current, bodyRefEvents);
    }
  };

  useEffect(() => {
    init();
    return () => {
      destroy();
    };
  }, []);

  // 控制圆圈效果
  const { radius = 25, stroke = 4, loadColor, loadText = "..." } = props;
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

  return (
    <View className="yzy-pullToRefresh-container" ref={wrapRef}>
      <View className="yzy-pullToRefresh-body" ref={bodyRef}>
        <View
          className="yzy-pullToRefresh-header"
          style={{ height: headerHeight + "px" }}
        >
          <svg
            height={radius * 2}
            width={radius * 2}
            className="yzy-pullToRefresh-svg"
          >
            <circle
              stroke={loadColor}
              fill="none"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
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
