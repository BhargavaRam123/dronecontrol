import { useState, useEffect } from 'react';
import { AlertCircle, CloudCog, Loader2 } from 'lucide-react';

export default function StreamControl({
  isStreaming,
  setIsStreaming,
  error,
  setError
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamPid, setStreamPid] = useState(null);

  // Check stream status on mount
  useEffect(() => {
    checkStreamStatus();
  }, []);

  const checkStreamStatus = async () => {
    try {
      const response = await fetch('/api/start-stream');
      const data = await response.json();
      console.log(" stream status data:",data)
      setIsStreaming(data.isRunning);
      setStreamPid(data.pid);
    } catch (err) {
      console.error('Error checking stream status:', err);
    }
  };

  const startStream = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("starting stream")
      const response = await fetch('/api/start-stream', {
        method: 'POST',
      });
      
      const data = await response.json();
      console.log("s",response)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start stream');
      }
      
      setStreamPid(data.pid);
      setIsStreaming(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/start-stream', {
        method: 'DELETE',
      });
      console.log("stopping stream")
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop stream');
      }
      
      setIsStreaming(false);
      setStreamPid(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-x-4">
        <button
          onClick={startStream}
          disabled={isStreaming || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg
                    disabled:bg-blue-300 disabled:cursor-not-allowed inline-flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isStreaming ? (
            'Streaming...'
          ) : (
            'fStart Stream'
          )}
        </button>

        {isStreaming && (
          <button
            onClick={stopStream}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg
                      disabled:bg-red-400 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stopping...
              </>
            ) : (
              'Stop Stream'
            )}
          </button>
        )}
      </div>

      {/* Stream Viewer */}
      {isStreaming && (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src="http://192.168.0.182:8889/cam1"
            className="w-full h-[600px]"
            scrolling="no"
            title="Stream Viewer"
          />
        </div>
       )} 

      {streamPid && (
        <div className="text-sm text-gray-600">
          Stream Process ID: {streamPid}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}