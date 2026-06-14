import { useEffect, useRef } from 'react';

const useAutoScroll = (dependencies) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, dependencies);

  return scrollRef;
};

export default useAutoScroll;