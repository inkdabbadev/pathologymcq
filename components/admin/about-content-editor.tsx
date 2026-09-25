"use client";

import * as React from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";
const label = "text-sm font-medium text-plum-900";

/** Edits the About page copy (hero, contact block, services list). Shown to admins only. */
export function AboutContentEditor() {
  const initial = useSiteSettings();
  const update = useUpdateSiteSettings();
  const [heading, setHeading] = React.useState(initial.aboutHeading);
  const [intro, setIntro] = React.useState(initial.aboutIntro);
  const [teamHeading, setTeamHeading] = React.useState(initial.aboutTeamHeading);
  const [address, setAddress] = React.useState(initial.aboutAddress);
  const [phone, setPhone] = React.useState(initial.aboutPhone);
  const [email, setEmail] = React.useState(initial.aboutEmail);
  const [servicesHeading, setServicesHeading] = React.useState(initial.aboutServicesHeading);
  const [services, setServices] = React.useState(initial.aboutServices);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  // Re-sync once when the persisted settings arrive (identity changes from defaults to the fetched doc).
  const [synced, setSynced] = React.useState(initial);
  if (synced !== initial) {
    setSynced(initial);
    setHeading(initial.aboutHeading);
    setIntro(initial.aboutIntro);
    setTeamHeading(initial.aboutTeamHeading);
    setAddress(initial.aboutAddress);
    setPhone(initial.aboutPhone);
    setEmail(initial.aboutEmail);
    setServicesHeading(initial.aboutServicesHeading);
    setServices(initial.aboutServices);
  }

  async function save() {
    await update.mutateAsync({
      aboutHeading: heading,
      aboutIntro: intro,
      aboutTeamHeading: teamHeading,
      aboutAddress: address,
      aboutPhone: phone,
      aboutEmail: email,
      aboutServicesHeading: servicesHeading,
      aboutServices: services.filter((s) => s.label.trim()),
    });
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="mx-auto max-w-3xl rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-plum-900">Edit About page content</h2>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-smoke-400">Saved {savedAt}</span>}
          <Button size="sm" disabled={update.isPending} onClick={save}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <label className={label}>Heading</label>
          <input value={heading} onChange={(e) => setHeading(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Intro (blank line between paragraphs)</label>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={8} className={field} />
        </div>
        <div>
          <label className={label}>Faculty section heading</label>
          <input value={teamHeading} onChange={(e) => setTeamHeading(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Address (one line per row)</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </div>
        </div>
        <div>
          <label className={label}>Services heading</label>
          <input value={servicesHeading} onChange={(e) => setServicesHeading(e.target.value)} className={field} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className={label}>Services list</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setServices((a) => [...a, { label: "", href: "/" }])}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {services.map((svc, i) => (
              <div key={i} className="flex items-start gap-2 rounded-panel border border-iris-300/40 bg-white p-3">
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <input
                    value={svc.label}
                    onChange={(e) =>
                      setServices((a) => a.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                    }
                    placeholder="Label"
                    className={field}
                  />
                  <input
                    value={svc.href}
                    onChange={(e) =>
                      setServices((a) => a.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))
                    }
                    placeholder="/path or https://..."
                    className={field}
                  />
                </div>
                <button
                  onClick={() => setServices((a) => a.filter((_, j) => j !== i))}
                  className="mt-1 rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
