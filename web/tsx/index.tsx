import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import { MainWindow } from "./window/MainWindow";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once("ipc-example", (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-example", ["ping"]);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainWindow />}/>
            </Routes>
        </Router>
    );
}
