<script>
import NewHsplitter from "../newHsplitter.svelte";
import NewVsplitter from "../newVsplitter.svelte";
</script>

<div class="w-screen h-screen">
  <NewHsplitter separatorWidth="{30}">
    <div slot="left">aaaa</div>
    <div slot="right" class="bg-blue-400 thingContainer">
      <NewHsplitter separatorWidth="{30}">
        <div slot="left" class="thingContainer">
          <NewVsplitter separatorHeight="{30}" />
        </div>
      </NewHsplitter>
    </div>
  </NewHsplitter>
</div>

<style>
.thingContainer {
  width: 100%;
  height: 100%;
}
</style>
