/**
 * Tracks mouse clicks and displays the X and Y coordinates in a designated element.
 *
 * @param {string} targetElementId - The ID of the HTML element where the coordinates will be displayed.  If null, defaults to displaying in the console.
 */
function trackMouseClicks(targetElementId = null) {
  // Get the target element (if specified).  If not specified, we log to the console.
  const targetElement = targetElementId ? document.getElementById(targetElementId) : null;

  // Error handling: check if the target element exists (if specified).
  if (targetElementId && !targetElement) {
    console.error(`Error: Element with ID "${targetElementId}" not found in the DOM.`);
    return; // Exit if the target element is invalid.  Preventing further errors.
  }

  // Event listener for mouse clicks on the entire document.
  document.addEventListener('click', (event) => {
    const x = event.clientX; // Horizontal coordinate (relative to the viewport).
    const y = event.clientY; // Vertical coordinate (relative to the viewport).

    if (targetElement) {
      // Display coordinates in the target element.
      targetElement.textContent = `X: ${x}, Y: ${y}`;
    } else {
      // Log coordinates to the console.
      console.log(`Click Coordinates: X: ${x}, Y: ${y}`);
    }
  });

  console.log("Mouse click tracking started. Click anywhere on the page.");
}


// --- Example Usage ---
// 1. Display coordinates in a div with the ID "coordinates".
// Create this HTML element in your HTML:
// <div id="coordinates"></div>
// trackMouseClicks("coordinates");


// 2. Display coordinates in the console.
trackMouseClicks(); // No targetElementId provided, so logs to console.

// 3. Display coordinates in the console, and then update an existing div:
//  <div id="anotherDiv">This text will be replaced by the coordinates</div>
// trackMouseClicks(); // logs to the console on click
// trackMouseClicks("anotherDiv") // updates this div with the coordinates. This will override any console logging, but it is still running the event listener.  If you are displaying to the console and using a div, this would be the correct behaviour.