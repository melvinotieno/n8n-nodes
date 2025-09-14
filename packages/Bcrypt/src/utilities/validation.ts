export const validateTextInput = (text: string, name: string): void => {
  if (text === "" || text === null || text === undefined) {
      throw new Error(`${name} Text must not be empty or null.`);
    }
}
