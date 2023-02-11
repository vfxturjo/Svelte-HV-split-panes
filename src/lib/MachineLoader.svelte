<script>
import {
  layoutComponents,
  LayoutEditingModeGlobal,
} from "./Store/LayoutSettings";

let LayoutEditingMode = false;
let component = "HelloWorld";
$: component_name = layoutComponents[component].name;
</script>

<div class="flex-1 bg-black">
  <!-- ? top bar -->
  <div class="flex-1 flex justify-between items-center bg-slate-900">
    <p class="p-1 pl-4 text-white">{component_name}</p>
    <button
      class="p-1 bg-red-400 rounded-md"
      on:click="{() => {
        LayoutEditingMode = !LayoutEditingMode;
        $LayoutEditingModeGlobal = LayoutEditingMode;
      }}"
    >
      EDIT
    </button>
  </div>

  <div class="fullsize">
    <!-- ? layout editor modal -->
    {#if LayoutEditingMode}
      <div class="fullsize modalbg">
        <div class="w-fit h-fit p-2 bg-gray-800 pointer-events-auto">
          <p class="text-white">component:</p>
          <select bind:value="{component}">
            {#each Object.keys(layoutComponents) as item, i}
              <option value="{item}">
                {layoutComponents[item].name}
              </option>
            {/each}
          </select>
        </div>
      </div>
    {/if}

    <!--? main part here -->
    <div class="fullsize bg-red-600">
      {#await layoutComponents[component]["component"]()}
        <div class="fullcenter bg-gray-300">
          <p class="text-2xl">loading...</p>
        </div>
      {:then module}
        <div class="fullsize">
          <svelte:component this="{module.default}" />
        </div>
      {:catch error}
        <p>
          oops! error occured... <br />
          add reset button? or let user choose another laoutComponent?
        </p>
      {/await}
    </div>
  </div>
</div>

<style>
.fullsize {
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
}

.fullcenter {
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalbg {
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
</style>
