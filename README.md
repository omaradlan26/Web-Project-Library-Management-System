# Library Management System

A simple Library Management System built with **Express.js** (backend) and **Vanilla JavaScript** (frontend).

## Prerequisites

Before running the project, ensure you have **Node.js** installed.

1.  Open **Command Prompt (cmd)**.
2.  Check if Node.js is installed by running:
    ```cmd
    node -v
    ```
    If it returns a version number (e.g., `v18.x.x` or `v20.x.x`), you are good to go.
    If not, download and install it from [nodejs.org](https://nodejs.org/).

---

## 🚀 How to Run the Project

### Option 1: The Easy Way (Recommended)
Simply double-click the **`run_project.bat`** file in the project folder. 
It will automatically:
1.  Fix the Node.js path issue.
2.  Start the Backend server.
3.  Start the Frontend server.

### Option 2: The Manual Method (Windows CMD)

Follow these steps exactly in your **Command Prompt (cmd)**.

### Step 1: Navigate to the Project Folder
Open your terminal and navigate to the project directory:

```cmd
cd "path\to\Library-Management-System"
```
*(Replace `path\to\...` with the actual path to the folder)*

### Step 2: Install Dependencies
Install the required libraries for the backend:

```cmd
npm install
```

### Step 3: Run the Backend Server
Start the backend server. This handles the database (in-memory) and API logic.

```cmd
node backend/server.js
```
You should see:
> Server running on http://localhost:5001

**Keep this terminal window OPEN.** Do not close it.

### Step 4: Run the Frontend (New Terminal)
Open a **NEW** Command Prompt window (leave the first one running).
Navigate to the project folder again:

```cmd
cd "path\to\Library-Management-System"
```

Now, serve the frontend files using `npx`:

```cmd
npx http-server frontend -p 8081
```
*(If asked to install `http-server`, type `y` and press Enter)*

You should see:
> Available on:
> http://127.0.0.1:8081

### Step 5: Open in Browser
Open your text browser (Chrome, Edge, etc.) and go to:
[http://localhost:8081](http://localhost:8081)

---

## Troubleshooting

- **Error: "Address already in use"**: 
  - If port `5001` or `8081` is busy, check if you have other terminals running the project. Close them and try again.
- **'node' is not recognized**:
  - Re-install Node.js and restart your computer or terminal.
