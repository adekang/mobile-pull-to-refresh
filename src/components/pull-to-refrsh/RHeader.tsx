// @ts-ignore
import React, {memo} from 'react';
import {Text, View} from '@tarojs/components';
import {AtActivityIndicator} from 'taro-ui';

const areEqual = (prevProps, nextProps) => {
  const {status} = prevProps;
  return status === nextProps.status;
};

const textMap = {
  init: '', // 未下拉状态
  pulling: '下拉可以刷新', // 下拉可以刷新
  loosing: '松开可以刷新', // 释放可以刷新
  loading: <View className="loading-box"><AtActivityIndicator/> <Text className="loading-text">加载中...</Text></View>, // 刷新中
  finish: '刷新完成', // 完成刷新
};

const RHeader = (props) => {
  const status = props.status;
  for (let key in textMap) {
    if (status === key) {
      return <View className="yzy-pullToRefresh-textMap">{textMap[key]}</View>;
    }
  }
};

// export default memo(RHeader, areEqual);
