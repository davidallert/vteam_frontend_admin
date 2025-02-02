import { createAction } from "@reduxjs/toolkit";
import io from "socket.io-client";

export const updateScooterStatusWS = createAction("scooters/updateStatusWS");

export function initWebsocketWithStore(store) {
  const socket = io("http://localhost:8585");
  socket.on("statusChange", (status) => {
    console.log("Socket received statusChange event:", status);
    store.dispatch(updateScooterStatusWS(status));
  });
  console.log("socket", socket);
  return socket;
}