// footprints/skrhade010.js
// Converted from KiCad Footprint: SKRHADE010
// Description: Alps 5-way multidirectional switch (Diamond/45-degree orientation)

module.exports = {
    params: {
        designator: 'SW',
        side: 'F',
        reversible: false,
        include_traces_vias: false,
        trace_distance: { type: 'number', value: 2 }, // Dist to move via away from pad
        trace_width: 0.25,
        via_size: 0.6,
        via_drill: 0.3,
        // Nets
        P1: { type: 'net', value: undefined }, // Pin 1
        P2: { type: 'net', value: undefined }, // Pin 2
        P3: { type: 'net', value: undefined }, // Pin 3
        P4: { type: 'net', value: undefined }, // Pin 4
        P5: { type: 'net', value: undefined }, // Pin 5
        P6: { type: 'net', value: undefined }, // Pin 6 (Common?)
    },
    body: p => {
        
        // --- HELPERS ---
        const get_pad = (name, x, y, width, height, net, side) => {
            const layer = side === 'F' ? "F.Cu" : "B.Cu";
            const mask = side === 'F' ? "F.Mask" : "B.Mask";
            const paste = side === 'F' ? "F.Paste" : "B.Paste";
            // KiCad dump had 45 degree rotation on pads. 
            // We apply p.r (global rotation) + 45.
            return `(pad "${name}" smd roundrect (at ${x} ${y} ${p.r + 45}) (size ${width} ${height}) (layers "${layer}" "${mask}" "${paste}") (roundrect_rratio 0.15) ${net.str})`
        }

        const get_mounting = (x, y, w, h) => {
             // Mounting pads are usually on Front only unless defined otherwise, 
             // but for reversibility, we might want them on both or just Front.
             // The KiCad dump defines them as SMD rects on F.Cu. 
             // We'll duplicate if reversible to ensure mechanical strength on both sides.
             let out = `(pad "" smd rect (at ${x} ${y} ${p.r + 45}) (size ${w} ${h}) (layers "F.Cu" "F.Mask" "F.Paste"))`;
             if(p.reversible) {
                 out += `(pad "" smd rect (at ${-x} ${y} ${p.r + 45}) (size ${w} ${h}) (layers "B.Cu" "B.Mask" "B.Paste"))`;
             }
             return out;
        }

        const get_hole = (x, y, drill) => {
            // Holes go through the board, so we just mirror the X for the reversible "ghost" hole?
            // Actually, if we flip the component, the hole needs to be at -x. 
            // So we need TWO holes if reversible? 
            // Looking at coords: Hole1 (-1.3, -1.3), Hole2 (1.3, 1.3). They are symmetric.
            // If we flip X, Hole1 becomes (1.3, -1.3). This is a NEW location.
            // So yes, reversible requires 4 holes total (2 normal, 2 mirrored) OR a slot.
            // For simplicity, we add the mirrored holes.
            let out = `(pad "" np_thru_hole circle (at ${x} ${y} ${p.r + 45}) (size ${drill} ${drill}) (drill ${drill}) (layers "*.Cu" "*.Mask"))`;
            if(p.reversible) {
                out += `(pad "" np_thru_hole circle (at ${-x} ${y} ${p.r + 45}) (size ${drill} ${drill}) (drill ${drill}) (layers "*.Cu" "*.Mask"))`;
            }
            return out;
        }

        // --- TRACE / VIA GENERATOR ---
        const get_trace_via = (x, y, net_idx, side, direction_vector) => {
            // direction_vector: [x_dir, y_dir] normalized roughly
            const via_x = x + (direction_vector[0] * p.trace_distance);
            const via_y = y + (direction_vector[1] * p.trace_distance);
            
            const layer_cu = side === 'F' ? "F.Cu" : "B.Cu";
            
            return `
            (segment (start ${p.eaxy(x, y)}) (end ${p.eaxy(via_x, via_y)}) (width ${p.trace_width}) (layer "${layer_cu}") (net ${net_idx}))
            (via (at ${p.eaxy(via_x, via_y)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${net_idx}))
            (segment (start ${p.eaxy(via_x, via_y)}) (end ${p.eaxy(x, y)}) (width ${p.trace_width}) (layer "${side === 'F' ? 'B.Cu' : 'F.Cu'}") (net ${net_idx}))
            `
        }

        // --- COORDINATES (From Dump) ---
        // Pads 1,2,3 are Top-Left. Pads 4,5,6 are Bottom-Right.
        // Direction vectors for vias: 1/2/3 go Top-Left (-1, 1). 4/5/6 go Bottom-Right (1, -1).
        // (KiCad Y is inverted? No, usually Y down. Top-Left in KiCad view is -X, -Y? 
        //  The dump has 1 at -3.5, 1.5. This is -X, +Y. )
        
        const pads_info = [
            { name: "1", x: -3.517856, y: 1.537957, w: 1.35, h: 1, net: p.P1, dir: [-1, 1] },
            { name: "2", x: -2.527907, y: 2.527907, w: 1.35, h: 1, net: p.P2, dir: [-1, 1] },
            { name: "3", x: -1.537957, y: 3.517856, w: 1.35, h: 1, net: p.P3, dir: [-1, 1] },
            { name: "4", x: 1.537957, y: -3.517856, w: 1.35, h: 1, net: p.P4, dir: [1, -1] },
            { name: "5", x: 2.527907, y: -2.527907, w: 1.35, h: 1, net: p.P5, dir: [1, -1] },
            { name: "6", x: 3.517856, y: -1.537957, w: 1.35, h: 1, net: p.P6, dir: [1, -1] }
        ];

        let content = `
        (footprint "SKRHADE010"
            (layer "${p.reversible ? 'F' : p.side}.Cu")
            ${p.at}
            (property "Reference" "${p.ref}" (at 0 -8 ${p.r}) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
            (attr smd)
            
            ${'' /* Body Outline (Diamond) */}
            (fp_poly (pts (xy -5.3 0) (xy 0 -5.3) (xy 5.3 0) (xy 0 5.3)) (layer "F.SilkS") (stroke (width 0.1) (type solid)) (fill no))
            ${p.reversible ? `(fp_poly (pts (xy -5.3 0) (xy 0 -5.3) (xy 5.3 0) (xy 0 5.3)) (layer "B.SilkS") (stroke (width 0.1) (type solid)) (fill no))` : ''}

            ${'' /* Mounting Tabs (2x1.8) */}
            ${get_mounting(-2.863782, -2.863782, 2, 1.8)}
            ${get_mounting(2.863782, 2.863782, 2, 1.8)}

            ${'' /* Registration Holes */}
            ${get_hole(-1.343503, -1.343503, 0.75)}
            ${get_hole(1.343503, 1.343503, 1.05)}
        `;

        // --- GENERATE PADS ---
        for (const pad of pads_info) {
            // Front Pad
            if (p.side === 'F' || p.reversible) {
                content += get_pad(pad.name, pad.x, pad.y, pad.w, pad.h, pad.net, 'F');
                
                // Front Trace/Via
                if (p.reversible && p.include_traces_vias) {
                     content += get_trace_via(pad.x, pad.y, pad.net.index, 'F', pad.dir);
                }
            }
            
            // Back Pad (Mirrored X)
            if (p.side === 'B' || p.reversible) {
                // IMPORTANT: When flipping component to back, Pin 1 (Left) moves to Right.
                // So Back Pad 1 must be at -X.
                const bx = -pad.x; 
                content += get_pad(pad.name, bx, pad.y, pad.w, pad.h, pad.net, 'B');

                // Back Trace/Via
                if (p.reversible && p.include_traces_vias) {
                     // For back trace, we mirror the direction vector X as well
                     content += get_trace_via(bx, pad.y, pad.net.index, 'B', [-pad.dir[0], pad.dir[1]]);
                }
            }
        }

        content += `)`;
        return content;
    }
}