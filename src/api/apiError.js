export function getApiErrorMessage(data, fallbackMessage) {
  if (data.detail) {
    return data.detail;
  }

  if (data.error) {
    return data.error;
  }

  if (data.errors) {
    const errors = data.errors;

    const firstField = Object.keys(errors)[0];

    if (firstField && errors[firstField]?.length > 0) {
      return errors[firstField][0];
    }
  }

  return fallbackMessage;
}