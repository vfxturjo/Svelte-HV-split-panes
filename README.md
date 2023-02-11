<!--
Created: Sun Feb 12 2023 00:50:09 GMT+0600 (Bangladesh Standard Time)
Modified: Sun Feb 12 2023 00:54:52 GMT+0600 (Bangladesh Standard Time)
-->

# Svelte-HV-split-panes

my kind of implementation for https://github.com/Readiz/svelte-split-pane

Modified:
1. for the divider bar, event listeners will be available when "layout edit mode" is on. this is helpful if u want to lock/unlock editing of sizes.

Added:
1. Touchscreen support
1. ability to change size/thickness of divider bar (to make it small when not in edit mode, and large when in edit mode so it becomes accessible in touch devices)
1. async loading of another module inside the splitter regions
1. you can specify width using percent (%) or pixels (px). just use `leftPaneSizePx` or `leftPaneSizePcent` to specify using your unit choice.

Problems:
1. for now, you can specify the position of divider line using only left or top pane size. you cannot specify bottom/right pane size, it will be calculated automatically. You can only set the minimum width for them.
