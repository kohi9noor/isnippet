# Industry-Standard TypeScript Guide

A minimal but professional approach to writing TypeScript like senior engineers do.

---

## 1. **Types First, Implementation Second**

### ❌ Bad: Type everything loosely

```typescript
function processData(data: any): any {
  return data.value;
}
```

### ✅ Good: Define types upfront

```typescript
interface DataPayload {
  value: string;
  timestamp: number;
}

function processData(data: DataPayload): string {
  return data.value;
}
```

**Why:** Types are contracts. They prevent bugs before they happen.

---

## 2. **Use Union Types Instead of Enums (Usually)**

### ❌ Bad: Over-engineered enums

```typescript
enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}
```

### ✅ Good: Simple union types

```typescript
type Status = "active" | "inactive" | "pending";
```

**Why:** Simpler, lighter, and still type-safe. Enums are only useful when you need extra logic.

---

## 3. **Response Pattern: Use Discriminated Unions**

### ❌ Bad: Manual success/error checks

```typescript
function createVault(name: string): {
  success: boolean;
  data?: string;
  error?: string;
} {
  // You have to check both data AND error
}
```

### ✅ Good: Discriminated Union

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function createVault(name: string): Result<{ vaultId: string }> {
  if (someError) return { ok: false, error: "..." };
  return { ok: true, data: { vaultId: "123" } };
}

// Usage - TypeScript forces you to handle both cases
const result = createVault("my-vault");
if (result.ok) {
  console.log(result.data.vaultId); // ✅ data is available
} else {
  console.log(result.error); // ✅ error is available
}
```

**Why:** Compiler enforces handling both cases. No silent bugs.

---

## 4. **Avoid `any` - Use `unknown` Instead**

### ❌ Bad: Using `any` everywhere

```typescript
function parse(data: any) {
  return data.nested.value; // No type checking
}
```

### ✅ Good: Use `unknown`

```typescript
function parse(data: unknown): string {
  if (typeof data !== "object" || !data) throw new Error("Invalid");
  if (!("nested" in data)) throw new Error("Missing nested");
  return String((data as Record<string, unknown>).nested);
}
```

**Why:** `any` disables TypeScript. `unknown` forces you to check types properly.

---

## 5. **One Responsibility Per File**

### ❌ Bad: Everything in one file

```typescript
// utils.ts - 500 lines
export function formatDate() { ... }
export function apiCall() { ... }
export function validateEmail() { ... }
export function parseJSON() { ... }
```

### ✅ Good: Separate files

```
utils/
  ├── date.ts        // Date formatting only
  ├── api.ts         // API calls only
  ├── validation.ts  // Email/form validation
  └── json.ts        // JSON parsing
```

**Why:** Easy to find, easy to test, easy to maintain.

---

## 6. **Generic Types for Reusable Logic**

### ❌ Bad: Duplicate code for similar operations

```typescript
function getUsers(): Promise<User[]> {
  return fetch("/users").then((r) => r.json());
}

function getPosts(): Promise<Post[]> {
  return fetch("/posts").then((r) => r.json());
}

function getComments(): Promise<Comment[]> {
  return fetch("/comments").then((r) => r.json());
}
```

### ✅ Good: Generic handler

```typescript
async function fetchList<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

// Usage - reusable everywhere
const users = await fetchList<User>("/users");
const posts = await fetchList<Post>("/posts");
```

**Why:** DRY principle. Write once, use everywhere.

---

## 7. **Const Assertions for String Literals**

### ❌ Bad: Strings can be any string

```typescript
const channels = {
  USER_CREATED: "user_created",
  USER_DELETED: "user_deleted",
};

function emit(channel: string) {} // Too loose
emit("typo_channel"); // ✅ No error, but wrong
```

### ✅ Good: Const assertion locks types

```typescript
const CHANNELS = {
  USER_CREATED: "user_created",
  USER_DELETED: "user_deleted",
} as const;

type Channel = (typeof CHANNELS)[keyof typeof CHANNELS];

function emit(channel: Channel) {}
emit("typo_channel"); // ❌ Type error - caught!
emit(CHANNELS.USER_CREATED); // ✅ Correct
```

**Why:** Prevents typos. Channel names are locked at compile time.

---

## 8. **Never Skip Error Handling**

### ❌ Bad: Ignore errors

```typescript
function readConfig() {
  const data = fs.readFileSync("config.json", "utf-8");
  return JSON.parse(data); // Can throw!
}
```

### ✅ Good: Handle errors properly

```typescript
function readConfig(): Result<Config> {
  try {
    const data = fs.readFileSync("config.json", "utf-8");
    const parsed = JSON.parse(data);
    return { ok: true, data: parsed as Config };
  } catch (error) {
    return { ok: false, error: `Config error: ${error}` };
  }
}
```

**Why:** Production crashes come from ignored errors. Always handle them.

---

## 9. **Use Type Narrowing, Not Type Assertion**

### ❌ Bad: Asserting types (dangerous)

```typescript
const value: unknown = getData();
const str = value as string; // Assuming value is string
console.log(str.toUpperCase()); // Could crash at runtime!
```

### ✅ Good: Type guard with narrowing

```typescript
const value: unknown = getData();

if (typeof value === "string") {
  console.log(value.toUpperCase()); // ✅ Safe
} else {
  console.log("Value is not a string");
}
```

**Why:** Assertions lie. Guards are honest.

---

## 10. **Organize Types in a Single File**

### ✅ Good structure

```typescript
// types/api.ts
export type Status = "active" | "inactive" | "pending";

export interface User {
  id: string;
  name: string;
  status: Status;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: number;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
```

**Why:** Single source of truth. No duplicate type definitions.

---

## 11. **Practice: Real Example**

### ❌ Before (Messy)

```typescript
// main.ts
function initVault(basePath: any, vaultName: any): any {
  try {
    const vaultPath = path.join(basePath, vaultName);
    if (!fs.existsSync(vaultPath)) {
      fs.mkdirSync(vaultPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(vaultPath, "index.json"),
      JSON.stringify({ snippets: {} })
    );
    return { success: true, data: vaultPath };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
```

### ✅ After (Professional)

```typescript
// types/vault.ts
export type VaultResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface VaultConfig {
  snippets: Record<string, unknown>;
}

// utils/vault.ts
export async function initializeVault(
  basePath: string,
  vaultName: string
): Promise<VaultResult<string>> {
  try {
    const vaultPath = path.join(basePath, vaultName);
    await ensureDir(vaultPath);

    const config: VaultConfig = { snippets: {} };
    await fs.promises.writeFile(
      path.join(vaultPath, "index.json"),
      JSON.stringify(config, null, 2)
    );

    return { ok: true, data: vaultPath };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: message };
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.promises.mkdir(dirPath, { recursive: true });
}
```

---

## 12. **Quick Checklist**

- [ ] **No `any`** - Use `unknown` or specific types
- [ ] **Discriminated Unions** - For success/error patterns
- [ ] **Union Types** - Instead of enums (usually)
- [ ] **Generic Functions** - Reuse code with `<T>`
- [ ] **Error Handling** - Every async/try block handled
- [ ] **One File, One Job** - Clear file organization
- [ ] **Constants as `const`** - String literals locked
- [ ] **Type Guards** - Check before using
- [ ] **Separate Type Files** - `types/` folder for all definitions
- [ ] **No Type Assertions** - Use type guards instead

---

## 13. **Resources**

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Discriminated Unions Pattern](https://www.typescriptlang.org/docs/handbook/unions-and-type-guards.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

**Golden Rule:** Let TypeScript work _for_ you, not against you. If you're fighting the types, rethink your approach.
