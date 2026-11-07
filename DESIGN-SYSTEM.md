# MFW WM Suite — design system

The interface system for the MobilityForWork warehouse app on SAP BTP (CAP + approuter) over SAP S/4HANA LE-WM. It serves three kinds of screen with one markup: a rugged handheld in a gloved hand under poor light, a supervisor's tablet, and a manager's or admin's desktop. It should feel native next to Fiori Horizon and still read as MobilityForWork.

## How to use this system

- Load `tokens.css`, then `components/bundle.css`, then `components/bundle.js` (a plain script; no React). It defines `window.MFW`.
- Put `class="mfw"` on `<body>` and call `MFW.autoDensity()` once at start-up. It sets `data-density` on `<html>` to `handheld`, `tablet` or `desktop`; offer a "Modo guantes" switch that stores `mfw.density = handheld`.
- Build every screen from the components below. Never set a colour, size or radius by hand: use a token or a component class.
- The UI is Spanish. Keep SAP field names (AUFNR, MATNR, LGPLA…) out of labels; they belong in code and in `title` tooltips.

## Who uses what

| Role (xs-security.json) | Device | Density | What they do |
|---|---|---|---|
| `mfw_handler` · Material Handler | Handheld scanner, tablet | handheld | Scan HU and bins, post receipts, confirm OTs, pick and load |
| `mfw_supervisor` · Supervisor | Tablet, desktop | tablet | Watch pending work, approve, re-assign |
| `mfw_manager` · Manager | Desktop | desktop | KPIs, S/4HANA integration status |
| `mfw_admin` · Admin | Desktop | desktop | Devices, warehouses, configuration |

Show the role in the shell header (`.mfw-role`): Op., Supervisor, Responsable, Admin.

## Content

- Write in Spanish, usted form, short and literal: "Escanee la HU", "Contabilizar entrada", never "¡Genial!".
- Buttons say the posting they make: **Contabilizar**, **Confirmar OT**, **Separar**, **Cargar**, **Contabilizar SM**, **Imprimir**. A toast then states what happened and the SAP document: "Entrada contabilizada: 120 PAL · Doc. material 5000004711/2026".
- Errors say what went wrong and what to do: "HU00000015 pertenece a la posición 0002. Escanee HU00000014." Never show a raw exception as the main message; put it in `.mfw-state__code` for support.
- No emoji anywhere. Icons come from `MFW.icon()`.
- Dates as dd/mm on handhelds, dd/mm/aaaa on desktop. Quantities through `MFW.fmtQty()` (es-ES, grouping always on: 1.000, 12.345,5).

## Identifiers

SAP keys are long and zero-padded. Show them shortened with `MFW.idHTML()`: leading zeros are stripped (SAP ALPHA output, `000000000001000123` → `1000123`) and the last four characters are bold, because handlers compare the tail against the label. The full value stays in `title`. HU (`HU00000014`) and bins (`A-01-02`, `GR-DOOR`, `PK-01`) are not numeric and show as they are, in the mono face.

## Colour

- Grounds: `bg` for the page, `surface` for panels and tables, `surface-sunken` for table headers and read-only fields, `surface-raised` for dialogs and toasts.
- Text: `ink` for content, `ink-muted` for labels, headers and units, `ink-subtle` only for placeholders and disabled text.
- Action: `brand` for the one primary action per screen and for the selected tab; `on-brand` on it. `brand-soft` marks the selected row.
- Identity: `signal` (safety yellow) appears only in the mark, the scan-ready field and the count on the active filter. It is never text on a light ground and never a status.
- Status: five tones, each carried by an icon and a word as well as a colour, so they survive colour blindness and a dirty screen.

| Tone | Shape | Domain values |
|---|---|---|
| Pending | hollow ring, grey | OPEN, CREATED, nothing received yet |
| Partial | dashed ring, amber | PARTIAL, PICKED, LOADED, part received |
| Complete | check, blue-green | CONFIRMED, POSTED, PGI_DONE, all received |
| Error | octagon-x, solid red fill | ERROR, rejected posting |
| Blocked | lock, purple, hatched | BESTQ Q (calidad) or S (bloqueado) |

Complete is blue-green on purpose: it never pairs with error by red/green hue alone, and error is the only solid badge, so the two also differ in weight.

## Themes

Light is the default. Dark ("Dark (low light)") is for dim aisles, cold rooms and night shifts: it keeps the same hierarchy, lightens `brand` and the status colours, and switches `on-brand` to dark ink. Follow `prefers-color-scheme` and let the user pin a theme with `data-theme` on `<html>`.

