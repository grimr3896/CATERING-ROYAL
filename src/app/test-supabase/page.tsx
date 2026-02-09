'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TableInfo {
  name: string;
  recordCount: number;
  error?: string;
}

export default function TestSupabase() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true);
      try {
        console.log('Testing Supabase connection...');
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
        
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        // Test connection by trying to fetch some data
        console.log('Attempting to fetch services...');
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .limit(1);

        if (servicesError) {
          console.error('Services error:', servicesError);
          throw servicesError;
        }

        console.log('Services fetched successfully:', services);
        setIsConnected(true);
        
        // Try to fetch other tables
        const tableNames = ['services', 'gallery_items', 'testimonials', 'team_members', 'social_links', 'site_content'];
        const tableInfos: TableInfo[] = [];
        
        for (const tableName of tableNames) {
          try {
            const { data, error: tableError } = await supabase.from(tableName).select('*');
            if (tableError) {
              tableInfos.push({ name: tableName, recordCount: 0, error: tableError.message });
              console.error(`Table ${tableName} error:`, tableError);
            } else {
              tableInfos.push({ name: tableName, recordCount: data.length });
              console.log(`Table ${tableName} exists and contains ${data.length} record(s)`);
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            tableInfos.push({ name: tableName, recordCount: 0, error: errorMessage });
            console.error(`Table ${tableName} error:`, err);
          }
        }
        
        setTables(tableInfos);
      } catch (err) {
        console.error('Connection test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Supabase Connection Test</h1>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <span className="font-medium">Connection Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {tables.length > 0 && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Database Tables:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Table Name</th>
                      <th className="text-left py-2 px-3">Record Count</th>
                      <th className="text-left py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                      <tr key={table.name} className="border-b hover:bg-green-50">
                        <td className="py-2 px-3 font-medium">{table.name}</td>
                        <td className="py-2 px-3">{table.recordCount}</td>
                        <td className="py-2 px-3">
                          {table.error ? (
                            <span className="text-red-600">{table.error}</span>
                          ) : (
                            <span className="text-green-600">Accessible</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tables.every(table => table.recordCount === 0) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="text-yellow-700">
                    All tables are empty. The application is using hardcoded fallback data.
                  </p>
                </div>
              )}
            </div>
          )}

          {isConnected && tables.length === 0 && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-yellow-700 text-sm">
                Connection successful but no tables found. Make sure your Supabase database has the required tables.
              </p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Environment Information:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Supabase URL:</span>
                <p className="text-blue-700 truncate">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              </div>
              <div>
                <span className="font-medium">Anon Key Set:</span>
                <p className="text-blue-700">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
