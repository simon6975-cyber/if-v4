import { useState, useEffect, useCallback, useMemo } from "react";
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
};

const ADMIN_PIN = "0000";
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
function getWeekKey(d) { const dt = new Date(d); const jan1 = new Date(dt.getFullYear(), 0, 1); const days = Math.floor((dt - jan1) / 86400000); return `${dt.getFullYear()}-W${String(Math.ceil((days + jan1.getDay() + 1) / 7)).padStart(2, "0")}`; }
function getMonthKey(d) { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`; }

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
  const member = members.find((m) => m.id === session.memberId);
  const program = programs.find((p) => p.id === member?.programId);
  const myLogs = useMemo(() => logs.filter((l) => l.memberId === session.memberId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), [logs, session.memberId]);

  if (screen === "workout" && program && selDay !== null) return (
    <WorkoutSession program={program} dayIndex={selDay} memberId={session.memberId} memberCustom={member?.customExercises}
      onFinish={(e) => { addLog(e); setScreen("home"); setSelDay(null); }}
      onBack={() => { setScreen("home"); setSelDay(null); }}/>
  );
  if (screen === "history") return <HistoryView logs={myLogs} onBack={() => setScreen("home")}/>;
  if (screen === "stats") return <StatsView logs={myLogs} onBack={() => setScreen("home")}/>;

  const today = new Date();
  const todayStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <div style={S.container}>
      <Header title={session.memberName} subtitle="오늘도 한 세트 더" onLogout={onLogout}/>
      <div style={S.todayDate}><I.Calendar size={14}/> {todayStr}</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button style={{ ...S.histBtn, flex: 1 }} onClick={() => setScreen("history")}><I.Calendar/><span>기록</span><span style={S.logCnt}>{myLogs.length}</span></button>
        <button style={{ ...S.histBtn, flex: 1 }} onClick={() => setScreen("stats")}><I.Chart/><span>통계</span></button>
      </div>

      {!program ? <Empty icon="🏋️" text="배정된 프로그램이 없습니다" sub="관리자에게 문의하세요"/> : (
        <div style={S.myProg}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ ...S.badge, background: LEVELS[program.level]?.bg, color: LEVELS[program.level]?.color }}>{LEVELS[program.level]?.label}</span>
            <span style={S.chip}>주 {program.daysPerWeek}일</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{program.name}</h3>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{program.description}</p>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.08em", marginBottom: 10 }}>루틴 선택</div>
          <div style={S.dayGrid}>
            {program.days.map((day, i) => {
              const todayDate = new Date().toDateString();
              const done = myLogs.some((l) => l.dayName === day.dayName && new Date(l.timestamp).toDateString() === todayDate);
              return (
                <button key={i} style={{ ...S.dayCard, ...(done ? S.dayCardDone : {}) }} onClick={() => { setSelDay(i); setScreen("workout"); }}>
                  {done && <div style={S.doneChk}><I.Check size={14}/></div>}
                  <div style={S.dayNum}>DAY {i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{day.dayName}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{day.exercises.length}종목</div>
                </button>
              );
            })}
          </div>
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
  const [startTime] = useState(() => new Date().toISOString());
  const [exData, setExData] = useState(day.exercises.map((ex, ei) => {
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
  }));
  const [activeEx, setActiveEx] = useState(0);

  const uSet = (ei, si, f, v) => setExData((prev) => { const n = [...prev]; n[ei] = { ...n[ei], sets: [...n[ei].sets] }; n[ei].sets[si] = { ...n[ei].sets[si], [f]: v }; return n; });
  const toggleDone = (ei, si) => { uSet(ei, si, "done", !exData[ei].sets[si].done); };

  const total = exData.reduce((a, e) => a + e.sets.length, 0);
  const done = exData.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const ex = exData[activeEx];

  const todayStr = new Date(startTime).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <div style={S.container}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
        <button style={S.backSm} onClick={onBack}><I.Back/></button>
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
          <button style={{ ...S.navBtn, ...S.finBtn }} onClick={() => {
            const endTime = new Date().toISOString();
            onFinish({ memberId, programId: program.id, programName: program.name, dayName: day.dayName, level: program.level,
              timestamp: startTime, startTime, endTime, date: new Date(startTime).toISOString().split("T")[0],
              exercises: exData.map((e) => ({ name: e.name, sets: e.sets.filter((s) => s.done).map((s) => ({ weight: s.weight, reps: s.reps })) })) });
          }}><I.Fire/> 운동 완료!</button>
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
// STATS VIEW (주별/월별/연간 그래프)
// ═══════════════════════════════════════
function StatsView({ logs, onBack }) {
  const [mode, setMode] = useState("weekly"); // weekly | monthly | yearly

  const stats = useMemo(() => {
    if (!logs.length) return { weekly: [], monthly: [], yearly: [], totalSessions: 0, totalMinutes: 0, streak: 0 };

    const weekMap = {}; const monthMap = {}; const yearMap = {};
    let totalMin = 0;

    logs.forEach((l) => {
      const wk = getWeekKey(l.timestamp); weekMap[wk] = (weekMap[wk] || 0) + 1;
      const mk = getMonthKey(l.timestamp); monthMap[mk] = (monthMap[mk] || 0) + 1;
      const yk = new Date(l.timestamp).getFullYear().toString(); yearMap[yk] = (yearMap[yk] || 0) + 1;
      if (l.startTime && l.endTime) totalMin += Math.floor((new Date(l.endTime) - new Date(l.startTime)) / 60000);
    });

    // streak
    const dates = [...new Set(logs.map((l) => new Date(l.timestamp).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]); d.setHours(0,0,0,0);
      const diff = Math.floor((today - d) / 86400000);
      if (diff === i || diff === i + 1) streak++; else break;
    }

    const toArr = (map) => Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
    return { weekly: toArr(weekMap), monthly: toArr(monthMap), yearly: toArr(yearMap), totalSessions: logs.length, totalMinutes: totalMin, streak };
  }, [logs]);

  const chartData = mode === "weekly" ? stats.weekly : mode === "monthly" ? stats.monthly : stats.yearly;
  const maxVal = Math.max(...chartData.map((d) => d[1]), 1);

  const formatLabel = (key) => {
    if (mode === "weekly") { const [, w] = key.split("-W"); return `${w}주`; }
    if (mode === "monthly") { const [, m] = key.split("-"); return `${parseInt(m)}월`; }
    return key;
  };

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

      {/* Mode Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["weekly","주별"],["monthly","월별"],["yearly","연간"]].map(([k,l]) => (
          <button key={k} style={{ ...S.modeTab, ...(mode === k ? S.modeTabOn : {}) }} onClick={() => setMode(k)}>{l}</button>
        ))}
      </div>

      {/* Bar Chart */}
      {chartData.length === 0 ? <Empty icon="📊" text="데이터가 없습니다"/> : (
        <div style={S.chartWrap}>
          <div style={S.chartBars}>
            {chartData.map(([key, val], i) => (
              <div key={key} style={S.chartCol}>
                <div style={S.chartValLabel}>{val}</div>
                <div style={S.chartBarOuter}>
                  <div style={{
                    ...S.chartBarInner,
                    height: `${(val / maxVal) * 100}%`,
                    background: mode === "weekly" ? "linear-gradient(180deg, #6a9fd8, #4a7ab5)" :
                      mode === "monthly" ? "linear-gradient(180deg, #22c55e, #16a34a)" :
                      "linear-gradient(180deg, #f59e0b, #d97706)",
                    animationDelay: `${i * 60}ms`,
                  }}/>
                </div>
                <div style={S.chartLabel}>{formatLabel(key)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
  modeTab: { flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", fontFamily: "'Noto Sans KR', sans-serif" },
  modeTabOn: { background: "rgba(106,159,216,0.1)", borderColor: "rgba(106,159,216,0.3)", color: "#6a9fd8" },
  chartWrap: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 12px 12px" },
  chartBars: { display: "flex", alignItems: "flex-end", gap: 6, height: 200 },
  chartCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 },
  chartValLabel: { fontSize: 11, fontWeight: 700, color: "#6a9fd8", fontFamily: "'JetBrains Mono'" },
  chartBarOuter: { width: "100%", height: 160, background: "rgba(255,255,255,0.03)", borderRadius: 6, display: "flex", alignItems: "flex-end", overflow: "hidden" },
  chartBarInner: { width: "100%", borderRadius: "6px 6px 0 0", transition: "height 0.6s ease-out", minHeight: 4 },
  chartLabel: { fontSize: 10, color: "#666", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" },
};
