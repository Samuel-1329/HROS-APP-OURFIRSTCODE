import { useState, useEffect, useCallback, useRef } from "react";

// ─── OurFirstCode Brand ───────────────────────────────────────────────────────
const BRAND = {
  name: "OurFirstCode",
  tagline: "Innovate. Achieve.",
  logo: "https://ourfirstcode.com/favicon_white-removebg-preview.png",
  primary: "#4A90E2",
  primaryDark: "#2563EB",
  primaryLight: "#EBF4FF",
  accent: "#6C63FF",
  dark: "#1A202C",
  darker: "#0F1117",
  surface: "#FFFFFF",
  surfaceAlt: "#F7FAFC",
  border: "#E2E8F0",
  text: "#1A202C",
  muted: "#718096",
  success: "#38A169",
  warning: "#D69E2E",
  danger: "#E53E3E",
  info: "#3182CE",
  gradient: "linear-gradient(135deg, #667eea 0%, #4A90E2 50%, #06B6D4 100%)",
  gradientDark: "linear-gradient(135deg, #1A202C 0%, #2D3748 100%)",
};

const STAGES = ["Applied","Screening","Technical Interview","HR Interview","Offer","Hired","Rejected"];
const DEPARTMENTS = ["Engineering","Product","Design","Marketing","Sales","HR","Finance","Operations","Legal","DevOps"];
const EMP_TYPES = ["Full-time","Part-time","Contract","Internship","Remote","Freelance"];
const EXP_LEVELS = ["Entry","Junior","Mid","Senior","Lead","Principal","Director"];
const INTERVIEW_TYPES = ["Phone Screen","Technical Round","Behavioral","System Design","Cultural Fit","Assignment Review","Final Round","CEO Round"];
const SOURCE_OPTIONS = ["LinkedIn","Referral","Job Board","Direct Apply","GitHub","Campus","Internship","Other"];

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

const stageColor = (stage) => ({
  "Applied": "#6366F1","Screening": "#F59E0B","Technical Interview": "#3B82F6",
  "HR Interview": "#8B5CF6","Offer": "#10B981","Hired": "#059669","Rejected": "#EF4444"
}[stage] || "#718096");

const stageIcon = (stage) => ({
  "Applied":"📩","Screening":"🔍","Technical Interview":"💻","HR Interview":"🤝",
  "Offer":"📋","Hired":"🎉","Rejected":"❌"
}[stage] || "📌");

// ─── Seed Data ────────────────────────────────────────────────────────────────
const mkJob = (title, dept, type, loc, min, max, skills, desc, status, feat, urg, rem) => ({
  id: genId(), title, department: dept, type, location: loc, salaryMin: min, salaryMax: max,
  skills, description: desc, status, featured: feat, urgent: urg, remote: rem,
  createdAt: new Date(Date.now() - Math.random()*30*864e5).toISOString().split("T")[0],
  expiryDate: new Date(Date.now() + Math.random()*60*864e5).toISOString().split("T")[0],
  openings: Math.floor(Math.random()*3)+1,
});

const SEED_JOBS = [
  mkJob("Senior React Developer","Engineering","Full-time","Bangalore",2000000,3200000,["React","TypeScript","Redux","GraphQL"],"Build next-gen recruitment interfaces. You'll architect scalable frontend systems, mentor juniors, and own the entire product UX.","Open",true,true,true),
  mkJob("Product Manager – HrTech","Product","Full-time","Mumbai",2400000,3600000,["Roadmapping","OKRs","Analytics","Agile"],"Own the product strategy for HrOS. Define roadmaps, work with engineering, and drive 10x growth in recruitment efficiency.","Open",true,false,false),
  mkJob("Full Stack Engineer","Engineering","Full-time","Hyderabad",1800000,2800000,["Node.js","React","PostgreSQL","Docker","AWS"],"End-to-end feature ownership from database schema to pixel-perfect UI.","Open",false,false,true),
  mkJob("UX Researcher","Design","Full-time","Remote",1400000,2000000,["User Research","Figma","Usability Testing","Data Analysis"],"Conduct user research to inform product decisions and improve recruiter workflows.","Open",false,false,true),
  mkJob("DevOps Engineer","DevOps","Contract","Bangalore",2200000,3000000,["Kubernetes","AWS","Terraform","CI/CD","Docker"],"Manage cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime for HrOS.","Open",false,true,false),
  mkJob("Data Analyst – People Analytics","HR","Full-time","Delhi",1200000,1800000,["SQL","Python","Power BI","Excel","Statistics"],"Turn hiring data into insights that help teams make smarter decisions.","Open",false,false,false),
  mkJob("Marketing Manager","Marketing","Full-time","Bangalore",1600000,2400000,["Content Strategy","SEO","Performance Marketing","Brand"],"Lead go-to-market strategy for HrOS and grow organic traffic.","On Hold",false,false,false),
  mkJob("Frontend Intern","Engineering","Internship","Remote",400000,600000,["HTML","CSS","JavaScript","React"],"6-month internship with real ownership of UI features. Join OurFirstCode's flagship product team.","Open",false,false,true),
];

const mkCandidate = (name, email, phone, pos, exp, skills, stage, rating, notes, fav, tags, source) => ({
  id: genId(), name, email, phone, position: pos, experience: exp, skills, stage,
  rating, notes, favorite: fav, tags, source: source || "LinkedIn",
  createdAt: new Date(Date.now() - Math.random()*30*864e5).toISOString().split("T")[0],
  resumeUrl: "", activityLog: [{ date: new Date().toISOString().split("T")[0], action: "Profile created", by: "HR Team" }],
});

const SEED_CANDIDATES = [
  mkCandidate("Arjun Sharma","arjun.sharma@gmail.com","9876543210","Senior React Developer","Senior",["React","TypeScript","Redux","GraphQL","Jest"],"Technical Interview",5,"Exceptional React skills. Led frontend team of 8. Strong system design. Highly recommended for senior role.",true,["Hot 🔥","Fast Mover","Top Talent"],"LinkedIn"),
  mkCandidate("Priya Patel","priya.patel@gmail.com","9876543211","Product Manager – HrTech","Mid",["Agile","OKRs","Analytics","SQL","Figma"],"HR Interview",4,"Strong analytical background. Previously at Razorpay. Excellent stakeholder management.",false,["Strong Fit"],"Referral"),
  mkCandidate("Rahul Nair","rahul.nair@gmail.com","9876543212","UX Researcher","Junior",["Figma","User Research","Prototyping","Miro"],"Applied",3,"Promising portfolio. 2 years experience at a startup. Needs assessment of research depth.",false,[],"Job Board"),
  mkCandidate("Sneha Reddy","sneha.reddy@gmail.com","9876543213","Full Stack Engineer","Senior",["Node.js","React","AWS","Docker","PostgreSQL"],"Offer",5,"Outstanding full-stack skills. Solved a complex system design question in record time. Verbal offer extended.",true,["Hot 🔥","Urgent Hire"],"GitHub"),
  mkCandidate("Karan Mehta","karan.mehta@gmail.com","9876543214","Marketing Manager","Mid",["SEO","Content","Google Analytics","HubSpot"],"Screening",3,"Decent B2B marketing experience. Need to assess brand strategy skills.",false,[],"LinkedIn"),
  mkCandidate("Divya Singh","divya.singh@gmail.com","9876543215","Senior React Developer","Lead",["React","Vue","Architecture","TypeScript","AWS"],"Hired",5,"Exceptional. Joined as Senior Engineer. Onboarding starts Jan 15.",true,["Top Talent","Joined"],"Referral"),
  mkCandidate("Amit Kumar","amit.kumar@gmail.com","9876543216","DevOps Engineer","Mid",["AWS","Kubernetes","Terraform"],"Rejected",2,"Skills gap in Kubernetes. Not ready for senior DevOps role. May revisit in 6 months.",false,["Future Potential"],"LinkedIn"),
  mkCandidate("Neha Joshi","neha.joshi@gmail.com","9876543217","Data Analyst – People Analytics","Junior",["SQL","Python","Power BI"],"Screening",4,"Strong SQL skills. Portfolio shows solid data storytelling ability.",false,["Fast Mover"],"Campus"),
  mkCandidate("Vikram Iyer","vikram.iyer@gmail.com","9876543218","Frontend Intern","Entry",["HTML","CSS","JavaScript","React"],"Technical Interview",4,"Excellent intern candidate. Built 3 real-world projects. OurFirstCode alum.",false,["OFC Alum"],"Direct Apply"),
  mkCandidate("Ananya Krishnan","ananya.k@gmail.com","9876543219","Full Stack Engineer","Mid",["Node.js","React","MongoDB","Express"],"Applied",3,"Applied via careers portal. Resume looks good. Needs initial screening call.",false,[],"Direct Apply"),
];

