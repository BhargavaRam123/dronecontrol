// Option 1: Using spawn from child_process
import { spawn } from 'child_process';

export function startStreamWithSpawn() {
  return new Promise((resolve, reject) => {
    const mediaProcess = spawn('./mediamtx', [], {
      cwd: process.env.MEDIATX_PATH,
      stdio: 'pipe' // This allows us to capture stdout/stderr
    });
    console.log("man here is the mediaprocess that is existing",mediaProcess)

    // Handle process events
    mediaProcess.on('error', (error) => {
      console.error('Failed to start MediaTX:', error);
      reject(error);
    });

    mediaProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}, signal: ${signal}`));
      }
    });

    // Capture stdout
    mediaProcess.stdout.on('data', (data) => {
      console.log('MediaTX output:', data.toString());
    });

    // Capture stderr
    mediaProcess.stderr.on('data', (data) => {
      console.error('MediaTX error:', data.toString());
    });

    // Return the process instance so it can be managed
    resolve(mediaProcess);
  });
}
