import { useEffect } from "react";

type ScrollLockSnapshot = {
  scrollX: number;
  scrollY: number;
  rootOverflow: string;
  rootOverscrollBehavior: string;
  rootScrollBehavior: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyWidth: string;
  bodyOverflow: string;
  bodyOverscrollBehavior: string;
  bodyPaddingRight: string;
};

let activeScrollLocks = 0;
let scrollLockSnapshot: ScrollLockSnapshot | null = null;

/**
 * Prevents wheel and touch scrolling from reaching the page behind a modal.
 * Locks are reference-counted so stacked dialogs restore the document only
 * after the last one closes.
 */
export function useDocumentScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockDocumentScroll();
    return unlockDocumentScroll;
  }, [locked]);
}

function lockDocumentScroll() {
  activeScrollLocks += 1;
  if (activeScrollLocks !== 1) return;

  const root = document.documentElement;
  const body = document.body;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
  const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

  scrollLockSnapshot = {
    scrollX,
    scrollY,
    rootOverflow: root.style.overflow,
    rootOverscrollBehavior: root.style.overscrollBehavior,
    rootScrollBehavior: root.style.scrollBehavior,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    bodyOverscrollBehavior: body.style.overscrollBehavior,
    bodyPaddingRight: body.style.paddingRight,
  };

  root.style.overflow = "hidden";
  root.style.overscrollBehavior = "none";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = `-${scrollX}px`;
  body.style.width = "100%";
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "none";
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
  }
}

function unlockDocumentScroll() {
  if (activeScrollLocks === 0) return;
  activeScrollLocks -= 1;
  if (activeScrollLocks > 0) return;

  const snapshot = scrollLockSnapshot;
  scrollLockSnapshot = null;
  if (!snapshot) return;

  const root = document.documentElement;
  const body = document.body;
  root.style.overflow = snapshot.rootOverflow;
  root.style.overscrollBehavior = snapshot.rootOverscrollBehavior;
  body.style.position = snapshot.bodyPosition;
  body.style.top = snapshot.bodyTop;
  body.style.left = snapshot.bodyLeft;
  body.style.width = snapshot.bodyWidth;
  body.style.overflow = snapshot.bodyOverflow;
  body.style.overscrollBehavior = snapshot.bodyOverscrollBehavior;
  body.style.paddingRight = snapshot.bodyPaddingRight;

  root.style.scrollBehavior = "auto";
  window.scrollTo(snapshot.scrollX, snapshot.scrollY);
  root.style.scrollBehavior = snapshot.rootScrollBehavior;
}