const mkInterview = (name, type, date, time, interviewer, notes, status) => ({
  id: genId(), candidateName: name, type, date, time, interviewer, notes, status,
  meetLink: "https://meet.google.com/ofc-" + genId().slice(0,8),
  duration: 60,
});

const SEED_INTERVIEWS = [
  mkInterview("Arjun Sharma","Technical Round","2024-12-20","10:00","Vikram Iyer, Lead Eng","Cover React architecture, system design, and TypeScript patterns. Prepare a live coding challenge.","Scheduled"),
  mkInterview("Priya Patel","Behavioral","2024-12-21","14:30","Meena Krishnan, Head of Product","PM case study: How would you prioritize features for HrOS? Leadership & conflict resolution questions.","Scheduled"),
  mkInterview("Sneha Reddy","Final Round","2024-12-22","11:00","Lakkshmi Vinayack, COO","Final culture fit and compensation discussion. Offer letter ready.","Scheduled"),
  mkInterview("Neha Joshi","Phone Screen","2024-12-19","09:30","Ranjit HR","Initial screening. Verify notice period, compensation expectations, and interest in the role.","Completed"),
  mkInterview("Vikram Iyer","Assignment Review","2024-12-23","15:00","Arjun Lead","Review take-home assignment: responsive dashboard build.","Scheduled"),
  mkInterview("Karan Mehta","Phone Screen","2024-12-18","11:00","Priya HR","Initial screening for Marketing Manager role.","Completed"),
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function useStorage(key, fallback) {
  const [state, setState] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  });
  const set = useCallback((fn) => {
    setState(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [state, set];
}

// ─── UI Components ────────────────────────────────────────────────────────────
function OFCLogo({ size = 32, showText = true, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <img src={BRAND.logo} alt="OurFirstCode" style={{ width: size, height: size, objectFit: "contain", filter: light ? "none" : "none" }}
        onError={e => { e.target.style.display = "none"; }} />
      {showText && (
        <div>
          <div style={{ fontWeight: 800, fontSize: size * 0.55, color: light ? "#fff" : BRAND.dark, letterSpacing: -0.5, lineHeight: 1 }}>
            <span style={{ color: BRAND.primary }}>Our</span>FirstCode
          </div>
          {size >= 36 && <div style={{ fontSize: 9, color: light ? "#A0AEC0" : BRAND.muted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>HrOS Platform</div>}
        </div>
      )}
    </div>
  );
}

function Badge({ color, bg, children, pill = true }) {
  return (
    <span style={{ background: bg || (color + "18"), color: color, border: `1px solid ${color}35`, borderRadius: pill ? 9999 : 6, padding: "2px 9px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 3 }}>
      {children}
    </span>
  );
}

function Avatar({ name, size = 40, color }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "??";
  const bg = color || BRAND.primary;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg + "22", border: `2px solid ${bg}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.34, color: bg, flexShrink: 0, letterSpacing: -0.5 }}>
      {initials}
    </div>
  );
}

function StarRating({ value, onChange, size = 16 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange?.(n)} onMouseEnter={() => onChange && setHover(n)} onMouseLeave={() => setHover(0)}
          style={{ cursor: onChange ? "pointer" : "default", color: n <= (hover || value) ? "#F59E0B" : "#CBD5E1", fontSize: size, lineHeight: 1, transition: "color 0.1s" }}>★</span>
      ))}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide, maxWidth }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,17,23,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: BRAND.surface, borderRadius: 20, width: "100%", maxWidth: maxWidth || (wide ? 720 : 560), maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.1)" }}>
        <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${BRAND.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "sticky", top: 0, background: BRAND.surface, zIndex: 1, borderRadius: "20px 20px 0 0" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: BRAND.text }}>{title}</h2>
            {subtitle && <p style={{ margin: "3px 0 0", fontSize: 13, color: BRAND.muted }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: BRAND.surfaceAlt, border: "none", cursor: "pointer", fontSize: 18, color: BRAND.muted, padding: "4px 8px", lineHeight: 1, borderRadius: 8, transition: "all 0.15s" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, required, error, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>{label}{required && <span style={{ color: BRAND.danger, marginLeft: 3 }}>*</span>}</label>}
      {children}
      {hint && <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: BRAND.danger, marginTop: 4 }}>⚠ {error}</div>}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 14px", border: `1.5px solid ${BRAND.border}`, borderRadius: 10, fontSize: 14, color: BRAND.text, outline: "none", boxSizing: "border-box", background: BRAND.surface, transition: "border-color 0.15s", fontFamily: "inherit" };
const selectStyle = { ...inputStyle, background: BRAND.surface, cursor: "pointer" };

function Input({ label, required, hint, error, ...props }) {
  return <FormField label={label} required={required} hint={hint} error={error}><input {...props} style={{ ...inputStyle, ...(props.style||{}) }} onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = BRAND.border} /></FormField>;
}
function Select({ label, options, required, hint, error, ...props }) {
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <select {...props} style={{ ...selectStyle, ...(props.style||{}) }} onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = BRAND.border}>
        {options.map(o => typeof o === "object" ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o}>{o}</option>)}
      </select>
    </FormField>
  );
}
function Textarea({ label, required, hint, error, ...props }) {
  return <FormField label={label} required={required} hint={hint} error={error}><textarea {...props} style={{ ...inputStyle, resize: "vertical", minHeight: 90, ...(props.style||{}) }} onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = BRAND.border} /></FormField>;
}

function Btn({ children, onClick, variant = "primary", size = "md", icon, loading, disabled, style: s = {} }) {
  const sizes = { sm: { padding: "6px 14px", fontSize: 12, borderRadius: 8 }, md: { padding: "10px 20px", fontSize: 14, borderRadius: 10 }, lg: { padding: "14px 28px", fontSize: 16, borderRadius: 12 } };
  const variants = {
    primary: { background: BRAND.primary, color: "#fff", border: "none", boxShadow: `0 4px 14px ${BRAND.primary}40` },
    secondary: { background: BRAND.surfaceAlt, color: BRAND.text, border: `1.5px solid ${BRAND.border}` },
    danger: { background: "#FFF5F5", color: BRAND.danger, border: `1.5px solid #FED7D7` },
    success: { background: "#F0FFF4", color: BRAND.success, border: `1.5px solid #C6F6D5` },
    ghost: { background: "transparent", color: BRAND.muted, border: `1.5px solid ${BRAND.border}` },
    dark: { background: BRAND.dark, color: "#fff", border: "none" },
    gradient: { background: BRAND.gradient, color: "#fff", border: "none", boxShadow: "0 4px 20px rgba(102,126,234,0.4)" },
  };
  return (
    <button onClick={disabled || loading ? undefined : onClick} disabled={disabled || loading}
      style={{ ...sizes[size], ...variants[variant], cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7, transition: "all 0.18s", opacity: disabled ? 0.6 : 1, ...s }}>
      {loading ? <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : icon}
      {children}
    </button>
  );
}

function Card({ children, style: s = {}, hover = false, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: BRAND.surface, border: `1px solid ${hov ? BRAND.primary + "50" : BRAND.border}`, borderRadius: 16, padding: "20px 22px", transition: "all 0.2s", boxShadow: hov ? `0 8px 30px rgba(74,144,226,0.12)` : "0 1px 4px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : "default", ...s }}>
      {children}
    </div>
  );
}

function KpiCard({ label, value, icon, color, delta, subtitle }) {
  return (
    <div style={{ background: BRAND.surface, border: `1px solid ${BRAND.border}`, borderRadius: 16, padding: "20px 22px", borderTop: `3px solid ${color || BRAND.primary}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: (color || BRAND.primary) + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
        {delta !== undefined && <span style={{ fontSize: 12, fontWeight: 600, color: delta >= 0 ? BRAND.success : BRAND.danger, background: (delta >= 0 ? BRAND.success : BRAND.danger) + "18", padding: "2px 8px", borderRadius: 20 }}>{delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%</span>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: BRAND.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 5, fontWeight: 500 }}>{label}</div>
      {subtitle && <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 3 }}>{subtitle}</div>}
    </div>
  );
}

function Toast({ toasts, dismiss }) {
  const colors = { success: BRAND.success, error: BRAND.danger, info: BRAND.primary, warning: BRAND.warning };
  const icons = { success: "✓", error: "✗", info: "ℹ", warning: "⚠" };
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: BRAND.darker, color: "#fff", padding: "12px 18px 12px 16px", borderRadius: 12, fontSize: 14, display: "flex", alignItems: "center", gap: 10, minWidth: 260, maxWidth: 380, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", borderLeft: `4px solid ${colors[t.type]}`, pointerEvents: "all", animation: "slideIn 0.2s ease" }}>
          <span style={{ color: colors[t.type], fontWeight: 700 }}>{icons[t.type]}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 16, padding: 0, pointerEvents: "all" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 32px", color: BRAND.muted, textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 18, opacity: 0.7 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.text, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 24, maxWidth: 360, lineHeight: 1.6 }}>{desc}</div>
      {action}
    </div>
  );
}

function SearchFilterBar({ search, onSearch, placeholder, filters, extra }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: BRAND.muted, pointerEvents: "none" }}>🔍</span>
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder || "Search..."} style={{ ...inputStyle, paddingLeft: 38, maxWidth: "100%" }} />
      </div>
      {filters}
      {extra}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "jobs", icon: "💼", label: "Jobs" },
  { id: "candidates", icon: "👥", label: "Candidates" },
  { id: "pipeline", icon: "🔀", label: "Pipeline" },
  { id: "interviews", icon: "📅", label: "Interviews" },
  { id: "analytics", icon: "📈", label: "Analytics" },
];

function Sidebar({ active, onNav, collapsed, onToggle, counts }) {
  return (
    <div style={{ background: BRAND.darker, width: collapsed ? 68 : 236, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "width 0.25s cubic-bezier(.4,0,.2,1)", flexShrink: 0, borderRight: "1px solid #1E2433" }}>
      <div style={{ padding: collapsed ? "20px 16px" : "20px 20px", borderBottom: "1px solid #1E2433", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", minHeight: 72 }}>
        {!collapsed && <OFCLogo size={36} light />}
        {collapsed && <img src={BRAND.logo} alt="OFC" style={{ width: 32, height: 32, objectFit: "contain" }} onError={e => e.target.style.display = "none"} />}
        {!collapsed && <button onClick={onToggle} style={{ background: "#1E2433", border: "none", color: "#64748B", cursor: "pointer", fontSize: 14, padding: "6px 8px", lineHeight: 1, borderRadius: 8 }}>◀</button>}
      </div>
      {collapsed && <button onClick={onToggle} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18, padding: "14px 0", textAlign: "center" }}>▶</button>}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} title={collapsed ? item.label : ""}
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: collapsed ? "11px 16px" : "11px 14px", border: "none", borderRadius: 10, background: isActive ? `${BRAND.primary}22` : "transparent", color: isActive ? BRAND.primary : "#94A3B8", cursor: "pointer", marginBottom: 3, fontSize: 14, fontWeight: isActive ? 700 : 400, textAlign: "left", transition: "all 0.18s", borderLeft: isActive ? `3px solid ${BRAND.primary}` : "3px solid transparent", fontFamily: "inherit" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {counts?.[item.id] > 0 && <span style={{ background: isActive ? BRAND.primary : "#1E2433", color: isActive ? "#fff" : "#64748B", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{counts[item.id]}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div style={{ padding: "16px 16px 20px", borderTop: "1px solid #1E2433" }}>
          <div style={{ background: `${BRAND.primary}18`, borderRadius: 12, padding: "14px 14px" }}>
            <div style={{ fontSize: 11, color: BRAND.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>OURFIRSTCODE</div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>HrOS v2.0 · MSME Registered</div>
            <div style={{ fontSize: 11, color: "#4A5568", marginTop: 4 }}>Bangalore, India</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardView({ jobs, candidates, interviews }) {
  const hired = candidates.filter(c => c.stage === "Hired").length;
  const offers = candidates.filter(c => c.stage === "Offer" || c.stage === "Hired").length;
  const acceptance = Math.round((hired / Math.max(offers, 1)) * 100);
  const scheduled = interviews.filter(i => i.status === "Scheduled").length;
  const activeJobs = jobs.filter(j => j.status === "Open").length;
  const recentCandidates = [...candidates].sort((a,b) => b.createdAt?.localeCompare(a.createdAt||"")).slice(0,6);
  const upcomingInterviews = interviews.filter(i => i.status === "Scheduled").slice(0,4);

  return (
    <div
  style={{
    padding: "32px 36px",
    width: "100%",
    maxWidth: "100%"
  }}
>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: BRAND.text, letterSpacing: -0.5 }}>Welcome back 👋</h1>
        <p style={{ color: BRAND.muted, margin: 0, fontSize: 15 }}>Here's what's happening with your recruitment pipeline today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Total Candidates" value={candidates.length} icon="👥" color={BRAND.primary} delta={12} />
        <KpiCard label="Active Openings" value={activeJobs} icon="💼" color="#6C63FF" delta={3} />
        <KpiCard label="Interviews Scheduled" value={scheduled} icon="📅" color={BRAND.warning} />
        <KpiCard label="Hired This Month" value={hired} icon="🎉" color={BRAND.success} delta={8} />
        <KpiCard label="Offer Acceptance" value={acceptance + "%"} icon="📋" color="#E91E8C" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Pipeline Snapshot */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Pipeline Overview</h3>
            <Badge color={BRAND.primary}>{candidates.length} total</Badge>
          </div>
          {STAGES.map(stage => {
            const cnt = candidates.filter(c => c.stage === stage).length;
            const pct = Math.round((cnt / Math.max(candidates.length, 1)) * 100);
            return (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 14 }}>{stageIcon(stage)}</span>
                <div style={{ width: 120, fontSize: 13, color: BRAND.text, fontWeight: 500, flexShrink: 0 }}>{stage}</div>
                <div style={{ flex: 1, height: 8, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: stageColor(stage), borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ width: 32, fontSize: 13, fontWeight: 700, color: BRAND.text, textAlign: "right" }}>{cnt}</div>
              </div>
            );
          })}
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Upcoming Interviews</h3>
            <Badge color={BRAND.warning}>{scheduled}</Badge>
          </div>
          {upcomingInterviews.length === 0
            ? <p style={{ color: BRAND.muted, fontSize: 14 }}>No upcoming interviews.</p>
            : upcomingInterviews.map(i => (
              <div key={i.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${BRAND.border}` }}>
                <div style={{ width: 40, height: 40, background: BRAND.warning + "18", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📅</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: BRAND.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.candidateName}</div>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>{i.type}</div>
                  <div style={{ fontSize: 11, color: BRAND.primary, fontWeight: 600, marginTop: 2 }}>{i.date} · {i.time}</div>
                </div>
              </div>
            ))
          }
        </Card>
      </div>

      {/* Recent Candidates */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BRAND.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Candidates</h3>
          <Badge color={BRAND.muted}>{recentCandidates.length} shown</Badge>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BRAND.surfaceAlt }}>
                {["Candidate","Position","Stage","Rating","Source","Date"].map(h => (
                  <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: BRAND.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCandidates.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${BRAND.border}`, background: i % 2 === 0 ? "#fff" : BRAND.surfaceAlt + "50" }}>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={c.name} size={34} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: BRAND.text }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: BRAND.muted }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: BRAND.text }}>{c.position}</td>
                  <td style={{ padding: "12px 18px" }}><Badge color={stageColor(c.stage)}>{stageIcon(c.stage)} {c.stage}</Badge></td>
                  <td style={{ padding: "12px 18px" }}><StarRating value={c.rating} /></td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: BRAND.muted }}>{c.source}</td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: BRAND.muted }}>{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Jobs View ────────────────────────────────────────────────────────────────
function JobForm({ initial, onSave, onClose }) {
  const empty = { title: "", department: DEPARTMENTS[0], type: EMP_TYPES[0], location: "", salaryMin: "", salaryMax: "", skills: "", description: "", status: "Open", featured: false, urgent: false, remote: false, openings: 1, expiryDate: "" };
  const [form, setForm] = useState(initial ? { ...initial, skills: (initial.skills||[]).join(", ") } : empty);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Job title is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim()) e.description = "Job description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = () => { if (validate()) onSave({ ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) }); };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Input label="Job Title" required value={form.title} onChange={e => set("title",e.target.value)} placeholder="e.g. Senior React Developer" error={errors.title} />
        </div>
        <Select label="Department" required value={form.department} onChange={e => set("department",e.target.value)} options={DEPARTMENTS} />
        <Select label="Employment Type" value={form.type} onChange={e => set("type",e.target.value)} options={EMP_TYPES} />
        <Input label="Location" required value={form.location} onChange={e => set("location",e.target.value)} placeholder="e.g. Bangalore, Remote" error={errors.location} />
        <Input label="Number of Openings" type="number" min={1} value={form.openings} onChange={e => set("openings",e.target.value)} />
        <Input label="Min Salary (₹ per year)" type="number" value={form.salaryMin} onChange={e => set("salaryMin",e.target.value)} placeholder="e.g. 1200000" />
        <Input label="Max Salary (₹ per year)" type="number" value={form.salaryMax} onChange={e => set("salaryMax",e.target.value)} placeholder="e.g. 2000000" />
        <Input label="Application Deadline" type="date" value={form.expiryDate} onChange={e => set("expiryDate",e.target.value)} />
      </div>
      <Input label="Required Skills" value={form.skills} onChange={e => set("skills",e.target.value)} placeholder="e.g. React, TypeScript, Node.js" hint="Comma-separated list of skills" />
      <Textarea label="Job Description" required value={form.description} onChange={e => set("description",e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." error={errors.description} style={{ minHeight: 120 }} />
      <Select label="Hiring Status" value={form.status} onChange={e => set("status",e.target.value)} options={[{value:"Open",label:"Open – Accepting Applications"},{value:"Closed",label:"Closed"},{value:"On Hold",label:"On Hold"}]} />
      <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
        {[["featured","⭐","Featured Job"],["urgent","🔴","Urgent Hiring"],["remote","🌐","Remote / Hybrid"]].map(([k,icon,l]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: BRAND.text, fontWeight: form[k] ? 600 : 400, background: form[k] ? BRAND.primary+"12" : "transparent", padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${form[k] ? BRAND.primary : BRAND.border}`, transition: "all 0.15s" }}>
            <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ marginRight: 0 }} />
            {icon} {l}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BRAND.border}`, paddingTop: 20 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} icon="💾">{initial ? "Update Job" : "Create Job"}</Btn>
      </div>
    </>
  );
}

function JobsView({ jobs, setJobs, toast }) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = jobs.filter(j =>
    (j.title+j.department+j.location).toLowerCase().includes(search.toLowerCase()) &&
    (dept === "All" || j.department === dept) &&
    (status === "All" || j.status === status)
  );

  const saveJob = (data) => {
    if (editing) { setJobs(js => js.map(j => j.id === editing.id ? { ...data, id: editing.id, createdAt: editing.createdAt } : j)); toast("Job updated successfully", "success"); }
    else { setJobs(js => [{ ...data, id: genId(), createdAt: new Date().toISOString().split("T")[0] }, ...js]); toast("Job created successfully", "success"); }
    setShowForm(false); setEditing(null);
  };

  const statusColor = { Open: BRAND.success, Closed: BRAND.danger, "On Hold": BRAND.warning };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5, color: BRAND.text }}>Job Openings</h1>
          <p style={{ color: BRAND.muted, margin: 0, fontSize: 14 }}>{jobs.filter(j=>j.status==="Open").length} active · {jobs.length} total positions</p>
        </div>
        <Btn onClick={() => { setEditing(null); setShowForm(true); }} icon="➕">Post New Job</Btn>
      </div>

      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search jobs, departments, locations..."
        filters={<>
          <select value={dept} onChange={e=>setDept(e.target.value)} style={{...selectStyle, width: "auto", flex: "none"}}>
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{...selectStyle, width: "auto", flex: "none"}}>
            {["All","Open","Closed","On Hold"].map(s=><option key={s} value={s}>{s==="All"?"All Status":s}</option>)}
          </select>
        </>}
      />

      {filtered.length === 0
        ? <EmptyState icon="💼" title="No jobs found" desc="Try adjusting your search or filters, or post a new job opening." action={<Btn onClick={() => { setEditing(null); setShowForm(true); }}>Post New Job</Btn>} />
        : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 18 }}>
            {filtered.map(job => (
              <Card key={job.id} style={{ padding: 22, borderTop: job.featured ? `3px solid ${BRAND.primary}` : undefined }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                      <Badge color={statusColor[job.status] || BRAND.muted}>{job.status}</Badge>
                      {job.featured && <Badge color={BRAND.primary}>⭐ Featured</Badge>}
                      {job.urgent && <Badge color={BRAND.danger}>🔴 Urgent</Badge>}
                      {job.remote && <Badge color="#06B6D4">🌐 Remote</Badge>}
                    </div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700, color: BRAND.text }}>{job.title}</h3>
                    <div style={{ fontSize: 13, color: BRAND.muted }}>{job.department} · {job.type} · {job.location}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: BRAND.primary + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>
                </div>

                {(job.salaryMin || job.salaryMax) && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.success, marginBottom: 10 }}>
                    ₹{Number(job.salaryMin||0).toLocaleString()} – ₹{Number(job.salaryMax||0).toLocaleString()} / year
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {(job.skills||[]).slice(0,5).map(s => <span key={s} style={{ background: BRAND.primaryLight, color: BRAND.primaryDark, padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{s}</span>)}
                  {(job.skills||[]).length > 5 && <span style={{ fontSize: 11, color: BRAND.muted, padding: "3px 6px" }}>+{job.skills.length-5} more</span>}
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13, color: BRAND.muted, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.description}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${BRAND.border}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>
                    {job.openings > 1 ? `${job.openings} openings` : "1 opening"} · Posted {job.createdAt}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="secondary" size="sm" onClick={() => { setEditing(job); setShowForm(true); }}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => setConfirmDel(job.id)}>Delete</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }

      {showForm && <Modal title={editing ? "Edit Job Opening" : "Post New Job"} subtitle="Fill in the details for this position" onClose={() => { setShowForm(false); setEditing(null); }} wide><JobForm initial={editing} onSave={saveJob} onClose={() => { setShowForm(false); setEditing(null); }} /></Modal>}
      {confirmDel && (
        <Modal title="Delete Job Opening?" subtitle="This action cannot be undone." onClose={() => setConfirmDel(null)}>
          <p style={{ color: BRAND.muted, fontSize: 14, marginBottom: 20 }}>All data associated with this job posting will be permanently removed.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setConfirmDel(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => { setJobs(js => js.filter(j => j.id !== confirmDel)); setConfirmDel(null); toast("Job deleted", "success"); }}>Delete Job</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Candidates View ──────────────────────────────────────────────────────────
function CandidateForm({ initial, onSave, onClose }) {
  const empty = { name: "", email: "", phone: "", position: "", experience: EXP_LEVELS[2], skills: "", stage: "Applied", rating: 3, notes: "", favorite: false, tags: "", source: SOURCE_OPTIONS[0], resumeUrl: "" };
  const [form, setForm] = useState(initial ? { ...initial, skills: (initial.skills||[]).join(", "), tags: (initial.tags||[]).join(", ") } : empty);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.position.trim()) e.position = "Position required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean), tags: form.tags.split(",").map(s=>s.trim()).filter(Boolean) });
  };
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Input label="Full Name" required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Arjun Sharma" error={errors.name} />
        <Input label="Email Address" required type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="arjun@example.com" error={errors.email} />
        <Input label="Phone Number" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="9876543210" />
        <Input label="Position Applied For" required value={form.position} onChange={e=>set("position",e.target.value)} placeholder="Senior React Developer" error={errors.position} />
        <Select label="Experience Level" value={form.experience} onChange={e=>set("experience",e.target.value)} options={EXP_LEVELS} />
        <Select label="Candidate Stage" value={form.stage} onChange={e=>set("stage",e.target.value)} options={STAGES} />
        <Select label="Source" value={form.source} onChange={e=>set("source",e.target.value)} options={SOURCE_OPTIONS} />
        <Input label="Resume / Portfolio URL" value={form.resumeUrl} onChange={e=>set("resumeUrl",e.target.value)} placeholder="https://linkedin.com/in/..." />
      </div>
      <Input label="Skills" value={form.skills} onChange={e=>set("skills",e.target.value)} placeholder="React, TypeScript, Node.js" hint="Comma-separated" />
      <Input label="Tags" value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="Hot, Fast Mover, Top Talent" hint="Comma-separated" />
      <FormField label="Rating">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StarRating value={form.rating} onChange={v=>set("rating",v)} size={24} />
          <span style={{ fontSize: 13, color: BRAND.muted }}>{["","Weak","Below Average","Average","Strong","Exceptional"][form.rating]}</span>
        </div>
      </FormField>
      <Textarea label="Notes & Observations" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Add your assessment, notes from conversations, or important observations about this candidate..." style={{ minHeight: 100 }} />
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: BRAND.text, fontWeight: 500, marginBottom: 24, background: form.favorite ? "#FFF5F7" : "transparent", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${form.favorite ? "#FC8181" : BRAND.border}`, transition: "all 0.15s" }}>
        <input type="checkbox" checked={form.favorite} onChange={e=>set("favorite",e.target.checked)} />
        ❤️ Mark as Favorite Candidate
      </label>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BRAND.border}`, paddingTop: 20 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} icon="💾">{initial ? "Update Candidate" : "Add Candidate"}</Btn>
      </div>
    </>
  );
}

function CandidateCard({ c, onEdit, onDelete, onView, onToggleFav }) {
  return (
    <Card hover style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <Avatar name={c.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: BRAND.muted }}>{c.position} · {c.experience}</div>
            </div>
            <button onClick={() => onToggleFav(c.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: c.favorite ? "#FC8181" : "#CBD5E1", padding: 0, transition: "color 0.15s", flexShrink: 0 }}>{c.favorite ? "❤️" : "🤍"}</button>
          </div>
          <div style={{ marginTop: 6 }}><Badge color={stageColor(c.stage)}>{stageIcon(c.stage)} {c.stage}</Badge></div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <StarRating value={c.rating} />
        <span style={{ fontSize: 12, color: BRAND.muted }}>{c.source}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {(c.skills||[]).slice(0,4).map(s => <span key={s} style={{ background: BRAND.primaryLight, color: BRAND.primaryDark, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{s}</span>)}
        {(c.skills||[]).length > 4 && <span style={{ fontSize: 11, color: BRAND.muted }}>+{c.skills.length-4}</span>}
      </div>

      {(c.tags||[]).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {c.tags.map(t => <span key={t} style={{ background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{t}</span>)}
        </div>
      )}

      {c.notes && <p style={{ margin: "0 0 12px", fontSize: 12, color: BRAND.muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>📝 {c.notes}</p>}

      <div style={{ display: "flex", gap: 6, borderTop: `1px solid ${BRAND.border}`, paddingTop: 12 }}>
        <Btn variant="secondary" size="sm" onClick={() => onView(c)} style={{ flex: 1, justifyContent: "center" }}>View Profile</Btn>
        <Btn variant="secondary" size="sm" onClick={() => onEdit(c)}>Edit</Btn>
        <Btn variant="danger" size="sm" onClick={() => onDelete(c.id)}>✕</Btn>
      </div>
    </Card>
  );
}

function CandidatesView({ candidates, setCandidates, toast }) {
  const [search, setSearch] = useState("");
  const [stageF, setStageF] = useState("All");
  const [expF, setExpF] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = candidates.filter(c =>
    (c.name+c.email+c.position).toLowerCase().includes(search.toLowerCase()) &&
    (stageF === "All" || c.stage === stageF) &&
    (expF === "All" || c.experience === expF) &&
    (!showFavOnly || c.favorite)
  ).sort((a,b) => sortBy === "rating" ? b.rating-a.rating : sortBy === "name" ? a.name.localeCompare(b.name) : (b.createdAt||"").localeCompare(a.createdAt||""));

  const saveCandidate = (data) => {
    if (editing) { setCandidates(cs => cs.map(c => c.id === editing.id ? { ...data, id: editing.id, createdAt: editing.createdAt, activityLog: [...(editing.activityLog||[]), { date: new Date().toISOString().split("T")[0], action: "Profile updated", by: "HR Team" }] } : c)); toast("Candidate updated", "success"); }
    else { setCandidates(cs => [{ ...data, id: genId(), createdAt: new Date().toISOString().split("T")[0], activityLog: [{ date: new Date().toISOString().split("T")[0], action: "Profile created", by: "HR Team" }] }, ...cs]); toast("Candidate added", "success"); }
    setShowForm(false); setEditing(null);
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5, color: BRAND.text }}>Candidates</h1>
          <p style={{ color: BRAND.muted, margin: 0, fontSize: 14 }}>{candidates.length} total · {candidates.filter(c=>c.favorite).length} favourites</p>
        </div>
        <Btn onClick={() => { setEditing(null); setShowForm(true); }} icon="➕">Add Candidate</Btn>
      </div>

      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search by name, email, position..."
        filters={<>
          <select value={stageF} onChange={e=>setStageF(e.target.value)} style={{...selectStyle, width:"auto",flex:"none"}}>
            <option value="All">All Stages</option>
            {STAGES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={expF} onChange={e=>setExpF(e.target.value)} style={{...selectStyle, width:"auto",flex:"none"}}>
            <option value="All">All Levels</option>
            {EXP_LEVELS.map(e=><option key={e}>{e}</option>)}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...selectStyle, width:"auto",flex:"none"}}>
            <option value="date">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A–Z</option>
          </select>
        </>}
        extra={<button onClick={() => setShowFavOnly(f=>!f)} style={{ ...inputStyle, width:"auto",flex:"none", background: showFavOnly ? "#FFF5F7" : BRAND.surface, color: showFavOnly ? "#FC8181" : BRAND.muted, border: `1.5px solid ${showFavOnly ? "#FC8181" : BRAND.border}`, cursor: "pointer", fontWeight: 600, padding: "10px 16px" }}>❤️ Favourites</button>}
      />

      {filtered.length === 0
        ? <EmptyState icon="👥" title="No candidates found" desc="Try adjusting your filters, or add a new candidate to start building your talent pipeline." action={<Btn onClick={() => { setEditing(null); setShowForm(true); }}>Add First Candidate</Btn>} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          {filtered.map(c => <CandidateCard key={c.id} c={c} onEdit={c=>{setEditing(c);setShowForm(true);}} onDelete={setConfirmDel} onView={setViewing} onToggleFav={id=>setCandidates(cs=>cs.map(c=>c.id===id?{...c,favorite:!c.favorite}:c))} />)}
        </div>
      }

      {showForm && <Modal title={editing?"Edit Candidate":"Add New Candidate"} subtitle={editing?"Update candidate information":"Fill in the candidate's details to add them to the pipeline"} onClose={()=>{setShowForm(false);setEditing(null);}} wide><CandidateForm initial={editing} onSave={saveCandidate} onClose={()=>{setShowForm(false);setEditing(null);}}/></Modal>}

      {viewing && (
        <Modal title="Candidate Profile" onClose={()=>setViewing(null)} maxWidth={640}>
          <div style={{ display: "flex", gap: 16, marginBottom: 22, alignItems: "center", background: BRAND.surfaceAlt, borderRadius: 14, padding: 20 }}>
            <Avatar name={viewing.name} size={64} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.text }}>{viewing.name} {viewing.favorite && "❤️"}</div>
              <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 8 }}>{viewing.position} · {viewing.experience} Level</div>
              <StarRating value={viewing.rating} size={18} />
            </div>
            <Badge color={stageColor(viewing.stage)}>{stageIcon(viewing.stage)} {viewing.stage}</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[["📧 Email",viewing.email],["📱 Phone",viewing.phone || "—"],["🏷 Source",viewing.source],["📅 Applied",viewing.createdAt]].map(([k,v]) => (
              <div key={k} style={{ background: BRAND.surfaceAlt, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>{v}</div>
              </div>
            ))}
          </div>
          {(viewing.skills||[]).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, marginBottom: 8 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {viewing.skills.map(s=><span key={s} style={{ background: BRAND.primaryLight, color: BRAND.primaryDark, padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{s}</span>)}
              </div>
            </div>
          )}
          {(viewing.tags||[]).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, marginBottom: 8 }}>Tags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {viewing.tags.map(t=><span key={t} style={{ background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A", padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{t}</span>)}
              </div>
            </div>
          )}
          {viewing.notes && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>📝 Notes</div>
              <div style={{ fontSize: 14, color: "#78350F", lineHeight: 1.7 }}>{viewing.notes}</div>
            </div>
          )}
          {viewing.resumeUrl && <div style={{ marginBottom: 16 }}><a href={viewing.resumeUrl} target="_blank" rel="noreferrer" style={{ color: BRAND.primary, fontSize: 14, fontWeight: 600 }}>🔗 View Resume / Portfolio →</a></div>}
          {(viewing.activityLog||[]).length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, marginBottom: 10 }}>Activity Log</div>
              {viewing.activityLog.map((log,i)=>(
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${BRAND.border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND.primary, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: BRAND.text, fontWeight: 500 }}>{log.action}</div>
                    <div style={{ fontSize: 11, color: BRAND.muted }}>{log.date} · {log.by}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Remove Candidate?" onClose={()=>setConfirmDel(null)}>
          <p style={{ color: BRAND.muted, fontSize: 14, marginBottom: 20 }}>This will permanently remove the candidate and all their data.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={()=>setConfirmDel(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={()=>{setCandidates(cs=>cs.filter(c=>c.id!==confirmDel));setConfirmDel(null);toast("Candidate removed","success");}}>Remove Candidate</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────
function PipelineView({ candidates, setCandidates, toast }) {
  const [dragging, setDragging] = useState(null);
  const [overStage, setOverStage] = useState(null);

  const moveCandidate = (id, stage) => {
    setCandidates(cs => cs.map(c => c.id === id ? { ...c, stage, activityLog: [...(c.activityLog||[]), { date: new Date().toISOString().split("T")[0], action: `Moved to ${stage}`, by: "HR Team" }] } : c));
    toast(`Moved to ${stage}`, "success");
  };

  return (
    <div style={{ padding: "32px 36px", width: "100%", overflow: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5, color: BRAND.text }}>Recruitment Pipeline</h1>
        <p style={{ color: BRAND.muted, margin: 0, fontSize: 14 }}>Drag and drop candidates between stages · {candidates.length} total candidates</p>
      </div>

      <div style={{ display: "flex", gap: 14, minWidth: "fit-content", paddingBottom: 20 }}>
        {STAGES.map(stage => {
          const sc = candidates.filter(c => c.stage === stage);
          const isOver = overStage === stage;
          return (
            <div key={stage} onDragOver={e=>{e.preventDefault();setOverStage(stage);}} onDrop={()=>{if(dragging){moveCandidate(dragging,stage);}setDragging(null);setOverStage(null);}} onDragLeave={()=>setOverStage(null)}
              style={{ width: 210, minWidth: 210, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 2px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{stageIcon(stage)}</span> {stage}
                </div>
                <div style={{ background: stageColor(stage), color: "#fff", borderRadius: 9999, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{sc.length}</div>
              </div>
              <div style={{ flex: 1, background: isOver ? BRAND.primary+"10" : BRAND.surfaceAlt, border: `2px dashed ${isOver ? BRAND.primary : BRAND.border}`, borderRadius: 14, padding: 10, minHeight: 80, transition: "all 0.18s", display: "flex", flexDirection: "column", gap: 8 }}>
                {sc.map(c => (
                  <div key={c.id} draggable onDragStart={()=>setDragging(c.id)} onDragEnd={()=>{setDragging(null);setOverStage(null);}}
                    style={{ background: dragging===c.id?"#EEF2FF":BRAND.surface, border: `1.5px solid ${dragging===c.id?BRAND.primary:BRAND.border}`, borderRadius: 12, padding: "12px 14px", cursor: "grab", transition: "all 0.15s", opacity: dragging===c.id?0.6:1, boxShadow: dragging===c.id?"0 4px 16px rgba(74,144,226,0.2)":"none" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <Avatar name={c.name} size={30} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: BRAND.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: BRAND.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.position}</div>
                      </div>
                      {c.favorite && <span style={{ fontSize: 12, flexShrink: 0 }}>❤️</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <StarRating value={c.rating} size={12} />
                      <span style={{ fontSize: 11, color: BRAND.muted }}>{c.experience}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <select value={stage} onChange={e=>{e.stopPropagation();moveCandidate(c.id,e.target.value);}} onClick={e=>e.stopPropagation()}
                        style={{ width: "100%", fontSize: 11, padding: "4px 8px", border: `1px solid ${BRAND.border}`, borderRadius: 7, background: BRAND.surface, color: BRAND.muted, cursor: "pointer", fontFamily: "inherit" }}>
                        {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {sc.length === 0 && <div style={{ textAlign: "center", padding: "24px 0", color: "#CBD5E1", fontSize: 12, fontWeight: 500 }}>Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Interviews ───────────────────────────────────────────────────────────────
function InterviewForm({ initial, candidates, onSave, onClose }) {
  const empty = { candidateName: candidates[0]?.name||"", type: INTERVIEW_TYPES[0], date: "", time: "", interviewer: "", notes: "", status: "Scheduled", meetLink: "", duration: 60 };
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const validate = () => {
    const e = {};
    if (!form.candidateName.trim()) e.candidateName = "Select a candidate";
    if (!form.date) e.date = "Date is required";
    if (!form.interviewer.trim()) e.interviewer = "Interviewer name required";
    setErrors(e); return Object.keys(e).length === 0;
  };
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <FormField label="Candidate" required error={errors.candidateName}>
          <select value={form.candidateName} onChange={e=>set("candidateName",e.target.value)} style={selectStyle}>
            {candidates.map(c=><option key={c.id} value={c.name}>{c.name} – {c.position}</option>)}
          </select>
        </FormField>
        <Select label="Interview Type" value={form.type} onChange={e=>set("type",e.target.value)} options={INTERVIEW_TYPES} />
        <Input label="Date" required type="date" value={form.date} onChange={e=>set("date",e.target.value)} error={errors.date} />
        <Input label="Time" type="time" value={form.time} onChange={e=>set("time",e.target.value)} />
        <Input label="Interviewer(s)" required value={form.interviewer} onChange={e=>set("interviewer",e.target.value)} placeholder="Vikram Iyer" error={errors.interviewer} />
        <Select label="Duration (minutes)" value={form.duration} onChange={e=>set("duration",e.target.value)} options={[{value:30,label:"30 min"},{value:45,label:"45 min"},{value:60,label:"1 hour"},{value:90,label:"90 min"},{value:120,label:"2 hours"}]} />
        <Input label="Meeting Link (optional)" value={form.meetLink} onChange={e=>set("meetLink",e.target.value)} placeholder="https://meet.google.com/..." style={{ gridColumn: "1/-1" }} />
      </div>
      <Textarea label="Notes & Agenda" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Topics to cover, preparation notes, evaluation criteria..." style={{ minHeight: 100 }} />
      <Select label="Status" value={form.status} onChange={e=>set("status",e.target.value)} options={[{value:"Scheduled",label:"Scheduled"},{value:"Completed",label:"Completed"},{value:"Cancelled",label:"Cancelled"}]} />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${BRAND.border}`, paddingTop: 20 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(validate())onSave(form);}} icon="📅">{initial?"Update Interview":"Schedule Interview"}</Btn>
      </div>
    </>
  );
}

