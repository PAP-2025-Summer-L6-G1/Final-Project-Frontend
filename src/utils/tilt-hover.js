export const handleMouseMove = (event) => {
    const card = event.currentTarget; // This e is the event and the currentTarget will give me the card.
    const rect = card.getBoundingClientRect(); // Need to get the cards current position and dimensions

    // Get the mouse position relative to the card on a plane
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate the center of the card (should just be 50% of the width/height)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate how far the cursor is from the center (as a percentage) to use for tilt
    // Multiply by an intensity factor (adjust later) to exaggerate the tilt effect
    const rotateX = ((y - centerY) / centerY) * 20; // Tilt up/down
    const rotateY = ((x - centerX) / centerX) * -20; // Tilt left/right (negative to mirror movement)

    // Apply 3D transform to card, including a slight scale-up for emphasis
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
};

// This function resets the card's transform after the mouse leaves
export const handleMouseLeave = (event) => {
    const card = event.currentTarget; //Grabbing the card again

    // Resetting the transform to default (no rotation, normal scale of 1)
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";

    // Add a transition so it resets smoothly and doesn't jerk back to the init state
    card.style.transition = "transform 0.2s ease";
};