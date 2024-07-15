// script.js
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.circle-link');
    const container = document.querySelector('.circle-container');
    const radius = container.offsetWidth / 2;
    const angleStep = 360 / links.length;

    links.forEach((link, index) => {
        const angle = angleStep * index;
        const radians = angle * (Math.PI / 180);
        const x = radius + radius * Math.cos(radians) - link.offsetWidth / 2;
        const y = radius + radius * Math.sin(radians) - link.offsetHeight / 2;

        link.style.left = `${x}px`;
        link.style.top = `${y}px`;
        link.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    });
});
