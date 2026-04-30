<script lang="ts">
  import "./app.css";
  import { greet } from "$lib/greeter";
  import { Card, CardContent, CardFooter, CardHeader } from "$lib/components/ui/card";
  import CreateTodo from "$lib/components/CreateTodo.svelte";
  import type { Task } from "$lib/types";
  import TodoItem from "$lib/components/TodoItem.svelte";
  import { v4 as uuid, v4 } from "uuid";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { liveQuery } from "dexie";
  import db from "$lib/db";
  import Button from "$lib/components/ui/button/button.svelte";
  import { SettingsIcon } from "@lucide/svelte";
  import Setting from "$lib/components/Setting.svelte";
  import { ModeWatcher } from "mode-watcher";

  let title: string | undefined = $state(undefined);
  let isSettingOpen: boolean = $state(false);
  let tasks = liveQuery(async () => await db.tasks.toArray());
  let undone = $derived(
    (() => {
      if ($tasks) {
        return $tasks.reduce((current: number, task: Task) => {
          if (task.doneAt === null) {
            return current + 1;
          }
          return current;
        }, 0);
      }else {
        return 0;
      }
    })(),
  );
  const quotes: { author: string; quote: string }[] = [
    {
      author: "Thomas Edison",
      quote:
        "Genius is one percent inspiration and ninety-nine percent perspiration.",
    },
    {
      author: "Albert Einstein",
      quote:
        "It's not that I'm so smart, it's just that I stay with problems longer.",
    },
    {
      author: "Colin Powell",
      quote:
        "A dream doesn't become reality through magic; it takes sweat, determination and hard work.",
    },
    {
      author: "Vince Lombardi",
      quote: "The only place success comes before work is in the dictionary.",
    },
    { author: "Maya Angelou", quote: "Nothing will work unless you do." },
    {
      author: "Dwayne Johnson",
      quote:
        "Success isn’t always about greatness. It’s about consistency. Consistent hard work leads to success.",
    },
    {
      author: "LeBron James",
      quote:
        "I’m going to use all my tools, my God-given ability, and make the best life I can with it.",
    },
    {
      author: "Steve Jobs",
      quote:
        "If you really look closely, most overnight successes took a long time.",
    },
    {
      author: "Bill Gates",
      quote:
        "It’s fine to celebrate success but it is more important to heed the lessons of failure.",
    },
    {
      author: "Elon Musk",
      quote:
        "Work like hell. I mean you just have to put in 80 to 100 hour weeks every week.",
    },
    {
      author: "Michael Jordan",
      quote:
        "I’ve failed over and over and over again in my life. And that is why I succeed.",
    },
    {
      author: "Serena Williams",
      quote:
        "I really think a champion is defined not by their wins but by how they can recover when they fall.",
    },
    {
      author: "Oprah Winfrey",
      quote:
        "Doing the best at this moment puts you in the best place for the next moment.",
    },
    {
      author: "Henry Ford",
      quote: "Quality means doing it right when no one is looking.",
    },
    {
      author: "Pele",
      quote:
        "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.",
    },
    {
      author: "Cristiano Ronaldo",
      quote: "Talent without working hard is nothing.",
    },
    {
      author: "Will Smith",
      quote:
        "There is no easy way around it. No matter how talented you are, your talent is going to fail you if you’re not skilled.",
    },
    {
      author: "Angela Duckworth",
      quote: "Enthusiasm is common. Endurance is rare.",
    },
    {
      author: "Stephen King",
      quote:
        "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    },
    {
      author: "Bruce Lee",
      quote: "Long-term consistency trumps short-term intensity.",
    },
  ];
  let currentQuoteIndex = $state(Math.round(Math.random() * 20));

  onMount(() => {
    const id = setInterval(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, 7_000);

    return () => clearInterval(id);
  });

  async function handleCreate() {
    if (title) {
      // Dexie
      await db.tasks.add({
        id: v4(),
        title,
        createdAt: new Date().getTime(),
        doneAt: null,
      });

      title = undefined;
    }
  }

  function handleDelete(task: Task) {
    db.tasks.delete(task.id);
  }
</script>

<ModeWatcher/>
<div class="min-h-screen w-screen flex items-center justify-center">
  <Card class="w-[90%] min-h-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] my-10">
    <CardHeader>
      <div class="flex justify-end">
        <Button variant="ghost" onclick={() => isSettingOpen = true}>
          <SettingsIcon class="size-6"></SettingsIcon>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <h1
        class="font-semibold text-lg md:text-xl lg:text-2xl xl:text-3xl text-center mb-3"
      >
        {greet()} Ready to sweat?
      </h1>
      {#if undone > 0}
        <p class="mb-7 text-center text-xs md:text-sm">
          You have {undone}
          {undone > 1 ? "tasks" : "task"} today.
        </p>
      {:else}
        <p class="mb-7 text-center text-sm">No task for today.</p>
      {/if}
      <CreateTodo bind:value={title} handleSubmit={handleCreate} />
      <div class="grid grid-cols-1 gap-3">
        {#if $tasks && $tasks.length}
          {#each $tasks as tsk, ix (tsk.id)}
            <TodoItem {handleDelete} bind:task={$tasks[ix]} />
          {/each}
        {:else}
          <p class="mt-5 font-semibold text-center">No taks found.</p>
        {/if}
      </div>
    </CardContent>
    <CardFooter>
      <div class="text-sm text-center w-full mt-3">
        {#if quotes.length}
          {#key currentQuoteIndex}
            <div transition:slide={{ duration: 400 }} class="space-y-2">
              <p class="font-medium">"{quotes[currentQuoteIndex].quote}"</p>
              <p class="text-xs text-gray-500">
                — {quotes[currentQuoteIndex].author}
              </p>
            </div>
          {/key}
        {/if}
        <p class="text-sm text-center w-full mt-5 font-medium">
          Creafted with <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-heart-fill inline text-red-500"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            />
          </svg>
          by <a href="https://github.com/triplettrouble">Deri Prasetyo</a>
        </p>
      </div>
    </CardFooter>
  </Card>

  <Setting bind:isOpen={isSettingOpen} />
</div>
