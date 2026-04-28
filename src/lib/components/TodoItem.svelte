<script lang="ts">
  import type { Task } from "$lib/types";
  import { XIcon } from "@lucide/svelte";
  import Button from "./ui/button/button.svelte";
  import Checkbox from "./ui/checkbox/checkbox.svelte";
  import db from "$lib/db";

  let {
    task = $bindable(),
    handleDelete,
  }: { task: Task; handleDelete: (task: Task) => void } = $props();
  const handleCheck = (checked: boolean) => {
    if (checked) {
      db.tasks.update(task.id, {
        doneAt: new Date().getTime(),
      });
    } else {
      db.tasks.update(task.id, {
        doneAt: null,
      });
    }
  };
</script>

<div class="p-3 border rounded-md">
  <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
    <div>
      <Checkbox onCheckedChange={handleCheck} checked={task.doneAt !== null} />
    </div>
    <p class:line-through={task.doneAt}>{task.title}</p>
    <div>
      <Button
        variant="destructive"
        size="icon-sm"
        onclick={() => handleDelete(task)}
      >
        <XIcon />
      </Button>
    </div>
  </div>
</div>