## Type

- Atkinson Hyperlegible Next for all text (Google Fonts), Atkinson Hyperlegible Mono for every identifier and quantity. Both separate 0/O and 1/l/I, which matters when a handler reads `HU00000014` at arm's length. The fallback stack starts with SAP `72` where the launchpad already loads it.
- Handheld styles: `hh-title`, `hh-body`, `hh-label`, `hh-button`, `hh-qty` (40px, for the single quantity being entered).
- Tablet and desktop: `title-l`, `title-m`, `body`, `body-strong`, `label`, `caption`.
- Data: `data` and `data-l`, monospaced so quantities align right without extra work.
- Components size their text through density variables (`--mfw-fs`, `--mfw-label-fs`, `--mfw-qty-fs`); you rarely need the type classes inside components.

## Size, spacing, shape

- Controls are `control-handheld` 64px, `control-tablet` 52px, `control-desktop` 40px. The smallest touch target on a handheld is `target-min` 56px, row actions included.
- Spacing steps of 4px: `space-4` is the minimum gutter and handheld panel padding, `space-5` tablet, `space-6` desktop.
- `radius-md` (8px) for buttons and inputs, as in Horizon; `radius-lg` for panels, dialogs and handheld rows; `radius-sm` for badges.
- `shadow-1` on panels, `shadow-2` on toasts and the handheld bottom bar, `shadow-3` on dialogs. In dark theme the lift comes mostly from `surface-raised`.

## Interaction rules for the floor

- One primary button per screen. On handhelds it spans the width and sits last in `.mfw-actions` (closest to the thumb); Cancel goes above it.
- Every field a scanner can fill is a ScanField and gets focus automatically when the step opens. Enter or Tab from the scanner commits it.
- Confirm postings that cannot be undone from the terminal with ConfirmDialog, never `window.confirm()`.
- Success: short vibration and toast. Error: long vibration, toast stays until dismissed, focus returns to the field to rescan.
- Focus ring: 3px `focus`, 2px offset, on every control in both themes.
- Respect `prefers-reduced-motion`: the scan beam, spinner and skeleton shimmer stop.

## Iconography

Lucide 0.460.0 (ISC licence), 2px stroke, rounded joins, inlined by `MFW.icon(name)` so they take `currentColor`. 28px on handhelds, 20px elsewhere, through `--mfw-icon`. The files in Assets › Icons are the same glyphs drawn in `ink` for reference. Module icons: entradas `arrow-down-to-line`, salidas `arrow-up-from-line`, inventario `boxes`, traspasos `arrow-left-right`, utilidades `printer`. Sub-flows: produccion `factory`, maquila `package`, entrega `truck`, devolucion `undo-2`, ots `clipboard-list`.

## Brand mark

MobilityForWork's own logo was not in the repository, so the shell uses a typographic tile: "MFW" in the mono face on `ink` with a `signal` hazard stripe (`.mfw-mark`). Replace it with the official logo file when one is supplied; keep the tile size (40px).

## Not covered yet

Screens and flows (the UX proposal), KPI charts for managers, and admin configuration views are out of scope for this version.

---

## Component: Button

Buttons start the posting or step their label names; one primary per screen.

**Classes:** `.mfw-btn` plus one of `--primary`, `--secondary`, `--ghost`, `--danger`. Modifiers: `--block` (full width), `--sm` (table row action, still `--mfw-target` tall), `--icon` (square, needs `aria-label`). States: `disabled`, `.is-loading` with `aria-busy="true"` and the `loading` icon.

**Use**
- `--primary` for the posting: Contabilizar, Confirmar, Imprimir, Ingresar. Label with the verb; add an icon before it (`check`, `etiqueta`).
- `--secondary` for the alternative that keeps the user in the flow: Cancelar, Ver stock en origen.
- `--ghost` for low-weight actions: Reintentar, Cerrar.
- `--danger` only for destructive SAP actions (Anular OT) and always behind ConfirmDialog.
- While the OData action runs, set `.is-loading`, swap the label to the gerund ("Contabilizando…") and block a second tap; scanners and gloves double-fire.

**Density:** heights follow `--mfw-ctl` (64 / 52 / 40px). In `.mfw-actions` on handhelds buttons stack full width with the primary at the bottom.

**In index-simple.html:** replace `.btn .btn-primary` with `.mfw-btn .mfw-btn--primary`, `.btn-secondary` with `--secondary`, `.btn-sm` with `--sm`. Row buttons produced by `table()` become `--sm --primary`.

---

## Component: ConfirmDialog

