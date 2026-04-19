'use client';

import { useState } from 'react';

const sizes = [
  { size: 'S', chest: '104cm', waist: '88cm', length: '68cm' },
  { size: 'M', chest: '110cm', waist: '94cm', length: '71cm' },
  { size: 'L', chest: '116cm', waist: '100cm', length: '74cm' },
  { size: 'XL', chest: '122cm', waist: '106cm', length: '77cm' },
  { size: 'XXL', chest: '128cm', waist: '112cm', length: '80cm' },
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-accent text-sm underline hover:no-underline"
      >
        Size guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass  p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">SIZE GUIDE</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left text-muted-foreground">Size</th>
                  <th className="py-2 text-center text-muted-foreground">Chest</th>
                  <th className="py-2 text-center text-muted-foreground">Waist</th>
                  <th className="py-2 text-center text-muted-foreground">Length</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((row) => (
                  <tr key={row.size} className="border-b border-border/50">
                    <td className="py-2 font-bold">{row.size}</td>
                    <td className="py-2 text-center text-muted-foreground">{row.chest}</td>
                    <td className="py-2 text-center text-muted-foreground">{row.waist}</td>
                    <td className="py-2 text-center text-muted-foreground">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-xs text-muted-foreground space-y-1">
              
              <p><strong>OG Series:</strong> Drop shoulder, relaxed fit. True to size.</p>
              <p><strong>Joggers:</strong> Tapered with ribbed cuffs.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
