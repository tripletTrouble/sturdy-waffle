<script lang="ts">
  import { MoonIcon, SunIcon } from "@lucide/svelte";
  import { Button } from "./ui/button";
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "./ui/dialog";
  import { mode, setMode } from "mode-watcher";
  import { Textarea } from "./ui/textarea";
  import { Root as Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
  import { toast } from "svelte-sonner";

  let { isOpen = $bindable() }: { isOpen: boolean } = $props();
  let syncUrl: string = $state(window.localStorage.getItem("syncUrl") ?? "");
  let syncInterval: string = $state('10_000');
  let syncSelectContent: string = $derived((() => {
    if (syncInterval === '10_000') {
        return "10 Seconds";
    }

    if (syncInterval === '30_000') {
        return "30 seconds"
    }

    if (syncInterval === '60_000') {
        return "1 minute"
    }

    return "Select interval";
  })());

  function handleSave() {
    window.localStorage.setItem("syncUrl", syncUrl);
    window.localStorage.setItem('syncInterval', syncInterval);

    toast.success("Settings updated successfully!")

    setTimeout(() => window.location.reload(), 4_000);
  }
</script>

<Dialog bind:open={isOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Application Settings</DialogTitle>
      <DialogDescription>Personalize your settings here</DialogDescription>
    </DialogHeader>
    <div class="grid space-y-5">
      <div class="flex justify-between items-center">
        <div class="grid space-y-1">
          <div class="font-semibold">Theme</div>
          <div class="text-xs">
            Choose your preferred theme color, you can choose between dark and
            light
          </div>
        </div>
        <div class="flex gap-3">
          <Button
            size="icon-sm"
            variant="outline"
            class={[
              mode.current === "dark"
                ? "*:[svg]:fill-primary text-primary"
                : "",
            ]}
            onclick={() => setMode("dark")}
          >
            <MoonIcon />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            class={[
              mode.current === "light"
                ? "*:[svg]:fill-primary text-primary"
                : "",
            ]}
            onclick={() => setMode("light")}
          >
            <SunIcon />
          </Button>
        </div>
      </div>

      <div class="grid gap-3">
        <div class="grid space-y-1">
          <div class="font-semibold">Sync URL</div>
          <div class="text-xs">
            You can sync your task to Google Sheet. <a
              href="#a"
              class="text-blue-500">Learn More</a
            >
          </div>
        </div>
        <div>
          <Textarea
            bind:value={syncUrl}
            placeholder="https://script.google.com/123abc"
          ></Textarea>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div class="grid space-y-1">
          <div class="font-semibold">Sync Interval</div>
          <div class="text-xs">
            Set 
          </div>
        </div>
        <div>
          <Select type="single" name="sync-interval" bind:value={syncInterval}>
            <SelectTrigger class="w-[125px]">
                {syncSelectContent}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="10_000">10 seconds</SelectItem>
                <SelectItem value="30_000">30 seconds</SelectItem>
                <SelectItem value="60_000">1 minute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    <DialogFooter>
      <DialogClose>
        <Button variant="secondary">Close</Button>
      </DialogClose>
      <Button onclick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