Asks before a posting that cannot be undone from the terminal, showing exactly what will be posted.

**Use:** `await MFW.confirm({ title, text, summary: [[label, value], …], confirm, cancel, danger })` resolves `true` or `false`. It uses a native `<dialog>` (focus trap and Esc for free) and focuses the confirm button.

**Rules**
- Title is the question with the document: "¿Contabilizar la entrega 0180001001?".
- Summary lists the reference documents and each line with quantity and unit, from the record being posted.
- Confirm label repeats the action ("Contabilizar entrada"), never "Sí" or "Aceptar".
- On handhelds the dialog is a bottom sheet with full-width buttons, confirm at the bottom.
- Replaces every `confirm()` call in index-simple.html (deliveries, returns, PGI).

---

## Component: DataTable

Work lists: production orders, PO items, deliveries, OT positions, stock by bin. A table on tablet and desktop, a list of cards on handhelds, from the same rows.

**Table markup:** `.mfw-table-wrap` > `table.mfw-table`. Cell classes: `.num` for every quantity (right-aligned, mono), `.uom` for the unit column right after it, `.act` for the row action, `.muted` for dates, `.wrap` for long descriptions. Selected row: `tr.is-selected`.

**Handheld markup:** `ul.mfw-list` > `li.mfw-row` with `.mfw-row__head` (description + badge), `.mfw-row__meta` (Orden, Mat., fecha) and `.mfw-row__qty` (the pending quantity in big mono + the primary action).

**Rules**
- Identifiers through `MFW.idHTML()`. Quantities through `MFW.fmtQty()`; zero renders as `<span class="mfw-zero">0</span>`.
- Lead with what the user acts on: Pendiente is bold; Total and Ingresado can drop on tablet.
- Desktop shows all columns; tablet keeps Orden, Material (with description under it), Total, Pendiente, UM, Estado, action.
- Status column uses StatusBadge; derived tone with `MFW.progressTone(GWEMG, GAMNG)`.
- Rows with nothing pending have no action button rather than a disabled one.
- Header is sticky; the wrapper scrolls horizontally, never the page.

**Data used here:** `ProductionOrders` (AUFNR, MATNR, MAKTX, GAMNG, GWEMG, MENGE_MAX, MEINS, ERDAT).

---

## Component: Icons

The icon set: 35 Lucide glyphs named by what they mean in the app.

**Use:** `MFW.icon(name, label?)` returns inline SVG that inherits `currentColor` and sizes to `--mfw-icon` (28px handheld, 20px elsewhere). Pass `label` only when the icon stands alone; otherwise it is `aria-hidden`. `MFW.icons` lists the names.

**Rules**
- One icon per meaning; do not swap glyphs between screens. Module and sub-flow names are icon names (`entradas`, `produccion`, `ots`…).
- Icons sit before the label in buttons, tabs and filters. Never use an icon instead of a word for an action on the floor.
- No emoji in the UI.

---

## Component: OrderProgress

Shows how much of an order or OT is done: received vs. total, with what is still pending.

**Markup:** `MFW.progress(done, total, uom, next)` returns `.mfw-progress[data-state]` with a track, a fill, an optional hatched `next` segment, and a text line ("600 / 1.000 PAL · Pend. 400").

**Rules**
- `done/total`: `GWEMG/GAMNG` for production orders, `VERME/GAMNG` for OT positions, items confirmed / items for a transport document.
- `next` is the quantity about to be posted (the stepper value, default `MENGE_MAX`), drawn hatched in `brand` so the handler sees where this pallet takes the order.
- Fill colour follows the tone: amber `status-partial-bar` while partial, blue-green `status-complete-bar` when complete, empty when pending. The text always repeats the numbers.
- Use it in the handheld row card, the confirm step, and as a table cell on tablet and desktop (minimum width 120px).

---

## Component: QuantityStepper

A large minus / value / plus control for the quantity being posted, sized for gloves.

**Markup:** `.mfw-stepper[data-step][data-soft-max]` > `button.mfw-stepper__btn[data-dir="-1"]` + `.mfw-stepper__value` (`input.mfw-stepper__input type=number min max` + `span.mfw-stepper__uom`) + `button[data-dir="1"]`. Follow it with `.mfw-limits` showing Pendiente and Máx. estiba. Wire with `MFW.stepper(el)`.

