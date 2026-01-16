// Panasonic EVQWGD001 horizontal rotary encoder - KiCad 8 compatible
//
//   __________________
//  (f) (t)         | |
//  | (1)           | |
//  | (2)           | |
//  | (3)           | |
//  | (4)           | |
//  |_( )___________|_|
//
// Nets
//    from: corresponds to switch pin 1 (for button presses)
//    to: corresponds to switch pin 2 (for button presses)
//    A: corresponds to pin 1 (for rotary)
//    B: corresponds to pin 2 (for rotary, should be GND)
//    C: corresponds to pin 3 (for rotary)
//    D: corresponds to pin 4 (for rotary, unused)
// Params
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible

module.exports = {
  params: {
    designator: 'S',
    reverse: false,
    from: undefined,
    to: undefined,
    A: undefined,
    B: undefined,
    C: undefined,
    D: undefined
  },
  body: p => {
    const standard = `
      (footprint "bhkfp:scrollwheel" (layer "F.Cu")
      ${p.at /* parametric position */}
      (property "Reference" "${p.ref}" (at 0 0 ${p.r}) (layer "F.SilkS")
        (effects (font (size 1 1) (thickness 0.15)))
      )
      (property "Value" "RollerEncoder_Panasonic_EVQWGD001" (at -0.1 9 ${p.r}) (layer "F.Fab")
        (effects (font (size 1 1) (thickness 0.15)))
      )
      (attr through_hole)

      ${'' /* corner marks */}
      (fp_line (start -8.4 -6.4) (end 8.4 -6.4) (stroke (width 0.12) (type solid)) (layer "Dwgs.User"))
      (fp_line (start 8.4 -6.4) (end 8.4 7.4) (stroke (width 0.12) (type solid)) (layer "Dwgs.User"))
      (fp_line (start 8.4 7.4) (end -8.4 7.4) (stroke (width 0.12) (type solid)) (layer "Dwgs.User"))
      (fp_line (start -8.4 7.4) (end -8.4 -6.4) (stroke (width 0.12) (type solid)) (layer "Dwgs.User"))
    `
    function pins(def_neg, def_pos) {
      return `
        ${'' /* edge cuts */}
        (fp_line (start ${def_pos}9.8 7.3) (end ${def_pos}9.8 -6.3) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_line (start ${def_pos}7.4 -6.3) (end ${def_pos}7.4 7.3) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_line (start ${def_pos}9.5 -6.6) (end ${def_pos}7.7 -6.6) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_line (start ${def_pos}7.7 7.6) (end ${def_pos}9.5 7.6) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_arc (start ${def_pos}7.7 7.0) (mid ${def_pos}7.488 7.088) (end ${def_pos}7.4 7.3) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_arc (start ${def_pos}9.2 7.3) (mid ${def_pos}9.288 7.512) (end ${def_pos}9.5 7.6) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_arc (start ${def_pos}8.0 -6.3) (mid ${def_pos}7.912 -6.512) (end ${def_pos}7.7 -6.6) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))
        (fp_arc (start ${def_pos}9.5 -6.0) (mid ${def_pos}9.712 -6.088) (end ${def_pos}9.8 -6.3) (stroke (width 0.15) (type solid)) (layer "Edge.Cuts"))

        ${'' /* pins */}
        (pad "S1" thru_hole circle (at ${def_neg}6.85 -6.2 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.from})
        (pad "S2" thru_hole circle (at ${def_neg}5 -6.2 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.to})
        (pad "A" thru_hole circle (at ${def_neg}5.625 -3.81 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.A})
        (pad "B" thru_hole circle (at ${def_neg}5.625 -1.27 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.B})
        (pad "C" thru_hole circle (at ${def_neg}5.625 1.27 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.C})
        (pad "D" thru_hole circle (at ${def_neg}5.625 3.81 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers "*.Cu" "*.Mask") ${p.D})

        ${'' /* stabilizer */}
        (pad "" np_thru_hole circle (at ${def_neg}5.625 6.3 ${p.r}) (size 1.5 1.5) (drill 1.5) (layers "*.Cu" "*.Mask"))
      `
    }
    if(p.reverse) {
      return `
        ${standard}
        ${pins('-', '')}
        ${pins('', '-')}
      )
      `
    } else {
      return `
        ${standard}
        ${pins('-', '')}
      )
      `
    }
  }
}
