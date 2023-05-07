import {createRoot} from 'react-dom/client';
import {useMemo, useRef} from 'react';
import {useVirtualized} from '@virtualized-toolkit/react';

const items = new Array(100)
  .fill(0)
  .map((_, index) => ({name: `Item ${index + 1}`, index}));

interface ListItemProps {
  name: string;
}

function ListItem({name}: ListItemProps) {
  return <li>{name}</li>;
}

function App() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const {offset, limit, leading, scrollSize} = useVirtualized({
    target: scrollerRef,
    itemSize: 30,
    itemCount: items.length,
  });

  const list = useMemo(
    () =>
      items
        .slice(offset, offset + limit)
        .map(({name, index}) => <ListItem name={name} key={index}></ListItem>),
    [offset, limit],
  );

  return (
    <div className="scroller" ref={scrollerRef}>
      <div className="wrapper" style={{height: `${scrollSize}px`}}>
        <ul className="list" style={{transform: `translate(0, ${leading}px)`}}>
          {list}
        </ul>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
