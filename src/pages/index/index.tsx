// @ts-ignore
import React, { useEffect, useRef, useState } from "react";
import PullRefresh from "../../components/pull-to-refrsh";
import "./index.scss";
// @ts-ignore
import yzy from "../../images/yzy.png";
import { Image } from "@tarojs/components";

const RowRender = (props: { index: any }) => {
  const { index } = props;
  return (
    <div
      style={{
        height: 80,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "pink"
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
      page.current += 1;
    });
  };

  const refresh = () => {
    return get(1);
  };

  const loadText = <Image src={yzy} className="loadingText" />;

  return (
    <div className="FContainer">
      <div className="box">123</div>

      <PullRefresh
        refresh={refresh}
        distanceToRefresh={56}
        headerHeight={56}
        stayTime={300}
        loadColor="#ffce03"
        loadText={loadText}
        isContainer={true}
      >
        {list.map(index => (
          <RowRender index={index} key={index} />
        ))}
      </PullRefresh>
    </div>
  );
};
export default Index;
