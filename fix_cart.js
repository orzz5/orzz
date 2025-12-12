// Fix for TOTP modal blocking cart functionality
// This will be added to the showValidationModal method

// Don't block cart functionality - allow clicks to pass through to cart elements
modal.style.pointerEvents = 'none';
const modalContent = modal.querySelector('.totp-modal-content');
modalContent.style.pointerEvents = 'auto';
