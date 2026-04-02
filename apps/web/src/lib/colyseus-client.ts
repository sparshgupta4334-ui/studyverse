"use client";

import { Client, type Room } from "colyseus.js";

const COLYSEUS_URL =
  process.env.NEXT_PUBLIC_COLYSEUS_URL ?? "ws://localhost:2567";

let colyseusClient: Client | null = null;

export function getColyseusClient(): Client {
  if (!colyseusClient) {
    colyseusClient = new Client(COLYSEUS_URL);
  }
  return colyseusClient;
}

export async function joinStudyRoom(options: {
  userId?: string;
  name?: string;
  avatar?: string;
}): Promise<Room> {
  const client = getColyseusClient();
  const room = await client.joinOrCreate("study_room", options);
  return room;
}
