# How to Build the Android APK

The "Pixel Mixtape" Android project has been generated using [Capacitor](https://capacitorjs.com).

Since the environment here does not have the full Android SDK to compile the `.apk` file, you will need to perform the final build step on your machine.

## Prerequisites

1.  **Node.js** installed.
2.  **Android Studio** installed (with Android SDK and Java).

## Steps to Build APK

**IMPORTANT: You must run the sync command first to generate necessary Gradle files.**

1.  **Install Dependencies & Sync:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    npx cap sync
    ```
    *This step is critical as it generates the `android/capacitor-cordova-android-plugins` folder which is required for the build but excluded from git.*

2.  **Open the Project in Android Studio:**
    Run:
    ```bash
    npx cap open android
    ```
    (Or manually open the `android` folder in Android Studio).

3.  **Wait for Gradle Sync:**
    Android Studio will automatically sync the project and download necessary dependencies.

4.  **Build the APK:**
    -   Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    -   Once finished, a notification will appear. Click "Locate" to find your `app-debug.apk` file.
    -   Transfer this file to your Android phone and install it!

## Troubleshooting

-   **"Could not read script ... cordova.variables.gradle"**:
    This means the `npx cap sync` step was skipped or failed. Ensure you run `npx cap sync` before opening Android Studio.

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
