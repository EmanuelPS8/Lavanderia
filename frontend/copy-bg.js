import fs from 'fs';

const source = 'C:\\Users\\Emanuel\\.gemini\\antigravity-ide\\brain\\aadec52c-325b-4d29-a43b-938957483fea\\background_clean_1782437020202.png';
const dest = './src/background.png';

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log('Background image copied successfully to src/background.png!');
  } else {
    console.warn('Source background image not found at:', source);
  }
} catch (err) {
  console.error('Error copying background image:', err);
}
