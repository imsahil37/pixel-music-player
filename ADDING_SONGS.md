# How to Add New Songs

Adding new songs to the Pixel Music Player is a two-step process. You need to add the audio file to the project and then tell the player where to find it.

## Step 1: Add the Audio File

1.  Navigate to the `public/songs` directory in your project folder.
2.  Choose the appropriate mood folder (e.g., `chatpate`, `sukoon`, etc.) or create a new one.
3.  **Copy your audio file** (MP3, M4A, etc.) into that folder.
    *   *Tip: Keep filenames simple and lowercase (e.g., `my-new-song.mp3`).*

## Step 2: Update the Configuration

1.  Open the file `public/music_config.json` in a text editor.
2.  Find the "Mood" section where you want to add the song.
3.  Add a new entry to the `tracks` list for that mood.

**Example:**

If you added `kal-ho-naa-ho.mp3` to the `sukoon` folder, your JSON should look like this:

```json
{
  "label": "SUKOON",
  "short": "SUK",
  "tracks": [
    {
      "title": "Bade Ache Lgte H",
      "artist": "Buddhu",
      "url": "/songs/sukoon/bade ache lgte h.m4a"
    },
    {
      "title": "Kal Ho Naa Ho",
      "artist": "Sonu Nigam",
      "url": "/songs/sukoon/kal-ho-naa-ho.mp3"
    }
  ]
}
```

## Step 3: Apply Changes

*   **If running locally (`npm run dev`):** The player might update automatically, or you may need to refresh the page.
*   **For the Android App:**
    1.  Run `npm run build` to package the new config and songs.
    2.  Run `npx cap sync` to copy them to the Android project.
    3.  Re-build/Re-install the app on your phone.

## Adding a New Mood

To add an entirely new mood category:
1.  Add a new object to the main list in `public/music_config.json`:

```json
{
  "label": "PARTY",
  "short": "PTY",
  "tracks": [
    { "title": "Party Song", "artist": "Artist", "url": "/songs/party/song.mp3" }
  ]
}
```
2.  The app will automatically detect the new mood and add it to the mood selector.
