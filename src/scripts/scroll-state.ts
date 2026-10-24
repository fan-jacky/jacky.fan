// Shared locomotive-scroll state, mirroring the former LocomotiveScrollPositionContext.
export type ScrollPos = {
  limit: { x: number; y: number };
  scroll: { x: number; y: number };
};

const state = {
  scrollPos: {
    limit: { x: 0, y: 0 },
    scroll: { x: 0, y: 0 },
  } as ScrollPos,
  instance: null as any,
};

const listeners = new Set<() => void>();

export function setScrollPos(pos: ScrollPos) {
  state.scrollPos = pos;
  listeners.forEach((fn) => fn());
}

export function getScrollPos(): ScrollPos {
  return state.scrollPos;
}

export function setLocoInstance(instance: any) {
  state.instance = instance;
}

export function getLocoInstance() {
  return state.instance;
}

export function onScrollPos(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
