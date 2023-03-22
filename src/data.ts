import { writable } from "svelte/store";
import data from './data2.json'

export const playersInitial = data
export const players = writable(playersInitial)

export const resetPlayers = () => {
    players.set(playersInitial)
}
