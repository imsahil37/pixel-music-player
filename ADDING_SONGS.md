# How to Add New Songs (Without Updating the App)

The app is configured to load the playlist from a remote GitHub Pages repository. This allows you to add new songs for the user without them needing to install a new APK update.

**Remote URL:** `https://imsahil37.github.io/pixel-mixtape-data/`

## Prerequisites

You must have access to the GitHub repository that hosts `pixel-mixtape-data`.

## Step-by-Step Guide

1.  **Prepare the Audio File:**
    -   Ensure your song file (MP3/M4A) is ready.
    -   Name it simply (e.g., `new-song.mp3`).

2.  **Upload to GitHub:**
    -   Go to your `pixel-mixtape-data` GitHub repository.
    -   Upload the audio file to the `songs/` folder (or create a subfolder like `songs/party/`).

3.  **Update `music_config.json`:**
    -   Edit the `music_config.json` file in that *same* GitHub repository.
    -   Add the new track entry. Use the relative path to where you uploaded the file.

    ```json
    {
      "title": "New Song Name",
      "artist": "Artist Name",
      "url": "/songs/party/new-song.mp3"
    }
    ```

4.  **Commit Changes:**
    -   Save/Commit your changes to the GitHub repository.

5.  **Wait for Deployment:**
    -   GitHub Pages usually takes 1-2 minutes to update.
    -   Once deployed, the app (on the user's phone) will automatically detect the new data within ~60 seconds (or on the next app restart).
    -   The app will flash `*** NEW DATA RECEIVED ***` when the new song list is loaded.

## Testing

You can verify the data is live by visiting:
`https://imsahil37.github.io/pixel-mixtape-data/music_config.json`
in your browser. If you see your new song there, the app will see it too.