**Rules**
- `max` is the hard limit (pending quantity `GAMNG − GWEMG`, or `VERME` on a partial transfer). The plus button disables there.
- `data-soft-max` is `MENGE_MAX` (máx. por estiba): above it the stepper turns `warning-fg` and a warning message asks to confirm or split into two HU. It does not block.
- Prefill with `min(pendiente, MENGE_MAX)`, as the current Ingresar button does.
- `data-step` is 1 for PAL/CJ/RO and may be 10 for UN.
- The value uses `hh-qty` size on handhelds (40px mono). The UoM is always shown beside the number.

---

## Component: ScanField

The input a keyboard-wedge scanner types into: HU, ubicación, material. It shows whether it is waiting, read correctly, or read the wrong thing.

**Markup:** `.mfw-field` > label + `.mfw-scan[data-state]` > `span.mfw-scan__icon` (`MFW.icon('scan')`) + `input.mfw-scan__input` + `span.mfw-scan__state`; then `.mfw-expect` with the expected value or an error `.mfw-msg`.

**States**
- `idle`: white, grey icon, placeholder "Escanee o escriba la ubicación".
- `ready` (also any focus): `scan-bg` ground, `scan-border`, yellow `signal` icon tile and a moving beam. The step's first ScanField gets focus on open.
- `ok`: blue-green border, check and "Leído". Move focus to the next field or the primary button.
- `error`: red border and icon, "No coincide", and a message naming both values. Select the text so the next scan replaces it.

**Behaviour:** `MFW.scanField(el, { expect, onScan })`. `expect` is a value or `v => true | 'mensaje'`. Enter or Tab commits. It vibrates short on success, long on error. Set `autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done"`; on handhelds add `inputmode="none"` when the device scanner is the only input, so the soft keyboard does not cover the screen.

**Data:** OT confirmation compares the scanned HU with `LENUM` of the selected `TransferOrderItems` row and the bin with `NLPLA` (a different bin is allowed, then send it as `NLPLA`).

---

## Component: SegmentedFilter

Switches the sub-flow inside a module: Producción / Maquila / Por entrega / Devoluciones / OTs de entrada, or Documentos de transporte / OTs de salida.

**Markup:** `div.mfw-seg[role=group]` > `button.mfw-seg__item[aria-pressed]` with icon, label and `.mfw-count`.

**Rules**
- The pressed item is inverted (`ink` fill, `surface` text) and its count turns `signal` yellow: the strongest mark on the screen after the primary button, so a handler always knows which list they are in.
- The row scrolls horizontally on narrow screens; never wrap to two lines.
- Counts are pending records for that sub-flow; a zero count uses `.mfw-count--zero`.
- Replaces `.pills` / `.pill` in index-simple.html one for one.

---

## Component: ShellHeader

The app bar: mark, app name and system, connection, warehouse, user and role.

**Markup:** `header.mfw-shell` > `.mfw-mark` + `.mfw-shell__app` (name, system) + `.mfw-shell__spacer` + `.mfw-conn` + `button.mfw-ctx` (warehouse switcher) + `.mfw-user` (icon, name, `.mfw-role`).

**Rules**
- Data from `LoginService.getUserContext()`: `userName`, `LGNUM`, `warehouseDesc`. The warehouse number is mono and bold: "**100** Almacén Central".
- The warehouse switcher lists `LoginService.Warehouses`; it only appears for users allowed more than one.
- Handheld: name shortens to "WM Suite", the e-mail is hidden (role chip stays), and the warehouse button drops to its own full-width row.
- `.mfw-conn--off` ("Sin conexión") replaces the system line on handhelds when fetches fail; desktop shows "Conectado" next to the switcher.
- No gradient, no emoji. The header is `surface` with a hairline, like the Horizon shell bar.

---

## Component: States

What a list or panel shows when it is empty, loading, failed or just succeeded.

**Use:** `MFW.state(kind, title, text, actionHTML)` with kind `empty`, `loading`, `error`, `offline`, `session`, `success`. Loading lists use `.mfw-skel` lines inside a panel with `aria-busy="true"`.

**Rules**
- Empty says what is missing and when it will appear: "No hay OTs de entrada pendientes".
- Errors explain and offer the next action. Use `MFW.getJSON(url)` instead of the current `get()`: it turns the approuter's HTML login page (the "Unexpected token '<'" seen in Salidas, Inventario, Traspasos and Utilidades) into a `session` error with a "Iniciar sesión" button, and network failures into `offline` with "Reintentar". The raw message goes in `.mfw-state__code` for support, never as the title.
- Success states appear only where the list itself empties after posting (the last OT confirmed); otherwise a toast is enough.
- Replaces `showError()` and the `.empty` div in index-simple.html.

---

## Component: StatusBadge

