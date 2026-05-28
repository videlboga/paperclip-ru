# Тарифная система в Paperclip

## Summary

This PR documents the current state of the tariff system in Paperclip.

## Findings

### Existing: Budget System
- File: `server/src/services/budgets.ts`, `server/src/services/costs.ts`
- Works with `metric === "billed_cents"` (expenditure in cents)
- Supports `warnPercent`, `hardStopEnabled`, `amount`
- Pauses agents/companies when budget exceeded

### Missing: Tariff Plans
- No free/premium/pro tiers
- No limits on requests/tokens/features
- No user → tariff mapping

## Problem (VIDA-7)

User 648981358 has "free tariff" but **not limited**:
- Unlimited requests
- Unlimited tokens  
- No checks at run creation

## Resolution

**No code change required** — tariff system is not yet implemented.

### Recommendation

1. **Immediate**: Check if HERMES/Droid adapter has tariff logic
2. **If not**: Implement separate tariff system (schema + API + enforcement)
3. **Integration**: Add tariff checks to `agentService.createInvocation()`

### Possible approaches

**Option A**: Extend `budgetPolicies` with new `metric` types:
- `request_count`, `input_tokens`, `output_tokens`

**Option B**: Separate tariff tables:
- `tariffPlans`, `userTariffs`, `tariffUsage`, `tariffEnforcement`

## Files

- `TARIFF_SYSTEM.md` — full documentation
- Issue: VIDA-7

## Testing

```bash
# Check budget system exists
grep -r "evaluateCostEvent" server/src/services/budgets.ts

# Check tariff system doesn't exist
grep -ri "tariff" server/src/services/*.ts | grep -v test || echo "No tariff code found"
```

---

Related: VIDA-7 "Проверить ограничения тарифных планов"
