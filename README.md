# ⏱️ React Native Timer App (Expo)

A customizable productivity timer app built using **React Native** and **Expo**, supporting multiple timers with categories, bulk actions, history tracking, and JSON export.

---

## 📲 Features

- ✅ Add, start, pause, and reset individual timers
- 📂 Categorize timers for organized workflows
- 🔁 Bulk actions: Start All, Pause All, Reset All per category
- 🕘 Timer History: Logs completed timers with timestamps
- 📤 Export history as a JSON file
- ⚙️ Built using Expo for cross-platform support

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the App

Ensure you have Expo CLI installed:

```bash
npm install -g expo-cli
```

Then start the development server:

```bash
expo start
```

Use the QR code in your terminal to open the app on your device using the **Expo Go** app.

---

Download the app from Github releases.

---

## 📌 Assumptions Made

- **Local State Management**: App state is managed using `useReducer` and `Context API`, persisted using `AsyncStorage`.
- **No Backend Required**: This is a standalone mobile app. No authentication or server sync is implemented.
- **Expo Managed Workflow**: The app is built and deployed using the managed Expo environment for ease of development.
- **Timer Accuracy**: Timers use JavaScript intervals and may experience slight drift; suitable for productivity use, not for precision timing.

---

## 📁 Folder Structure

```
/assets          -> App images and icons
/components      -> Reusable UI components
/context         -> Global state and reducer logic
/screens         -> App screens (Home, History, etc.)
/utils           -> Helper functions (e.g., export logic)
App.js           -> Entry point
```

---

## 🙋‍♂️ Author

**Akhiranandha Kodam**  
🔗 [LinkedIn](https://www.linkedin.com/in/akhiranandha)
