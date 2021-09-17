// @ts-ignore
import React, {useEffect, useState} from 'react';
import PullRefresh from '../../components/pull-to-refrsh';
import './index.scss';

const RowRender = props => {
  const {index} = props;
  return (
    <div
      style={{
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'pink',
        color: '#fff'
      }}
    >
      {index}
    </div>
  );
};

const Index = () => {
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;
  useEffect(() => {
    get(1);
  }, []);

  const get = _pageNum => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newList = new Array(_pageNum === 4 ? 2 : 10)
          .fill(true)
          .map((_, index) => (_pageNum - 1) * pageSize + index);

        setList(_pageNum === 1 ? newList : list.concat(newList));
        setPageNum(_pageNum);
        setHasMore(_pageNum < 4);
        resolve('ok');
      }, 800);
    });
  };

  const refresh = () => {
    return get(1);
  };

  return (
    <div className="Fcontainer">
      <div className="box">123</div>
      <PullRefresh refresh={refresh}>
        {list.map(index => (
          <RowRender index={index} key={index}/>
        ))}
      </PullRefresh>
    </div>
  );
};
export default Index;
