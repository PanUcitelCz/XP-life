import chokidar from 'chokidar';
import crypto from 'crypto';
import { generateFonts } from 'fantasticon';
import fs from 'fs-extra';
import path from 'path';

// Function to generate file hash for change detection
const generateFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

// Normalize paths for cross-platform compatibility
const normalizePath = (filePath) => filePath.replace(/\\/g, '/');

export default function fantasticonPlugin(options = {}) {
  const sourceDir = normalizePath(options.inputDir || path.resolve(__dirname, '../src/icons'));
  const outputDir = normalizePath(options.outputDir || path.resolve(__dirname, '../src/css/fantasticon'));
  const codepoints = options.codepoints || {}; // Ensure codepoints is always an object

  let fileHashes = new Map();

  const generate = async (files = []) => {
    if (files.length === 0) {
      files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.svg')).map(file => path.join(sourceDir, file));
    }

    const updatedFiles = files.filter(file => {
      const hash = generateFileHash(file);
      if (!fileHashes.has(file) || fileHashes.get(file) !== hash) {
        fileHashes.set(file, hash);
        return true;
      }
      return false;
    });

    if (updatedFiles.length > 0) {
      try {
        await generateFonts({
          inputDir: sourceDir,
          outputDir: outputDir,
          fontTypes: options.fontTypes || ['woff', 'woff2', 'svg'],
          assetTypes: options.assetTypes || ['css', 'html'],
          name: options.name || 'fantasticon',
          prefix: 'icon',
          codepoints: codepoints,
          ...options,
        });
        injectCssVariables();
      } catch (error) {
        console.error('Error in generateFonts:', error);
      }
    }
  };

  const injectCssVariables = () => {
    const cssFilePath = path.join(outputDir, 'fantasticon.css');
    if (!fs.existsSync(cssFilePath)) {
      console.warn(`CSS file not found: ${cssFilePath}`);
      return;
    }

    let cssContent = fs.readFileSync(cssFilePath, 'utf8');

    const cssVariables = Object.entries(codepoints)
      .map(([name, codepoint]) => `--icon-${name}: "\\${codepoint.toString(16)}";`)
      .join('\n');

    cssContent = `:root {\n${cssVariables}\n}\n${cssContent}`;

    Object.keys(codepoints).forEach(icon => {
      const regex = new RegExp(`\\.icon-${icon}:before\\s*{[^}]*}`, 'g');
      const replacement = `.icon-${icon}:before { content: var(--icon-${icon}); }`;
      cssContent = cssContent.replace(regex, replacement);
    });

    fs.writeFileSync(cssFilePath, cssContent, 'utf8');
  };

  return {
    name: 'vite-plugin-fantasticon',
    async buildStart() {
      try {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        const files = fs.readdirSync(sourceDir).map(file => path.join(sourceDir, file));
        await generate(files);
        if (process.env.NODE_ENV !== 'production') {
          const watcher = chokidar.watch(`${sourceDir}/*.svg`, { persistent: true });
          watcher.on('add', file => generate([file]));
          watcher.on('change', file => generate([file]));
          watcher.on('unlink', async file => {
            fileHashes.delete(file);
            await generate();
          });
        }
      } catch (error) {
        console.error('Error during buildStart:', error);
      }
    },
    configureServer(server) {
      const watcher = chokidar.watch(`${sourceDir}/*.svg`, { persistent: true });
      watcher.on('add', file => {
        generate([file]).then(() => server.ws.send({ type: 'full-reload', path: '*' }));
      });
      watcher.on('change', file => {
        generate([file]).then(() => server.ws.send({ type: 'full-reload', path: '*' }));
      });
      watcher.on('unlink', async file => {
        fileHashes.delete(file);
        await generate();
        server.ws.send({ type: 'full-reload', path: '*' });
      });
    }
  };
}
