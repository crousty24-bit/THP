// Select the button and the text block that will be updated on click.
const learnMoreButton = document.querySelector("#learn-more-button");
const detailsText = document.querySelector("#details-text");

// Keep the behavior small and explicit for this first static prototype.
learnMoreButton.addEventListener("click", () => {
  detailsText.textContent =
    "The generator is designed to produce a reviewable draft, not a final truth. Developers must check the assumptions, adjust the tests, and run them in their own project.";
});
