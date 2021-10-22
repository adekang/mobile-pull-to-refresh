// @ts-ignore
import React, {useEffect, useRef, useState} from 'react';
import PullRefresh from '../../components/pull-to-refrsh';
import './index.scss';
// @ts-ignore
import yzy from '../../images/yzy.png';
import {Image} from '@tarojs/components';

const RowRender = (props: { index: any }) => {
  const {index} = props;
  return (
    <div
      style={{
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'pink'
      }}
    >
      {index}
    </div>
  );
};

const Index = () => {
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  let [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const page = useRef<number>();
  page.current = 1;

  useEffect(() => {
    get(1);
  }, []);
  const get = (pageNum: number) => {
    setTimeout(() => {
      const newList = new Array(pageNumber)
        .fill(true)
        .map((item, index) => index + 1);
      // @ts-ignore
      setList(pageNumber === 1 ? newList : list.concat(newList));
      setPageNumber((pageNumber += pageNum));
      // @ts-ignore
      page.current += 3;
    });
  };

  const refresh = () => {
    return get(2);
  };


  return (
    <div className="FContainer">
      <div className="box">123</div>

      <PullRefresh
        distanceToRefresh={56}
        onRefresh={refresh}
        getScrollContainer={false}
        className="box"
        loadColor="#330066"
      >
        {list.map(index => (
          <RowRender index={index} key={index}/>
        ))}
      </PullRefresh>
    </div>
  );
};
export default Index;
