// @ts-ignore
import React, {memo} from 'react';
import {PullDownStatus} from './util';
import {View} from '@tarojs/components';

const areEqual = (prevProps, nextProps) => {
  const {status} = prevProps;
  return status === nextProps.status;
};


const RHeader = (props) => {
  const status = props.status;
  console.log('RHeader', status);
  let child = null;
  switch (status) {
    case PullDownStatus.init:
    case PullDownStatus.pulling:
      child = <span>下拉可以刷新</span>;
      break;
    case PullDownStatus.loading:
      child = <span>加载中...</span>;
      break;
    case PullDownStatus.loosing:
      child = <span>松开可以刷新</span>;
      break;
    case PullDownStatus.finish:
      child = <span>刷新完成</span>;
      break;
    default:
      break;
  }
  return <View className="rheader">{child}</View>;
};

export default memo(RHeader, areEqual);
