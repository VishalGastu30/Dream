/**
 * experience/director/store.ts
 *
 * Minimal typed state machine for the experience.
 * X0 placeholder — only exposes `state` and `setState`.
 * Full Director implementation in X1.
 */
export type ExperienceState = "boot" | "intro" | "choice" | "story" | "explore" | "reader";

type Store = {
  state: ExperienceState;
  setState: (s: ExperienceState) => void;
  listeners: Set<() => void>;
};

const store: Store = {
  state: "boot",
  setState(s) {
    store.state = s;
    for (const fn of store.listeners) fn();
  },
  listeners: new Set(),
};

export function getState() {
  return store.state;
}

export function setState(s: ExperienceState) {
  store.setState(s);
}

export function subscribe(fn: () => void) {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}
