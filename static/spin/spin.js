function spinWheel() {
    const wheel = document.getElementById('spinWheel');
    const spinBtn = document.getElementById('spin-btn');

    // Disable button during spin
    spinBtn.disabled = true;

    // Simulate a random spin result (adjust as needed)
    const randomDegrees = Math.floor(Math.random() * 360);

    // Calculate the total rotation, ensuring that the pointer always points at 50 KES
    const totalRotation = randomDegrees + 360 * 5;  // 5 rotations

    // Apply rotation to the wheel
    wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)'; // Adjust the cubic-bezier for smoother motion
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // Add the 'spin' class to the wheel to trigger the transition
    wheel.classList.add('spin');

    // Enable button after spin completes
    setTimeout(() => {
        spinBtn.disabled = false;

        // Remove the 'spin' class to reset the transition
        wheel.classList.remove('spin');

        // Determine the result based on the stop angle
        const won = (totalRotation % 360) < 180;

        // Display the result in a modal
        showModal(won);
    }, 3000);
}

function showModal(won) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const content = document.createElement('div');
    content.classList.add('modal-content');

    const message = document.createElement('p');
    message.textContent = won ? 'Congratulations! You won 50 KES.' : 'Sorry, you didn\'t win this time. Try again tomorrow!';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    content.appendChild(message);
    content.appendChild(closeButton);
    modal.appendChild(content);

    document.body.appendChild(modal);
}

// Dynamic creation of wheel sections
const wheel = document.getElementById('spinWheel');
const numSections = 6;  // Change this based on the number of sections
const degreesPerSection = 360 / numSections;

// Create and append new sections with background images
for (let i = 0; i < numSections; i++) {
    const section = document.createElement('div');
    const image = document.createElement('img');
    image.src = `/static/img/img/header/notice_${i + 1}.png`;  // Adjust the image filenames
    image.alt = `Image ${i + 1}`;

    section.classList.add('section');
    section.style.transform = `rotate(${i * degreesPerSection}deg)`;
    section.appendChild(image);
    
    wheel.appendChild(section);
}

// Add the pointer
const pointer = document.createElement('div');
pointer.classList.add('pointer');
wheel.appendChild(pointer);

// function spinWheel() {
//     const wheel = document.querySelector('.wheel');
//     const spinBtn = document.getElementById('spin-btn');

//     // Disable button during spin
//     spinBtn.disabled = true;

//     // Simulate a random spin result (adjust as needed)
//     const randomDegrees = Math.floor(Math.random() * 360);

//     // Calculate the total rotation, ensuring that the pointer always points at 50 KES
//     const totalRotation = randomDegrees + 360 * 5;  // 5 rotations

//     // Apply rotation to the wheel
//     wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)'; // Adjust the cubic-bezier for smoother motion
//     wheel.style.transform = `rotate(${totalRotation}deg)`;

//     // Add the 'spin' class to the wheel to trigger the transition
//     wheel.classList.add('spin');

//     // Enable button after spin completes
//     setTimeout(() => {
//         spinBtn.disabled = false;

//         // Remove the 'spin' class to reset the transition
//         wheel.classList.remove('spin');
        
//         // Display the result after a short delay
//         setTimeout(() => {
//             // Determine the result based on the stop angle
//             const won = (totalRotation % 360) < 180;

//             // Display the result as a pop-up
//             const message = won ? 'Congratulations! You won 50 KES.' : 'Sorry, you didn\'t win this time. Try again tomorrow!';
//             alert(message);
//         }, 500); // Adjust the delay to match the wheel spinning completion
//     }, 3000);
// }
