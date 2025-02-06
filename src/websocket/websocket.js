import { createAction } from "@reduxjs/toolkit";
import io from "socket.io-client";

export const updateScooterStatusWS = createAction("scooters/updateStatusWS");
export const updateScooterLocationWS = createAction('scooters/updateLocationWS');


// filepath: /home/mobn/dbwebb-kurser/vteam/me/scooter-rental-system-frontend-admin/src/websocket/websocket.js
export function initWebsocketWithStore(store) {
  const socket = io("http://localhost:8585");

  console.log("✅ WebSocket is being initialized...");

  socket.on("connect", () => {
    console.log("✅ Socket Connected:", socket.id);
  });

  socket.on("statusChange", (status) => {
    console.log("✅ Socket received statusChange event:", status);
    store.dispatch(updateScooterStatusWS(status));
  });

  socket.on("receivemovingLocation", (location) => {
    console.log("✅ Socket received receivemovingLocation event:", location);
    store.dispatch(updateScooterLocationWS(location));
  });
  return socket;
}