"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Shield, ShieldAlert, Ban, CheckCircle, User as UserIcon } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Role updated!", {
           style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
           iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
         });
        fetchUsers();
      } else { toast.error(data.message); }
    } catch (err) { toast.error("Action failed"); }
  };

  const toggleBan = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}/ban`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.isBanned ? "User Banned" : "User Restored", {
           style: { background: '#0b0f0a', color: data.isBanned ? '#ef4444' : '#a7c957', border: `1px solid ${data.isBanned ? '#ef4444' : '#a7c957'}` },
           iconTheme: { primary: data.isBanned ? '#ef4444' : '#a7c957', secondary: '#0b0f0a' }
         });
        fetchUsers();
      } else { toast.error(data.message); }
    } catch (err) { toast.error("Action failed"); }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#a7c957]/30 border-t-[#a7c957] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl space-y-8 font-body">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-heading">Access Control</h1>
        <p className="text-gray-400 mt-1">Manage user roles, permissions, and account statuses.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/60 text-gray-400 text-sm border-b border-white/10">
              <tr>
                <th className="p-4 font-bold tracking-wider">USER</th>
                <th className="p-4 font-bold tracking-wider">EMAIL</th>
                <th className="p-4 font-bold tracking-wider text-center">ROLE</th>
                <th className="p-4 font-bold tracking-wider text-center">STATUS</th>
                <th className="p-4 font-bold tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/30">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-inner">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <span className="text-white font-bold">{user.name || 'Fan'}</span>
                  </td>
                  <td className="p-4 text-gray-400 font-medium">{user.email}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-flex items-center justify-center gap-1.5 border ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-[#a7c957]/10 text-[#a7c957] border-[#a7c957]/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {user.role === 'admin' || user.role === 'superadmin' ? <ShieldAlert size={12}/> : <UserIcon size={12}/>}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-flex items-center justify-center border ${user.isBanned ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                      {user.isBanned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {user.role !== 'superadmin' && (
                      <>
                        <button onClick={() => toggleRole(user._id)} className="p-2.5 bg-white/5 hover:bg-[#a7c957] hover:text-[#0b0f0a] rounded-xl text-gray-300 transition-all border border-white/5 hover:border-transparent" title="Toggle Admin Role">
                          <Shield size={18}/>
                        </button>
                        <button onClick={() => toggleBan(user._id)} className={`p-2.5 rounded-xl transition-all border ${user.isBanned ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-[#0b0f0a]' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white'}`} title={user.isBanned ? "Unban User" : "Ban User"}>
                          {user.isBanned ? <CheckCircle size={18}/> : <Ban size={18}/>}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
