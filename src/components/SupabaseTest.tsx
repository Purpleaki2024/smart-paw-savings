import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Get the actual URL being used
        setUrl(supabase.supabaseUrl);
        
        // Test with a simple health check first
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(`Auth Error: ${error.message}`);
          setConnectionStatus("Failed - Auth");
        } else {
          setConnectionStatus("Connected successfully!");
          setError(null);
        }
      } catch (err) {
        setError(`Connection error: ${err}`);
        setConnectionStatus("Failed - Network");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Test</h3>
      <p className="mb-2">Status: <span className={connectionStatus === "Connected successfully!" ? "text-green-600" : "text-red-600"}>{connectionStatus}</span></p>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-600">
        <p>Configured URL: {url}</p>
        <p>Expected: https://jlrxsnarfbsppmfelikz.supabase.co</p>
      </div>
    </div>
  );
};

export default SupabaseTest;
