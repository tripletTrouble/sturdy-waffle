<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import "../app.css";
  import Step1 from "../assets/sync_step/new_app_script.webp";
  import Step2 from "../assets/sync_step/save_script.webp";
  import Step3 from "../assets/sync_step/start_deploy.webp";
  import Step4 from "../assets/sync_step/select_web_app.webp";
  import Step5 from "../assets/sync_step/select_anyone.webp";
  import Step6 from "../assets/sync_step/deploy.webp";
  import Step7 from "../assets/sync_step/copy_link.webp";
  import { ArrowBigDown, ArrowBigUp, ChevronLeftIcon, MenuIcon, SettingsIcon } from "@lucide/svelte";
  import logo from "../assets/vite.svg";
  import { Content, Header, Root as SheetRoot } from "$lib/components/ui/sheet";
  import { link } from "svelte-spa-router";

  const script = `// ===== CONFIG =====
const SHEET_NAME = "tasks";

// ===== HELPER =====
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["id", "title", "createdAt", "doneAt"]);
  }

  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== GET: Pull Data =====
function doGet(e) {
  try {
    const params = e.parameter;

    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return jsonResponse({
        success: true,
        tasks: []
      });
    }

    const headers = rows[0];

    const tasks = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });

      return {
        id: String(obj.id),
        title: String(obj.title),
        createdAt: Number(obj.createdAt),
        doneAt: obj.doneAt === "" || obj.doneAt === null
          ? null
          : Number(obj.doneAt)
      };
    });

    return jsonResponse({
      success: true,
      tasks
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      message: err.message
    });
  }
}

// ===== POST: Push Data (Overwrite) =====
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const tasks = body.tasks || [];
    const sheet = getSheet();

    // clear sheet
    sheet.clear();

    // header
    const headers = ["id", "title", "createdAt", "doneAt"];
    sheet.appendRow(headers);

    if (tasks.length > 0) {
      const values = tasks.map(task => [
        task.id,
        task.title,
        task.createdAt,
        task.doneAt ?? ""
      ]);

      sheet.getRange(2, 1, values.length, headers.length).setValues(values);
    }

    return jsonResponse({
      success: true,
      message: "Data synced successfully"
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      message: err.message
    });
  }
}`;
  let isTocOpen = $state(false);

  function handleCopyScript() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(script).then(
        () => {
          alert("Script copied to clipboard!");
        },
        (err) => {
          alert("Failed to copy script: " + err);
        },
      );
    } else {
      alert("Clipboard API not supported in this browser.");
    }
  }

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      isTocOpen = false;
    }
  }
</script>

<header class="py-2 px-3 flex items-center justify-between border-b fixed top-0 left-0 right-0 bg-background z-10">
  <div class="flex gap-2 items-center">
    <Button href="#/" variant="outline" size="icon-sm">
      <ChevronLeftIcon class="size-5" />
    </Button>
    <a use:link href="/" class="flex items-center gap-1">
      <img src={logo} alt="Sweat Mate Logo" class="size-12" />
      <span class="text-xl font-bold">Sweat Mate</span>
    </a>
  </div>
  <Button
    variant="ghost"
    onclick={() => (isTocOpen = true)}
    title="Open Table of Contents"
  >
    <MenuIcon class="size-5" />
  </Button>
</header>

