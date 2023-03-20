import { writable } from 'svelte/store';

export const register = writable({});

export const registerFn = (key: string, cb: Function) => {
  register.update((prev) => {
    return {
      ...prev,
      [key]: cb
    }
  })
}

