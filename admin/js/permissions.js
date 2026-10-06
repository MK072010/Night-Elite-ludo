window.MODULES=['dashboard','users','kyc','wallet','payments','withdrawals','games','referrals','agents','announcements','notifications','support','admins','settings','audit'];
window.ACTIONS=['view','create','edit','approve','reject','delete'];
/* UI HINT ONLY — never a security boundary. Server enforces via RLS / RPC checks. */
window.Permissions={can:(m,a='view')=>!!State.admin?.permissions?.[m]?.includes(a)};
