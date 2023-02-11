<script>
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

export let leftPaneSizePx = null;
export let leftPaneSizePcent = null;

export let minLeftPaneSize_PxOrPcent = "0px",
  minRightPaneSize_PxOrPcent = "0px";
export let separatorWidth = 2;

// export let allowResize = false;
export let updateCallback = () => {
  return;
};

let wrapperWidth, left, delta;
let eStartData;
let leftWidth, rightWidth; ///// DONT USE EXCEPT FOR DISPATCH

// use given value (in percent or PX), default to 50%
$: usingPcent = leftPaneSizePx == null ? true : false;

$: leftPaneSizeCalc =
  leftPaneSizePx != null
    ? leftPaneSizePx
    : leftPaneSizePcent != null
    ? leftPaneSizePcent
    : 50;

//// main functions ////
const onMouseDown = (e) => {
  e.preventDefault();
  eStartData = {
    mouseX: e.clientX,
    firstWidth: left.offsetWidth, // lagbe?
    initialPercent: leftPaneSizeCalc,
  };
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e) => {
  e.preventDefault();
  if (e.button !== 0) return;
  delta = e.clientX - eStartData.mouseX;
  if (usingPcent) {
    delta = (delta / wrapperWidth) * 100;
    leftPaneSizeCalc = eStartData.initialPercent + delta;
  } else {
    leftPaneSizeCalc = eStartData.firstWidth + delta;
  }
};

const onMouseUp = (e) => {
  e.preventDefault();
  if (e.button !== 0) return;

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // send data
  updateCallback();
  dispatch("layoutUpdated", {
    leftWidth: leftWidth,
    rightWidth: rightWidth,
    leftPercent: leftWidth / wrapperWidth,
    RightPercent: leftWidth / wrapperWidth,
  }); ///// TODO: fixme
};

const onTouchStart = (e) => {
  e.preventDefault();
  eStartData = {
    touchX: e.touches[0].clientX,
    firstWidth: left.offsetWidth, // lagbe?
    initialPercent: leftPaneSizeCalc,
  };
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);
};

const onTouchMove = (e) => {
  e.preventDefault();
  delta = e.touches[0].clientX - eStartData.touchX;
  if (usingPcent) {
    delta = (delta / wrapperWidth) * 100;
    leftPaneSizeCalc = eStartData.initialPercent + delta;
  } else {
    leftPaneSizeCalc = eStartData.firstWidth + delta;
  }
};

const onTouchEnd = (e) => {
  e.preventDefault();

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // send data
  updateCallback();
  dispatch("layoutUpdated", {
    leftWidth: leftWidth,
    rightWidth: rightWidth,
    leftPercent: leftWidth / wrapperWidth,
    RightPercent: leftWidth / wrapperWidth,
  }); ///// TODO: fixme
};
</script>

<div
  bind:clientWidth="{wrapperWidth}"
  class="wrapper"
  style="--left-panel-size: calc( {leftPaneSizeCalc +
    (usingPcent ? '%' : 'px')} - {separatorWidth / 2}px);
    --min-left-panel-size: {minLeftPaneSize_PxOrPcent};
    --min-right-panel-size: {minRightPaneSize_PxOrPcent}; 
    --separator-width: {separatorWidth}px;"
>
  <div bind:this="{left}" class="left" bind:clientWidth="{leftWidth}">
    <slot name="left">
      <div style="text-align: center; overflow: hidden;">
        <!-- Left Contents goes here... -->
        A<br />
        {leftWidth}
      </div>
    </slot>
  </div>
  <div
    class="separator"
    on:mousedown="{onMouseDown}"
    on:touchstart="{onTouchStart}"
  ></div>
  <div class="right" bind:clientWidth="{rightWidth}">
    <slot name="right">
      <div style="text-align: center; overflow: hidden;">
        <!-- Right Contents goes here... -->

        B <br />
        {rightWidth}
      </div>
    </slot>
  </div>
</div>

<style>
div.wrapper {
  display: inline-flex;
  width: 100%;
  height: 100%;
  /* background-color: yellow; */
}
div.separator {
  cursor: col-resize;
  width: var(--separator-width);
  height: 100%;
  z-index: 1;
  background-color: #aaa;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='30'><path d='M2 0 v30 M5 0 v30 M8 0 v30' fill='none' stroke='black'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
}
div.left {
  width: var(--left-panel-size);
  min-width: var(--min-left-panel-size);
  height: 100%;
  background: rgb(116, 170, 214);
}

/* removed right pane width */
div.right {
  flex: 1;
  min-width: var(--min-right-panel-size);
  background: rgb(125, 228, 125);
  height: 100%;
}
</style>
