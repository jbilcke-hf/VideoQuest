export const formatActionnableName = (input: string) => {
  input = input.replaceAll("-", " ")
  return input.charAt(0).toUpperCase() + input.slice(1)
}
