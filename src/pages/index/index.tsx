// @ts-ignore
import React, {useEffect, useRef, useState} from 'react';
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
  const get = pageNum => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newList = new Array(pageNumber)
          .fill(true)
          .map((item, index) => index + 1);
        setList(pageNumber === 1 ? newList : list.concat(newList));
        setPageNumber(pageNumber += pageNum);
        page.current += 1;
        resolve('ok');
      }, 800);
    });
  };

  const refresh = () => {
    return get(1);
  };

  return (
    <div className="FContainer">
      <div className="box">123</div>
      <PullRefresh
        refresh={refresh}
        distanceToRefresh={56}
        headerHeight={56}
        stayTime={300}
      >
        {list.map(index => (
          <RowRender index={index} key={index}/>
        ))}
      </PullRefresh>
    </div>
  );
};
export default Index;
