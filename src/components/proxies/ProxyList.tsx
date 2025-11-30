import cx from 'clsx';
import * as React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

import { Proxy, ProxySmall } from './Proxy';
import s from './ProxyList.module.scss';

type ProxyListProps = {
  all: string[];
  now?: string;
  isSelectable?: boolean;
  itemOnTapCallback?: (x: string) => void;
  show?: boolean;
};

function useContainerWidth(ref: React.RefObject<HTMLDivElement>) {
  const [width, setWidth] = React.useState<number>(0);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const cr = entry.contentRect;
      setWidth(cr.width);
    });
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
    };
  }, [ref]);
  return width;
}

export function ProxyList({ all, now, isSelectable, itemOnTapCallback }: ProxyListProps) {
  const proxies = all;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  const useVirtual = proxies.length > 200;
  const columnWidth = 220;
  const rowHeight = 76;
  const columnCount = Math.max(1, Math.floor(width / columnWidth));
  const rowCount = Math.ceil(proxies.length / columnCount);

  return (
    <div ref={containerRef} className={cx(s.list, s.detail)}>
      {useVirtual && width > 0 ? (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={Math.min(600, rowCount * rowHeight)}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={width}
          itemKey={({ columnIndex, rowIndex }) => {
            const index = rowIndex * columnCount + columnIndex;
            return proxies[index] ?? `empty-${rowIndex}-${columnIndex}`;
          }}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex;
            const proxyName = proxies[index];
            if (!proxyName) return <div style={style} />;
            return (
              <div style={style}>
                <Proxy
                  onClick={itemOnTapCallback}
                  isSelectable={isSelectable}
                  name={proxyName}
                  now={proxyName === now}
                />
              </div>
            );
          }}
        </Grid>
      ) : (
        proxies.map((proxyName) => {
          return (
            <Proxy
              key={proxyName}
              onClick={itemOnTapCallback}
              isSelectable={isSelectable}
              name={proxyName}
              now={proxyName === now}
            />
          );
        })
      )}
    </div>
  );
}

export function ProxyListSummaryView({
  all,
  now,
  isSelectable,
  itemOnTapCallback,
}: ProxyListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);
  const useVirtual = all.length > 400;
  const columnWidth = 22; // 12px dot + gap
  const rowHeight = 22;
  const columnCount = Math.max(1, Math.floor(width / columnWidth));
  const rowCount = Math.ceil(all.length / columnCount);

  return (
    <div ref={containerRef} className={cx(s.list, s.summary)}>
      {useVirtual && width > 0 ? (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={Math.min(240, rowCount * rowHeight)}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={width}
          itemKey={({ columnIndex, rowIndex }) => {
            const index = rowIndex * columnCount + columnIndex;
            return all[index] ?? `empty-${rowIndex}-${columnIndex}`;
          }}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex;
            const proxyName = all[index];
            if (!proxyName) return <div style={style} />;
            return (
              <div style={style}>
                <ProxySmall
                  onClick={itemOnTapCallback}
                  isSelectable={isSelectable}
                  name={proxyName}
                  now={proxyName === now}
                />
              </div>
            );
          }}
        </Grid>
      ) : (
        all.map((proxyName) => {
          return (
            <ProxySmall
              key={proxyName}
              onClick={itemOnTapCallback}
              isSelectable={isSelectable}
              name={proxyName}
              now={proxyName === now}
            />
          );
        })
      )}
    </div>
  );
}
