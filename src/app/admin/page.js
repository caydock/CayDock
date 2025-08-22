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
  // Hide global header/footer when entering admin
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('admin-mode')
      return () => document.body.classList.remove('admin-mode')
    }
  }, [])
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
  const [checkingIframe, setCheckingIframe] = useState(new Set()); // 正在检测的网站ID集合
  const [bulkChecking, setBulkChecking] = useState(false); // 批量检测状态
  const [selectedItems, setSelectedItems] = useState(new Set()); // 选中的项目
  const [showAddForm, setShowAddForm] = useState(false); // 显示添加表单
  const [addFormData, setAddFormData] = useState({
    link: '',
    title: '',
    title_en: '',
    title_zh: '',
    desc_en: '',
    desc_zh: '',
    abbrlink: '',
    slug: ''
  });
  const [addingSite, setAddingSite] = useState(false); // 添加网站状态

  useEffect(() => {
    const t = localStorage.getItem("admin_token") || "";
    if (t) {
      setToken(t);
      setAuthed(true);
    }
  }, []);

  const headers = useMemo(() => ({
    "x-admin-token": token,
    authorization: token ? `Bearer ${token}` : undefined,
    accept: "application/json",
    "content-type": "application/json",
  }), [token]);

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

  // 检测iframe并自动下线
  async function checkIframe(id) {
    setCheckingIframe(prev => new Set(prev).add(id));
    
    try {
      const res = await fetch('/api/admin/check-iframe', {
        method: 'POST',
        headers,
        body: JSON.stringify({ siteId: id })
      });
      
      if (!res.ok) {
        throw new Error('检测请求失败');
      }
      
      const result = await res.json();
      
      if (result.checkResult.allowed === false) {
        alert(`检测结果：${result.siteTitle}\n原因：${result.checkResult.reason}\n网站已自动下线！`);
        fetchList(); // 刷新列表
      } else if (result.checkResult.allowed === true) {
        alert(`检测结果：${result.siteTitle}\n状态：允许iframe嵌入 ✅`);
      } else {
        alert(`检测结果：${result.siteTitle}\n状态：检测失败 ⚠️\n原因：${result.checkResult.reason}`);
      }
      
    } catch (error) {
      console.error('检测失败:', error);
      alert(`检测失败：${error.message}`);
    } finally {
      setCheckingIframe(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  // 批量检测iframe
  async function bulkCheckIframe() {
    if (selectedItems.size === 0) {
      alert('请先选择要检测的网站');
      return;
    }
    
    setBulkChecking(true);
    
    try {
      const res = await fetch('/api/admin/check-iframe-bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          siteIds: Array.from(selectedItems),
          autoUnpublish: true
        })
      });
      
      if (!res.ok) {
        throw new Error('批量检测请求失败');
      }
      
      const result = await res.json();
      
      // 显示检测结果
      const message = `批量检测完成！\n\n` +
        `总计：${result.summary.total} 个网站\n` +
        `允许iframe：${result.summary.allowed} 个 ✅\n` +
        `不允许iframe：${result.summary.blocked} 个 ❌\n` +
        `检测失败：${result.summary.failed} 个 ⚠️\n` +
        `已下线：${result.summary.unpublished} 个\n\n` +
        (result.unpublishIds.length > 0 ? 
          `已下线的网站：${result.unpublishIds.join(', ')}` : 
          '没有需要下线的网站');
      
      alert(message);
      
      // 刷新列表
      fetchList();
      
      // 清空选择
      setSelectedItems(new Set());
      
    } catch (error) {
      console.error('批量检测失败:', error);
      alert(`批量检测失败：${error.message}`);
    } finally {
      setBulkChecking(false);
    }
  }

  // 批量上线
  async function bulkPublish() {
    if (selectedItems.size === 0) {
      alert('请先选择要上线的网站');
      return;
    }
    
    try {
      const promises = Array.from(selectedItems).map(id => 
        fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { 
          method: "PATCH", 
          headers, 
          body: JSON.stringify({ isShow: 1 }) 
        })
      );
      
      await Promise.all(promises);
      alert(`批量上线完成！已上线 ${selectedItems.size} 个网站`);
      
      // 刷新列表
      fetchList();
      
      // 清空选择
      setSelectedItems(new Set());
      
    } catch (error) {
      console.error('批量上线失败:', error);
      alert(`批量上线失败：${error.message}`);
    }
  }

    // 批量下线
  async function bulkUnpublish() {
    if (selectedItems.size === 0) {
      alert('请先选择要下线的网站');
      return;
    }

    try {
      const promises = Array.from(selectedItems).map(id =>
        fetch(`/api/admin/sites/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ isShow: 0 })
        })
      );

      await Promise.all(promises);
      alert(`批量下线完成！已下线 ${selectedItems.size} 个网站`);

      // 刷新列表
      fetchList();

      // 清空选择
      setSelectedItems(new Set());

    } catch (error) {
      console.error('批量下线失败:', error);
      alert(`批量下线失败：${error.message}`);
    }
  }

  // 添加网站
  async function addSite(e) {
    e.preventDefault();
    
    if (!addFormData.link.trim()) {
      alert('请输入网站链接');
      return;
    }

    setAddingSite(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '添加失败');
      }

      const result = await res.json();
      alert(`网站添加成功！\nID: ${result.id}\nAbbrlink: ${result.abbrlink}`);
      
      // 重置表单
      setAddFormData({
        link: '',
        title: '',
        title_en: '',
        title_zh: '',
        desc_en: '',
        desc_zh: '',
        abbrlink: '',
        slug: ''
      });
      setShowAddForm(false);
      
      // 刷新列表
      fetchList();

    } catch (error) {
      console.error('添加网站失败:', error);
      alert(`添加网站失败：${error.message}`);
    } finally {
      setAddingSite(false);
    }
  }

  // 重置添加表单
  function resetAddForm() {
    setAddFormData({
      link: '',
      title: '',
      title_en: '',
      title_zh: '',
      desc_en: '',
      desc_zh: '',
      abbrlink: '',
      slug: ''
    });
  }

  // 全选/取消全选
  function toggleSelectAll() {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  }

  // 选择单个项目
  function toggleSelectItem(id) {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
        <button 
          className="px-4 py-2 rounded bg-blue-600 text-white" 
          onClick={() => {
            if (items.length === 0) {
              alert('当前页面没有网站数据');
              return;
            }
            setSelectedItems(new Set(items.map(item => item.id)));
          }}
          disabled={loading || items.length === 0}
        >
          检测当前页 ({items.length})
        </button>
        <button 
          className="px-4 py-2 rounded bg-green-600 text-white" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '取消添加' : '添加网站'}
        </button>
      </div>

      {/* 页面状态指示器 */}
      {items.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-300">
          <span>当前页：</span>
          <span className="text-green-600 dark:text-green-400">
            已展示 {items.filter(item => item.isShow).length}
          </span>
          <span className="mx-2">|</span>
          <span className="text-orange-600 dark:text-orange-400">
            待审核 {items.filter(item => !item.isShow).length}
          </span>
          <span className="mx-2">|</span>
          <span className="text-blue-600 dark:text-blue-400">
            总计 {items.length}
          </span>
        </div>
      )}

      {/* 批量操作区域 */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                已选择 {selectedItems.size} 个网站
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button 
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={() => setSelectedItems(new Set(items.filter(item => item.isShow).map(item => item.id)))}
                >
                  选择已展示
                </button>
                <span>|</span>
                <button 
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={() => setSelectedItems(new Set(items.filter(item => !item.isShow).map(item => item.id)))}
                >
                  选择待审核
                </button>
                <span>|</span>
                <button 
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={() => setSelectedItems(new Set())}
                >
                  取消选择
                </button>
              </div>
            </div>
            <div className="space-x-2">
              <button 
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                onClick={bulkCheckIframe}
                disabled={bulkChecking}
              >
                {bulkChecking ? '批量检测中...' : '批量检测iframe'}
              </button>
              <button 
                className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                onClick={bulkPublish}
              >
                批量上线
              </button>
              <button 
                className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                onClick={bulkUnpublish}
              >
                批量下线
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加网站表单 */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">添加新网站</h3>
          <form onSubmit={addSite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput 
                label="网站链接 *" 
                value={addFormData.link} 
                onChange={(v) => setAddFormData(d => ({...d, link: v}))} 
                placeholder="https://example.com"
                required
              />
              <TextInput 
                label="网站标题" 
                value={addFormData.title} 
                onChange={(v) => setAddFormData(d => ({...d, title: v}))} 
                placeholder="网站标题"
              />
              <TextInput 
                label="英文标题" 
                value={addFormData.title_en} 
                onChange={(v) => setAddFormData(d => ({...d, title_en: v}))} 
                placeholder="English Title"
              />
              <TextInput 
                label="中文标题" 
                value={addFormData.title_zh} 
                onChange={(v) => setAddFormData(d => ({...d, title_zh: v}))} 
                placeholder="中文标题"
              />
              <TextInput 
                label="英文描述" 
                value={addFormData.desc_en} 
                onChange={(v) => setAddFormData(d => ({...d, desc_en: v}))} 
                placeholder="English description"
              />
              <TextInput 
                label="中文描述" 
                value={addFormData.desc_zh} 
                onChange={(v) => setAddFormData(d => ({...d, desc_zh: v}))} 
                placeholder="中文描述"
              />
              <TextInput 
                label="Abbrlink (可选)" 
                value={addFormData.abbrlink} 
                onChange={(v) => setAddFormData(d => ({...d, abbrlink: v}))} 
                placeholder="自定义短链接"
              />
              <TextInput 
                label="Slug (可选)" 
                value={addFormData.slug} 
                onChange={(v) => setAddFormData(d => ({...d, slug: v}))} 
                placeholder="自定义slug"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={addingSite}
              >
                {addingSite ? '添加中...' : '添加网站'}
              </button>
              <button 
                type="button" 
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                onClick={resetAddForm}
              >
                重置表单
              </button>
              <button 
                type="button" 
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                onClick={() => setShowAddForm(false)}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-zinc-200 dark:border-zinc-800">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
                          <tr>
                <th className="px-3 py-2 text-left w-8">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Abbrlink</th>
                <th className="px-3 py-2 text-left">标题</th>
                <th className="px-3 py-2 text-left">链接</th>
                <th className="px-3 py-2 text-left">状态</th>
                <th className="px-3 py-2 text-left">操作</th>
              </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-zinc-200 dark:border-zinc-800 align-top hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-3 py-2 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-zinc-600 dark:text-zinc-300">{item.id}</td>
                <td className="px-3 py-2 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                  {item.abbrlink ? (
                    <a 
                      href={`/site?id=${item.abbrlink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {item.abbrlink}
                    </a>
                  ) : '-'}
                </td>
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
                        <div className="text-xs text-zinc-500">
                         英文标题: {item.title_en || '-'} <br/>
                         中文标题: {item.title_zh || '-'}</div>
                      )}
                      {(item.description || item.desc_en || item.desc_zh) && (
                        <div className="text-xs text-zinc-500 line-clamp-3">
                          英文描述: {item.desc_en || '-'} <br/> 
                          中文描述: {item.desc_zh || '-'}</div>
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
                        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={()=>publish(item.id)}>上线</button>
                      ) : (
                        <button className="px-3 py-1 rounded bg-slate-600 text-white" onClick={()=>unpublish(item.id)}>下线</button>
                      )}
                      <button 
                        className="px-3 py-1 rounded bg-blue-600 text-white" 
                        onClick={()=>checkIframe(item.id)}
                        disabled={checkingIframe.has(item.id)}
                      >
                        {checkingIframe.has(item.id) ? '检测中...' : '检测iframe'}
                      </button>
                      <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={()=>startEdit(item)}>编辑</button>
                      <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>remove(item.id)}>删除</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-zinc-500">{loading ? '加载中...' : '暂无数据'}</td>
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
