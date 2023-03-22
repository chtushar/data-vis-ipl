export const clean = () => {
    const allGroups = document.querySelectorAll(".vis svg g");
    Array.from(allGroups).filter(g => !g.classList.contains('players')).forEach((group) => {
        group.remove();
    });
}
