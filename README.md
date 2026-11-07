# MFW Warehouse Management Suite - CAP Application

**Version**: 1.0.0
**Domain model**: aligned with the reference project `MFW_WM_Suite 1/cap` (SAP LE-WM, replaces the Movilizer Movelets)

---

## Project Structure

```
mfw-wm-suite/
├── db/
│   ├── data-model.cds          # namespace mfw.wm — Warehouses, Bins, Materials, StockItems (LQUA),
│   │                           # TransferOrders/Items (LTAK/LTAP), Production/Purchase orders,
│   │                           # Inbound/Return deliveries, OutboundDocuments, BinTransfers, PrintDevices
│   └── data/*.csv              # Mock data, loaded on deploy (dev) / every start (production)
├── srv/
│   ├── common-types.cds        # PostingResult, ConfirmationResult, TransferResult, PrintResult
│   ├── entradas-service.*      # /odata/v4/entradas    — goods receipt
│   ├── salidas-service.*       # /odata/v4/salidas     — picking, loading, goods issue
│   ├── inventario-service.cds  # /odata/v4/inventario  — stock by bin (LX03), read-only
│   ├── traspasos-service.*     # /odata/v4/traspasos   — bin-to-bin transfers
│   ├── utilidades-service.*    # /odata/v4/utilidades  — label printing
│   ├── login-service.*         # /odata/v4/login       — user/warehouse context
│   └── server.js               # Serves app/index-simple.html at "/"
├── app/index-simple.html       # Web UI (5 tabs)
├── approuter/                  # SAP approuter (XSUAA login) for BTP
├── mta.yaml                    # BTP Cloud Foundry deployment descriptor
└── xs-security.json            # XSUAA scopes, role templates, role collections
```

Every point where the real SAP posting must happen is marked `// >>> INTEGRACIÓN SAP:` in `srv/*.js`;
today those handlers validate and simulate the result.

---

## Services

| Service | Entities | Actions |
|---------|----------|---------|
| **Entradas** | ProductionOrders, PurchaseOrders, InboundDeliveries, ReturnDeliveries, PendingInboundTransferOrders | postProductionGoodsReceipt, postPurchaseOrderGoodsReceipt, postDeliveryGoodsReceipt, postReturnGoodsReceipt, confirmInboundTransferOrder |
| **Salidas** | OutboundDocuments, PendingOutboundTransferOrders | confirmPicking/LoadingByTransportDoc, confirmPicking/LoadingByDelivery, postGoodsIssue, confirmOutboundTransferOrder |
| **Inventario** | StockByBin (filter with `$filter=LGNUM eq '100' and LGPLA eq 'A-01-01'`) | — |
| **Traspasos** | BinStock, BinTransferRequests | createFullBinTransfer, createPartialBinTransfer |
| **Utilidades** | PrintDevices | printLabel |
| **Login** | Warehouses | getUserContext() |

Outbound document lifecycle: `OPEN → (Separar) PICKED → (Cargar) LOADED → (Contabilizar SM) PGI_DONE`.

---

## Run locally

```bash
npm install
npm run deploy:local   # (re)creates db.sqlite from db/data/*.csv — use it to reset mock data
npm run watch          # http://localhost:4004
```

Locally, authentication is disabled (`dummy` auth in the development profile).

---

## Build & deploy to SAP BTP (space: mfw)

```bash
npm run build:mta      # → mta_archives/mfw-wm-suite_1.0.0.mtar
```

Deploy (requires the CF CLI with the MultiApps plugin):

```bash
cf login -a https://api.cf.<region>.hana.ondemand.com
cf target -o <ORG> -s mfw
cf deploy mta_archives/mfw-wm-suite_1.0.0.mtar
```

Or upload the `.mtar` in the BTP cockpit: space **mfw** → *Applications* → *Deploy MTA archive*.

After deployment:
- Open the **mfw-wm-approuter** app route (not the srv route) — it handles the login.
- Role collections are created by the deployment (`MFW Warehouse Admin`, `... Manager`, `... Supervisor`, `MFW Material Handler`); assign them to users in the subaccount.

**Production profile** (`package.json`): XSUAA auth; in-memory SQLite re-seeded from `db/data/*.csv` on every start —
fine for a PoC, but changes are lost on restart. For persistence, add an SAP HANA Cloud HDI container.

Services provisioned: `mfw-xsuaa` (xsuaa/application), `mfw-destinations` (destination/lite),
`mfw-logging` (application-logs/lite).
