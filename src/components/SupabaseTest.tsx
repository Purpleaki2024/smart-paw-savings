import { useEffect, useState } from "react";

const SupabaseTest = () => {
  const [status, setStatus] = useState<string>("Loading...");
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    try {
      // Check environment variables
      const envConfig = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV
      };
      
      setConfig(envConfig);
      
      // Try to import supabase client
      import("@/integrations/supabase/client").then((module) => {
        setStatus("Supabase client loaded successfully");
      }).catch((error) => {
        setStatus(`Failed to load Supabase client: ${error.message}`);
      });
      
    } catch (error) {
      setStatus(`Configuration error: ${error}`);
    }
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Supabase Configuration Test</h3>
      <p className="mb-2">Status: <span className={status.includes("successfully") ? "text-green-600" : "text-red-600"}>{status}</span></p>
      
      <div className="mt-2 text-xs text-gray-600">
        <h4 className="font-semibold">Environment Variables:</h4>
        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SupabaseTest;
