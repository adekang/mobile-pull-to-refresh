import { useEffect, useRef } from "react";
import { debounce } from "@/utils/common";

interface IPull {
  ele: HTMLElement;
  onReachBottomDistance: number;
  onReachBottom: (...arg: any) => void;
  disabled: boolean;
}

export default (props: IPull, pagePath = "page/index") => {
  const { ele, onReachBottomDistance = 100, disabled, onReachBottom } = props;

  const ref = useRef({
    handler: onReachBottom
  });
  const disRef = useRef<boolean>(disabled);

  disRef.current = disabled;

  ref.current.handler = onReachBottom;

  useEffect(() => {
    if (!ele) {
      return;
    }
    const __onReachBottom = debounce(() => {
      if (disRef.current) {
        return;
      }
      if (!window.location.href.includes(pagePath)) {
        return;
      }
      // 加载盒子的高度
      const onPullUpHeight = ele.clientHeight;
      // 视口的高度
      const documentHeight = document.documentElement.clientHeight;
      // 网页卷起来的高度
      const documentTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset;
      if (
        onPullUpHeight - onReachBottomDistance <=
        documentHeight + documentTop
      ) {
        ref.current?.handler();
      }
    }, 100);

    window.addEventListener("scroll", __onReachBottom);

    return () => {
      window.removeEventListener("scroll", __onReachBottom);
    };
  }, [ele]);
};