One or two words of status with a shape icon, in one of five tones.

**Markup:** `MFW.badge(value, label?)`. `value` is a domain status (`OPEN`, `PARTIAL`, `CONFIRMED`, `CANCELLED`, `PICKED`, `LOADED`, `PGI_DONE`, `CREATED`, `POSTED`, `ERROR`, BESTQ `Q`/`S`) or a tone (`pending`, `partial`, `complete`, `error`, `blocked`). The map lives in `MFW.STATUS`; extend it there, not in screens.

**Rules**
- Always icon + word. Never a coloured dot alone.
- Error is the only solid badge; reserve it for postings that failed.
- Blocked (stock in quality or blocked) is hatched like a no-go floor marking. Show it on stock rows and in Traspasos when BESTQ is set.
- Cancelled OTs use the pending tone, struck through, with an `x` icon.
- Intermediate outbound steps (Separado, Cargado) are partial: the document is moving but not finished until PGI_DONE.

---

## Component: Tabs

Top-level navigation between the five modules: Entradas, Salidas, Inventario, Traspasos, Utilidades.

**Markup:** `div.mfw-tabs[role=tablist]` > `button.mfw-tab[role=tab][aria-selected]` with `MFW.icon(module)` + label (+ `.mfw-count` of pending items on tablet/desktop). On handhelds add `.mfw-tabs--bottom` and fix the bar to the bottom edge (pad it with `env(safe-area-inset-bottom)`).

**Rules**
- Show only modules in `getUserContext().allowedApps`.
- Counts are pending work (open OTs, open transport documents), not totals. Hide a zero count.
- The bottom bar on handhelds is 72px tall, icon over label, the active tab on `brand-soft` with a `brand` top edge.
- Switching module keeps the user's sub-filter per module (store it in memory).

---

## Component: TextField

Labelled text, number and select fields for data the handler types or reads back.

**Markup:** `.mfw-field` > `label.mfw-label` + `input.mfw-input` (+ `p.mfw-hint` or `p.mfw-msg.mfw-msg--error`). Add `.mfw-input--num` for quantities (mono, right-aligned, `inputmode="decimal"`) and `.mfw-input--code` for codes (Lote, Diferenciación). Selects go in `.mfw-select` with a `chevron-down` icon after the select.

**Rules**
- Labels are business words, not SAP names: "Orden de fabricación", not "Orden (AUFNR)".
- Required: `<span class="mfw-req">*</span>` in the label and `required` on the input.
- Read-only context (Almacén, OT, Posición) uses `readonly`, which renders on `surface-sunken` without a border. Do not use disabled for data the user must see.
- Validation messages sit under the field with the `error` icon, set `aria-invalid` and `aria-describedby`, and add `.is-invalid` on `.mfw-field`. State the limit: "Supera lo pendiente: 400 PAL."
- `.mfw-form-grid` lays fields out in columns on tablet and desktop and in one column on handhelds.
- Any field a barcode can fill is a ScanField instead.

---

## Component: Toast

A short confirmation or error after an action, carrying the SAP document it produced.

**Use:** `MFW.toastResult(result)` maps the CAP action result (`PostingResult`, `ConfirmationResult`, `TransferResult`, `PrintResult`) to a toast; `MFW.toast({ kind, title, meta })` for anything else. Kinds: success, error, warning (any message with severity W), info.

**Rules**
- Title states what happened with the quantity: "Entrada contabilizada: 120 PAL". Meta carries the references in mono: Doc. material, OT/Pos., Spool.
- Success and info close after 6 s; errors stay until closed and use `role="alert"`.
- Position: top-right on tablet and desktop; on handhelds full width above the bottom tab bar.
- Replaces the `#result` banner and its scroll-into-view in index-simple.html.

---

## Component: UomSelector

A segmented radio group for the unit of measure of a quantity: PAL, CJ, UN, RO.

**Markup:** `.mfw-uom[role=radiogroup]` > `label.mfw-uom__opt` (`input[type=radio]` + `span.mfw-uom__code` + `span.mfw-uom__name`). Mark the material's base unit (`Materials.MEINS`) with `.is-base`. Disable units with no conversion for the material.

**Rules**
- Replace the free-text "UM" inputs; a typed "pal" or "Pal" is a posting error waiting to happen.
- Preselect the document's unit (`MEINS` of the order, item or OT position).
- Names: PAL Palé, CJ Caja, UN Unidad, RO Rollo. Add new codes to this list only from `Materials.MEINS` values.
- On handhelds the options fill the width in four equal columns; elsewhere the group sizes to its content.
