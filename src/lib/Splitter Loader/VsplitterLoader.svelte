<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
import {
  separatorSizeGlobal,
  separatorWidthExtra,
  LayoutEditingModeGlobal,
} from "../Store/LayoutSettings";
import MachineLoader from "../MachineLoader.svelte";

// separatorSizeGlobalorWidth if editing mode is on
$: separatorSize = $LayoutEditingModeGlobal
  ? $separatorSizeGlobal + separatorWidthExtra
  : $separatorSizeGlobal;

export let topPaneSizePx = null;
export let topPaneSizePcent = null;

export let minTopPaneSize_PxOrPcent = "0px",
  minBottomPaneSize_PxOrPcent = "0px";

// export let allowResize = false;
export let updateCallback = () => {
  return;
};

let wrapperHeight, top, delta;
let eStartData;
let topHeight, bottomHeight; ///// DONT USE EXCEPT FOR DISPATCH

// use given value (in percent or PX), default to 50%
$: usingPcent = topPaneSizePx == null ? true : false;

$: topPaneSizeCalc =
  topPaneSizePx != null
    ? topPaneSizePx
    : topPaneSizePcent != null
    ? topPaneSizePcent
    : 50;

//// main functions ////
const onMouseDown = (e) => {
  e.preventDefault();
  eStartData = {
    mouseY: e.clientY,
    firstHeight: top.offsetHeight, // lagbe?
    initialPercent: topPaneSizeCalc,
  };
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e) => {
  e.preventDefault();
  if (e.button !== 0) return;
  delta = e.clientY - eStartData.mouseY;
  if (usingPcent) {
    delta = (delta / wrapperHeight) * 100;
    topPaneSizeCalc = eStartData.initialPercent + delta;
  } else {
    topPaneSizeCalc = eStartData.firstHeight + delta;
  }
};

const onMouseUp = (e) => {
  e.preventDefault();
  if (e.button !== 0) return;

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // send data
  updateCallback();
  dispatchCurrentValues();
};

const onTouchStart = (e) => {
  e.preventDefault();
  eStartData = {
    touchY: e.touches[0].clientY,
    firstWidth: top.offsetHeight, // lagbe?
    initialPercent: topPaneSizeCalc,
  };
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);
};

const onTouchMove = (e) => {
  e.preventDefault();
  delta = e.touches[0].clientY - eStartData.touchY;
  if (usingPcent) {
    delta = (delta / wrapperHeight) * 100;
    topPaneSizeCalc = eStartData.initialPercent + delta;
  } else {
    topPaneSizeCalc = eStartData.firstHeight + delta;
  }
};

const onTouchEnd = (e) => {
  e.preventDefault();

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  // send data
  updateCallback();
  dispatchCurrentValues();
};

function dispatchCurrentValues() {
  dispatch("layoutUpdated", {
    topHeight: topHeight,
    bottomHeight: bottomHeight,
    topPercent: topHeight / wrapperHeight,
    bottomPercent: topHeight / wrapperHeight,
  });
}
</script>

<div
  bind:clientHeight="{wrapperHeight}"
  class="wrapper"
  style="--top-panel-size: calc( {topPaneSizeCalc +
    (usingPcent ? '%' : 'px')} - {separatorSize / 2}px);
    --min-top-panel-size: {minTopPaneSize_PxOrPcent};
    --min-bottom-panel-size: {minBottomPaneSize_PxOrPcent}; 
    --separator-size: {separatorSize}px; --cursorType: {$LayoutEditingModeGlobal
    ? 'row-resize'
    : 'default'};"
>
  <div bind:this="{top}" class="top" bind:clientHeight="{topHeight}">
    <slot name="top">
      <div class="fullsize flex flex-1">
        <!--? top Contents goes here... -->
        <!-- A<br />
        {topHeight} -->
        <MachineLoader />
      </div>
    </slot>
  </div>
  <div
    class="separator"
    on:mousedown="{$LayoutEditingModeGlobal ? onMouseDown : undefined}"
    on:touchstart="{$LayoutEditingModeGlobal ? onTouchStart : undefined}"
  ></div>
  <div class="bottom" bind:clientHeight="{bottomHeight}">
    <slot name="bottom">
      <div class="fullsize flex flex-1">
        <!-- Right Contents goes here... -->
        <!-- B <br />
        {bottomHeight} -->
        <MachineLoader />
      </div>
    </slot>
  </div>
</div>

<style>
div.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* background-color: yellow; */
}
div.separator {
  cursor: var(--cursorType);
  width: 100%;
  height: var(--separator-size);
  z-index: 1;
  background-color: #aaa;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='10'><path d='M2 2 h30 M2 5 h30 M2 8 h30' fill='none' stroke='black'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
}
div.top {
  height: var(--top-panel-size);
  min-height: var(--min-top-panel-size);
  width: 100%;
  background: rgb(116, 170, 214);
}

div.bottom {
  flex: 1;
  min-height: var(--min-bottom-panel-size);
  background: rgb(125, 228, 125);
  width: 100%;
}
</style>
