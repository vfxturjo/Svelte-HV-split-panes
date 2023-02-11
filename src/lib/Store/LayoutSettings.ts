import { persisted } from "svelte-local-storage-store";

//
//
//? some variables that will be fixed based on use
export const separatorWidthExtra = 30;

//
//

// not using it now
export let LayoutEditingModeGlobal = persisted("LayoutEditingMode", false);

export let separatorSizeGlobal = persisted("separatorWidthGlobal", 2);

export const layoutComponents = {
  Hsplitter: {
    // ^----- use this name for referring. programming name
    name: "H Split",
    // ^----- use this name for showing in UI, beautiful name
    component: () => import("../Splitter Loader/HsplitterLoader.svelte"),
  },
  Vsplitter: {
    name: "V Split",
    component: () => import("../Splitter Loader/VsplitterLoader.svelte"),
  },
  HelloWorld: {
    name: "Hello World",
    component: () => import("../extra/hello world.svelte"),
  },
};
