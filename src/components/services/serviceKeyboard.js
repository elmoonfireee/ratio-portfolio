export function activateWithKeyboard(event, callback) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  callback();
}