<div class="p-3 mt-16">
  <h1 class="text-3xl font-bold mb-4">Syncing Guide</h1>
  <p>
    This page will guide you to sync your tasks into your Google Sheet, so you
    can access them from anywhere and any device.
  </p>
  <h2 class="text-2xl font-bold mb-4" id="getting-started">Getting Started</h2>
  <p>
    Before using the sync feature, please there are two terms you need to
    understand before starting: "Push" and "Pull".
  </p>
  <h3 class="text-xl font-semibold mt-4 mb-2">Push</h3>
  <p>
    Push means uploading your local tasks to Google Sheets. Push is symbolized as an upward arrow (<ArrowBigUp class="inline-block size-4" />) button. When you push, the
    data in your Google Sheet will be replaced by your local data. So make sure
    to pull first if you have made changes in Google Sheets that you want to
    keep.
  </p>
  <h3 class="text-xl font-semibold mt-4 mb-2">Pull</h3>
  <p>
    Pull means downloading tasks from Google Sheets to your local device. Pull is symbolized as a downward arrow (<ArrowBigDown class="inline-block size-4" />) button. When
    you pull, your local data will be replaced by the data in your Google Sheet.
    So make sure to push first if you have made changes locally that you want to
    keep.
  </p>
  <h2 class="text-2xl font-semibold mt-4 mb-2" id="prepare-to-sync">Preparing to sync</h2>
  <ol class="list-decimal list-outside px-6 space-y-3">
    <li>
      Prepare an empty Google Sheet. You can name it as you like, it doesn't
      matter.
    </li>
    <li>
      <p>
        Add App Script to the Google Sheet. You can do this by going to
        <code class="bg-muted"
          >Extensions > Apps Script in your Google Sheet</code
        >
      </p>
      <img
        src={Step1}
        alt="Screenshot of Google Sheet menu"
        class="block my-3"
      />
      <p>
        Delete any existing code and copy the script below into the script
        editor.
      </p>
      <div class="rounded-md border mt-3 bg-red-50 mb-3">
        <div class="rounded-t-md bg-white p-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-muted-foreground">Script.gs</span>
            <Button variant="default" size="sm" onclick={handleCopyScript}
              >Copy Script</Button
            >
          </div>
        </div>
        <pre
          class="bg-muted rounded-b-md p-3 overflow-auto whitespace-pre-wrap h-[400px]">
        <code>{script}</code>
        </pre>
      </div>
      <p>Now, all are set. Save the script!</p>
      <img
        src={Step2}
        alt="Screenshot of saving the script"
        class="block my-3"
      />
    </li>
    <li>
      The script must be deployed as a web app. You can do this by clicking on <code
        class="bg-muted">Deploy > New deployment</code
      >.
      <img
        src={Step3}
        alt="Screenshot of deploying the script"
        class="block my-3"
      />
      <p>
        After that, select <code class="bg-muted">Web app</code>.
      </p>
      <img
        src={Step4}
        alt="Screenshot of selecting Web app"
        class="block my-3"
      />
      <p>
        Choose <code class="bg-muted">Anyone</code>, at the
        <code class="bg-muted">Who has access</code> option.
      </p>
      <img
        src={Step5}
        alt="Screenshot of setting access to Anyone"
        class="block my-3"
      />
      <p>
        Then click
        <code class="bg-muted">Deploy</code>.
      </p>
      <img
        src={Step6}
        alt="Screenshot of deploying the web app"
        class="block my-3"
      />
    </li>
    <li>
      <p>
        Copy the web app URL and set it up in the settings page of this app.
      </p>
      <img
        src={Step7}
        alt="Screenshot of copying the web app URL"
        class="block my-3"
      />
    </li>
    <li>The web app URL is now ready to be used in the app settings. You can save the URL to use it later on another device, so you can syncing your tasks seamlessly across devices.</li>
  </ol>
  <h2 class="text-2xl font-semibold mt-4 mb-2" id="configure-the-app">Configure the app</h2>
  <ol class="list-decimal list-outside px-6 space-y-3">
    <li>
      Go to the settings page of this app by clicking setting/cog (<SettingsIcon class="inline-block size-4" />) button, then paste the web app URL you copied
      in the previous step into the input field.
    </li>
    <li>
      Click the "Save" button to save the URL. Now you can start syncing your
      tasks!
    </li>
    <li>
      At the first, try to push your local tasks to Google Sheets by clicking
      the "Push" button in the settings page. This will upload your local tasks
      to Google Sheets. After that, you can go to the Google Sheet to see the uploaded tasks.
    </li>
    <li>
      Later, you can try to pull the tasks into your new device (mobile phone or another Desktop/Laptop) by clicking the "Pull" button. This will download the tasks from Google Sheets to your new device, so you can access them from there.
    </li>
    <li>Viola, you're all set! Now, you can work seamlessly across your devices.</li>
  </ol>
</div>

<SheetRoot bind:open={isTocOpen}>
  <Content>
    <Header>
      <a use:link href="/" class="flex items-center gap-1">
        <img src={logo} alt="Sweat Mate Logo" class="size-12" />
        <span class="text-xl font-bold">Sweat Mate</span>
      </a>
    </Header>
    <div class="px-5">
      <p class="text-lg font-semibold mb-2">On this page</p>
      <ul class="space-y-2 list-disc list-inside">
        <li>
          <button
            onclick={() => scrollTo("getting-started")}
            class="text-blue-500 cursor-pointer">Getting Started</button
          >
          <ul class="space-y-1 px-5 list-disc list-inside">
            <li>
              <button onclick={() => scrollTo("push")} class="text-blue-500 cursor-pointer"
                >Push</button
              >
            </li>
            <li>
              <button onclick={() => scrollTo("pull")} class="text-blue-500 cursor-pointer"
                >Pull</button
              >
            </li>
          </ul>
        </li>
        <li>
          <button onclick={() => scrollTo("prepare-to-sync")} class="text-blue-500 cursor-pointer"
            >Preparing to sync</button
          >
        </li>
        <li>
          <button onclick={() => scrollTo("configure-the-app")} class="text-blue-500 cursor-pointer"
            >Configure the app</button
          >
        </li>
      </ul>
    </div>
  </Content>
</SheetRoot>

<style>
  h2 {
    margin-top: 2rem;
  }
</style>
