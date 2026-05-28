# CometChat Take-Home Assessment

A React-based real-time chat application integrating the `@cometchat/skills` package. This project was developed as a take-home assessment for the CometChat engineering team.

## 🚀 Features

*   **Real-Time 1-on-1 Messaging:** Seamless, instant communication between users (fully testable via concurrent standard and incognito browser sessions).
*   **Group Chat Management:** Full functionality to create new groups, select specific users from a directory to add to the group, and delete groups when no longer needed.
*   **Modular Architecture:** Clean separation of concerns with dedicated styling files for components and pages to ensure high maintainability and readability.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), TypeScript
*   **SDK:** `@cometchat/skills`

## ⚙️ Local Setup

To run this project locally, you will need a CometChat account to generate the necessary API keys.

### 1. Clone the repository
```bash
git clone https://github.com/MAX5271/CometChat.git
cd CometChat/frontend
```
2. Environment Variables
Create a .env file in the root of the frontend directory and add your CometChat dashboard credentials:

```Code snippet
VITE_COMETCHAT_APP_ID=your_app_id
VITE_COMETCHAT_REGION=your_region
VITE_COMETCHAT_AUTH_KEY=your_auth_key
```
3. Install Dependencies and Run
```Bash
# Install required dependencies
npm install
```
# Ensure CometChat skills are initialized
```
npx @cometchat/skills add
```
# Start the Vite development server
```
npm run dev
```
