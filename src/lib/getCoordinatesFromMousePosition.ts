export function getCoordinatesFromMousePosition({
  mouseX,
  mouseY,
  containerWidth,
  containerHeight,
  currentYaw,
  currentPitch,
  imageWidth,
  imageHeight,
  fov,
}: {
  mouseX: number
  mouseY: number
  containerWidth: number
  containerHeight: number
  currentYaw: number
  currentPitch: number
  imageWidth: number
  imageHeight: number
  fov: number
}): { x: number; y: number } {
  // Convert mouse position to relative to the viewer's center
  const relativeX = 2 * (mouseX / containerWidth) - 1;
  const relativeY = 2 * (mouseY / containerHeight) - 1;

  // Calculate angle differences (in degrees)
  const deltaYaw = relativeX * fov / 2;
  const deltaPitch = relativeY * fov / 2;

  // Calculate new yaw and pitch
  const newYaw = currentYaw + deltaYaw;
  const newPitch = currentPitch + deltaPitch;

  // Now convert these yaw, pitch back to (x, y) on the image
  const x = ((newYaw + 180) / 360) * imageWidth;
  const y = ((newPitch + 90) / 180) * imageHeight;

  return { x, y };
}