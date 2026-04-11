'use client';

const SERVICES = [
  { name: 'API Server', status: 'operational', uptime: '99.98%', latency: '42ms', lastCheck: '1 min ago' },
  { name: 'Database (PostgreSQL)', status: 'operational', uptime: '99.99%', latency: '8ms', lastCheck: '1 min ago' },
  { name: 'Redis Cache', status: 'operational', uptime: '99.95%', latency: '2ms', lastCheck: '1 min ago' },
  { name: 'SMS Gateway', status: 'degraded', uptime: '97.2%', latency: '1200ms', lastCheck: '1 min ago' },
  { name: 'Storage (S3)', status: 'operational', uptime: '99.99%', latency: '120ms', lastCheck: '1 min ago' },
  { name: 'Email Service', status: 'operational', uptime: '99.7%', latency: '230ms', lastCheck: '1 min ago' },
];

const statusColors: Record<string, string> = {
  operational: 'bg-green-900/40 text-green-400',
  degraded: 'bg-yellow-900/40 text-yellow-400',
  down: 'bg-red-900/40 text-red-400',
};

export default function AdminSystemPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-white">System Monitoring</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'All Systems', value: '5/6 Operational', color: 'text-green-400' },
          { label: 'Avg Uptime', value: '99.3%', color: 'text-green-400' },
          { label: 'Active Incidents', value: '1', color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="font-semibold text-white">Service Status</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {SERVICES.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${s.status === 'operational' ? 'bg-green-400' : s.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                <span className="text-sm font-medium text-white">{s.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Uptime: <span className="text-gray-300">{s.uptime}</span></span>
                <span className="text-gray-500">Latency: <span className="text-gray-300">{s.latency}</span></span>
                <span className={`px-2 py-0.5 rounded-full ${statusColors[s.status]}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
