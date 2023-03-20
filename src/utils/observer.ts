import { register } from './register'

export const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      register.subscribe(value => {
        value[entry.target.dataset.section]()
      })
    }
  })
}, {
  threshold: 1
})
