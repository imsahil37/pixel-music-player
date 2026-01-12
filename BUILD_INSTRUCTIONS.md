# How to Build the Android APK

The "Pixel Mixtape" Android project has been generated using [Capacitor](https://capacitorjs.com).

Since the environment here does not have the full Android SDK to compile the `.apk` file, you will need to perform the final build step on your machine.

## Prerequisites

1.  **Node.js** installed.
2.  **Android Studio** installed (with Android SDK and Java).

## Steps to Build APK

1.  **Open the Project in Android Studio:**
    Run the following command in your terminal from the project root:
    ```bash
    npx cap open android
    ```
    (Or manually open the `android` folder in Android Studio).

2.  **Wait for Gradle Sync:**
    Android Studio will automatically sync the project and download necessary dependencies.

3.  **Build the APK:**
    -   Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    -   Once finished, a notification will appear. Click "Locate" to find your `app-debug.apk` file.
    -   Transfer this file to your Android phone and install it!

## Development

If you make changes to the React code (`src/`):

1.  Rebuild the web app:
    ```bash
    npm run build
    ```
2.  Sync changes to the Android project:
    ```bash
    npx cap sync
    ```
3.  Re-run/Re-build from Android Studio.

## Background Audio

Support for background audio controls has been added via the Media Session API. The app should continue playing music when the screen is off or when you switch apps, provided the OS doesn't aggressively kill the process (which is standard behavior for media apps).
