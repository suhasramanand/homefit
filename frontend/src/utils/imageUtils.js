/**
 * Image Utility Functions
 */

// SVG placeholder image as data URI (light gray with icon)
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";

/**
 * Formats image URL to full path
 * @param {string} imagePath - Image path (can be relative or absolute)
 * @returns {string} Full image URL
 */
export const formatImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a data URI, return as is
  if (imagePath.startsWith('data:')) return imagePath;
  
  // Otherwise, prepend the base URL
  return `http://localhost:4000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

/**
 * Gets a placeholder image for when images fail to load
 * @returns {string} Placeholder image data URI
 */
export const getPlaceholderImage = () => PLACEHOLDER_IMAGE;

/**
 * Handles image error and sets a placeholder
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  if (event.target.src !== PLACEHOLDER_IMAGE) {
    event.target.src = PLACEHOLDER_IMAGE;
  }
};

export default formatImageUrl;

