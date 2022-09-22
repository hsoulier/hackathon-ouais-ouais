const modals = document.querySelectorAll<HTMLDivElement>("[data-modal]")

modals.forEach((trigger) => {
  trigger.addEventListener("click", function (event) {
    event.preventDefault()
    if ("modal" in trigger.dataset) {
      const modal = document.getElementById(trigger.dataset.modal as string)!
      modal.classList.add("open")
      const exits = modal.querySelectorAll(".modal-exit")
      exits.forEach((exit) => {
        exit.addEventListener("click", (event) => {
          event.preventDefault()
          modal.classList.remove("open")
        })
      })
    }
  })
})
