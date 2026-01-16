# TODO

## Technical Debt

### Fix switch_mx.js stabilizer nets parameter bug

**Issue:** The `switch_mx.js` footprint has a bug where it checks the wrong parameter for enabling stabilizer nets.

**Location:** `footprints/ceoloide/switch_mx.js:196, :203`

**Problem:**
- Lines 196 and 203 check `p.include_centerhole_net` to determine if stabilizer nets should be applied
- Should instead check `p.include_stabilizer_nets` (as documented in lines 57-60)

**Current code:**
```javascript
${p.include_plated_holes && p.include_centerhole_net ? p.RIGHTSTAB : ''}
${p.include_plated_holes && p.include_centerhole_net ? p.LEFTSTAB : ''}
```

**Should be:**
```javascript
${p.include_plated_holes && p.include_stabilizer_nets ? p.RIGHTSTAB : ''}
${p.include_plated_holes && p.include_stabilizer_nets ? p.LEFTSTAB : ''}
```

**Workaround (current):**
Add `include_centerhole_net: true` to the switches params in `config.yaml`

**Proper fix:**
Update the footprint file to check the correct parameter