function InterviewsView({ interviews, setInterviews, candidates, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [typeF, setTypeF] = useState("All");

  const filtered = interviews.filter(i =>
    (i.candidateName+i.interviewer+i.type).toLowerCase().includes(search.toLowerCase()) &&
    (statusF==="All"||i.status===statusF) &&
    (typeF==="All"||i.type===typeF)
  ).sort((a,b)=>a.date.localeCompare(b.date));

  const saveInterview = (data) => {
    if (editing) { setInterviews(is=>is.map(i=>i.id===editing.id?{...data,id:editing.id}:i)); toast("Interview updated","success"); }
    else { setInterviews(is=>[...is,{...data,id:genId()}]); toast("Interview scheduled","success"); }
    setShowForm(false); setEditing(null);
  };

  const statusColor = { Scheduled: BRAND.primary, Completed: BRAND.success, Cancelled: BRAND.danger };
  const statusBg = { Scheduled: BRAND.primaryLight, Completed: "#F0FFF4", Cancelled: "#FFF5F5" };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5, color: BRAND.text }}>Interviews</h1>
          <p style={{ color: BRAND.muted, margin: 0, fontSize: 14 }}>{interviews.filter(i=>i.status==="Scheduled").length} upcoming · {interviews.filter(i=>i.status==="Completed").length} completed</p>
        </div>
        <Btn onClick={()=>{setEditing(null);setShowForm(true);}} icon="📅">Schedule Interview</Btn>
      </div>

      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search by candidate, interviewer..."
        filters={<>
          <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{...selectStyle,width:"auto",flex:"none"}}>
            {["All","Scheduled","Completed","Cancelled"].map(s=><option key={s} value={s}>{s==="All"?"All Status":s}</option>)}
          </select>
          <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{...selectStyle,width:"auto",flex:"none"}}>
            <option value="All">All Types</option>
            {INTERVIEW_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </>}
      />

      {filtered.length === 0
        ? <EmptyState icon="📅" title="No interviews found" desc="Schedule an interview to start tracking your hiring conversations." action={<Btn onClick={()=>{setEditing(null);setShowForm(true);}}>Schedule Interview</Btn>} />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(i => (
              <Card key={i.id} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 6, background: statusColor[i.status] || BRAND.border, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: "18px 22px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: (statusColor[i.status]||BRAND.muted)+"18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                      {i.status==="Scheduled"?"📅":i.status==="Completed"?"✅":"❌"}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: BRAND.text, marginBottom: 3 }}>{i.candidateName}</div>
                      <div style={{ fontSize: 13, color: BRAND.muted, marginBottom: 4 }}>{i.type} · Interviewer: {i.interviewer || "TBD"} · {i.duration} min</div>
                      {i.notes && <div style={{ fontSize: 12, color: BRAND.muted, background: BRAND.surfaceAlt, padding: "6px 10px", borderRadius: 8, display: "inline-block" }}>📝 {i.notes.slice(0,100)}{i.notes.length>100?"…":""}</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>{i.date}</div>
                      <div style={{ fontSize: 13, color: BRAND.muted, marginBottom: 8 }}>{i.time || "Time TBD"}</div>
                      <Badge color={statusColor[i.status]}>{i.status}</Badge>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {i.meetLink && <Btn variant="success" size="sm" onClick={()=>window.open(i.meetLink,"_blank")}>Join →</Btn>}
                      <Btn variant="secondary" size="sm" onClick={()=>{setEditing(i);setShowForm(true);}}>Edit</Btn>
                      {i.status==="Scheduled" && <Btn variant="ghost" size="sm" onClick={()=>{setInterviews(is=>is.map(x=>x.id===i.id?{...x,status:"Cancelled"}:x));toast("Interview cancelled","info");}}>Cancel</Btn>}
                      <Btn variant="danger" size="sm" onClick={()=>{setInterviews(is=>is.filter(x=>x.id!==i.id));toast("Deleted","success");}}>✕</Btn>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }

      {showForm && <Modal title={editing?"Edit Interview":"Schedule Interview"} subtitle="Set up an interview session" onClose={()=>{setShowForm(false);setEditing(null);}} wide><InterviewForm initial={editing} candidates={candidates} onSave={saveInterview} onClose={()=>{setShowForm(false);setEditing(null);}}/></Modal>}
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function AnalyticsView({ jobs, candidates, interviews }) {
  const hired = candidates.filter(c=>c.stage==="Hired").length;
  const offers = candidates.filter(c=>c.stage==="Offer"||c.stage==="Hired").length;
  const acceptance = Math.round((hired/Math.max(offers,1))*100);
  const activeJobs = jobs.filter(j=>j.status==="Open").length;
  const scheduled = interviews.filter(i=>i.status==="Scheduled").length;
  const byStage = STAGES.map(s=>({ stage:s, count:candidates.filter(c=>c.stage===s).length }));
  const maxStage = Math.max(...byStage.map(s=>s.count),1);
  const byDept = DEPARTMENTS.map(d=>({ dept:d, count:jobs.filter(j=>j.department===d&&j.status==="Open").length })).filter(d=>d.count>0);
  const maxDept = Math.max(...byDept.map(d=>d.count),1);
  const totalSrc = candidates.length || 1;
  const sources = [
    { source:"LinkedIn", count:Math.round(candidates.filter(c=>c.source==="LinkedIn").length) },
    { source:"Referral", count:Math.round(candidates.filter(c=>c.source==="Referral").length) },
    { source:"Job Board", count:Math.round(candidates.filter(c=>c.source==="Job Board").length) },
    { source:"Direct Apply", count:Math.round(candidates.filter(c=>c.source==="Direct Apply").length) },
    { source:"Other", count:candidates.filter(c=>!["LinkedIn","Referral","Job Board","Direct Apply"].includes(c.source)).length },
  ].filter(s=>s.count>0);
  const srcColors = [BRAND.primary,"#6C63FF","#06B6D4",BRAND.success,BRAND.warning];

  const months = ["Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyHires = [2,3,4,5,4,hired||3];
  const maxHire = Math.max(...monthlyHires,1);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5, color: BRAND.text }}>HR Analytics</h1>
        <p style={{ color: BRAND.muted, margin: 0, fontSize: 14 }}>Data-driven insights to power smarter hiring decisions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Total Candidates" value={candidates.length} icon="👥" color={BRAND.primary} delta={12} />
        <KpiCard label="Active Job Openings" value={activeJobs} icon="💼" color="#6C63FF" delta={5} />
        <KpiCard label="Interviews Scheduled" value={scheduled} icon="📅" color={BRAND.warning} />
        <KpiCard label="Candidates Hired" value={hired} icon="🎉" color={BRAND.success} delta={8} />
        <KpiCard label="Offer Acceptance Rate" value={acceptance+"%"} icon="📋" color="#E91E8C" />
        <KpiCard label="Pipeline Depth" value={Math.round(candidates.length/Math.max(activeJobs,1))} icon="📊" color="#F97316" subtitle="Candidates per opening" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:700 }}>Hiring Funnel</h3>
          {byStage.map(({stage,count}) => (
            <div key={stage} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <span style={{ width:20, textAlign:"center" }}>{stageIcon(stage)}</span>
              <div style={{ width:130, fontSize:13, color:BRAND.text, fontWeight:500, flexShrink:0 }}>{stage}</div>
              <div style={{ flex:1, height:14, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(count/maxStage)*100}%`, background:stageColor(stage), borderRadius:99, transition:"width 0.6s ease" }} />
              </div>
              <div style={{ width:30, fontSize:13, fontWeight:700, color:BRAND.text, textAlign:"right" }}>{count}</div>
              <div style={{ width:36, fontSize:11, color:BRAND.muted, textAlign:"right" }}>{Math.round((count/Math.max(candidates.length,1))*100)}%</div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:700 }}>Monthly Hiring Trends</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140, marginBottom:8 }}>
            {months.map((m,i) => (
              <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ fontSize:12, fontWeight:700, color:BRAND.primary }}>{monthlyHires[i]}</div>
                <div style={{ width:"100%", background:i===5?BRAND.primary:BRAND.primaryLight, borderRadius:"6px 6px 0 0", height:`${(monthlyHires[i]/maxHire)*100}%`, minHeight:4, transition:"height 0.5s ease" }} />
                <div style={{ fontSize:11, color:BRAND.muted }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, color:BRAND.muted, textAlign:"center", marginTop:8 }}>Candidates hired per month</div>
        </Card>

        <Card>
          <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:700 }}>Department-wise Openings</h3>
          {byDept.length === 0
            ? <p style={{ color:BRAND.muted, fontSize:14 }}>No active openings by department.</p>
            : byDept.map(({dept,count}) => (
              <div key={dept} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:11 }}>
                <div style={{ width:90, fontSize:13, color:BRAND.text, fontWeight:500, flexShrink:0 }}>{dept}</div>
                <div style={{ flex:1, height:12, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(count/maxDept)*100}%`, background:"#6C63FF", borderRadius:99 }} />
                </div>
                <div style={{ width:16, fontSize:13, fontWeight:700, color:BRAND.text }}>{count}</div>
              </div>
            ))
          }
        </Card>

        <Card>
          <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:700 }}>Candidate Source Breakdown</h3>
          {sources.length === 0
            ? <p style={{ color:BRAND.muted, fontSize:14 }}>No source data yet.</p>
            : sources.map(({source,count},i) => (
              <div key={source} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:11 }}>
                <div style={{ width:90, fontSize:13, color:BRAND.text, fontWeight:500, flexShrink:0 }}>{source}</div>
                <div style={{ flex:1, height:12, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(count/totalSrc)*100}%`, background:srcColors[i%srcColors.length], borderRadius:99 }} />
                </div>
                <div style={{ width:24, fontSize:13, fontWeight:700, color:BRAND.text }}>{count}</div>
                <div style={{ width:36, fontSize:11, color:BRAND.muted }}>{Math.round((count/totalSrc)*100)}%</div>
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  const features = [
    { icon:"💼", title:"Smart Job Management", desc:"Post, track and manage job openings with full details, salary bands, skill requirements, and expiry dates. Tag urgent and remote roles." },
    { icon:"👥", title:"Candidate Profiles", desc:"Build rich talent profiles with skill tags, ratings, source tracking, activity logs, resume links, and favoriting." },
    { icon:"🔀", title:"Visual Pipeline Board", desc:"Drag-and-drop Kanban board across 7 hiring stages. See your entire funnel at a glance and move candidates instantly." },
    { icon:"📅", title:"Interview Scheduling", desc:"Schedule, track and join interviews with one click. Assign interviewers, set agendas, and manage statuses." },
    { icon:"📈", title:"People Analytics", desc:"Real-time metrics on funnel conversion, department openings, candidate sources, and monthly hiring trends." },
    { icon:"🔍", title:"Search & Filter", desc:"Find any candidate or job instantly. Filter by stage, department, experience, and sort by rating or date." },
  ];
  const stats = [["10x","Faster Hiring"],["95%","Offer Acceptance"],["500+","Candidates Tracked"],["4.9★","Platform Rating"]];
  const testimonials = [
    { name:"Ananya Iyer", role:"Head of Talent, TechCorp India", text:"HrOS completely transformed our hiring process. We reduced time-to-hire by 60% in just one quarter. The pipeline view is indispensable." },
    { name:"Rajesh Verma", role:"HR Director, GrowthStartup", text:"Finally a recruitment tool that feels like it was built by people who actually do hiring. Clean, fast, and everything is where you expect it." },
    { name:"Meena Kapoor", role:"Senior Recruiter, ScaleUp Co", text:"The analytics dashboard alone is worth it. We now make data-driven decisions on every hire. Our team loves it every day." },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: BRAND.text }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Navbar */}
      <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${BRAND.border}`, padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <OFCLogo size={40} />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>MSME Registered · Bangalore, India</span>
          <Btn onClick={onEnter} size="md">Launch HrOS →</Btn>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: BRAND.gradientDark, padding: "88px 48px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(74,144,226,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${BRAND.primary}20`, border: `1px solid ${BRAND.primary}40`, borderRadius: 9999, padding: "6px 16px", marginBottom: 28 }}>
            <img src={BRAND.logo} alt="OFC" style={{ width: 18, height: 18, objectFit: "contain" }} />
            <span style={{ fontSize: 13, color: BRAND.primary, fontWeight: 700, letterSpacing: 0.5 }}>Built by OurFirstCode · HrOS Platform</span>
          </div>
          <h1 style={{ fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 900, margin: "0 0 22px", lineHeight: 1.1, letterSpacing: -1.5, color: "#fff" }}>
            Recruit Smarter.<br /><span style={{ color: BRAND.primary }}>Hire Better.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.75 }}>
            HrOS is a full-featured recruitment management platform for modern HR teams. Track candidates, manage jobs, schedule interviews, and analyze your hiring pipeline — all in one place.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={onEnter} variant="gradient" size="lg" style={{ borderRadius: 14 }}>Enter Dashboard →</Btn>
            <Btn variant="ghost" size="lg" style={{ borderRadius: 14, color: "#94A3B8", borderColor: "#2D3748" }}>Watch Demo</Btn>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: BRAND.primary, padding: "32px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
          {stats.map(([v,l]) => <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>{v}</div><div style={{ fontSize: 13, color: "#BFDBFE", marginTop: 3, fontWeight: 500 }}>{l}</div></div>)}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "72px 48px", background: BRAND.surfaceAlt }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: BRAND.primary, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What HrOS Offers</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", letterSpacing: -0.5 }}>Everything you need to hire great people</h2>
            <p style={{ color: BRAND.muted, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>A complete recruitment workflow, from first application to final offer letter.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {features.map((f,i) => (
              <div key={f.title} style={{ background: BRAND.surface, border: `1px solid ${BRAND.border}`, borderRadius: 16, padding: "26px 22px", borderTop: `3px solid ${[BRAND.primary,"#6C63FF","#06B6D4",BRAND.success,BRAND.warning,"#E91E8C"][i%6]}` }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: BRAND.muted, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      <div style={{ padding: "72px 48px", background: BRAND.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: BRAND.primary, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Real-time Insights</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 16px", letterSpacing: -0.5 }}>Analytics that drive smarter decisions</h2>
            <p style={{ color: BRAND.muted, fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>Track your hiring funnel, understand where candidates drop off, and optimize your recruitment strategy with live data.</p>
            <Btn onClick={onEnter} size="lg">See it in action →</Btn>
          </div>
          <div style={{ background: BRAND.darker, borderRadius: 20, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              {[["42","Candidates","#4A90E2"],["8","Open Jobs","#6C63FF"],["12","Interviews","#F59E0B"],["7","Hired","#10B981"]].map(([v,l,c])=>(
                <div key={l} style={{ background: "#1E2433", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
            {[["Applied",100,"#6366F1"],["Screening",70,"#F59E0B"],["Interview",45,"#3B82F6"],["Offer",20,"#10B981"],["Hired",14,"#059669"]].map(([s,pct,c])=>(
              <div key={s} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:9 }}>
                <div style={{ width:70,fontSize:12,color:"#64748B" }}>{s}</div>
                <div style={{ flex:1,height:8,background:"#1E2433",borderRadius:99,overflow:"hidden" }}><div style={{ height:"100%",width:`${pct}%`,background:c,borderRadius:99 }} /></div>
                <div style={{ width:28,fontSize:12,fontWeight:700,color:"#94A3B8",textAlign:"right" }}>{pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "72px 48px", background: BRAND.surfaceAlt }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: BRAND.primary, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Testimonials</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Loved by HR teams across India</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: BRAND.surface, border: `1px solid ${BRAND.border}`, borderRadius: 16, padding: "26px 22px" }}>
                <div style={{ fontSize: 20, color: "#F59E0B", marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ margin: "0 0 18px", fontSize: 15, color: BRAND.text, lineHeight: 1.75 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={t.name} size={36} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: BRAND.muted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: BRAND.gradientDark, padding: "72px 48px", textAlign: "center" }}>
        <OFCLogo size={48} light />
        <h2 style={{ color: "#fff", fontSize: 38, fontWeight: 900, margin: "28px 0 14px", letterSpacing: -0.5 }}>Start hiring smarter today</h2>
        <p style={{ color: "#64748B", fontSize: 16, marginBottom: 36 }}>Join leading HR teams using HrOS to build world-class teams.</p>
        <Btn onClick={onEnter} size="lg" style={{ background: BRAND.primary, color: "#fff", borderRadius: 14, boxShadow: `0 8px 30px ${BRAND.primary}50` }}>Enter HrOS Dashboard →</Btn>
      </div>

      {/* Footer */}
      <div style={{ background: "#080B11", padding: "32px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <OFCLogo size={32} light />
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#4A5568" }}>
            <span>ourfirstcode@gmail.com</span>
            <span>+91 9177898222</span>
            <span>Bangalore, India</span>
          </div>
          <div style={{ fontSize: 12, color: "#2D3748" }}>© 2025–2026 OurFirstCode. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [section, setSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [jobs, setJobs] = useStorage("hros_jobs_v2", SEED_JOBS);
  const [candidates, setCandidates] = useStorage("hros_candidates_v2", SEED_CANDIDATES);
  const [interviews, setInterviews] = useStorage("hros_interviews_v2", SEED_INTERVIEWS);

  const toast = useCallback((message, type = "info") => {
    const id = genId();
    setToasts(ts => [...ts, { id, message, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 4000);
  }, []);

  const counts = { jobs: jobs.filter(j=>j.status==="Open").length, candidates: candidates.filter(c=>c.stage==="Applied").length, interviews: interviews.filter(i=>i.status==="Scheduled").length };

  if (page === "landing") return <LandingPage onEnter={() => setPage("app")} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", background: BRAND.surfaceAlt }}>
      <style>{`* { box-sizing:border-box; } @keyframes spin { to { transform:rotate(360deg); } } @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
      <Sidebar active={section} onNav={setSection} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c=>!c)} counts={counts} />
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div style={{ background: BRAND.surface, borderBottom: `1px solid ${BRAND.border}`, padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: BRAND.muted }}>
            <button onClick={() => setPage("landing")} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND.primary, fontWeight: 700, fontSize: 13, padding: 0, fontFamily: "inherit" }}>HrOS</button>
            <span style={{ color: BRAND.border }}>›</span>
            <span style={{ color: BRAND.text, fontWeight: 600 }}>{{dashboard:"Dashboard",jobs:"Jobs",candidates:"Candidates",pipeline:"Pipeline",interviews:"Interviews",analytics:"Analytics"}[section]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: BRAND.muted }}>OurFirstCode HrOS</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: BRAND.primary + "20", border: `2px solid ${BRAND.primary}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: BRAND.primary }}>HR</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {section === "dashboard" && <DashboardView jobs={jobs} candidates={candidates} interviews={interviews} />}
          {section === "jobs" && <JobsView jobs={jobs} setJobs={setJobs} toast={toast} />}
          {section === "candidates" && <CandidatesView candidates={candidates} setCandidates={setCandidates} toast={toast} />}
          {section === "pipeline" && <PipelineView candidates={candidates} setCandidates={setCandidates} toast={toast} />}
          {section === "interviews" && <InterviewsView interviews={interviews} setInterviews={setInterviews} candidates={candidates} toast={toast} />}
          {section === "analytics" && <AnalyticsView jobs={jobs} candidates={candidates} interviews={interviews} />}
        </div>
      </div>
      <Toast toasts={toasts} dismiss={id => setToasts(ts => ts.filter(t => t.id !== id))} />
    </div>
  );
}
