import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk menjalankan perintah dan menunggu hasilnya
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: path.join(process.cwd(), 'frontend') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      resolve(stdout + (stderr || ''));
    });
  });
}

// Mendapatkan daftar file yang memiliki error unused-vars
async function getFilesWithUnusedVars() {
  try {
    console.log('Menjalankan ESLint untuk mencari variabel yang tidak digunakan...');
    const output = await runCommand('pnpm eslint . --ext .js,.jsx,.ts,.tsx --format json');

    let eslintResults;
    try {
      eslintResults = JSON.parse(output);
    } catch (err) {
      console.error('Error parsing ESLint output:', err);
      return new Map();
    }

    const filesWithIssues = new Map();

    for (const result of eslintResults) {
      // Abaikan file eslint.config.js
      if (result.filePath.endsWith('eslint.config.js')) {
        continue;
      }

      const filePath = path
        .relative(path.join(process.cwd(), 'frontend'), result.filePath)
        .replace(/\\/g, '/'); // Normalisasi path untuk Windows

      if (result.messages && result.messages.length > 0) {
        const unusedVarsMessages = result.messages.filter(
          msg =>
            (msg.ruleId === 'unused-imports/no-unused-vars' ||
              msg.ruleId === 'no-unused-vars' ||
              msg.ruleId?.includes('no-unused')) &&
            msg.message.includes('never used')
        );

        if (unusedVarsMessages.length > 0) {
          if (!filesWithIssues.has(filePath)) {
            filesWithIssues.set(filePath, []);
          }

          for (const msg of unusedVarsMessages) {
            // Ekstrak nama variabel dari pesan
            const varNameMatch = msg.message.match(/'([^']+)'/);
            if (varNameMatch && varNameMatch[1]) {
              filesWithIssues.get(filePath).push({
                lineNo: msg.line,
                colNo: msg.column,
                varName: varNameMatch[1],
              });
            }
          }
        }
      }
    }

    return filesWithIssues;
  } catch (error) {
    console.error('Error getting files with unused vars:', error);
    return new Map();
  }
}

// Fungsi untuk memperbaiki file dengan unused variables
async function fixUnusedVars(filesWithIssues) {
  for (const [filePath, issues] of filesWithIssues.entries()) {
    console.log(`\nProcessing file: ${filePath}`);

    try {
      // Membaca konten file
      const fullPath = path.join(process.cwd(), 'frontend', filePath);
      let content = fs.readFileSync(fullPath, 'utf8');
      let lines = content.split('\n');

      // Urutkan issues berdasarkan nomor baris (menurun) untuk menghindari pergeseran posisi
      issues.sort((a, b) => b.lineNo - a.lineNo);

      for (const issue of issues) {
        const { lineNo, varName } = issue;
        const line = lines[lineNo - 1]; // Array 0-based, lineNo 1-based

        console.log(`  Fixing: Line ${lineNo}, Var '${varName}'`);

        // Skip jika variabel sudah diawali dengan underscore
        if (line.includes(`_${varName}`)) {
          console.log(`  ► Already fixed: ${varName}`);
          continue;
        }

        // Perbaiki variabel dalam parameter fungsi atau objek destructuring
        if (line.includes('{') && line.includes('}')) {
          const newLine = line.replace(
            new RegExp(`(\\s|,|{)${varName}(\\s|,|:|})`, 'g'),
            (match, before, after) => {
              // Jika diikuti oleh ':', ini adalah deklarasi properti dalam objek, jangan ubah
              if (after.startsWith(':')) return match;
              return `${before}_${varName}${after}`;
            }
          );
          lines[lineNo - 1] = newLine;
        }
        // Perbaiki deklarasi variabel
        else if (line.includes('const ') || line.includes('let ')) {
          const newLine = line
            .replace(new RegExp(`\\bconst\\s+${varName}\\b`, 'g'), `const _${varName}`)
            .replace(new RegExp(`\\blet\\s+${varName}\\b`, 'g'), `let _${varName}`);
          lines[lineNo - 1] = newLine;
        }
        // Perbaiki parameter fungsi
        else {
          const newLine = line.replace(new RegExp(`\\b${varName}\\b(?!\\s*:)`, 'g'), `_${varName}`);
          lines[lineNo - 1] = newLine;
        }
      }

      // Menyimpan perubahan
      fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
      console.log(`  ✓ Fixed ${issues.length} issues in ${filePath}`);
    } catch (error) {
      console.error(`  ✗ Error fixing ${filePath}:`, error);
    }
  }
}

// Fungsi baru untuk mengurutkan import
async function sortImports() {
  console.log('\n🔄 Mengurutkan urutan import...');
  try {
    // Gunakan perintah sort-imports dari package.json
    await runCommand('pnpm sort-imports');
    console.log('✓ Import berhasil diurutkan');
    return true;
  } catch (/** @type {any} */ _unused) {
    console.error('✗ Error saat mengurutkan import');
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Finding files with unused variables...');
  const filesWithIssues = await getFilesWithUnusedVars();

  if (filesWithIssues.size === 0) {
    console.log('\n✅ No unused variables found!');
  } else {
    console.log(`\n🛠️ Found ${filesWithIssues.size} files with unused variables to fix.`);
    await fixUnusedVars(filesWithIssues);
  }

  // Mengurutkan import setelah memperbaiki unused variables
  await sortImports();

  console.log('\n🧹 Running lint again to check remaining issues...');
  await runCommand('pnpm fix:all');

  console.log('\n✅ Done!');
}

main().catch(console.error);
