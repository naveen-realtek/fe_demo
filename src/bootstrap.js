import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
const root = ReactDOM.createRoot(document.querySelector("#admin"));
root.render(
    <BrowserRouter basename="/app/admin">
       <App />
    </BrowserRouter>
);
