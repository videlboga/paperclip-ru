import { useState } from "react";
import {
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  CircleDot,
  Command as CommandIcon,
  DollarSign,
  Hexagon,
  History,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Mail,
  Plus,
  Search,
  Settings,
  Target,
  Trash2,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusIcon } from "@/components/StatusIcon";
import { PriorityIcon } from "@/components/PriorityIcon";
import { agentStatusDot, agentStatusDotDefault } from "@/lib/status-colors";
import { EntityRow } from "@/components/EntityRow";
import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar, type FilterValue } from "@/components/FilterBar";
import { InlineEditor } from "@/components/InlineEditor";
import { PageSkeleton } from "@/components/PageSkeleton";
import { Identity } from "@/components/Identity";
import { IssueReferencePill } from "@/components/IssueReferencePill";
import { MembershipAction } from "@/components/MembershipAction";
import { useTranslation } from "@/i18n";

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <Separator />
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Color swatch                                                       */
/* ------------------------------------------------------------------ */

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-md border border-border shrink-0"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div>
        <p className="text-xs font-mono">{cssVar}</p>
        <p className="text-xs text-muted-foreground">{name}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function DesignGuide() {
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [selectValue, setSelectValue] = useState("in_progress");
  const [menuChecked, setMenuChecked] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [inlineText, setInlineText] = useState("Click to edit this text");
  const [inlineTitle, setInlineTitle] = useState("Editable Title");
  const [inlineDesc, setInlineDesc] = useState(
    "This is an editable description. Click to edit it — the textarea auto-sizes to fit the content without layout shift."
  );
  const [filters, setFilters] = useState<FilterValue[]>([
    { key: "status", label: "Status", value: "Active" },
    { key: "priority", label: "Priority", value: "High" },
  ]);

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold">{t("ppages_DesignGuide.design_guide", {defaultValue: "Design Guide"})}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Every component, style, and pattern used across Paperclip.
        </p>
      </div>

      {/* ============================================================ */}
      {/*  COVERAGE                                                     */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.component_coverage", {defaultValue: "Component Coverage"})}>
        <p className="text-sm text-muted-foreground">
          This page should be updated when new UI primitives or app-level patterns ship.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={t("ppages_DesignGuide.ui_primitives", {defaultValue: "UI primitives"})}>
            <div className="flex flex-wrap gap-2">
              {[
                "avatar", "badge", "breadcrumb", "button", "card", "checkbox", "collapsible",
                "command", "dialog", "dropdown-menu", "input", "label", "popover", "scroll-area",
                "select", "separator", "sheet", "skeleton", "tabs", "textarea", "tooltip",
              ].map((name) => (
                <Badge key={name} variant="outline" className="font-mono text-[10px]">
                  {name}
                </Badge>
              ))}
            </div>
          </SubSection>
          <SubSection title={t("ppages_DesignGuide.app_components", {defaultValue: "App components"})}>
            <div className="flex flex-wrap gap-2">
              {[
                "StatusBadge", "StatusIcon", "PriorityIcon", "EntityRow", "EmptyState", "MetricCard",
                "FilterBar", "InlineEditor", "PageSkeleton", "Identity", "CommentThread", "MarkdownEditor",
                "PropertiesPanel", "Sidebar", "CommandPalette",
              ].map((name) => (
                <Badge key={name} variant="ghost" className="font-mono text-[10px]">
                  {name}
                </Badge>
              ))}
            </div>
          </SubSection>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  COLORS                                                       */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.colors", {defaultValue: "Colors"})}>
        <SubSection title={t("ppages_DesignGuide.core", {defaultValue: "Core"})}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Background" cssVar="--background" />
            <Swatch name="Foreground" cssVar="--foreground" />
            <Swatch name="Card" cssVar="--card" />
            <Swatch name="Primary" cssVar="--primary" />
            <Swatch name="Primary foreground" cssVar="--primary-foreground" />
            <Swatch name="Secondary" cssVar="--secondary" />
            <Swatch name="Muted" cssVar="--muted" />
            <Swatch name="Muted foreground" cssVar="--muted-foreground" />
            <Swatch name="Accent" cssVar="--accent" />
            <Swatch name="Destructive" cssVar="--destructive" />
            <Swatch name="Border" cssVar="--border" />
            <Swatch name="Ring" cssVar="--ring" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.sidebar", {defaultValue: "Sidebar"})}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Sidebar" cssVar="--sidebar" />
            <Swatch name="Sidebar border" cssVar="--sidebar-border" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.chart", {defaultValue: "Chart"})}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Chart 1" cssVar="--chart-1" />
            <Swatch name="Chart 2" cssVar="--chart-2" />
            <Swatch name="Chart 3" cssVar="--chart-3" />
            <Swatch name="Chart 4" cssVar="--chart-4" />
            <Swatch name="Chart 5" cssVar="--chart-5" />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TYPOGRAPHY                                                   */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.typography", {defaultValue: "Typography"})}>
        <div className="space-y-3">
          <h2 className="text-xl font-bold">{t("ppages_DesignGuide.page_title_textxl_fontbold", {defaultValue: "Page Title — text-xl font-bold"})}</h2>
          <h2 className="text-lg font-semibold">{t("ppages_DesignGuide.section_title_textlg_fontsemibold", {defaultValue: "Section Title — text-lg font-semibold"})}</h2>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Section Heading — text-sm font-semibold uppercase tracking-wide
          </h3>
          <p className="text-sm font-medium">{t("ppages_DesignGuide.card_title_textsm_fontmedium", {defaultValue: "Card Title — text-sm font-medium"})}</p>
          <p className="text-sm font-semibold">{t("ppages_DesignGuide.card_title_alt_textsm_fontsemibold", {defaultValue: "Card Title Alt — text-sm font-semibold"})}</p>
          <p className="text-sm">{t("ppages_DesignGuide.body_text_textsm", {defaultValue: "Body text — text-sm"})}</p>
          <p className="text-sm text-muted-foreground">
            Muted description — text-sm text-muted-foreground
          </p>
          <p className="text-xs text-muted-foreground">
            Tiny label — text-xs text-muted-foreground
          </p>
          <p className="text-sm font-mono text-muted-foreground">
            Mono identifier — text-sm font-mono text-muted-foreground
          </p>
          <p className="text-2xl font-bold">{t("ppages_DesignGuide.large_stat_text2xl_fontbold", {defaultValue: "Large stat — text-2xl font-bold"})}</p>
          <p className="font-mono text-xs">{t("ppages_DesignGuide.logcode_text_fontmono_textxs", {defaultValue: "Log/code text — font-mono text-xs"})}</p>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SPACING & RADIUS                                             */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.radius", {defaultValue: "Radius"})}>
        <div className="flex items-end gap-4 flex-wrap">
          {[
            ["sm", "var(--radius-sm)"],
            ["md", "var(--radius-md)"],
            ["lg", "var(--radius-lg)"],
            ["xl", "var(--radius-xl)"],
            ["full", "9999px"],
          ].map(([label, radius]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className="h-12 w-12 bg-primary"
                style={{ borderRadius: radius }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  BUTTONS                                                      */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.buttons", {defaultValue: "Buttons"})}>
        <SubSection title={t("ppages_DesignGuide.variants", {defaultValue: "Variants"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.sizes", {defaultValue: "Sizes"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="xs">{t("ppages_DesignGuide.extra_small", {defaultValue: "Extra Small"})}</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.icon_buttons", {defaultValue: "Icon buttons"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="icon-xs"><Search /></Button>
            <Button variant="ghost" size="icon-sm"><Search /></Button>
            <Button variant="outline" size="icon"><Search /></Button>
            <Button variant="outline" size="icon-lg"><Search /></Button>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.with_icons", {defaultValue: "With icons"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button><Plus /> New Issue</Button>
            <Button variant="outline"><Upload /> Upload</Button>
            <Button variant="destructive"><Trash2 /> Delete</Button>
            <Button size="sm"><Plus /> Add</Button>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.states", {defaultValue: "States"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button disabled>{t("ppages_DesignGuide.disabled", {defaultValue: "Disabled"})}</Button>
            <Button variant="outline" disabled>{t("ppages_DesignGuide.disabled_outline", {defaultValue: "Disabled Outline"})}</Button>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  BADGES                                                       */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.badges", {defaultValue: "Badges"})}>
        <SubSection title={t("ppages_DesignGuide.variants", {defaultValue: "Variants"})}>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  STATUS BADGES & ICONS                                        */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.status_system", {defaultValue: "Status System"})}>
        <SubSection title={t("ppages_DesignGuide.statusbadge_all_statuses", {defaultValue: "StatusBadge (all statuses)"})}>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              "active", "running", "paused", "idle", "archived", "planned",
              "achieved", "completed", "failed", "timed_out", "succeeded", "error",
              "pending_approval", "backlog", "todo", "in_progress", "in_review", "blocked",
              "done", "terminated", "cancelled", "pending", "revision_requested",
              "approved", "rejected",
            ].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.statusicon_interactive", {defaultValue: "StatusIcon (interactive)"})}>
          <div className="flex items-center gap-3 flex-wrap">
            {["backlog", "todo", "in_progress", "in_review", "done", "cancelled", "blocked"].map(
              (s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <StatusIcon status={s} />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </div>
              )
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StatusIcon status={status} onChange={setStatus} />
            <span className="text-sm">Click the icon to change status (current: {status})</span>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.priorityicon_interactive", {defaultValue: "PriorityIcon (interactive)"})}>
          <div className="flex items-center gap-3 flex-wrap">
            {["critical", "high", "medium", "low"].map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <PriorityIcon priority={p} />
                <span className="text-xs text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <PriorityIcon priority={priority} onChange={setPriority} />
            <span className="text-sm">Click the icon to change (current: {priority})</span>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.agent_status_dots", {defaultValue: "Agent status dots"})}>
          <div className="flex items-center gap-4 flex-wrap">
            {(["running", "active", "paused", "error", "archived"] as const).map((label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`inline-flex h-full w-full rounded-full ${agentStatusDot[label] ?? agentStatusDotDefault}`} />
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.run_invocation_badges", {defaultValue: "Run invocation badges"})}>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ["timer", "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"],
              ["assignment", "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"],
              ["on_demand", "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"],
              ["automation", "bg-muted text-muted-foreground"],
            ].map(([label, cls]) => (
              <span key={label} className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>
                {label}
              </span>
            ))}
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.issuereferencepill", {defaultValue: "IssueReferencePill"})}>
          <p className="text-xs text-muted-foreground">
            Used wherever a task is referenced — in markdown, the Related Work tab, and activity summaries.
            Pass <code className="font-mono">status</code> to show the target issue&apos;s state at a glance.
            Use <code className="font-mono">strikethrough</code> for &quot;removed&quot; contexts.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <IssueReferencePill issue={{ id: "demo-1", identifier: "PAP-123", title: "Identifier only — no status yet" }} />
            <IssueReferencePill issue={{ id: "demo-2", identifier: "PAP-456", title: "With in_progress status", status: "in_progress" }} />
            <IssueReferencePill issue={{ id: "demo-3", identifier: "PAP-789", title: "Done status", status: "done" }} />
            <IssueReferencePill issue={{ id: "demo-4", identifier: "PAP-101", title: "Blocked status", status: "blocked" }} />
            <IssueReferencePill strikethrough issue={{ id: "demo-5", identifier: "PAP-202", title: "Removed (strikethrough)", status: "todo" }} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  FORM ELEMENTS                                                */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.form_elements", {defaultValue: "Form Elements"})}>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={t("ppages_DesignGuide.input", {defaultValue: "Input"})}>
            <Input placeholder={t("ppages_DesignGuide.default_input", {defaultValue: "Default input"})} />
            <Input placeholder={t("ppages_DesignGuide.disabled_input", {defaultValue: "Disabled input"})} disabled className="mt-2" />
          </SubSection>

          <SubSection title={t("ppages_DesignGuide.textarea", {defaultValue: "Textarea"})}>
            <Textarea placeholder={t("ppages_DesignGuide.write_something", {defaultValue: "Write something..."})} />
          </SubSection>

          <SubSection title={t("ppages_DesignGuide.checkbox_label", {defaultValue: "Checkbox & Label"})}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="check1" defaultChecked />
                <Label htmlFor="check1">{t("ppages_DesignGuide.checked_item", {defaultValue: "Checked item"})}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check2" />
                <Label htmlFor="check2">{t("ppages_DesignGuide.unchecked_item", {defaultValue: "Unchecked item"})}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check3" disabled />
                <Label htmlFor="check3">{t("ppages_DesignGuide.disabled_item", {defaultValue: "Disabled item"})}</Label>
              </div>
            </div>
          </SubSection>

          <SubSection title={t("ppages_DesignGuide.inline_editor", {defaultValue: "Inline Editor"})}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("ppages_DesignGuide.title_singleline", {defaultValue: "Title (single-line)"})}</p>
                <InlineEditor
                  value={inlineTitle}
                  onSave={setInlineTitle}
                  as="h2"
                  className="text-xl font-bold"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("ppages_DesignGuide.body_text_singleline", {defaultValue: "Body text (single-line)"})}</p>
                <InlineEditor
                  value={inlineText}
                  onSave={setInlineText}
                  as="p"
                  className="text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("ppages_DesignGuide.description_multiline_autosizing", {defaultValue: "Description (multiline, auto-sizing)"})}</p>
                <InlineEditor
                  value={inlineDesc}
                  onSave={setInlineDesc}
                  as="p"
                  className="text-sm text-muted-foreground"
                  placeholder={t("ppages_DesignGuide.add_a_description", {defaultValue: "Add a description..."})}
                  multiline
                />
              </div>
            </div>
          </SubSection>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SELECT                                                       */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.select", {defaultValue: "Select"})}>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={t("ppages_DesignGuide.default_size", {defaultValue: "Default size"})}>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("ppages_DesignGuide.select_status", {defaultValue: "Select status"})} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">{t("ppages_DesignGuide.backlog", {defaultValue: "Backlog"})}</SelectItem>
                <SelectItem value="todo">{t("ppages_DesignGuide.todo", {defaultValue: "Todo"})}</SelectItem>
                <SelectItem value="in_progress">{t("ppages_DesignGuide.in_progress", {defaultValue: "In Progress"})}</SelectItem>
                <SelectItem value="in_review">{t("ppages_DesignGuide.in_review", {defaultValue: "In Review"})}</SelectItem>
                <SelectItem value="done">{t("ppages_DesignGuide.done", {defaultValue: "Done"})}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Current value: {selectValue}</p>
          </SubSection>
          <SubSection title={t("ppages_DesignGuide.small_trigger", {defaultValue: "Small trigger"})}>
            <Select defaultValue="high">
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">{t("ppages_DesignGuide.critical", {defaultValue: "Critical"})}</SelectItem>
                <SelectItem value="high">{t("ppages_DesignGuide.high", {defaultValue: "High"})}</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">{t("ppages_DesignGuide.low", {defaultValue: "Low"})}</SelectItem>
              </SelectContent>
            </Select>
          </SubSection>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  DROPDOWN MENU                                                */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.dropdown_menu", {defaultValue: "Dropdown Menu"})}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Quick Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Check className="h-4 w-4" />
              Mark as done
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="h-4 w-4" />
              Open docs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={menuChecked}
              onCheckedChange={(value) => setMenuChecked(value === true)}
            >
              Watch issue
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* ============================================================ */}
      {/*  POPOVER                                                      */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.popover", {defaultValue: "Popover"})}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">{t("ppages_DesignGuide.open_popover", {defaultValue: "Open Popover"})}</Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-2">
            <p className="text-sm font-medium">{t("ppages_DesignGuide.agent_heartbeat", {defaultValue: "Agent heartbeat"})}</p>
            <p className="text-xs text-muted-foreground">
              Last run succeeded 24s ago. Next timer run in 9m.
            </p>
            <Button size="xs">{t("ppages_DesignGuide.wake_now", {defaultValue: "Wake now"})}</Button>
          </PopoverContent>
        </Popover>
      </Section>

      {/* ============================================================ */}
      {/*  COLLAPSIBLE                                                  */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.collapsible", {defaultValue: "Collapsible"})}>
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {collapsibleOpen ? "Hide" : "Show"} advanced filters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-md border border-border p-3">
            <div className="space-y-2">
              <Label htmlFor="owner-filter">{t("ppages_DesignGuide.owner", {defaultValue: "Owner"})}</Label>
              <Input id="owner-filter" placeholder={t("ppages_DesignGuide.filter_by_agent_name", {defaultValue: "Filter by agent name"})} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      {/* ============================================================ */}
      {/*  SHEET                                                        */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.sheet", {defaultValue: "Sheet"})}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{t("ppages_DesignGuide.open_side_panel", {defaultValue: "Open Side Panel"})}</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("ppages_DesignGuide.issue_properties", {defaultValue: "Issue Properties"})}</SheetTitle>
              <SheetDescription>{t("ppages_DesignGuide.edit_metadata_without_leaving_the_current_page", {defaultValue: "Edit metadata without leaving the current page."})}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <div className="space-y-1">
                <Label htmlFor="sheet-title">{t("ppages_DesignGuide.title", {defaultValue: "Title"})}</Label>
                <Input id="sheet-title" defaultValue="Improve onboarding docs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sheet-description">{t("ppages_DesignGuide.description", {defaultValue: "Description"})}</Label>
                <Textarea id="sheet-description" defaultValue="Capture setup pitfalls and screenshots." />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline">{t("ppages_DesignGuide.cancel", {defaultValue: "Cancel"})}</Button>
              <Button>{t("ppages_DesignGuide.save", {defaultValue: "Save"})}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>

      {/* ============================================================ */}
      {/*  SCROLL AREA                                                  */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.scroll_area", {defaultValue: "Scroll Area"})}>
        <ScrollArea className="h-36 rounded-md border border-border">
          <div className="space-y-2 p-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-md border border-border p-2 text-sm">
                Heartbeat run #{i + 1}: completed successfully
              </div>
            ))}
          </div>
        </ScrollArea>
      </Section>

      {/* ============================================================ */}
      {/*  COMMAND                                                      */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.command_cmdk", {defaultValue: "Command (CMDK)"})}>
        <div className="rounded-md border border-border">
          <Command>
            <CommandInput placeholder={t("ppages_DesignGuide.type_a_command_or_search", {defaultValue: "Type a command or search..."})} />
            <CommandList>
              <CommandEmpty>{t("ppages_DesignGuide.no_results_found", {defaultValue: "No results found."})}</CommandEmpty>
              <CommandGroup heading="Pages">
                <CommandItem>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </CommandItem>
                <CommandItem>
                  <CircleDot className="h-4 w-4" />
                  Issues
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem>
                  <CommandIcon className="h-4 w-4" />
                  Open command palette
                </CommandItem>
                <CommandItem>
                  <Plus className="h-4 w-4" />
                  Create new issue
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  BREADCRUMB                                                   */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.breadcrumb", {defaultValue: "Breadcrumb"})}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{t("ppages_DesignGuide.projects", {defaultValue: "Projects"})}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{t("ppages_DesignGuide.paperclip_app", {defaultValue: "Paperclip App"})}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ppages_DesignGuide.issue_list", {defaultValue: "Issue List"})}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      {/* ============================================================ */}
      {/*  CARDS                                                        */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.cards", {defaultValue: "Cards"})}>
        <SubSection title={t("ppages_DesignGuide.standard_card", {defaultValue: "Standard Card"})}>
          <Card>
            <CardHeader>
              <CardTitle>{t("ppages_DesignGuide.card_title", {defaultValue: "Card Title"})}</CardTitle>
              <CardDescription>{t("ppages_DesignGuide.card_description_with_supporting_text", {defaultValue: "Card description with supporting text."})}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t("ppages_DesignGuide.card_content_goes_here_this_is_the_main_body_area", {defaultValue: "Card content goes here. This is the main body area."})}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">{t("ppages_DesignGuide.action", {defaultValue: "Action"})}</Button>
              <Button variant="outline" size="sm">{t("ppages_DesignGuide.cancel", {defaultValue: "Cancel"})}</Button>
            </CardFooter>
          </Card>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.metric_cards", {defaultValue: "Metric Cards"})}>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard icon={Bot} value={12} label={t("ppages_DesignGuide.active_agents", {defaultValue: "Active Agents"})} description={t("ppages_DesignGuide.3_this_week", {defaultValue: "+3 this week"})} />
            <MetricCard icon={CircleDot} value={48} label={t("ppages_DesignGuide.open_issues", {defaultValue: "Open Issues"})} />
            <MetricCard icon={DollarSign} value="$1,234" label={t("ppages_DesignGuide.monthly_cost", {defaultValue: "Monthly Cost"})} description={t("ppages_DesignGuide.under_budget", {defaultValue: "Under budget"})} />
            <MetricCard icon={Zap} value="99.9%" label={t("ppages_DesignGuide.uptime", {defaultValue: "Uptime"})} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TABS                                                         */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.tabs", {defaultValue: "Tabs"})}>
        <SubSection title={t("ppages_DesignGuide.default_pill_variant", {defaultValue: "Default (pill) variant"})}>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{t("ppages_DesignGuide.overview", {defaultValue: "Overview"})}</TabsTrigger>
              <TabsTrigger value="runs">{t("ppages_DesignGuide.runs", {defaultValue: "Runs"})}</TabsTrigger>
              <TabsTrigger value="config">{t("ppages_DesignGuide.config", {defaultValue: "Config"})}</TabsTrigger>
              <TabsTrigger value="costs">{t("ppages_DesignGuide.costs", {defaultValue: "Costs"})}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.overview_tab_content", {defaultValue: "Overview tab content."})}</p>
            </TabsContent>
            <TabsContent value="runs">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.runs_tab_content", {defaultValue: "Runs tab content."})}</p>
            </TabsContent>
            <TabsContent value="config">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.config_tab_content", {defaultValue: "Config tab content."})}</p>
            </TabsContent>
            <TabsContent value="costs">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.costs_tab_content", {defaultValue: "Costs tab content."})}</p>
            </TabsContent>
          </Tabs>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.line_variant", {defaultValue: "Line variant"})}>
          <Tabs defaultValue="summary">
            <TabsList variant="line">
              <TabsTrigger value="summary">{t("ppages_DesignGuide.summary", {defaultValue: "Summary"})}</TabsTrigger>
              <TabsTrigger value="details">{t("ppages_DesignGuide.details", {defaultValue: "Details"})}</TabsTrigger>
              <TabsTrigger value="comments">{t("ppages_DesignGuide.comments", {defaultValue: "Comments"})}</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.summary_content_with_underline_tabs", {defaultValue: "Summary content with underline tabs."})}</p>
            </TabsContent>
            <TabsContent value="details">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.details_content", {defaultValue: "Details content."})}</p>
            </TabsContent>
            <TabsContent value="comments">
              <p className="text-sm text-muted-foreground py-4">{t("ppages_DesignGuide.comments_content", {defaultValue: "Comments content."})}</p>
            </TabsContent>
          </Tabs>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  ENTITY ROWS                                                  */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.entity_rows", {defaultValue: "Entity Rows"})}>
        <div className="border border-border rounded-md">
          <EntityRow
            leading={
              <>
                <StatusIcon status="in_progress" />
                <PriorityIcon priority="high" />
              </>
            }
            identifier="PAP-001"
            title={t("ppages_DesignGuide.implement_authentication_flow", {defaultValue: "Implement authentication flow"})}
            subtitle="Assigned to Agent Alpha"
            trailing={<StatusBadge status="in_progress" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="done" />
                <PriorityIcon priority="medium" />
              </>
            }
            identifier="PAP-002"
            title={t("ppages_DesignGuide.set_up_cicd_pipeline", {defaultValue: "Set up CI/CD pipeline"})}
            subtitle="Completed 2 days ago"
            trailing={<StatusBadge status="done" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="todo" />
                <PriorityIcon priority="low" />
              </>
            }
            identifier="PAP-003"
            title={t("ppages_DesignGuide.write_api_documentation", {defaultValue: "Write API documentation"})}
            trailing={<StatusBadge status="todo" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="blocked" />
                <PriorityIcon priority="critical" />
              </>
            }
            identifier="PAP-004"
            title={t("ppages_DesignGuide.deploy_to_production", {defaultValue: "Deploy to production"})}
            subtitle="Blocked by PAP-001"
            trailing={<StatusBadge status="blocked" />}
            selected
          />
        </div>
        <SubSection title={t("ppages_DesignGuide.membership_action", {defaultValue: "Membership action"})}>
          <div className="border border-border rounded-md">
            <EntityRow
              title={t("ppages_DesignGuide.joined_resource", {defaultValue: "Joined resource"})}
              subtitle="Hover or focus the row to reveal the reserved action slot."
              className="group"
              trailing={
                <MembershipAction
                  state="joined"
                  resourceName="Joined resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={t("ppages_DesignGuide.left_resource", {defaultValue: "Left resource"})}
              subtitle="Persistent action with dimmed row content."
              className="group text-foreground/55"
              trailing={
                <MembershipAction
                  state="left"
                  resourceName="Left resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={t("ppages_DesignGuide.leaving_resource", {defaultValue: "Leaving resource"})}
              subtitle="Disabled while the optimistic mutation is pending."
              className="group text-foreground/55"
              trailing={
                <MembershipAction
                  state="left"
                  pending
                  pendingState="left"
                  resourceName="Leaving resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={t("ppages_DesignGuide.joining_resource", {defaultValue: "Joining resource"})}
              subtitle="The target state is visible immediately while the server confirms."
              className="group"
              trailing={
                <MembershipAction
                  state="joined"
                  pending
                  pendingState="joined"
                  resourceName="Joining resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  FILTER BAR                                                   */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.filter_bar", {defaultValue: "Filter Bar"})}>
        <FilterBar
          filters={filters}
          onRemove={(key) => setFilters((f) => f.filter((x) => x.key !== key))}
          onClear={() => setFilters([])}
        />
        {filters.length === 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters([
                { key: "status", label: "Status", value: "Active" },
                { key: "priority", label: "Priority", value: "High" },
              ])
            }
          >
            Reset filters
          </Button>
        )}
      </Section>

      {/* ============================================================ */}
      {/*  AVATARS                                                      */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.avatars", {defaultValue: "Avatars"})}>
        <SubSection title={t("ppages_DesignGuide.sizes", {defaultValue: "Sizes"})}>
          <div className="flex items-center gap-3">
            <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>DF</AvatarFallback></Avatar>
            <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.group", {defaultValue: "Group"})}>
          <AvatarGroup>
            <Avatar><AvatarFallback>A1</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>A2</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>A3</AvatarFallback></Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  IDENTITY                                                     */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.identity", {defaultValue: "Identity"})}>
        <SubSection title={t("ppages_DesignGuide.sizes", {defaultValue: "Sizes"})}>
          <div className="flex items-center gap-6">
            <Identity name="Agent Alpha" size="sm" />
            <Identity name="Agent Alpha" />
            <Identity name="Agent Alpha" size="lg" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.initials_derivation", {defaultValue: "Initials derivation"})}>
          <div className="flex flex-col gap-2">
            <Identity name="CEO Agent" size="sm" />
            <Identity name="Alpha" size="sm" />
            <Identity name="Quality Assurance Lead" size="sm" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.custom_initials", {defaultValue: "Custom initials"})}>
          <Identity name="Backend Service" initials="BS" size="sm" />
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TOOLTIPS                                                     */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.tooltips", {defaultValue: "Tooltips"})}>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">{t("ppages_DesignGuide.hover_me", {defaultValue: "Hover me"})}</Button>
            </TooltipTrigger>
            <TooltipContent>{t("ppages_DesignGuide.this_is_a_tooltip", {defaultValue: "This is a tooltip"})}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm"><Settings /></Button>
            </TooltipTrigger>
            <TooltipContent>{t("ppages_DesignGuide.settings", {defaultValue: "Settings"})}</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  DIALOG                                                       */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.dialog", {defaultValue: "Dialog"})}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{t("ppages_DesignGuide.open_dialog", {defaultValue: "Open Dialog"})}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("ppages_DesignGuide.dialog_title", {defaultValue: "Dialog Title"})}</DialogTitle>
              <DialogDescription>
                This is a sample dialog showing the standard layout with header, content, and footer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>{t("ppages_DesignGuide.name", {defaultValue: "Name"})}</Label>
                <Input placeholder={t("ppages_DesignGuide.enter_a_name", {defaultValue: "Enter a name"})} className="mt-1.5" />
              </div>
              <div>
                <Label>{t("ppages_DesignGuide.description", {defaultValue: "Description"})}</Label>
                <Textarea placeholder={t("ppages_DesignGuide.describe", {defaultValue: "Describe..."})} className="mt-1.5" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">{t("ppages_DesignGuide.cancel", {defaultValue: "Cancel"})}</Button>
              <Button>{t("ppages_DesignGuide.save", {defaultValue: "Save"})}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      {/* ============================================================ */}
      {/*  EMPTY STATE                                                  */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.empty_state", {defaultValue: "Empty State"})}>
        <div className="border border-border rounded-md">
          <EmptyState
            icon={Inbox}
            message="No items to show. Create your first one to get started."
            action="Create Item"
            onAction={() => {}}
          />
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  PROGRESS BARS                                                */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.progress_bars_budget", {defaultValue: "Progress Bars (Budget)"})}>
        <div className="space-y-3">
          {[
            { label: "Under budget (40%)", pct: 40, color: "bg-green-400" },
            { label: "Warning (75%)", pct: 75, color: "bg-yellow-400" },
            { label: "Over budget (95%)", pct: 95, color: "bg-red-400" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-mono">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width,background-color] duration-150 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  LOG VIEWER                                                   */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.log_viewer", {defaultValue: "Log Viewer"})}>
        <div className="bg-neutral-950 rounded-lg p-3 font-mono text-xs max-h-80 overflow-y-auto">
          <div className="text-foreground">[12:00:01] INFO  Agent started successfully</div>
          <div className="text-foreground">[12:00:02] INFO  Processing task PAP-001</div>
          <div className="text-yellow-400">[12:00:05] WARN  Rate limit approaching (80%)</div>
          <div className="text-foreground">[12:00:08] INFO  Task PAP-001 completed</div>
          <div className="text-red-400">[12:00:12] ERROR Connection timeout to upstream service</div>
          <div className="text-blue-300">[12:00:12] SYS   Retrying connection in 5s...</div>
          <div className="text-foreground">[12:00:17] INFO  Reconnected successfully</div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-pulse" />
              <span className="inline-flex h-full w-full rounded-full bg-cyan-400" />
            </span>
            <span className="text-cyan-400">{t("ppages_DesignGuide.live", {defaultValue: "Live"})}</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  PROPERTY ROW PATTERN                                         */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.property_row_pattern", {defaultValue: "Property Row Pattern"})}>
        <div className="border border-border rounded-md p-4 space-y-1 max-w-sm">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.status", {defaultValue: "Status"})}</span>
            <StatusBadge status="active" />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.priority", {defaultValue: "Priority"})}</span>
            <PriorityIcon priority="high" />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.assignee", {defaultValue: "Assignee"})}</span>
            <div className="flex items-center gap-1.5">
              <Avatar size="sm"><AvatarFallback>A</AvatarFallback></Avatar>
              <span className="text-xs">{t("ppages_DesignGuide.agent_alpha", {defaultValue: "Agent Alpha"})}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.created", {defaultValue: "Created"})}</span>
            <span className="text-xs">{t("ppages_DesignGuide.jan_15_2025", {defaultValue: "Jan 15, 2025"})}</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  NAVIGATION PATTERNS                                          */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.navigation_patterns", {defaultValue: "Navigation Patterns"})}>
        <SubSection title={t("ppages_DesignGuide.sidebar_nav_items", {defaultValue: "Sidebar nav items"})}>
          <div className="w-60 border border-border rounded-md p-3 space-y-0.5 bg-card">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <CircleDot className="h-4 w-4" />
              Issues
              <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                12
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <Bot className="h-4 w-4" />
              Agents
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <Hexagon className="h-4 w-4" />
              Projects
            </div>
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.view_toggle", {defaultValue: "View toggle"})}>
          <div className="flex items-center border border-border rounded-md w-fit">
            <button className="px-3 py-1.5 text-xs font-medium bg-accent text-foreground rounded-l-md">
              <ListTodo className="h-3.5 w-3.5 inline mr-1" />
              List
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/50 rounded-r-md">
              <Target className="h-3.5 w-3.5 inline mr-1" />
              Org
            </button>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  GROUPED LIST (Issues pattern)                                */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.grouped_list_issues_pattern", {defaultValue: "Grouped List (Issues pattern)"})}>
        <div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-t-md">
            <StatusIcon status="in_progress" />
            <span className="text-sm font-medium">{t("ppages_DesignGuide.in_progress", {defaultValue: "In Progress"})}</span>
            <span className="text-xs text-muted-foreground ml-1">2</span>
          </div>
          <div className="border border-border rounded-b-md">
            <EntityRow
              leading={<PriorityIcon priority="high" />}
              identifier="PAP-101"
              title={t("ppages_DesignGuide.build_agent_heartbeat_system", {defaultValue: "Build agent heartbeat system"})}
              onClick={() => {}}
            />
            <EntityRow
              leading={<PriorityIcon priority="medium" />}
              identifier="PAP-102"
              title={t("ppages_DesignGuide.add_cost_tracking_dashboard", {defaultValue: "Add cost tracking dashboard"})}
              onClick={() => {}}
            />
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  COMMENT THREAD PATTERN                                       */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.comment_thread_pattern", {defaultValue: "Comment Thread Pattern"})}>
        <div className="space-y-3 max-w-2xl">
          <h3 className="text-sm font-semibold">{t("ppages_DesignGuide.comments_2", {defaultValue: "Comments (2)"})}</h3>
          <div className="space-y-3">
            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{t("ppages_DesignGuide.agent", {defaultValue: "Agent"})}</span>
                <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.jan_15_2025", {defaultValue: "Jan 15, 2025"})}</span>
              </div>
              <p className="text-sm">{t("ppages_DesignGuide.started_working_on_the_authentication_module_will", {defaultValue: "Started working on the authentication module. Will need API keys configured."})}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{t("ppages_DesignGuide.human", {defaultValue: "Human"})}</span>
                <span className="text-xs text-muted-foreground">{t("ppages_DesignGuide.jan_16_2025", {defaultValue: "Jan 16, 2025"})}</span>
              </div>
              <p className="text-sm">{t("ppages_DesignGuide.api_keys_have_been_added_to_the_vault_please_proce", {defaultValue: "API keys have been added to the vault. Please proceed."})}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Textarea placeholder={t("ppages_DesignGuide.leave_a_comment", {defaultValue: "Leave a comment..."})} rows={3} />
            <Button size="sm">{t("ppages_DesignGuide.comment", {defaultValue: "Comment"})}</Button>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  COST TABLE PATTERN                                           */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.cost_table_pattern", {defaultValue: "Cost Table Pattern"})}>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-accent/20">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t("ppages_DesignGuide.model", {defaultValue: "Model"})}</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t("ppages_DesignGuide.tokens", {defaultValue: "Tokens"})}</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t("ppages_DesignGuide.cost", {defaultValue: "Cost"})}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2">claude-sonnet-4-20250514</td>
                <td className="px-3 py-2 font-mono">1.2M</td>
                <td className="px-3 py-2 font-mono">$18.00</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2">claude-haiku-4-20250506</td>
                <td className="px-3 py-2 font-mono">500k</td>
                <td className="px-3 py-2 font-mono">$1.25</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">{t("ppages_DesignGuide.total", {defaultValue: "Total"})}</td>
                <td className="px-3 py-2 font-mono">1.7M</td>
                <td className="px-3 py-2 font-mono font-medium">$19.25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SKELETONS                                                    */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.skeletons", {defaultValue: "Skeletons"})}>
        <SubSection title={t("ppages_DesignGuide.individual", {defaultValue: "Individual"})}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full max-w-sm" />
            <Skeleton className="h-20 w-full" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.page_skeleton_list", {defaultValue: "Page Skeleton (list)"})}>
          <div className="border border-border rounded-md p-4">
            <PageSkeleton variant="list" />
          </div>
        </SubSection>

        <SubSection title={t("ppages_DesignGuide.page_skeleton_detail", {defaultValue: "Page Skeleton (detail)"})}>
          <div className="border border-border rounded-md p-4">
            <PageSkeleton variant="detail" />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  SEPARATOR                                                    */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.separator", {defaultValue: "Separator"})}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("ppages_DesignGuide.horizontal", {defaultValue: "Horizontal"})}</p>
          <Separator />
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  ICON REFERENCE                                               */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.common_icons_lucide", {defaultValue: "Common Icons (Lucide)"})}>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {[
            ["Inbox", Inbox],
            ["ListTodo", ListTodo],
            ["CircleDot", CircleDot],
            ["Hexagon", Hexagon],
            ["Target", Target],
            ["LayoutDashboard", LayoutDashboard],
            ["Bot", Bot],
            ["DollarSign", DollarSign],
            ["History", History],
            ["Search", Search],
            ["Plus", Plus],
            ["Trash2", Trash2],
            ["Settings", Settings],
            ["User", User],
            ["Mail", Mail],
            ["Upload", Upload],
            ["Zap", Zap],
          ].map(([name, Icon]) => {
            const LucideIcon = Icon as React.FC<{ className?: string }>;
            return (
              <div key={name as string} className="flex flex-col items-center gap-1.5 p-2">
                <LucideIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">{name as string}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  KEYBOARD SHORTCUTS                                           */}
      {/* ============================================================ */}
      <Section title={t("ppages_DesignGuide.keyboard_shortcuts", {defaultValue: "Keyboard Shortcuts"})}>
        <div className="border border-border rounded-md divide-y divide-border text-sm">
          {[
            ["Cmd+K / Ctrl+K", "Open Command Palette"],
            ["C", "New Issue (outside inputs)"],
            ["[", "Toggle Sidebar"],
            ["]", "Toggle Properties Panel"],

            ["Cmd+Enter / Ctrl+Enter", "Submit markdown comment"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between px-4 py-2">
              <span className="text-muted-foreground">{desc}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border border-border">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
