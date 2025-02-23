import { NextResponse } from 'next/server';
import { startStreamWithSpawn } from '@/lib/stream';

// Store the media process reference
let mediaProcess = null;

export async function POST() {
  try {
    // Check if process is already running
    if (mediaProcess) {
      return NextResponse.json(
        { message: 'Stream is already running' },
        { status: 400 }
      );
    }

    // Start the stream and store the process reference
    mediaProcess = await startStreamWithSpawn();

    // Handle process exit
    mediaProcess.on('exit', (code, signal) => {
      console.log(`Stream process exited with code ${code}, signal: ${signal}`);
      mediaProcess = null;
    });

    return NextResponse.json({ 
      message: 'Stream started successfully',
      pid: mediaProcess.pid
    });

  } catch (error) {
    console.error('Error starting stream:', error);
    // Clean up process reference if startup failed
    mediaProcess = null;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to check stream status
export async function GET() {
  return NextResponse.json({
    isRunning: mediaProcess !== null,
    pid: mediaProcess?.pid
  });
}

// Add a DELETE endpoint to stop the stream
export async function DELETE() {
  if (!mediaProcess) {
    return NextResponse.json(
      { message: 'No stream is running' },
      { status: 400 }
    );
  }

  try {
    mediaProcess.kill();
    mediaProcess = null;
    return NextResponse.json({ message: 'Stream stopped successfully' });
  } catch (error) {
    console.error('Error stopping stream:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}