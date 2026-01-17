# Code Example

```typescript
export function nextSlide(index: number, total: number): number {
  return Math.min(index + 1, total - 1);
}
```

- Strong typing only
- No mocks in tests
- One assertion per test
