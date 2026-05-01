<script lang="ts">
  import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "./ui/alert-dialog";
  import { Button } from "./ui/button";

  let {
    isOpen = $bindable(),
    handlePull,
  }: { isOpen: boolean; handlePull: () => void } = $props();
</script>

<AlertDialog bind:open={isOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to pull data?</AlertDialogTitle>
      <AlertDialogDescription>
        This action will overwrite your current data with the latest data from
        Google Sheets.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button variant="destructive" onclick={handlePull}>Okay</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
