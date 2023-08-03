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
  mouseX: number,
  mouseY: number,
  containerWidth: number,
  containerHeight: number,
  currentYaw: number,
  currentPitch: number,
  imageWidth: number,
  imageHeight: number,
  fov: number,
}): { x: number; y: number } {
  // Considering the full width/height of FOV
  const relativeX = 2 * (mouseX / containerWidth) - 1;
  const relativeY = 2 * (mouseY / containerHeight) - 1;

  // yaw varies with FOV over width and pitch over height
  const deltaYaw = relativeX * fov * (Math.PI / 180);
  const deltaPitch = relativeY * fov * (Math.PI / 180);
  
  let newYaw = currentYaw + deltaYaw;
  while (newYaw < 0) newYaw += 2 * Math.PI;
  while (newYaw > 2 * Math.PI) newYaw -= 2 * Math.PI;

  let newPitch = currentPitch + deltaPitch;
  if (newPitch < -Math.PI / 2) newPitch = -Math.PI / 2;
  if (newPitch > Math.PI / 2) newPitch = Math.PI / 2;

  // Changing origin for the yaw rotation to bring image center to screen center
  newYaw = (newYaw + Math.PI) % (2 * Math.PI);
  
  // Image X corresponds to Yaw and Y corresponds to Pitch
  const x = ((newYaw / (2 * Math.PI)) * imageWidth) % imageWidth;
  const y = (((newPitch + Math.PI / 2) / Math.PI) * imageHeight) % imageHeight;

  return { x, y };
}