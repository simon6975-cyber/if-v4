import React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// ═══════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyAnhodesyW_2SOly1oMAB25M1MOyfb8piA",
  authDomain: "coffee-order-f1e1b.firebaseapp.com",
  databaseURL: "https://coffee-order-f1e1b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coffee-order-f1e1b",
  storageBucket: "coffee-order-f1e1b.firebasestorage.app",
  messagingSenderId: "157369526558",
  appId: "1:157369526558:web:3b9014c72055e89b45010f"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
function fbSet(path, val) { return set(ref(db, `if-fitness/${path}`), val); }

function useFirebase(path, fallback = null) {
  const [data, setData] = useState(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const unsub = onValue(ref(db, `if-fitness/${path}`), (snap) => {
      setData(snap.exists() ? snap.val() : fallback);
      setLoaded(true);
    });
    return () => unsub();
  }, [path]);
  return [data, loaded];
}

function getSession() { try { return JSON.parse(localStorage.getItem("if-session-v2")); } catch { return null; } }
function saveSession(s) { localStorage.setItem("if-session-v2", JSON.stringify(s)); }

// ═══════════════════════════════════════
// ICONS
// ═══════════════════════════════════════
const I = {
  Back: (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Check: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Lock: (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Calendar: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  User: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Users: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Logout: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Fire: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2 2-4 2z"/></svg>,
  Clipboard: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Chart: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Clock: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Camera: (p) => <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
};

const ADMIN_PIN = "0000";
const APP_VERSION = "v13.3";
const LEVELS = {
  beginner: { label: "초급", color: "#22c55e", bg: "#052e16", accent: "rgba(34,197,94,0.12)" },
  intermediate: { label: "중급", color: "#f59e0b", bg: "#451a03", accent: "rgba(245,158,11,0.12)" },
  advanced: { label: "고급", color: "#ef4444", bg: "#450a0a", accent: "rgba(239,68,68,0.12)" },
};

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
function fmtDate(d) { return new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }
function fmtDuration(start, end) {
  const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
  const m = Math.floor(diff / 60); const s = diff % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [membersRaw, membersLoaded] = useFirebase("members", {});
  const [programsRaw, programsLoaded] = useFirebase("programs", {});
  const [logsRaw, logsLoaded] = useFirebase("logs", {});
  const [session, setSession] = useState(() => getSession());

  const members = useMemo(() => membersRaw ? Object.values(membersRaw) : [], [membersRaw]);
  const programs = useMemo(() => programsRaw ? Object.values(programsRaw) : [], [programsRaw]);
  const logs = useMemo(() => logsRaw ? Object.values(logsRaw) : [], [logsRaw]);
  const loaded = membersLoaded && programsLoaded && logsLoaded;

  const saveMember = useCallback((m) => fbSet(`members/${m.id}`, m), []);
  const deleteMember = useCallback((id) => fbSet(`members/${id}`, null), []);
  const saveProgram = useCallback((p) => fbSet(`programs/${p.id}`, p), []);
  const deleteProgram = useCallback((id) => fbSet(`programs/${id}`, null), []);
  const addLog = useCallback((entry) => { const l = { ...entry, id: Date.now().toString() }; fbSet(`logs/${l.id}`, l); }, []);

  const handleLogin = useCallback((s) => { setSession(s); saveSession(s); }, []);
  const logout = useCallback(() => { setSession(null); saveSession(null); }, []);

  if (!loaded) return <div style={S.loading}><div style={S.spinner}/><p style={S.loadingText}>불러오는 중...</p></div>;

  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
      {!session ? <LoginScreen members={members} onLogin={handleLogin}/> :
       session.type === "admin" ? <AdminApp members={members} saveMember={saveMember} deleteMember={deleteMember} programs={programs} saveProgram={saveProgram} deleteProgram={deleteProgram} logs={logs} onLogout={logout}/> :
       <MemberApp session={session} programs={programs} members={members} logs={logs} addLog={addLog} onLogout={logout}/>}
    </div>
  );
}

// ═══════════════════════════════════════
// LOGIN (이름 + PIN 직접 입력, 회원 목록 안 보임)
// ═══════════════════════════════════════
function LoginScreen({ members, onLogin }) {
  const [tab, setTab] = useState("member");
  const [pin, setPin] = useState("");
  const [memberName, setMemberName] = useState("");
  const [mPin, setMPin] = useState("");
  const [err, setErr] = useState("");
  const showErr = (msg) => { setErr(msg); setTimeout(() => setErr(""), 2000); };
  const handleMemberLogin = () => {
    const found = members.find((m) => m.name === memberName.trim());
    if (!found) { showErr("등록되지 않은 이름입니다"); return; }
    if (mPin !== found.pin) { showErr("비밀번호가 올바르지 않습니다"); return; }
    onLogin({ type: "member", memberId: found.id, memberName: found.name });
  };
  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <img src="/icon-192.png" alt="IF" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 12 }}/>
        <h1 style={S.loginTitle}>IF</h1>
        <p style={S.loginSub}>Intelligent Fitness Services</p>
        <div style={S.loginTabs}>
          <button style={{ ...S.loginTab, ...(tab === "member" ? S.loginTabOn : {}) }} onClick={() => { setTab("member"); setErr(""); }}><I.User size={15}/> 회원</button>
          <button style={{ ...S.loginTab, ...(tab === "admin" ? S.loginTabOn : {}) }} onClick={() => { setTab("admin"); setErr(""); }}><I.Lock size={15}/> 관리자</button>
        </div>
        {tab === "admin" ? (
          <div style={S.loginForm}>
            <label style={S.label}>관리자 PIN</label>
            <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••" style={S.pinInput} onKeyDown={(e) => e.key === "Enter" && (pin === ADMIN_PIN ? onLogin({ type: "admin" }) : showErr("PIN이 올바르지 않습니다"))}/>
            <button style={S.primaryBtn} onClick={() => pin === ADMIN_PIN ? onLogin({ type: "admin" }) : showErr("PIN이 올바르지 않습니다")}>로그인</button>
          </div>
        ) : (
          <div style={S.loginForm}>
            <label style={S.label}>이름</label>
            <input style={S.input} value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="이름을 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("member-pin")?.focus()}/>
            <div style={{ height: 12 }}/>
            <label style={S.label}>비밀번호 (4자리)</label>
            <input id="member-pin" type="password" inputMode="numeric" maxLength={4} value={mPin} onChange={(e) => setMPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••" style={S.pinInput} onKeyDown={(e) => e.key === "Enter" && handleMemberLogin()}/>
            <button style={S.primaryBtn} onClick={handleMemberLogin}>로그인</button>
          </div>
        )}
        {err && <div style={S.errMsg}>{err}</div>}
        <div style={{ marginTop: 24, fontSize: 11, color: "#333", fontFamily: "'JetBrains Mono', monospace" }}>{APP_VERSION}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ADMIN APP
// ═══════════════════════════════════════
function AdminApp({ members, saveMember, deleteMember, programs, saveProgram, deleteProgram, logs, onLogout }) {
  const [screen, setScreen] = useState("home");
  const [editMember, setEditMember] = useState(null);
  const [editProgram, setEditProgram] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  if (screen === "memberLogs" && viewingMember) {
    const mLogs = logs.filter((l) => l.memberId === viewingMember.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return <AdminMemberLogs member={viewingMember} logs={mLogs} onBack={() => { setViewingMember(null); setScreen("members"); }}/>;
  }

  if (screen === "memberForm" && editMember) return (
    <MemberForm member={editMember} programs={programs} onSave={(m) => { saveMember(m); setEditMember(null); setScreen("members"); }}
      onCancel={() => { setEditMember(null); setScreen("members"); }}/>
  );
  if (screen === "programForm" && editProgram) return (
    <ProgramForm program={editProgram} onSave={(p) => { saveProgram(p); setEditProgram(null); setScreen("programs"); }}
      onCancel={() => { setEditProgram(null); setScreen("programs"); }}/>
  );
  if (screen === "members") return (
    <div style={S.container}>
      <BackBtn onClick={() => setScreen("home")}/>
      <div style={S.pageHead}><h2 style={S.pageTitle}>회원 관리</h2>
        <button style={S.addBtn} onClick={() => { setEditMember({ id: "m-" + Date.now(), name: "", phone: "", pin: "1234", level: "beginner", programId: "" }); setScreen("memberForm"); }}><I.Plus/> 추가</button></div>
      {members.length === 0 ? <Empty icon="👤" text="등록된 회원이 없습니다" sub="회원을 추가해보세요"/> :
        members.map((m) => {
          const prog = programs.find((p) => p.id === m.programId);
          const mLogs = logs.filter((l) => l.memberId === m.id);
          return (
            <div key={m.id} style={S.mCard}>
              <div style={S.mCardL}>
                <div style={{ ...S.avatarLg, background: LEVELS[m.level]?.accent, color: LEVELS[m.level]?.color }}>{m.name[0]}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                    <span style={{ ...S.badge, background: LEVELS[m.level]?.bg, color: LEVELS[m.level]?.color }}>{LEVELS[m.level]?.label}</span>
                    {prog && <span style={{ fontSize: 11, color: "#888" }}>{prog.name}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>운동 {mLogs.length}회</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={{ ...S.iconBtn, color: "#6a9fd8" }} onClick={() => { setViewingMember(m); setScreen("memberLogs"); }} title="운동 기록"><I.Calendar/></button>
                <button style={S.iconBtn} onClick={() => { setEditMember({ ...m }); setScreen("memberForm"); }}><I.Edit/></button>
                <button style={{ ...S.iconBtn, color: "#ef4444" }} onClick={() => { if (confirm(`${m.name} 회원을 삭제하시겠습니까?`)) deleteMember(m.id); }}><I.Trash/></button>
              </div>
            </div>
          );
        })}
    </div>
  );
  if (screen === "programs") return (
    <div style={S.container}>
      <BackBtn onClick={() => setScreen("home")}/>
      <div style={S.pageHead}><h2 style={S.pageTitle}>프로그램 관리</h2>
        <button style={S.addBtn} onClick={() => {
          setEditProgram({ id: "p-" + Date.now(), level: "beginner", name: "", description: "", daysPerWeek: 3,
            days: [{ dayName: "Day 1", exercises: [{ name: "", sets: 3, reps: "10", weight: "", note: "" }] }] });
          setScreen("programForm");
        }}><I.Plus/> 추가</button></div>
      {programs.length === 0 ? <Empty icon="📋" text="프로그램이 없습니다" sub="프로그램을 만들어보세요"/> :
        Object.entries(LEVELS).map(([key]) => {
          const filtered = programs.filter((p) => p.level === key);
          if (!filtered.length) return null;
          return (
            <div key={key} style={{ marginBottom: 20 }}>
              <div style={S.lvlHead}><span style={{ ...S.badge, background: LEVELS[key].bg, color: LEVELS[key].color }}>{LEVELS[key].label}</span><span style={{ color: "#555", fontSize: 12 }}>{filtered.length}개</span></div>
              {filtered.map((prog) => {
                const assigned = members.filter((m) => m.programId === prog.id);
                return (
                  <div key={prog.id} style={S.pCard}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{prog.name || "이름 없음"}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{prog.description}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <span style={S.chip}>주 {prog.daysPerWeek}일</span>
                        <span style={S.chip}>{prog.days.length}개 루틴</span>
                        <span style={S.chip}><I.User size={11}/> {assigned.length}명</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={S.iconBtn} onClick={() => { setEditProgram(JSON.parse(JSON.stringify(prog))); setScreen("programForm"); }}><I.Edit/></button>
                      <button style={{ ...S.iconBtn, color: "#ef4444" }} onClick={() => { if (confirm("삭제하시겠습니까?")) deleteProgram(prog.id); }}><I.Trash/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
  return (
    <div style={S.container}>
      <Header title="관리자" subtitle="IF Admin" onLogout={onLogout}/>
      <div style={S.adminGrid}>
        <button style={S.adminCard} onClick={() => setScreen("members")}><I.Users size={28} style={{ color: "#6a9fd8" }}/><div style={S.adminCardT}>회원 관리</div><div style={S.adminCardN}>{members.length}명</div></button>
        <button style={S.adminCard} onClick={() => setScreen("programs")}><I.Clipboard size={28} style={{ color: "#22c55e" }}/><div style={S.adminCardT}>프로그램</div><div style={S.adminCardN}>{programs.length}개</div></button>
      </div>
    </div>
  );
}

// ─── Admin: Member Logs (열람 + 삭제) ───
function AdminMemberLogs({ member, logs, onBack }) {
  const [expId, setExpId] = useState(null);
  const grouped = useMemo(() => { const g = {}; logs.forEach((l) => { const d = fmtDate(l.timestamp); if (!g[d]) g[d] = []; g[d].push(l); }); return g; }, [logs]);

  const deleteLog = (logId) => {
    if (confirm("이 운동 기록을 삭제하시겠습니까?")) fbSet(`logs/${logId}`, null);
  };

  return (
    <div style={S.container}>
      <BackBtn onClick={onBack}/>
      <div style={S.pageHead}>
        <div>
          <h2 style={S.pageTitle}>{member.name}의 기록</h2>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>총 {logs.length}회</div>
        </div>
      </div>
      {logs.length === 0 ? <Empty icon="📋" text="운동 기록이 없습니다"/> :
        Object.entries(grouped).map(([date, entries]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <div style={S.dateGrp}>{date}</div>
            {entries.map((log) => (
              <div key={log.id}>
                <div style={{ ...S.logCard, cursor: "default" }}>
                  <button style={{ flex: 1, background: "none", border: "none", color: "#e8e8e8", textAlign: "left", padding: 0, cursor: "pointer", fontFamily: "'Noto Sans KR'" }}
                    onClick={() => setExpId(expId === log.id ? null : log.id)}>
                    <span style={{ ...S.badgeSm, background: LEVELS[log.level]?.bg, color: LEVELS[log.level]?.color }}>{LEVELS[log.level]?.label}</span>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{log.dayName}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                      {fmtTime(log.startTime || log.timestamp)}
                      {log.startTime && log.endTime && <span style={{ color: "#6a9fd8", marginLeft: 8 }}>{fmtDuration(log.startTime, log.endTime)}</span>}
                    </div>
                  </button>
                  <button style={{ ...S.iconBtn, color: "#ef4444" }} onClick={() => deleteLog(log.id)}><I.Trash/></button>
                </div>
                {expId === log.id && <div style={S.logDet}>{log.exercises?.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 3 }}>{ex.name}</div>
                    {ex.sets?.map((s, si) => <div key={si} style={{ fontSize: 12, color: "#777", paddingLeft: 8, fontFamily: "'JetBrains Mono'" }}>세트 {si+1}: {s.weight||"–"}kg × {s.reps||"–"}회</div>)}</div>
                ))}</div>}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

// ─── Member Form (회원별 세트마다 중량/횟수 커스텀 설정) ───
function MemberForm({ member, programs, onSave, onCancel }) {
  const [m, setM] = useState({ ...member, customExercises: member.customExercises || {} });
  const u = (f, v) => setM((p) => ({ ...p, [f]: v }));

  const handleProgramChange = (progId) => {
    const prog = programs.find((p) => p.id === progId);
    const custom = {};
    if (prog) {
      prog.days.forEach((day, di) => {
        day.exercises.forEach((ex, ei) => {
          const key = `${di}-${ei}`;
          const existing = m.customExercises?.[key];
          if (existing?.sets) {
            custom[key] = existing;
          } else {
            custom[key] = { sets: Array.from({ length: ex.sets }, () => ({ weight: existing?.weight || "", reps: existing?.reps || ex.reps })) };
          }
        });
      });
    }
    setM((p) => ({ ...p, programId: progId, customExercises: custom }));
  };

  const updateSetVal = (key, si, field, value) => {
    setM((p) => {
      const ce = { ...p.customExercises };
      const entry = { ...ce[key], sets: [...(ce[key]?.sets || [])] };
      entry.sets[si] = { ...entry.sets[si], [field]: value };
      ce[key] = entry;
      return { ...p, customExercises: ce };
    });
  };

  const selectedProg = programs.find((p) => p.id === m.programId);

  // 프로그램 선택되어 있으나 customExercises가 없거나 구조가 다를 때 자동 초기화
  const ensureCustom = () => {
    if (!selectedProg) return m.customExercises;
    const custom = { ...m.customExercises };
    let changed = false;
    selectedProg.days.forEach((day, di) => {
      day.exercises.forEach((ex, ei) => {
        const key = `${di}-${ei}`;
        if (!custom[key]?.sets) {
          custom[key] = { sets: Array.from({ length: ex.sets }, () => ({ weight: custom[key]?.weight || "", reps: custom[key]?.reps || ex.reps })) };
          changed = true;
        } else if (custom[key].sets.length !== ex.sets) {
          const existing = custom[key].sets;
          custom[key] = { sets: Array.from({ length: ex.sets }, (_, i) => existing[i] || { weight: "", reps: ex.reps }) };
          changed = true;
        }
      });
    });
    if (changed) setTimeout(() => setM((p) => ({ ...p, customExercises: custom })), 0);
    return custom;
  };

  const customData = ensureCustom();

  return (
    <div style={S.container}>
      <BackBtn onClick={onCancel} label="취소"/>
      <h2 style={S.pageTitle}>{member.name ? "회원 수정" : "회원 추가"}</h2>
      <div style={S.fg}><label style={S.label}>이름 *</label><input style={S.input} value={m.name} onChange={(e) => u("name", e.target.value)} placeholder="홍길동"/></div>
      <div style={S.fg}><label style={S.label}>연락처</label><input style={S.input} type="tel" inputMode="tel" value={m.phone} onChange={(e) => u("phone", e.target.value)} placeholder="010-0000-0000"/></div>
      <div style={S.fg}><label style={S.label}>로그인 비밀번호 (4자리)</label><input style={S.input} inputMode="numeric" maxLength={4} value={m.pin} onChange={(e) => u("pin", e.target.value.replace(/\D/g, ""))} placeholder="1234"/></div>
      <div style={S.fg}><label style={S.label}>수준</label>
        <select style={S.input} value={m.level} onChange={(e) => u("level", e.target.value)}>
          <option value="beginner">초급</option><option value="intermediate">중급</option><option value="advanced">고급</option>
        </select></div>
      <div style={S.fg}><label style={S.label}>배정 프로그램</label>
        <select style={S.input} value={m.programId} onChange={(e) => handleProgramChange(e.target.value)}>
          <option value="">— 선택 —</option>
          {programs.map((p) => <option key={p.id} value={p.id}>[{LEVELS[p.level]?.label}] {p.name}</option>)}
        </select></div>

      {selectedProg && (
        <>
          <div style={S.divider}/>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#6a9fd8", marginBottom: 12 }}>
            {m.name || "회원"}의 운동 설정
          </div>
          {selectedProg.days.map((day, di) => (
            <div key={di} style={S.customDayBlock}>
              <div style={S.customDayTitle}>{day.dayName}</div>
              {day.exercises.map((ex, ei) => {
                const key = `${di}-${ei}`;
                const cv = customData?.[key];
                const sets = cv?.sets || Array.from({ length: ex.sets }, () => ({ weight: "", reps: ex.reps }));
                return (
                  <div key={ei} style={S.customExBlock}>
                    <div style={S.customExHeader}>
                      <span style={S.customExNum}>{ei + 1}</span>
                      <span style={S.customExName}>{ex.name || `운동 ${ei+1}`}</span>
                      <span style={{ fontSize: 11, color: "#555" }}>{sets.length}세트</span>
                    </div>
                    <div style={S.customSetGrid}>
                      <div style={S.customSetHeaderRow}>
                        <span style={S.customSetHCell}>세트</span>
                        <span style={S.customSetHCellW}>중량(kg)</span>
                        <span style={S.customSetHCellW}>횟수</span>
                      </div>
                      {sets.map((s, si) => (
                        <div key={si} style={S.customSetRow}>
                          <span style={S.customSetCell}>{si + 1}</span>
                          <span style={S.customSetCellW}>
                            <input style={S.customSetInput} type="number" inputMode="decimal" placeholder="kg"
                              value={s.weight || ""} onChange={(e) => updateSetVal(key, si, "weight", e.target.value)}/>
                          </span>
                          <span style={S.customSetCellW}>
                            <input style={S.customSetInput} inputMode="numeric" placeholder={ex.reps}
                              value={s.reps || ""} onChange={(e) => updateSetVal(key, si, "reps", e.target.value)}/>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}

      <div style={S.formAct}>
        <button style={S.cancelBtn} onClick={onCancel}>취소</button>
        <button style={{ ...S.primaryBtn, marginTop: 0 }} onClick={() => { if (!m.name.trim()) { alert("이름을 입력하세요"); return; } onSave(m); }}>저장</button>
      </div>
    </div>
  );
}

// ─── Program Form (운동: 이름, 세트, 횟수, 중량 — 휴식 제거) ───
function ProgramForm({ program, onSave, onCancel }) {
  const [p, setP] = useState(JSON.parse(JSON.stringify(program)));
  const u = (f, v) => setP((prev) => ({ ...prev, [f]: v }));
  const uDay = (di, f, v) => setP((prev) => { const d = [...prev.days]; d[di] = { ...d[di], [f]: v }; return { ...prev, days: d }; });
  const uEx = (di, ei, f, v) => setP((prev) => { const d = [...prev.days]; const e = [...d[di].exercises]; e[ei] = { ...e[ei], [f]: f === "sets" ? (parseInt(v)||0) : v }; d[di] = { ...d[di], exercises: e }; return { ...prev, days: d }; });
  const addDay = () => setP((prev) => ({ ...prev, days: [...prev.days, { dayName: `Day ${prev.days.length+1}`, exercises: [{ name: "", sets: 3, reps: "10", note: "" }] }] }));
  const copyDay1 = () => setP((prev) => ({ ...prev, days: [...prev.days, { dayName: `Day ${prev.days.length+1}`, exercises: JSON.parse(JSON.stringify(prev.days[0].exercises)) }] }));
  const rmDay = (di) => setP((prev) => ({ ...prev, days: prev.days.filter((_, i) => i !== di) }));
  const addEx = (di) => setP((prev) => { const d = [...prev.days]; d[di] = { ...d[di], exercises: [...d[di].exercises, { name: "", sets: 3, reps: "10", note: "" }] }; return { ...prev, days: d }; });
  const rmEx = (di, ei) => setP((prev) => { const d = [...prev.days]; d[di] = { ...d[di], exercises: d[di].exercises.filter((_, i) => i !== ei) }; return { ...prev, days: d }; });

  return (
    <div style={S.container}>
      <BackBtn onClick={onCancel} label="취소"/>
      <h2 style={S.pageTitle}>{program.name ? "프로그램 수정" : "프로그램 생성"}</h2>
      <div style={S.fg}><label style={S.label}>이름 *</label><input style={S.input} value={p.name} onChange={(e) => u("name", e.target.value)} placeholder="예: 초보자 전신 운동"/></div>
      <div style={S.fg}><label style={S.label}>설명</label><input style={S.input} value={p.description} onChange={(e) => u("description", e.target.value)} placeholder="프로그램 설명"/></div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ ...S.fg, flex: 1 }}><label style={S.label}>수준</label>
          <select style={S.input} value={p.level} onChange={(e) => u("level", e.target.value)}>
            <option value="beginner">초급</option><option value="intermediate">중급</option><option value="advanced">고급</option>
          </select></div>
        <div style={{ ...S.fg, flex: 1 }}><label style={S.label}>주간 횟수</label>
          <input style={S.input} type="number" inputMode="numeric" value={p.daysPerWeek} onChange={(e) => u("daysPerWeek", parseInt(e.target.value)||0)}/></div>
      </div>
      <div style={S.divider}/>
      {p.days.map((day, di) => (
        <div key={di} style={S.dayEd}>
          <div style={S.dayEdHead}>
            <input style={{ ...S.input, fontWeight: 600 }} value={day.dayName} onChange={(e) => uDay(di, "dayName", e.target.value)}/>
            {p.days.length > 1 && <button style={{ ...S.iconBtn, color: "#ef4444" }} onClick={() => rmDay(di)}><I.Trash/></button>}
          </div>
          {day.exercises.map((ex, ei) => (
            <div key={ei} style={S.exEd}>
              <div style={S.exEdRow}><span style={S.exNum}>{ei + 1}</span><input style={{ ...S.inputSm, flex: 2 }} placeholder="운동 이름" value={ex.name} onChange={(e) => uEx(di, ei, "name", e.target.value)}/><button style={{ ...S.iconBtn, color: "#ef4444", padding: 4 }} onClick={() => rmEx(di, ei)}><I.Trash/></button></div>
              <div style={S.exEdRow}>
                <div style={S.mini}><span style={S.miniL}>세트</span><input style={S.inputSm} type="number" inputMode="numeric" value={ex.sets} onChange={(e) => uEx(di, ei, "sets", e.target.value)}/></div>
              </div>
              <input style={S.inputSm} placeholder="참고사항 (선택)" value={ex.note} onChange={(e) => uEx(di, ei, "note", e.target.value)}/>
            </div>
          ))}
          <button style={S.addExBtn} onClick={() => addEx(di)}><I.Plus size={14}/> 운동 추가</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ ...S.addDayBtn, flex: 1 }} onClick={addDay}><I.Plus/> 빈 루틴 추가</button>
        {p.days.length >= 1 && <button style={{ ...S.addDayBtn, flex: 1, background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)", color: "#22c55e" }} onClick={copyDay1}>Day 1 복사</button>}
      </div>
      <div style={S.formAct}>
        <button style={S.cancelBtn} onClick={onCancel}>취소</button>
        <button style={{ ...S.primaryBtn, marginTop: 0 }} onClick={() => { if (!p.name.trim()) { alert("이름을 입력하세요"); return; } onSave(p); }}>저장</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MEMBER APP
// ═══════════════════════════════════════
function MemberApp({ session, programs, members, logs, addLog, onLogout }) {
  const [screen, setScreen] = useState("home");
  const [selDay, setSelDay] = useState(null);
  const [activeProgId, setActiveProgId] = useState(null); // null = use assigned program
  const [showProgPicker, setShowProgPicker] = useState(false);
  const member = members.find((m) => m.id === session.memberId);
  const assignedProgram = programs.find((p) => p.id === member?.programId);
  const activeProgram = activeProgId ? programs.find((p) => p.id === activeProgId) : assignedProgram;
  const isUsingOther = activeProgId && activeProgId !== member?.programId;
  const myLogs = useMemo(() => logs.filter((l) => l.memberId === session.memberId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), [logs, session.memberId]);

  // Check for in-progress workout sessions (must be before conditional returns)
  const hasInProgress = useCallback((prog, dayIdx) => {
    if (!prog) return false;
    try {
      const key = `if-workout-${session.memberId}-${prog.id}-${dayIdx}`;
      const saved = JSON.parse(localStorage.getItem(key));
      return saved?.exData && saved?.programId === prog.id;
    } catch { return false; }
  }, [session.memberId]);

  if (screen === "workout" && activeProgram && selDay !== null) return (
    <WorkoutSession program={activeProgram} dayIndex={selDay} memberId={session.memberId}
      memberCustom={!isUsingOther ? member?.customExercises : undefined}
      onFinish={(e) => { addLog(e); setScreen("home"); setSelDay(null); }}
      onBack={() => { setScreen("home"); setSelDay(null); }}/>
  );
  if (screen === "history") return <HistoryView logs={myLogs} onBack={() => setScreen("home")}/>;
  if (screen === "stats") return <StatsView logs={myLogs} onBack={() => setScreen("home")}/>;
  if (screen === "aiCounter") return <AIExerciseCounter onBack={() => setScreen("home")}/>;

  const today = new Date();
  const todayStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  // Other available programs (excluding the assigned one)
  const otherPrograms = programs.filter((p) => p.id !== member?.programId);

  return (
    <div style={S.container}>
      <Header title={session.memberName} subtitle="오늘도 한 세트 더" onLogout={onLogout}/>
      <div style={S.todayDate}><I.Calendar size={14}/> {todayStr}</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button style={{ ...S.histBtn, flex: 1 }} onClick={() => setScreen("history")}><I.Calendar/><span>기록</span><span style={S.logCnt}>{myLogs.length}</span></button>
        <button style={{ ...S.histBtn, flex: 1 }} onClick={() => setScreen("stats")}><I.Chart/><span>통계</span></button>
      </div>
      <button style={{ ...S.histBtn, width: "100%", marginBottom: 20, background: "linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,77,255,0.08))", border: "1px solid rgba(0,229,255,0.2)" }}
        onClick={() => setScreen("aiCounter")}>
        <I.Camera/><span style={{ fontWeight: 600 }}>AI 캘리브레이션</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#ffab00", background: "rgba(255,171,0,0.1)", padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>BETA</span>
      </button>

      {/* Active Program Display */}
      {!activeProgram ? <Empty icon="🏋️" text="배정된 프로그램이 없습니다" sub={otherPrograms.length > 0 ? "아래에서 다른 프로그램을 선택해보세요" : "관리자에게 문의하세요"}/> : (
        <div style={S.myProg}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <span style={{ ...S.badge, background: LEVELS[activeProgram.level]?.bg, color: LEVELS[activeProgram.level]?.color }}>{LEVELS[activeProgram.level]?.label}</span>
            <span style={S.chip}>주 {activeProgram.daysPerWeek}일</span>
            {isUsingOther && <span style={{ fontSize: 10, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>자유 선택</span>}
            {isUsingOther && <button style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 11, color: "#6a9fd8", cursor: "pointer", padding: "2px 6px", fontFamily: "'Noto Sans KR', sans-serif", textDecoration: "underline" }} onClick={() => setActiveProgId(null)}>내 프로그램</button>}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{activeProgram.name}</h3>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{activeProgram.description}</p>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.08em", marginBottom: 10 }}>루틴 선택</div>
          <div style={S.dayGrid}>
            {activeProgram.days.map((day, i) => {
              const todayDate = new Date().toDateString();
              const done = myLogs.some((l) => l.dayName === day.dayName && l.programId === activeProgram.id && new Date(l.timestamp).toDateString() === todayDate);
              const inProgress = hasInProgress(activeProgram, i);
              return (
                <button key={i} style={{ ...S.dayCard, ...(done ? S.dayCardDone : {}), ...(inProgress && !done ? { borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.06)" } : {}) }} onClick={() => { setSelDay(i); setScreen("workout"); }}>
                  {done && <div style={S.doneChk}><I.Check size={14}/></div>}
                  {inProgress && !done && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10, color: "#f59e0b", background: "rgba(245,158,11,0.15)", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>진행중</div>}
                  <div style={S.dayNum}>DAY {i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{day.dayName}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{day.exercises.length}종목</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Programs Section */}
      {otherPrograms.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <button style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", color: "#e8e8e8" }} onClick={() => setShowProgPicker(!showProgPicker)}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <I.Clipboard/><span style={{ fontSize: 14, fontWeight: 600 }}>다른 프로그램</span>
              <span style={{ fontSize: 12, color: "#555" }}>{otherPrograms.length}개</span>
            </span>
            <span style={{ color: "#555", fontSize: 16, transition: "transform 0.2s", transform: showProgPicker ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {showProgPicker && (
            <div style={{ marginTop: 8 }}>
              {otherPrograms.map((p) => (
                <button key={p.id} style={{ width: "100%", background: activeProgId === p.id ? "rgba(106,159,216,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${activeProgId === p.id ? "rgba(106,159,216,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans KR', sans-serif", color: "#e8e8e8" }}
                  onClick={() => { setActiveProgId(p.id); setShowProgPicker(false); }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{p.description}</div>}
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <span style={{ ...S.badge, background: LEVELS[p.level]?.bg, color: LEVELS[p.level]?.color, fontSize: 10 }}>{LEVELS[p.level]?.label}</span>
                      <span style={{ ...S.chip, fontSize: 10 }}>{p.days.length}개 루틴</span>
                      <span style={{ ...S.chip, fontSize: 10 }}>주 {p.daysPerWeek}일</span>
                    </div>
                  </div>
                  <span style={{ color: "#6a9fd8", fontSize: 13, flexShrink: 0 }}>선택 →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// WORKOUT SESSION (시작/종료 시간 기록, 관리자 설정 중량 표시)
// ═══════════════════════════════════════
function WorkoutSession({ program, dayIndex, memberId, memberCustom, onFinish, onBack }) {
  const day = program.days[dayIndex];
  const sessionKey = `if-workout-${memberId}-${program.id}-${dayIndex}`;

  const [startTime] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(sessionKey)); if (saved?.startTime) return saved.startTime; } catch {}
    return new Date().toISOString();
  });

  const [exData, setExData] = useState(() => {
    // Try to restore from localStorage first
    try {
      const saved = JSON.parse(localStorage.getItem(sessionKey));
      if (saved?.exData && saved?.programId === program.id && saved?.dayIndex === dayIndex) {
        // Verify structure matches (same exercises/sets count)
        const matches = saved.exData.length === day.exercises.length &&
          saved.exData.every((e, i) => e.name === day.exercises[i].name);
        if (matches) return saved.exData;
      }
    } catch {}
    // Fresh init
    return day.exercises.map((ex, ei) => {
      const custom = memberCustom?.[`${dayIndex}-${ei}`];
      const customSets = custom?.sets;
      return {
        name: ex.name,
        sets: Array.from({ length: ex.sets }, (_, si) => {
          const cs = customSets?.[si];
          return { weight: cs?.weight || "", reps: cs?.reps || ex.reps || "", done: false };
        }),
        targetReps: ex.reps, note: ex.note,
      };
    });
  });
  const [activeEx, setActiveEx] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(sessionKey)); return saved?.activeEx || 0; } catch { return 0; }
  });
  const [restored, setRestored] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(sessionKey)); return saved?.exData ? true : false; } catch { return false; }
  });

  // Persist workout state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(sessionKey, JSON.stringify({ exData, activeEx, startTime, programId: program.id, dayIndex }));
    } catch {}
  }, [exData, activeEx, startTime, sessionKey, program.id, dayIndex]);

  // Clear saved session on finish or intentional back
  const clearSession = useCallback(() => { try { localStorage.removeItem(sessionKey); } catch {} }, [sessionKey]);

  const uSet = (ei, si, f, v) => setExData((prev) => { const n = [...prev]; n[ei] = { ...n[ei], sets: [...n[ei].sets] }; n[ei].sets[si] = { ...n[ei].sets[si], [f]: v }; return n; });
  const toggleDone = (ei, si) => { uSet(ei, si, "done", !exData[ei].sets[si].done); };

  const total = exData.reduce((a, e) => a + e.sets.length, 0);
  const done = exData.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const ex = exData[activeEx];

  const todayStr = new Date(startTime).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  const handleBack = () => {
    if (done > 0) {
      if (!confirm("운동 기록이 임시 저장됩니다.\n나가시겠습니까?")) return;
      // Don't clear session — allow resume
    } else {
      clearSession();
    }
    onBack();
  };

  const handleFinish = () => {
    clearSession();
    const endTime = new Date().toISOString();
    onFinish({ memberId, programId: program.id, programName: program.name, dayName: day.dayName, level: program.level,
      timestamp: startTime, startTime, endTime, date: new Date(startTime).toISOString().split("T")[0],
      exercises: exData.map((e) => ({ name: e.name, sets: e.sets.filter((s) => s.done).map((s) => ({ weight: s.weight, reps: s.reps })) })) });
  };

  return (
    <div style={S.container}>
      {restored && <div style={{ background: "rgba(106,159,216,0.1)", border: "1px solid rgba(106,159,216,0.2)", borderRadius: 10, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#6a9fd8" }}>💾 이전 운동 기록이 복원되었습니다</span>
        <button style={{ background: "none", border: "none", color: "#888", fontSize: 11, cursor: "pointer", padding: "2px 6px" }} onClick={() => setRestored(false)}>✕</button>
      </div>}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
        <button style={S.backSm} onClick={handleBack}><I.Back/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{day.dayName}</div>
          <div style={S.progBar}><div style={{ ...S.progFill, width: `${total > 0 ? (done/total)*100 : 0}%` }}/></div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>{done}/{total} 세트 완료</div>
        </div>
      </div>
      <div style={S.workoutMeta}>
        <span><I.Calendar size={13}/> {todayStr}</span>
        <span><I.Clock size={13}/> 시작 {fmtTime(startTime)}</span>
      </div>

      <div style={S.exTabs}>{exData.map((e, i) => {
        const allDone = e.sets.every((s) => s.done);
        return <button key={i} style={{ ...S.exTab, ...(i === activeEx ? S.exTabOn : {}), ...(allDone ? S.exTabDone : {}) }} onClick={() => setActiveEx(i)}>{allDone ? "✓" : i + 1}</button>;
      })}</div>
      <div style={S.curEx}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}><span style={S.exNumDisplay}>{activeEx + 1}</span>{ex.name}</h3>
        {ex.note && <div style={S.exNote}>{ex.note}</div>}
        <div style={{ marginTop: 12 }}>
          <div style={S.setHead}><span style={S.setHC}>세트</span><span style={S.setHCW}>무게(kg)</span><span style={S.setHCW}>횟수</span><span style={S.setHC}>완료</span></div>
          {ex.sets.map((s, si) => (
            <div key={si} style={{ ...S.setRow, ...(s.done ? S.setRowDone : {}) }}>
              <span style={S.setC}>{si + 1}</span>
              <span style={S.setCW}><input type="number" inputMode="decimal" placeholder={ex.targetWeight || "0"} value={s.weight} onChange={(e) => uSet(activeEx, si, "weight", e.target.value)} style={S.setIn}/></span>
              <span style={S.setCW}><input type="number" inputMode="numeric" placeholder={ex.targetReps} value={s.reps} onChange={(e) => uSet(activeEx, si, "reps", e.target.value)} style={S.setIn}/></span>
              <span style={S.setC}><button style={{ ...S.doneBtn, ...(s.done ? S.doneBtnOn : {}) }} onClick={() => toggleDone(activeEx, si)}><I.Check/></button></span>
            </div>
          ))}
        </div>
      </div>
      <div style={S.wNav}>
        {activeEx > 0 && <button style={S.navBtn} onClick={() => setActiveEx((v) => v - 1)}>← 이전</button>}
        {activeEx < exData.length - 1 ? (
          <button style={{ ...S.navBtn, ...S.navBtnPri }} onClick={() => setActiveEx((v) => v + 1)}>다음 →</button>
        ) : (
          <button style={{ ...S.navBtn, ...S.finBtn }} onClick={handleFinish}><I.Fire/> 운동 완료!</button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// HISTORY VIEW
// ═══════════════════════════════════════
function HistoryView({ logs, onBack }) {
  const [expId, setExpId] = useState(null);
  const grouped = useMemo(() => { const g = {}; logs.forEach((l) => { const d = fmtDate(l.timestamp); if (!g[d]) g[d] = []; g[d].push(l); }); return g; }, [logs]);
  return (
    <div style={S.container}>
      <BackBtn onClick={onBack}/><h2 style={S.pageTitle}>내 운동 기록</h2>
      {logs.length === 0 ? <Empty icon="📋" text="아직 기록이 없습니다" sub="운동을 시작해보세요!"/> :
        Object.entries(grouped).map(([date, entries]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <div style={S.dateGrp}>{date}</div>
            {entries.map((log) => (
              <div key={log.id}>
                <button style={S.logCard} onClick={() => setExpId(expId === log.id ? null : log.id)}>
                  <div>
                    <span style={{ ...S.badgeSm, background: LEVELS[log.level]?.bg, color: LEVELS[log.level]?.color }}>{LEVELS[log.level]?.label}</span>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{log.dayName}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{log.programName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#555", fontFamily: "'JetBrains Mono'" }}>{fmtTime(log.startTime || log.timestamp)}</div>
                    {log.startTime && log.endTime && <div style={{ fontSize: 11, color: "#6a9fd8", marginTop: 2 }}><I.Clock size={11}/> {fmtDuration(log.startTime, log.endTime)}</div>}
                  </div>
                </button>
                {expId === log.id && <div style={S.logDet}>{log.exercises?.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 3 }}>{ex.name}</div>
                    {ex.sets?.map((s, si) => <div key={si} style={{ fontSize: 12, color: "#777", paddingLeft: 8, fontFamily: "'JetBrains Mono'" }}>세트 {si+1}: {s.weight||"–"}kg × {s.reps||"–"}회</div>)}</div>
                ))}</div>}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

// ═══════════════════════════════════════
// STATS VIEW (월별 달력 — 운동한 날 표시, 스크롤 누적)
// ═══════════════════════════════════════
function StatsView({ logs, onBack }) {
  const stats = useMemo(() => {
    let totalMin = 0;
    const workoutDates = new Set();
    logs.forEach((l) => {
      workoutDates.add(new Date(l.timestamp).toISOString().split("T")[0]);
      if (l.startTime && l.endTime) totalMin += Math.floor((new Date(l.endTime) - new Date(l.startTime)) / 60000);
    });
    // streak
    const sorted = [...workoutDates].sort().reverse();
    let streak = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i]); d.setHours(0,0,0,0);
      const diff = Math.floor((today - d) / 86400000);
      if (diff === i || diff === i + 1) streak++; else break;
    }
    return { workoutDates, totalSessions: logs.length, totalMinutes: totalMin, streak };
  }, [logs]);

  // 월 목록 생성: 첫 운동 월 ~ 현재 월
  const months = useMemo(() => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let startMonth = currentMonth;
    if (logs.length > 0) {
      const earliest = new Date(Math.min(...logs.map((l) => new Date(l.timestamp).getTime())));
      startMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    }
    const result = [];
    const d = new Date(startMonth);
    while (d <= currentMonth) {
      result.push(new Date(d));
      d.setMonth(d.getMonth() + 1);
    }
    return result.reverse(); // 최신 월이 위에
  }, [logs]);

  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div style={S.container}>
      <BackBtn onClick={onBack}/><h2 style={S.pageTitle}>운동 통계</h2>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        <div style={S.statCard}>
          <div style={S.statNum}>{stats.totalSessions}</div>
          <div style={S.statLabel}>총 운동</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statNum, color: "#22c55e" }}>{stats.streak}</div>
          <div style={S.statLabel}>연속일</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statNum, color: "#f59e0b" }}>{stats.totalMinutes}</div>
          <div style={S.statLabel}>총 시간(분)</div>
        </div>
      </div>

      {/* Monthly Calendars */}
      {logs.length === 0 ? <Empty icon="📊" text="운동 기록이 없습니다"/> :
        months.map((monthDate) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const firstDayOfWeek = new Date(year, month, 1).getDay();
          const monthLabel = `${year}년 ${month + 1}월`;

          // 이번 달 운동 횟수
          const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
          const monthCount = logs.filter((l) => l.timestamp && l.timestamp.startsWith(monthKey)).length;

          // 날짜 배열 (빈칸 포함)
          const cells = [];
          for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(d);

          const todayStr = new Date().toISOString().split("T")[0];

          return (
            <div key={monthKey} style={S.calMonth}>
              <div style={S.calMonthHeader}>
                <span style={S.calMonthTitle}>{monthLabel}</span>
                <span style={S.calMonthCount}>{monthCount}회</span>
              </div>
              <div style={S.calWeekdays}>
                {WEEKDAYS.map((w, i) => (
                  <span key={w} style={{ ...S.calWeekday, color: i === 0 ? "#ef4444" : i === 6 ? "#6a9fd8" : "#555" }}>{w}</span>
                ))}
              </div>
              <div style={S.calGrid}>
                {cells.map((day, i) => {
                  if (day === null) return <div key={`e${i}`} style={S.calCell}/>;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isWorkout = stats.workoutDates.has(dateStr);
                  const isToday = dateStr === todayStr;
                  const dayOfWeek = new Date(year, month, day).getDay();
                  return (
                    <div key={dateStr} style={S.calCell}>
                      <div style={{
                        ...S.calDay,
                        ...(isWorkout ? S.calDayWorkout : {}),
                        ...(isToday ? S.calDayToday : {}),
                        color: isWorkout ? "#fff" : isToday ? "#6a9fd8" : dayOfWeek === 0 ? "rgba(239,68,68,0.6)" : dayOfWeek === 6 ? "rgba(106,159,216,0.6)" : "#888",
                      }}>
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function Header({ title, subtitle, onLogout }) {
  return (
    <header style={{ marginBottom: 16, paddingTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          <img src="/icon-192.png" alt="IF" style={{ width: 28, height: 28, borderRadius: 6 }}/>{title}</h1>
          {subtitle && <p style={{ color: "#555", fontSize: 13, marginTop: 4, fontWeight: 300 }}>{subtitle}</p>}</div>
        <button style={S.logoutBtn} onClick={onLogout}><I.Logout/> 로그아웃</button>
      </div>
    </header>
  );
}
function BackBtn({ onClick, label }) { return <button style={S.backSm} onClick={onClick}><I.Back size={18}/> {label || "뒤로"}</button>; }
function Empty({ icon, text, sub }) { return <div style={S.empty}><div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div><p style={{ color: "#888" }}>{text}</p>{sub && <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{sub}</p>}</div>; }

// ═══════════════════════════════════════
// AI EXERCISE COUNTER (Calibration + Form Check)
// ═══════════════════════════════════════
const AI_KP = { NOSE:0,L_EYE:1,R_EYE:2,L_EAR:3,R_EAR:4,L_SHOULDER:5,R_SHOULDER:6,L_ELBOW:7,R_ELBOW:8,L_WRIST:9,R_WRIST:10,L_HIP:11,R_HIP:12,L_KNEE:13,R_KNEE:14,L_ANKLE:15,R_ANKLE:16 };
const AI_SKELETON = [[5,6],[5,7],[7,9],[6,8],[8,10],[5,11],[6,12],[11,12],[11,13],[13,15],[12,14],[14,16]];
const AI_JOINT_MAP = {
  "l-knee":{a:11,b:13,c:15,label:"L무릎"},"r-knee":{a:12,b:14,c:16,label:"R무릎"},
  "l-hip":{a:5,b:11,c:13,label:"L엉덩이"},"r-hip":{a:6,b:12,c:14,label:"R엉덩이"},
  "l-elbow":{a:5,b:7,c:9,label:"L팔꿈치"},"r-elbow":{a:6,b:8,c:10,label:"R팔꿈치"},
  "l-shoulder":{a:11,b:5,c:7,label:"L어깨"},"r-shoulder":{a:12,b:6,c:8,label:"R어깨"},
  "l-spine":{a:5,b:11,c:13,label:"L척추",isTorso:true},"r-spine":{a:6,b:12,c:14,label:"R척추",isTorso:true},
};
const AI_JOINT_OPTIONS = [
  {key:"l-knee",label:"L무릎"},{key:"r-knee",label:"R무릎"},
  {key:"l-hip",label:"L엉덩이"},{key:"r-hip",label:"R엉덩이"},
  {key:"l-elbow",label:"L팔꿈치"},{key:"r-elbow",label:"R팔꿈치"},
  {key:"l-shoulder",label:"L어깨"},{key:"r-shoulder",label:"R어깨"},
  {key:"l-spine",label:"L척추(상체)"},{key:"r-spine",label:"R척추(상체)"},
];

function calcAngle(a,b,c){const r=Math.atan2(c.y-b.y,c.x-b.x)-Math.atan2(a.y-b.y,a.x-b.x);let ang=Math.abs(r*180/Math.PI);return ang>180?360-ang:ang}
function arrAvg(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0}
function arrStd(a){const m=arrAvg(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length)}

function AIExerciseCounter({ onBack }) {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const detectorRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const smoothRef = React.useRef({});

  const [status, setStatus] = useState("init"); // init, loading, ready
  const [mode, setMode] = useState("idle"); // idle, calibrating, workout
  const [debug, setDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Exercise setup
  const [exName, setExName] = useState("스쿼트");
  const [selectedJoints, setSelectedJoints] = useState(["l-knee","r-knee"]);
  const [tolerance, setTolerance] = useState(15);

  // Saved calibration profiles
  const PROFILES_KEY = "if-calib-profiles";
  const [savedProfiles, setSavedProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || []; } catch { return []; }
  });
  const [showProfileList, setShowProfileList] = useState(false);

  const saveProfilesToStorage = React.useCallback((profiles) => {
    setSavedProfiles(profiles);
    try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch {}
  }, []);

  const saveCurrentProfile = React.useCallback(() => {
    if (!learnedRef.current) return;
    const name = exName.trim();
    if (!name) { alert("운동 이름을 입력하세요"); return; }
    const profile = {
      id: Date.now().toString(),
      name,
      joints: selectedJointsRef.current.slice(),
      tolerance: toleranceRef.current,
      learned: JSON.parse(JSON.stringify(learnedRef.current)),
      createdAt: new Date().toISOString(),
    };
    const existing = savedProfiles.filter(p => p.name !== name);
    const updated = [profile, ...existing].slice(0, 20); // max 20 profiles
    saveProfilesToStorage(updated);
    alert(`"${name}" 캘리브레이션이 저장되었습니다`);
  }, [exName, savedProfiles, saveProfilesToStorage]);

  const loadProfile = React.useCallback((profile) => {
    setExName(profile.name);
    setSelectedJoints(profile.joints);
    selectedJointsRef.current = profile.joints;
    setTolerance(profile.tolerance);
    toleranceRef.current = profile.tolerance;
    learnedRef.current = profile.learned;
    setLearnedDisplay(profile.learned);
    smoothRef.current = {};
    setShowProfileList(false);
    setMode("idle"); modeRef.current = "idle";
  }, []);

  const deleteProfile = React.useCallback((id) => {
    if (!confirm("이 프로필을 삭제하시겠습니까?")) return;
    const updated = savedProfiles.filter(p => p.id !== id);
    saveProfilesToStorage(updated);
  }, [savedProfiles, saveProfilesToStorage]);

  // Calibration
  const CALIB_REPS = 5;
  const calibRef = React.useRef({ phase:"idle", count:0, data:{} });
  const [calibCount, setCalibCount] = useState(0);
  const [calibMsg, setCalibMsg] = useState("동작을 시작하세요...");
  const [showCalibOverlay, setShowCalibOverlay] = useState(false);
  const [showCalibProgress, setShowCalibProgress] = useState(false);

  // Learned data
  const learnedRef = React.useRef(null);
  const [learnedDisplay, setLearnedDisplay] = useState(null);

  // Workout
  const workRef = React.useRef({ phase:"idle", count:0, warnings:0, frames:0 });
  const [repCount, setRepCount] = useState(0);
  const [formMsg, setFormMsg] = useState("");
  const [formOk, setFormOk] = useState(true);
  const [showFlash, setShowFlash] = useState("");

  const modeRef = React.useRef("idle");
  const selectedJointsRef = React.useRef(["l-knee","r-knee"]);
  const toleranceRef = React.useRef(15);
  const debugRef = React.useRef(false);

  React.useEffect(() => { modeRef.current = mode; }, [mode]);
  React.useEffect(() => { selectedJointsRef.current = selectedJoints; }, [selectedJoints]);
  React.useEffect(() => { toleranceRef.current = tolerance; }, [tolerance]);
  React.useEffect(() => { debugRef.current = debug; }, [debug]);

  // EMA smoothing
  const ema = React.useCallback((key, val, f=0.4) => {
    const s = smoothRef.current;
    if(s[key]===undefined) s[key]=val;
    s[key]=s[key]*(1-f)+val*f;
    return s[key];
  }, []);

  // Get angles for selected joints from keypoints
  const getAngles = React.useCallback((kps) => {
    const result = {};
    for(const jk of selectedJointsRef.current){
      const j = AI_JOINT_MAP[jk];
      if(kps[j.a].score>.3 && kps[j.b].score>.3 && kps[j.c].score>.3){
        result[jk] = ema("a_"+jk, calcAngle(kps[j.a], kps[j.b], kps[j.c]));
      }
    }
    return result;
  }, [ema]);

  // Init camera + model
  const init = React.useCallback(async () => {
    setStatus("loading"); setErrMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640},height:{ideal:480}},audio:false});
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await window.tf.setBackend("webgl"); await window.tf.ready();
      detectorRef.current = await window.poseDetection.createDetector(window.poseDetection.SupportedModels.MoveNet,{modelType:window.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING});
      setStatus("ready");
    } catch(e) { setErrMsg(e.message||"카메라/모델 로딩 실패"); setStatus("init"); }
  }, []);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if(rafRef.current) cancelAnimationFrame(rafRef.current);
      if(videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop());
    };
  }, []);

  // Resize canvas
  const resizeCanvas = React.useCallback(() => {
    const c=canvasRef.current; if(c){c.width=c.offsetWidth;c.height=c.offsetHeight;}
  }, []);
  React.useEffect(() => { window.addEventListener("resize",resizeCanvas); return ()=>window.removeEventListener("resize",resizeCanvas); }, [resizeCanvas]);

  // Drawing
  const drawSkeleton = React.useCallback((kps) => {
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d");
    const w=c.width,h=c.height,vid=videoRef.current;
    const vw=vid.videoWidth,vh=vid.videoHeight;
    const sc=Math.max(w/vw,h/vh),ox=(w-vw*sc)/2,oy=(h-vh*sc)/2;
    const toC=kp=>({x:w-(kp.x*sc+ox),y:kp.y*sc+oy});
    ctx.clearRect(0,0,w,h);

    ctx.lineWidth=2.5;ctx.strokeStyle="rgba(0,229,255,.4)";ctx.lineCap="round";
    for(const[i,j]of AI_SKELETON){
      if(kps[i].score>.3&&kps[j].score>.3){const a=toC(kps[i]),b=toC(kps[j]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    }
    for(const kp of kps){
      if(kp.score>.3){const p=toC(kp);ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle="rgba(0,229,255,.85)";ctx.fill();ctx.strokeStyle="rgba(255,255,255,.7)";ctx.lineWidth=1.5;ctx.stroke();}
    }

    // Highlight tracked joints with color
    const curMode = modeRef.current;
    const learned = learnedRef.current;
    const tol = toleranceRef.current;
    for(const jk of selectedJointsRef.current){
      const j=AI_JOINT_MAP[jk];
      if(kps[j.a].score>.3&&kps[j.b].score>.3&&kps[j.c].score>.3){
        const b=toC(kps[j.b]);
        const angle=calcAngle(kps[j.a],kps[j.b],kps[j.c]);
        let color="rgba(0,229,255,.9)";
        if(curMode==="workout"&&learned?.joints[jk]){
          const lj=learned.joints[jk];
          color=(angle<lj.normalMin-tol||angle>lj.normalMax+tol)?"rgba(255,23,68,.9)":"rgba(0,230,118,.9)";
        }else if(curMode==="calibrating"){color="rgba(255,171,0,.9)";}

        // For spine joints, draw the shoulder-hip-knee line thicker
        if(j.isTorso){
          const pA=toC(kps[j.a]),pB=toC(kps[j.b]),pC=toC(kps[j.c]);
          ctx.save();
          ctx.lineWidth=4;ctx.strokeStyle=color;ctx.setLineDash([]);
          ctx.beginPath();ctx.moveTo(pA.x,pA.y);ctx.lineTo(pB.x,pB.y);ctx.lineTo(pC.x,pC.y);ctx.stroke();
          // Draw vertical reference line from hip (dashed)
          ctx.setLineDash([6,4]);ctx.lineWidth=1.5;ctx.strokeStyle="rgba(255,255,255,.3)";
          ctx.beginPath();ctx.moveTo(pB.x,pB.y);ctx.lineTo(pB.x,pB.y-120);ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          // Angle label near the midpoint of shoulder-hip
          const mx=(pA.x+pB.x)/2, my=(pA.y+pB.y)/2;
          ctx.font="600 13px 'JetBrains Mono',monospace";ctx.fillStyle=color;
          ctx.fillText(`${Math.round(angle)}°`,mx+10,my);
        }

        ctx.beginPath();ctx.arc(b.x,b.y,8,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
        if(!j.isTorso){ctx.font="600 12px 'JetBrains Mono',monospace";ctx.fillStyle="#fff";ctx.fillText(`${Math.round(angle)}°`,b.x+14,b.y-6);}
      }
    }
  }, []);

  // Process calibration frame
  const processCalibration = React.useCallback((kps) => {
    const angles = getAngles(kps);
    if(Object.keys(angles).length===0) return;
    const cal = calibRef.current;

    for(const[jk,ang]of Object.entries(angles)){
      if(!cal.data[jk]) cal.data[jk]={allFrames:[],repMins:[],repMaxs:[],curMin:999,curMax:0};
      cal.data[jk].allFrames.push(ang);
      if(ang<cal.data[jk].curMin) cal.data[jk].curMin=ang;
      if(ang>cal.data[jk].curMax) cal.data[jk].curMax=ang;
    }

    const pj=selectedJointsRef.current[0];
    const pAng=angles[pj]; if(pAng===undefined) return;
    const cd=cal.data[pj];
    const oMin=Math.min(...cd.allFrames),oMax=Math.max(...cd.allFrames);
    const mid=(oMin+oMax)/2, dTh=mid-5, uTh=mid+5;

    if(cal.phase==="idle"){
      if(oMax-oMin>30){cal.phase="down";setCalibMsg("동작 감지됨...계속하세요");}
      else{setCalibMsg("동작을 시작하세요...");}
    }else{
      if(pAng<dTh&&cal.phase!=="down"){cal.phase="down";setCalibMsg("⬇️ 수축 감지");}
      else if(pAng>uTh&&cal.phase==="down"){
        cal.phase="up"; cal.count++;
        for(const jk of selectedJointsRef.current){
          if(cal.data[jk]){
            cal.data[jk].repMins.push(cal.data[jk].curMin);
            cal.data[jk].repMaxs.push(cal.data[jk].curMax);
            cal.data[jk].curMin=999;cal.data[jk].curMax=0;
          }
        }
        setCalibCount(cal.count);
        setCalibMsg(`✅ ${cal.count}/${CALIB_REPS}회 완료`);
        if(cal.count>=CALIB_REPS) finishCalibration();
      }
    }
  }, [getAngles]);

  const finishCalibration = React.useCallback(() => {
    setMode("idle"); modeRef.current="idle";
    setShowCalibProgress(false);
    const cal=calibRef.current;
    const result={primaryJoint:selectedJointsRef.current[0],joints:{}};
    for(const jk of selectedJointsRef.current){
      const cd=cal.data[jk];
      if(!cd||cd.repMins.length===0) continue;
      const aMin=arrAvg(cd.repMins),aMax=arrAvg(cd.repMaxs);
      const sMin=arrStd(cd.repMins),sMax=arrStd(cd.repMaxs);
      result.joints[jk]={min:Math.round(aMin),max:Math.round(aMax),sdMin:Math.round(sMin*10)/10,sdMax:Math.round(sMax*10)/10,normalMin:Math.round(aMin-sMin*2),normalMax:Math.round(aMax+sMax*2)};
    }
    const pj=result.joints[result.primaryJoint];
    if(pj){const rng=pj.max-pj.min;result.downThreshold=pj.min+rng*0.3;result.upThreshold=pj.max-rng*0.3;}
    learnedRef.current=result;
    setLearnedDisplay(result);
  }, []);

  // Process workout frame
  const processWorkout = React.useCallback((kps) => {
    const angles=getAngles(kps);
    const learned=learnedRef.current; if(!learned) return;
    const pAng=angles[learned.primaryJoint]; if(pAng===undefined) return;
    const w=workRef.current;
    const tol=toleranceRef.current;
    w.frames++;

    let hasWarn=false, wMsg="";
    for(const jk of selectedJointsRef.current){
      const lj=learned.joints[jk]; if(!lj||angles[jk]===undefined) continue;
      const ang=angles[jk];
      if(ang<lj.normalMin-tol){hasWarn=true;wMsg=`⚠️ ${AI_JOINT_MAP[jk].label} 각도 너무 작음 (${Math.round(ang)}°)`;}
      else if(ang>lj.normalMax+tol){hasWarn=true;wMsg=`⚠️ ${AI_JOINT_MAP[jk].label} 각도 너무 큼 (${Math.round(ang)}°)`;}
    }

    if(hasWarn){w.warnings++;setFormMsg(wMsg);setFormOk(false);setShowFlash("warn");setTimeout(()=>setShowFlash(""),180);}
    else{setFormOk(true);}

    if(w.phase==="idle"||w.phase==="up"){
      if(pAng<learned.downThreshold) w.phase="down";
    }else if(w.phase==="down"){
      if(pAng>learned.upThreshold){
        w.phase="up"; w.count++;
        setRepCount(w.count);
        if(!hasWarn){setFormMsg("✅ 좋은 자세!");setFormOk(true);setTimeout(()=>setFormMsg(""),800);}
        setShowFlash("ok");setTimeout(()=>setShowFlash(""),180);
        if(navigator.vibrate)navigator.vibrate(50);
      }
    }

    if(debugRef.current){
      let txt=`운동: ${exName}\n`;
      for(const jk of selectedJointsRef.current){
        const lj=learned.joints[jk];const ang=angles[jk];
        if(ang!==undefined){
          const ok=lj?(ang>=lj.normalMin-tol&&ang<=lj.normalMax+tol):true;
          txt+=`${ok?"🟢":"🔴"} ${AI_JOINT_MAP[jk].label}: ${Math.round(ang)}°`;
          if(lj) txt+=` (${lj.normalMin}°~${lj.normalMax}°)`;
          txt+=`\n`;
        }
      }
      txt+=`Phase: ${w.phase} | Reps: ${w.count}`;
      if(w.frames>0) txt+=` | 정확도: ${Math.round((1-w.warnings/w.frames)*100)}%`;
      setDebugInfo(txt);
    }
  }, [getAngles, exName]);

  // Main detection loop
  const detect = React.useCallback(async () => {
    if(!detectorRef.current||!videoRef.current) { rafRef.current=requestAnimationFrame(detect); return; }
    try{
      const poses=await detectorRef.current.estimatePoses(videoRef.current);
      if(poses.length>0){
        const kps=poses[0].keypoints;
        drawSkeleton(kps);
        const m=modeRef.current;
        if(m==="calibrating") processCalibration(kps);
        else if(m==="workout") processWorkout(kps);
        else if(debugRef.current){
          const angles=getAngles(kps);
          let txt="[대기 모드]\n";
          for(const jk of selectedJointsRef.current){if(angles[jk]!==undefined) txt+=`${AI_JOINT_MAP[jk].label}: ${Math.round(angles[jk])}°\n`;}
          setDebugInfo(txt);
        }
      }
    }catch(e){}
    rafRef.current=requestAnimationFrame(detect);
  }, [drawSkeleton, processCalibration, processWorkout, getAngles]);

  // Start loop when ready
  React.useEffect(() => {
    if(status==="ready"){resizeCanvas();rafRef.current=requestAnimationFrame(detect);}
    return ()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  }, [status, detect, resizeCanvas]);

  const toggleJoint = (key) => {
    setSelectedJoints(prev => {
      if(prev.includes(key)){return prev.length<=1?prev:prev.filter(k=>k!==key);}
      return [...prev, key];
    });
  };

  const startCalibration = () => {
    setShowCalibOverlay(false); setShowCalibProgress(true);
    calibRef.current={phase:"idle",count:0,data:{}};
    smoothRef.current={};
    setCalibCount(0); setCalibMsg("동작을 시작하세요...");
    setMode("calibrating"); modeRef.current="calibrating";
  };

  const startWorkout = () => {
    workRef.current={phase:"idle",count:0,warnings:0,frames:0};
    smoothRef.current={};
    setRepCount(0); setFormMsg(""); setFormOk(true);
    setMode("workout"); modeRef.current="workout";
  };

  const stopWorkout = () => {
    setMode("idle"); modeRef.current="idle"; setFormMsg("");
    const w=workRef.current;
    if(w.frames>0){
      const acc=Math.round((1-w.warnings/w.frames)*100);
      alert(`운동 완료!\n\n횟수: ${w.count}회\n자세 정확도: ${acc}%`);
    }
  };

  const resetAll = () => {
    setMode("idle"); modeRef.current="idle";
    learnedRef.current=null; setLearnedDisplay(null);
    setRepCount(0); setFormMsg(""); setShowCalibProgress(false); setShowCalibOverlay(false);
    smoothRef.current={};
  };

  const A = aiStyles;

  return (
    <div style={A.wrap}>
      {/* Top bar */}
      <div style={A.topbar}>
        <button style={A.backBtn} onClick={()=>{if(mode==="workout")stopWorkout();onBack();}}>
          <I.Back size={20}/> 뒤로
        </button>
        <div style={A.pill(mode)}>{mode==="calibrating"?"캘리브레이션":mode==="workout"?"운동 중":"대기 중"}</div>
      </div>

      {/* Camera */}
      <div style={A.camWrap}>
        <video ref={videoRef} autoPlay playsInline muted style={A.video}/>
        <canvas ref={canvasRef} style={A.canvas}/>

        {/* Flash */}
        {showFlash && <div style={A.flash(showFlash)}/>}

        {/* Count HUD */}
        {mode==="workout" && (
          <div style={A.countHud}>
            <div style={A.countVal}>{repCount}</div>
            <div style={A.countLbl}>REPS</div>
          </div>
        )}

        {/* Form feedback banner */}
        {formMsg && mode==="workout" && (
          <div style={A.formBanner(formOk)}>{formMsg}</div>
        )}

        {/* Calibration progress overlay */}
        {showCalibProgress && (
          <div style={A.calibProgress}>
            <div style={A.calibRepNum}>{calibCount}</div>
            <div style={A.calibRepLbl}>/ {CALIB_REPS} REPS</div>
            <div style={A.calibStatus}>{calibMsg}</div>
          </div>
        )}

        {/* Calibration start overlay */}
        {showCalibOverlay && (
          <div style={A.overlay}>
            <div style={{fontSize:56,marginBottom:16}}>🎯</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>캘리브레이션 준비</div>
            <div style={{fontSize:13,color:"#9499b0",lineHeight:1.7,textAlign:"center",marginBottom:24,maxWidth:300}}>
              올바른 자세로 운동 동작을 <strong style={{color:"#ffab00"}}>{CALIB_REPS}회</strong> 시범 보여주세요.<br/>AI가 정확한 동작 범위를 학습합니다.
            </div>
            <button style={A.calibBtn} onClick={startCalibration}>시범 시작</button>
            <button style={{...A.calibBtn,...A.calibBtnSec}} onClick={()=>setShowCalibOverlay(false)}>취소</button>
          </div>
        )}

        {/* Init screen */}
        {status==="init" && (
          <div style={A.overlay}>
            <div style={{fontSize:56,marginBottom:16}}>🎯</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>IF 캘리브레이션</div>
            <div style={{fontSize:13,color:"#9499b0",lineHeight:1.7,textAlign:"center",marginBottom:20,maxWidth:300}}>고정된 카메라 위치에서<br/>운동 동작을 학습하고<br/>자세를 교정합니다</div>
            {errMsg && <div style={{fontSize:12,color:"#ff4444",marginBottom:12,background:"rgba(255,0,0,.1)",padding:"8px 14px",borderRadius:8}}>{errMsg}</div>}
            <button style={A.calibBtn} onClick={init}>카메라 시작</button>
          </div>
        )}
        {status==="loading" && (
          <div style={A.overlay}>
            <div style={A.spinner}/>
            <div style={{color:"#888",marginTop:16,fontSize:14}}>AI 모델 로딩 중...</div>
          </div>
        )}

        {/* Debug panel */}
        {debug && debugInfo && <div style={A.debugBox}>{debugInfo}</div>}
      </div>

      {/* Bottom panel */}
      <div style={A.bottomPanel}>
        {/* Saved profiles toggle */}
        {!showProfileList ? (
          <>
            {/* Exercise name + saved profiles button */}
            <div style={A.exNameRow}>
              <input style={A.exNameInput} value={exName} onChange={e=>setExName(e.target.value)} placeholder="운동 이름 (예: 바벨 스쿼트)"/>
              <button style={{...A.resetBtn,width:40,height:40,fontSize:13,position:"relative"}} onClick={()=>setShowProfileList(true)} title="저장된 동작">
                📂
                {savedProfiles.length>0 && <span style={{position:"absolute",top:-4,right:-4,background:"#ffab00",color:"#000",fontSize:9,fontWeight:800,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{savedProfiles.length}</span>}
              </button>
            </div>

            {/* Joint selector */}
            <div style={A.jointRow}>
              {AI_JOINT_OPTIONS.map(j=>(
                <button key={j.key} style={A.jointBtn(selectedJoints.includes(j.key))} onClick={()=>toggleJoint(j.key)}>{j.label}</button>
              ))}
            </div>

            {/* Tolerance slider */}
            <div style={A.tolRow}>
              <span style={A.tolLabel}>오차 허용:</span>
              <input type="range" min="5" max="30" value={tolerance} onChange={e=>setTolerance(parseInt(e.target.value))} style={{flex:1,accentColor:"#ffab00"}}/>
              <span style={A.tolVal}>±{tolerance}°</span>
            </div>

            {/* Learned data display */}
            {learnedDisplay && (
              <div style={A.calibDataBox}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{color:"#ffab00",fontWeight:700}}>📊 캘리브레이션 결과</span>
                  <button onClick={saveCurrentProfile} style={{background:"rgba(0,229,255,.1)",border:"1px solid rgba(0,229,255,.3)",borderRadius:6,padding:"3px 10px",color:"#00e5ff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif"}}>💾 저장</button>
                </div>
                <div>운동: <span style={{color:"#00e5ff"}}>{exName}</span></div>
                <div>카운트: down &lt; <span style={{color:"#00e5ff"}}>{Math.round(learnedDisplay.downThreshold)}°</span> → up &gt; <span style={{color:"#00e5ff"}}>{Math.round(learnedDisplay.upThreshold)}°</span></div>
                {Object.entries(learnedDisplay.joints).map(([jk,d])=>(
                  <div key={jk}>{AI_JOINT_MAP[jk].label}: <span style={{color:"#00e5ff"}}>{d.min}°~{d.max}°</span> (정상: {d.normalMin}°~{d.normalMax}°)</div>
                ))}
              </div>
            )}

            {/* Controls */}
            <div style={A.ctrlRow}>
              <button style={A.dbgBtn(debug)} onClick={()=>setDebug(!debug)}>DBG</button>
              {mode==="idle" && !learnedDisplay && <button style={A.mainBtn("calib")} onClick={()=>setShowCalibOverlay(true)}>캘리브레이션</button>}
              {mode==="idle" && learnedDisplay && <button style={A.mainBtn("start")} onClick={startWorkout}>운동 시작</button>}
              {mode==="calibrating" && <button style={A.mainBtn("stop")} onClick={()=>{setMode("idle");modeRef.current="idle";setShowCalibProgress(false);}}>중지</button>}
              {mode==="workout" && <button style={A.mainBtn("stop")} onClick={stopWorkout}>운동 종료</button>}
              <button style={A.resetBtn} onClick={resetAll}>↺</button>
            </div>
          </>
        ) : (
          /* Saved profiles list */
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>📂 저장된 동작</span>
              <button style={{background:"none",border:"none",color:"#888",fontSize:13,cursor:"pointer",padding:"4px 8px",fontFamily:"'Noto Sans KR',sans-serif"}} onClick={()=>setShowProfileList(false)}>✕ 닫기</button>
            </div>
            {savedProfiles.length===0 ? (
              <div style={{textAlign:"center",padding:"20px 0",color:"#555",fontSize:13}}>저장된 동작이 없습니다.<br/>캘리브레이션 후 저장해보세요.</div>
            ) : (
              <div style={{maxHeight:240,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                {savedProfiles.map(p=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#10111a",border:"1px solid #222436",borderRadius:10,marginBottom:6,cursor:"pointer"}} onClick={()=>loadProfile(p)}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#e8eaf0"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#5c6080",marginTop:2}}>
                        {p.joints.map(j=>AI_JOINT_MAP[j]?.label).join(", ")} · ±{p.tolerance}°
                      </div>
                      <div style={{fontSize:10,color:"#3a3d50",marginTop:1}}>{new Date(p.createdAt).toLocaleDateString("ko-KR")}</div>
                    </div>
                    <button onClick={(e)=>{e.stopPropagation();deleteProfile(p.id);}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:6,fontSize:14}}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const aiStyles = {
  wrap:{position:"fixed",inset:0,background:"#08090d",display:"flex",flexDirection:"column",zIndex:1000,maxWidth:480,margin:"0 auto"},
  topbar:{padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"absolute",top:0,left:0,right:0,zIndex:20,background:"linear-gradient(to bottom,rgba(8,9,13,.95),transparent)"},
  backBtn:{background:"none",border:"none",color:"#ccc",display:"flex",alignItems:"center",gap:4,fontSize:14,cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif",padding:"6px 0"},
  pill:(mode)=>({fontFamily:"'JetBrains Mono',monospace",fontSize:11,padding:"4px 12px",borderRadius:20,letterSpacing:".04em",
    background:mode==="calibrating"?"rgba(255,171,0,.12)":mode==="workout"?"rgba(0,230,118,.12)":"rgba(0,229,255,.08)",
    color:mode==="calibrating"?"#ffab00":mode==="workout"?"#00e676":"#00e5ff",
    border:`1px solid ${mode==="calibrating"?"rgba(255,171,0,.25)":mode==="workout"?"rgba(0,230,118,.25)":"rgba(0,229,255,.2)"}`
  }),
  camWrap:{flex:1,position:"relative",overflow:"hidden"},
  video:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"},
  canvas:{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:2},
  flash:(type)=>({position:"absolute",inset:0,zIndex:3,pointerEvents:"none",background:type==="ok"?"radial-gradient(circle,rgba(0,229,255,.18),transparent 70%)":"radial-gradient(circle,rgba(255,23,68,.2),transparent 70%)"}),
  countHud:{position:"absolute",top:65,left:0,right:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",pointerEvents:"none"},
  countVal:{fontFamily:"'JetBrains Mono',monospace",fontSize:80,fontWeight:700,color:"#fff",textShadow:"0 0 50px rgba(0,229,255,.5),0 4px 20px rgba(0,0,0,.8)",lineHeight:1},
  countLbl:{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:4},
  formBanner:(ok)=>({position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10,pointerEvents:"none",padding:"10px 24px",borderRadius:30,fontSize:15,fontWeight:600,backdropFilter:"blur(10px)",whiteSpace:"nowrap",
    background:ok?"rgba(0,230,118,.2)":"rgba(255,23,68,.2)",color:ok?"#00e676":"#ff1744",border:`1px solid ${ok?"rgba(0,230,118,.3)":"rgba(255,23,68,.3)"}`
  }),
  calibProgress:{position:"absolute",top:65,left:0,right:0,zIndex:35,display:"flex",flexDirection:"column",alignItems:"center",pointerEvents:"none"},
  calibRepNum:{fontFamily:"'JetBrains Mono',monospace",fontSize:64,fontWeight:700,color:"#ffab00",textShadow:"0 0 40px rgba(255,171,0,.5)"},
  calibRepLbl:{fontSize:13,color:"rgba(255,171,0,.7)",letterSpacing:3,fontWeight:600},
  calibStatus:{marginTop:12,fontSize:13,color:"#9499b0",background:"rgba(0,0,0,.5)",padding:"6px 16px",borderRadius:20,backdropFilter:"blur(6px)"},
  overlay:{position:"absolute",inset:0,zIndex:50,background:"rgba(8,9,13,.92)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30},
  calibBtn:{padding:"14px 36px",borderRadius:14,border:"none",fontFamily:"'Noto Sans KR',sans-serif",fontSize:16,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg,#ffab00,#ff8f00)",color:"#fff",boxShadow:"0 4px 20px rgba(255,171,0,.3)"},
  calibBtnSec:{background:"#181a28",color:"#9499b0",border:"1px solid #222436",boxShadow:"none",marginTop:10},
  spinner:{width:40,height:40,border:"3px solid #222",borderTopColor:"#00e5ff",borderRadius:"50%",animation:"spin .8s linear infinite"},
  debugBox:{position:"absolute",bottom:280,left:12,zIndex:10,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(255,255,255,.7)",background:"rgba(0,0,0,.55)",padding:"10px 14px",borderRadius:10,backdropFilter:"blur(6px)",pointerEvents:"none",whiteSpace:"pre-line",lineHeight:1.6},
  bottomPanel:{position:"absolute",bottom:0,left:0,right:0,zIndex:20,padding:"0 14px 24px",background:"linear-gradient(to top,rgba(8,9,13,.96) 60%,transparent)",paddingTop:36},
  exNameRow:{display:"flex",gap:8,marginBottom:8,alignItems:"center"},
  exNameInput:{flex:1,padding:"8px 14px",borderRadius:10,border:"1.5px solid #222436",background:"#10111a",color:"#e8eaf0",fontFamily:"'Noto Sans KR',sans-serif",fontSize:14,fontWeight:500,outline:"none",boxSizing:"border-box"},
  jointRow:{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},
  jointBtn:(on)=>({flexShrink:0,padding:"6px 12px",borderRadius:8,border:`1.5px solid ${on?"#00e5ff":"#222436"}`,background:on?"rgba(0,229,255,.06)":"#10111a",color:on?"#00e5ff":"#5c6080",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif",whiteSpace:"nowrap"}),
  tolRow:{display:"flex",alignItems:"center",gap:10,marginBottom:8},
  tolLabel:{fontSize:12,color:"#5c6080",whiteSpace:"nowrap"},
  tolVal:{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#ffab00",minWidth:36,textAlign:"right"},
  calibDataBox:{background:"#10111a",border:"1px solid #222436",borderRadius:10,padding:"10px 14px",marginBottom:10,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#9499b0",lineHeight:1.8},
  ctrlRow:{display:"flex",gap:10,alignItems:"center"},
  mainBtn:(type)=>({flex:1,padding:14,borderRadius:12,border:"none",fontSize:15,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:.5,fontFamily:"'Noto Sans KR',sans-serif",color:"#fff",
    background:type==="calib"?"linear-gradient(135deg,#ffab00,#ff8f00)":type==="start"?"linear-gradient(135deg,#00e5ff,#7c4dff)":"linear-gradient(135deg,#ff1744,#d50000)",
    boxShadow:type==="calib"?"0 4px 16px rgba(255,171,0,.25)":type==="start"?"0 4px 16px rgba(0,229,255,.25)":"0 4px 16px rgba(255,23,68,.25)"
  }),
  dbgBtn:(on)=>({width:48,height:48,borderRadius:12,border:`1.5px solid ${on?"#00e5ff":"#222436"}`,background:on?"rgba(0,229,255,.05)":"#10111a",color:on?"#00e5ff":"#5c6080",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}),
  resetBtn:{width:48,height:48,borderRadius:12,border:"1.5px solid #222436",background:"#10111a",color:"#5c6080",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
};

// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════
const S = {
  root: { fontFamily: "'Noto Sans KR', sans-serif", background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh", maxWidth: 480, margin: "0 auto", WebkitFontSmoothing: "antialiased" },
  loading: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0a" },
  spinner: { width: 32, height: 32, border: "3px solid #333", borderTopColor: "#6a9fd8", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#a0a0a0", marginTop: 16 },
  container: { padding: "16px 16px 100px" },

  // Login
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  loginCard: { width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center" },
  loginTitle: { fontSize: 32, fontWeight: 900, color: "#6a9fd8", margin: "0 0 2px", letterSpacing: "0.05em" },
  loginSub: { color: "#555", fontSize: 13, marginBottom: 28 },
  loginTabs: { display: "flex", width: "100%", gap: 8, marginBottom: 20 },
  loginTab: { flex: 1, padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Noto Sans KR', sans-serif" },
  loginTabOn: { background: "rgba(106,159,216,0.1)", borderColor: "rgba(106,159,216,0.3)", color: "#6a9fd8" },
  loginForm: { width: "100%" },
  pinInput: { width: "100%", textAlign: "center", fontSize: 24, letterSpacing: "0.3em", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", outline: "none", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box" },
  errMsg: { marginTop: 12, padding: "10px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#ef4444", fontSize: 13, textAlign: "center" },
  logoutBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", padding: "8px 12px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },

  // Admin
  adminGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  adminCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 16px", textAlign: "center", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif", color: "#e8e8e8", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  adminCardT: { fontSize: 15, fontWeight: 600 },
  adminCardN: { fontSize: 24, fontWeight: 800, color: "#6a9fd8", fontFamily: "'JetBrains Mono'" },

  // Page
  pageHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 },
  backSm: { background: "none", border: "none", color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: "8px 0", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" },
  addBtn: { background: "rgba(106,159,216,0.1)", border: "1px solid rgba(106,159,216,0.2)", borderRadius: 10, padding: "8px 14px", color: "#6a9fd8", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },

  // Cards
  mCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" },
  mCardL: { display: "flex", gap: 12, alignItems: "center" },
  avatarLg: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  pCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 },
  lvlHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, justifyContent: "space-between" },

  // Shared
  badge: { fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, letterSpacing: "0.04em" },
  badgeSm: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, display: "inline-block" },
  chip: { fontSize: 11, color: "#666", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 },
  iconBtn: { background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex", alignItems: "center" },
  empty: { textAlign: "center", padding: "60px 20px" },
  divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 },

  // Forms
  fg: { marginBottom: 14 },
  input: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e8e8e8", fontSize: 14, outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" },
  inputSm: { flex: 1, padding: "8px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e8e8e8", fontSize: 13, outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" },
  formAct: { display: "flex", gap: 10, position: "sticky", bottom: 16, paddingTop: 8 },
  cancelBtn: { flex: 1, padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", fontFamily: "'Noto Sans KR', sans-serif" },
  primaryBtn: { flex: 1, padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #4a7ab5, #6a9fd8)", border: "none", color: "#fff", fontFamily: "'Noto Sans KR', sans-serif", marginTop: 12 },

  // Program Editor
  dayEd: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, marginBottom: 12 },
  dayEdHead: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 },
  exEd: { background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 10, marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 },
  exEdRow: { display: "flex", gap: 8, alignItems: "center" },
  exNum: { width: 28, height: 28, borderRadius: 8, background: "rgba(106,159,216,0.15)", color: "#6a9fd8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" },
  exNumDisplay: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 7, background: "rgba(106,159,216,0.15)", color: "#6a9fd8", fontSize: 13, fontWeight: 700, marginRight: 8, fontFamily: "'JetBrains Mono', monospace" },
  mini: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  miniL: { fontSize: 10, color: "#666", fontWeight: 600 },
  addExBtn: { width: "100%", background: "none", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 8, padding: 8, color: "#666", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },
  addDayBtn: { width: "100%", background: "rgba(106,159,216,0.06)", border: "1px dashed rgba(106,159,216,0.2)", borderRadius: 12, padding: 14, color: "#6a9fd8", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", marginBottom: 16, fontFamily: "'Noto Sans KR', sans-serif" },

  // Member Custom Exercise Settings (per-set)
  customDayBlock: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, marginBottom: 10 },
  customDayTitle: { fontSize: 13, fontWeight: 700, color: "#6a9fd8", marginBottom: 10, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  customExBlock: { marginBottom: 12 },
  customExHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  customExNum: { width: 22, height: 22, borderRadius: 6, background: "rgba(106,159,216,0.1)", color: "#6a9fd8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "'JetBrains Mono'" },
  customExName: { fontSize: 13, fontWeight: 600, color: "#ccc", flex: 1 },
  customSetGrid: { paddingLeft: 30 },
  customSetHeaderRow: { display: "flex", alignItems: "center", marginBottom: 4 },
  customSetHCell: { width: 36, textAlign: "center", fontSize: 10, color: "#555", fontWeight: 600 },
  customSetHCellW: { flex: 1, textAlign: "center", fontSize: 10, color: "#555", fontWeight: 600 },
  customSetRow: { display: "flex", alignItems: "center", marginBottom: 3 },
  customSetCell: { width: 36, textAlign: "center", fontSize: 12, color: "#888", fontFamily: "'JetBrains Mono'" },
  customSetCellW: { flex: 1, display: "flex", justifyContent: "center" },
  customSetInput: { width: "80%", padding: "6px 6px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 13, textAlign: "center", fontFamily: "'JetBrains Mono'", outline: "none" },

  // Member Home
  todayDate: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6a9fd8", marginBottom: 16, padding: "8px 12px", background: "rgba(106,159,216,0.06)", borderRadius: 10, fontWeight: 500 },
  histBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, color: "#e8e8e8", fontSize: 14, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" },
  logCnt: { marginLeft: "auto", background: "rgba(106,159,216,0.15)", color: "#6a9fd8", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  myProg: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16 },
  dayGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  dayCard: { background: "rgba(106,159,216,0.06)", border: "1px solid rgba(106,159,216,0.12)", borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans KR', sans-serif", color: "#e8e8e8", position: "relative" },
  dayCardDone: { borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)" },
  doneChk: { position: "absolute", top: 10, right: 10, color: "#22c55e" },
  dayNum: { fontSize: 10, fontWeight: 700, color: "#6a9fd8", letterSpacing: "0.12em", marginBottom: 6 },

  // Workout
  workoutMeta: { display: "flex", gap: 16, fontSize: 12, color: "#888", marginBottom: 16, padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, alignItems: "center" },
  exTabs: { display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" },
  exTab: { minWidth: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" },
  exTabOn: { background: "rgba(106,159,216,0.15)", borderColor: "#6a9fd8", color: "#6a9fd8" },
  exTabDone: { background: "rgba(34,197,94,0.1)", color: "#22c55e" },
  curEx: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16 },
  exNote: { fontSize: 12, color: "#f59e0b", background: "rgba(245,158,11,0.08)", padding: "6px 10px", borderRadius: 8, marginBottom: 12 },
  progBar: { height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden", marginTop: 6 },
  progFill: { height: "100%", background: "linear-gradient(90deg, #4a7ab5, #6a9fd8)", borderRadius: 3, transition: "width 0.3s" },
  setHead: { display: "flex", alignItems: "center", padding: "0 4px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 },
  setHC: { width: 44, textAlign: "center", fontSize: 11, color: "#555", fontWeight: 600 },
  setHCW: { flex: 1, textAlign: "center", fontSize: 11, color: "#555", fontWeight: 600 },
  setRow: { display: "flex", alignItems: "center", padding: "6px 4px", borderRadius: 8, marginBottom: 2, transition: "background 0.2s" },
  setRowDone: { background: "rgba(34,197,94,0.06)" },
  setC: { width: 44, textAlign: "center", fontSize: 14, color: "#aaa", fontFamily: "'JetBrains Mono', monospace" },
  setCW: { flex: 1, display: "flex", justifyContent: "center" },
  setIn: { width: "80%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 8px", color: "#fff", fontSize: 16, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", outline: "none" },
  doneBtn: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#555" },
  doneBtnOn: { background: "rgba(34,197,94,0.2)", borderColor: "#22c55e", color: "#22c55e" },
  addSetBtn: { width: "100%", background: "none", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px", color: "#666", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", marginTop: 8, fontFamily: "'Noto Sans KR', sans-serif" },
  wNav: { display: "flex", gap: 10, marginTop: 16, position: "sticky", bottom: 16 },
  navBtn: { flex: 1, padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#aaa", fontFamily: "'Noto Sans KR', sans-serif" },
  navBtnPri: { background: "rgba(106,159,216,0.15)", borderColor: "rgba(106,159,216,0.3)", color: "#6a9fd8" },
  finBtn: { background: "linear-gradient(135deg, #4a7ab5, #6a9fd8)", borderColor: "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },

  // History
  dateGrp: { fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  logCard: { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans KR', sans-serif", color: "#e8e8e8" },
  logDet: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 12, marginBottom: 8, marginTop: -2 },

  // Stats
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 8px", textAlign: "center" },
  statNum: { fontSize: 28, fontWeight: 800, color: "#6a9fd8", fontFamily: "'JetBrains Mono'" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 4 },

  // Calendar
  calMonth: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, marginBottom: 16 },
  calMonthHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  calMonthTitle: { fontSize: 16, fontWeight: 700, color: "#fff" },
  calMonthCount: { fontSize: 13, fontWeight: 600, color: "#6a9fd8", background: "rgba(106,159,216,0.1)", padding: "3px 10px", borderRadius: 8 },
  calWeekdays: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 },
  calWeekday: { textAlign: "center", fontSize: 11, fontWeight: 600, padding: "4px 0" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 },
  calCell: { aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" },
  calDay: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono'", transition: "all 0.2s" },
  calDayWorkout: { background: "linear-gradient(135deg, #4a7ab5, #6a9fd8)", color: "#fff", fontWeight: 700, boxShadow: "0 0 8px rgba(106,159,216,0.3)" },
  calDayToday: { border: "2px solid #6a9fd8" },
};
