export const messages = [];
export let deliveryError = null;
export let creationError = null;

export function resetMail() {
  messages.length = 0;
  deliveryError = null;
  creationError = null;
}

export function failDelivery(error) {
  deliveryError = error;
}

export function failCreation(error) {
  creationError = error;
}

const mailer = {
  createTransport() {
    if (creationError) throw creationError;

    return {
      async sendMail(message) {
        messages.push(message);
        if (deliveryError) throw deliveryError;
      }
    };
  }
};

export default mailer;
