# 📡 Remote Device Interface

> Desktop application for real-time monitoring of an industrial flow meter via TCP.

**Built for a real industrial environment and actively used in production.**

---

## 📌 Context

Industrial flow meters expose operational data over TCP — but no usable interface.
This app bridges that gap: connect to any compatible device by IP and port, pull live 
readings continuously, and visualize them in a clean dashboard.

It handles the full pipeline: TCP connection → hex payload → float conversion → live charts.

---

## 📊 Monitored indicators

- Mass flow rate
- Volumetric flow rate
- Total volume
- Center of gravity
- Configured density (read + write)

---

## ✨ Features

- Connect to remote device by IP and port
- Periodic data polling with continuous dashboard updates
- Time-series charts for all indicators
- Density parameter adjustment directly from the interface
- Hex-to-float conversion of raw device responses

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Desktop shell | Electron |
| Interface | React 18, Recharts |
| Communication | Node.js TCP sockets (`net`) |
| IPC | `ipcMain` / `ipcRenderer` / `preload` |

---

## 🏗️ Architecture

```text
main.js          → Electron window and IPC handlers
src/preload.js   → Controlled API exposure to renderer
src/tcpClient.js → TCP client and raw response handling
src/Conversora.js→ Hex to float conversion
src/App.js       → Main interface, polling and data display
```

Communication between the React interface and the TCP layer goes through Electron's IPC 
bridge — keeping the renderer process isolated from low-level networking.

---

## 💡 Technical highlights

- **Hex-to-float conversion** of raw device payloads into readable operational values
- **Secure IPC bridge** via `preload.js` — renderer never accesses Node.js APIs directly
- **Periodic polling** with continuous chart updates for real-time monitoring
- Clean separation between interface layer and communication layer

---

## 🚀 Running locally

**Requirements:** Node.js, npm, and a TCP-compatible flow meter (or a compatible TCP endpoint for testing)

```bash
npm install
npm start
```

To launch the desktop window:

```bash
npm run electron
```

> Connect to your device by entering its IP address and port in the interface.
