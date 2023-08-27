- Allow interacting with the scene as soon as we have segments,
  even if we don't have the full upscaled image yet
- Make sure we convert PNG to JPG before sending it back
- Try a different segmentation algorithm (one where we don't need to pass a list of words)