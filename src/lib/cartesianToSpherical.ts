export function cartesianToSpherical(x: number, y: number, width: number, height: number): { yaw: number, pitch: number } {
  const yaw = (x / width) * 360 - 180;
  const pitch = (y / height) * 180 - 90;

  return { yaw, pitch };
}
