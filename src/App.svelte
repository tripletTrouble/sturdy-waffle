<script lang="ts">
  import "./app.css";
  import { greet } from "$lib/greeter";
  import { Card, CardContent } from "$lib/components/ui/card";
  import CreateTodo from "$lib/components/CreateTodo.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { XIcon } from "@lucide/svelte";

  let title: string | undefined = $state(undefined);
  let tasks: string[] = $state([]);

  function handleCreate() {
    if (title) {
      tasks.push(title);

      title = undefined;
    }
  }
</script>

<div class="h-screen w-screen flex items-center justify-center">
  <Card class="w-[90%] min-h-[90%]">
    <CardContent>
      <h1 class="font-semibold text-2xl text-center mb-3">
        {greet()} Ready to sweat?!
      </h1>
      <p class="mb-7 text-center text-sm">
        You have: {tasks.length}
        {tasks.length > 1 ? "tasks" : "task"} today
      </p>
      <CreateTodo bind:value={title} handleSubmit={handleCreate} />
      <div class="grid grid-cols-1">
        {#each tasks as tsk, ix}
          <Card>
            <CardContent>
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <div>
                  <Checkbox />
                </div>
                <p class="w-full">{tsk}</p>
                <div>
                  <Button variant="ghost" size="icon-sm">
                    <XIcon/>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>
