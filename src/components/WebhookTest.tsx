import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const WebhookTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWebhook = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('Testing webhook...');
      const { data, error } = await supabase.functions.invoke('webhook-test', {
        body: {}
      });

      console.log('Test result:', data);
      console.log('Test error:', error);

      setResult({ data, error });
    } catch (err) {
      console.error('Test failed:', err);
      setResult({ error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-4">Webhook Test</h3>
      
      <Button onClick={testWebhook} disabled={testing}>
        {testing ? 'Testing...' : 'Test Webhook Connection'}
      </Button>

      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};