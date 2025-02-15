// copy-mail-templates.ts
import * as fs from 'fs/promises';
import * as path from 'path';

// Use require for CommonJS modules
const fg = require('fast-glob');

async function copyTemplates() {
  const projectRoot = path.resolve(__dirname, '..'); // Adjust based on your script location
  const srcBase = path.join(projectRoot, 'src');
  const destBase = path.join(projectRoot, 'dist');

  const srcDir = path.join(srcBase, 'modules', 'common', 'mail', 'template');
  const destDir = path.join(destBase, 'modules', 'common', 'mail', 'template');

  // console.log(`Source directory: ${srcDir}`);
  // console.log(`Destination directory: ${destDir}`);

  await fs.mkdir(destDir, { recursive: true });

  try {
    const options = { cwd: srcDir, dot: true, onlyFiles: true };
    // console.log('fast-glob options:', options);

    const files = await fg(['**/*.hbs'], options);
    // console.log('HBS files found:', files);

    if (files.length === 0) {
      console.warn('No .hbs files found in the source directory.');
      return;
    }

    for (const file of files) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);

      await fs.mkdir(path.dirname(destFile), { recursive: true });
      await fs.copyFile(srcFile, destFile);
      // console.log(`Copied ${srcFile} to ${destFile}`);

      // 验证文件是否真的被复制到了目的地
      try {
        const stats = await fs.stat(destFile);
        if (stats.isFile()) {
          // console.log(`Successfully verified that ${destFile} exists.`);
        }
      } catch (err) {
        console.error(`Failed to verify that ${destFile} exists after copying:`, err);
      }
    }

    // console.log('Template files copied successfully.');
  } catch (err) {
    console.error('Error copying template files:', err);
  }
}

copyTemplates().catch(err => {
  console.error('Unhandled error during copy templates:', err);
});