"use client";
import { useEffect, useMemo, useState } from "react";

export const runtime = 'edge';

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">{label}</div>
      <input
        className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">{label}</div>
      <textarea
        className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [isShow, setIsShow] = useState("all"); // all | 0 | 1
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const t = localStorage.getItem("admin_token") || "";
    if (t) {
      setToken(t);
      setAuthed(true);
    }
  }, []);

  const headers = useMemo(() => ({ "x-admin-token": token, accept: "application/json", "content-type": "application/json" }), [token]);

  async function fetchList(p = page) {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("pageSize", String(pageSize));
      if (q.trim()) params.set("q", q.trim());
      if (isShow === "0" || isShow === "1") params.set("isShow", isShow);
      // Fallback: also send token via query in case headers are stripped by edge proxies
      params.set("token", token);
      const res = await fetch(`/api/admin/sites?${params}`, { headers });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || p);
    } catch (e) {
      console.error(e);
      alert("Auth failed or server error");
      setAuthed(false);
      localStorage.removeItem("admin_token");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    if (!confirm("确认审核通过该站点？")) return;
    await fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { method: "PATCH", headers, body: JSON.stringify({ isShow: 1 }) });
    fetchList();
  }

  async function publish(id) {
    if (!confirm("确认上线该站点？")) return;
    await fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { method: "PATCH", headers, body: JSON.stringify({ isShow: 1 }) });
    fetchList();
  }

  async function unpublish(id) {
    if (!confirm("确认下线该站点？下线后将不再展示")) return;
    await fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { method: "PATCH", headers, body: JSON.stringify({ isShow: 0 }) });
    fetchList();
  }

  async function remove(id) {
    if (!confirm("确认删除该站点？此操作不可恢复")) return;
    await fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { method: "DELETE", headers });
    fetchList();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditData({
      title_en: item.title_en || "",
      title_zh: item.title_zh || "",
      desc_en: item.desc_en || "",
      desc_zh: item.desc_zh || "",
    });
  }

  async function saveEdit() {
    const id = editingId;
    await fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { method: "PATCH", headers, body: JSON.stringify(editData) });
    setEditingId(null);
    setEditData({});
    fetchList();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem("admin_token", token.trim());
    setAuthed(true);
    fetchList(1);
  }

  useEffect(() => {
    if (authed) fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (!authed) {
    return (
      <>
        <meta name="robots" content="noindex,nofollow" />
        <main className="max-w-xl mx-auto mt-16 p-6 bg-white/90 dark:bg-zinc-900/80 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <TextInput label="Admin Token" value={token} onChange={setToken} placeholder="Enter ADMIN_TOKEN" />
            <button className="px-4 py-2 rounded bg-violet-600 text-white" type="submit">Login</button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <main className="max-w-6xl mx-auto mt-8 p-4 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4">站点管理</h1>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="w-72">
          <TextInput label="搜索" value={q} onChange={setQ} placeholder="标题/描述/链接/ID" />
        </div>
        <label className="block">
          <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">状态</div>
          <select className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2" value={isShow} onChange={(e)=>setIsShow(e.target.value)}>
            <option value="all">全部</option>
            <option value="0">待审核</option>
            <option value="1">已展示</option>
          </select>
        </label>
        <button className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700" onClick={()=>fetchList(1)} disabled={loading}>查询</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-zinc-200 dark:border-zinc-800">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">标题</th>
              <th className="px-3 py-2 text-left">链接</th>
              <th className="px-3 py-2 text-left">状态</th>
              <th className="px-3 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-zinc-200 dark:border-zinc-800 align-top">
                <td className="px-3 py-2 whitespace-nowrap text-zinc-600 dark:text-zinc-300">{item.id}</td>
                <td className="px-3 py-2 w-[420px]">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <TextInput label="title_en" value={editData.title_en} onChange={(v)=>setEditData(d=>({...d, title_en:v}))} />
                      <TextInput label="title_zh" value={editData.title_zh} onChange={(v)=>setEditData(d=>({...d, title_zh:v}))} />
                      <TextArea label="desc_en" value={editData.desc_en} onChange={(v)=>setEditData(d=>({...d, desc_en:v}))} />
                      <TextArea label="desc_zh" value={editData.desc_zh} onChange={(v)=>setEditData(d=>({...d, desc_zh:v}))} />
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {(item.title_en || item.title_zh) && (
                        <div className="text-xs text-zinc-500">EN: {item.title_en || '-'} | ZH: {item.title_zh || '-'}</div>
                      )}
                      {(item.description || item.desc_en || item.desc_zh) && (
                        <div className="text-xs text-zinc-500 line-clamp-3">{item.description || item.desc_en || item.desc_zh}</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 max-w-[320px] truncate">
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{item.link}</a>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{item.isShow ? '已展示' : '待审核'}</td>
                <td className="px-3 py-2 whitespace-nowrap space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={saveEdit}>保存</button>
                      <button className="px-3 py-1 rounded bg-zinc-400 text-white" onClick={cancelEdit}>取消</button>
                    </>
                  ) : (
                    <>
                      {!item.isShow ? (
                        <>
                          <button className="px-3 py-1 rounded bg-violet-600 text-white" onClick={()=>approve(item.id)}>审核通过</button>
                          <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={()=>publish(item.id)}>上线</button>
                        </>
                      ) : (
                        <button className="px-3 py-1 rounded bg-slate-600 text-white" onClick={()=>unpublish(item.id)}>下线</button>
                      )}
                      <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={()=>startEdit(item)}>编辑</button>
                      <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>remove(item.id)}>删除</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">{loading ? '加载中...' : '暂无数据'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">共 {total} 条，{page}/{totalPages} 页</div>
        <div className="space-x-2">
          <button className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700" disabled={page<=1} onClick={()=>{setPage(p=>p-1); fetchList(page-1);}}>上一页</button>
          <button className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700" disabled={page>=totalPages} onClick={()=>{setPage(p=>p+1); fetchList(page+1);}}>下一页</button>
        </div>
      </div>
    </main>
    </>
  );
}
