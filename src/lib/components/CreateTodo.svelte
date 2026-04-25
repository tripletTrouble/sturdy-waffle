<script lang="ts">
  import { PlusIcon } from "@lucide/svelte/icons";
  import { Button } from "./ui/button";
  let input: HTMLTextAreaElement;
  let {
    handleSubmit,
    value = $bindable(),
  }: { handleSubmit: () => void; value: string | undefined } = $props();
  function handleInput() {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit();
    }
  }
</script>

<form onsubmit={handleSubmit} class="mb-5">
  <div class="w-full flex gap-3 items-center">
    <textarea
      bind:this={input}
      oninput={handleInput}
      rows="1"
      class="overflow-hidden outline-0 border-0 resize-none border-b-2 border-muted-foreground w-full focus:ring-0 focus:bg-muted rounded-t-md"
      placeholder="Write your task here"
      onkeydown={handleKeyDown}
      bind:value
    ></textarea>
    <Button type="submit" size="icon-sm">
      <PlusIcon />
    </Button>
  </div>
</form>
