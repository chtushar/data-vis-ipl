import { writable } from "svelte/store";
import data from './data.json'

export const playersInitial = data
export const players = writable(playersInitial)

export const resetPlayers = () => {
    players.set(playersInitial)
}