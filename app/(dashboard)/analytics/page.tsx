'use client'
import { TopBar } from '@/components/dashboard/TopBar'
import { StatCard } from '@/components/dashboard/StatCard'
import { Eye, TrendingUp, MousePointer, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CHART_DATA = [
  { date: 'Jul 1', views: 4200 }, { date: 'Jul 3', views: 6800 }, { date: 'Jul 5', views: 5400 },
  { date: 'Jul 7', views: 9200 }, { date: 'Jul 9', views: 7800 }, { date: 'Jul 11', views: 11200 },
  { date: 'Jul 13', views: 13400 }, { date: 'Jul 15', views: 9600 }, { date: 'Jul 17', views: 14800 },
  { date: 'Jul 19', views: 12200 }, { date: 'Jul 21', views: 16400 }, { date: 'Jul 23', views: 18900 },
  { date: 'Jul 25', views: 15600 }, { date: 'Jul 27', views: 21200 }, { date: 'Jul 29', views: 19800 },
]

const TOP_VIDEOS = [
  { rank: '🥇', title: 'Summer Sale — Sophia', views: '84,291', ctr: '8.4%', conversions: '714' },
  { rank: '🥈', title: 'Product Launch — Marcus', views: '62,400', ctr: '7.1%', conversions: '443' },
  { rank: '🥉', title: 'Brand Story — Elena', views: '48,900', ctr: '6.2%', conversions: '303' },
  { rank: '4', title: 'Flash Sale — Carlos', views: '34,200', ctr: '5.8%', conversions: '198' },
  { rank: '5', title: 'Holiday — Nina', views: '28,100', ctr: '5.1%', conversions: '143' },
]

export default function AnalyticsPage() {
  return (
    <div>
      <TopBar title="Analytics" subtitle="Track your video ad performance" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-5">
          <StatCard title="Total Views" value="284,291" change="+34%" changeType="positive" icon={Eye} />
          <StatCard title="Avg CTR" value="6.8%" change="+1.2pp" changeType="positive" icon={MousePointer} iconColor="text-green-600" iconBg="bg-green-50" />
          <StatCard title="Conversions" value="1,840" change="+89%" changeType="positive" icon={TrendingUp} iconColor="text-purple-600" iconBg="bg-purple-50" />
          <StatCard title="Revenue Impact" value="$12,400" change="+195%" changeType="positive" icon={DollarSign} iconColor="text-amber-600" iconBg="bg-amber-50" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#0A0A0B] mb-6">Views over time (last 30 days)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={CHART_DATA} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="views" fill="#2563EB" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#0A0A0B]">Top Performing Videos</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {['', 'Video', 'Views', 'CTR', 'Conversions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {TOP_VIDEOS.map(v => (
                <tr key={v.title} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4 text-xl">{v.rank}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0A0A0B]">{v.title}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{v.views}</td>
                  <td className="px-6 py-4"><span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{v.ctr}</span></td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{v.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
