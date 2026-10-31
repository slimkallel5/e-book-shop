/**
 * Comprehensive vector Lottie animations for website icons.
 * Standard Bodymovin v5.5.7 format with smooth keyframe animations.
 */

const baseLottie = (name: string, layers: any[], fr = 30, op = 30) => ({
  v: '5.5.7',
  fr,
  ip: 0,
  op,
  w: 100,
  h: 100,
  nm: name,
  ddd: 0,
  assets: [],
  layers,
});

/**
 * 1. Book Icon Animation (Pages fluttering gently)
 */
export const bookAnimation = baseLottie('book', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Cover Left',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-2], e: [2] },
          { t: 15, s: [2], e: [-2] },
          { t: 30, s: [-2] },
        ],
      },
      p: { a: 0, k: [35, 52, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [26, 44] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 4 },
        nm: 'Left Page',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.12, 0.45, 0.32, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: 'Cover Right',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [2], e: [-2] },
          { t: 15, s: [-2], e: [2] },
          { t: 30, s: [2] },
        ],
      },
      p: { a: 0, k: [65, 52, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [26, 44] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 4 },
        nm: 'Right Page',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.76, 0.28, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Gold',
      },
    ],
  },
  {
    ddd: 0,
    ind: 3,
    ty: 4,
    nm: 'Spine',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 52, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 48] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 2 },
        nm: 'Spine Center',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.08, 0.28, 0.2, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill',
      },
    ],
  },
]);

/**
 * 2. Search Icon Animation (Magnifying glass pulsing scale & rotation)
 */
export const searchAnimation = baseLottie('search', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Search Glass',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-10], e: [10] },
          { t: 15, s: [10], e: [-10] },
          { t: 30, s: [-10] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [48, 48, 0], e: [52, 48, 0] },
          { t: 15, s: [52, 48, 0], e: [48, 48, 0] },
          { t: 30, s: [48, 48, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [95, 95, 100], e: [105, 105, 100] },
          { t: 15, s: [105, 105, 100], e: [95, 95, 100] },
          { t: 30, s: [95, 95, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [38, 38] },
        p: { a: 0, k: [-4, -4] },
        nm: 'Lens',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.9, 0.75, 0.25, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 8 },
        nm: 'Stroke Lens',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [10, 26] },
        p: { a: 0, k: [18, 18] },
        r: { a: 0, k: 3 },
        nm: 'Handle',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.9, 0.75, 0.25, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Handle',
      },
    ],
  },
]);

/**
 * 3. Settings Gear Animation (Spinning rotating cog)
 */
export const settingsAnimation = baseLottie('settings', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Cog',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [360] },
          { t: 30, s: [360] },
        ],
      },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [46, 46] },
        p: { a: 0, k: [0, 0] },
        nm: 'Inner Ring',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 14 },
        nm: 'Stroke Ring',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [18, 18] },
        p: { a: 0, k: [0, 0] },
        nm: 'Center Hole',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.12, 0.38, 0.28, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Hole',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 60] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 3 },
        nm: 'Tooth Vert',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Tooth Vert',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [60, 12] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 3 },
        nm: 'Tooth Horiz',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Tooth Horiz',
      },
    ],
  },
]);

/**
 * 4. Package / Box Animation (Gentle delivery bounce)
 */
export const packageAnimation = baseLottie('package', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Parcel Box',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 52, 0], e: [50, 44, 0] },
          { t: 15, s: [50, 44, 0], e: [50, 52, 0] },
          { t: 30, s: [50, 52, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 96, 100], e: [96, 104, 100] },
          { t: 15, s: [96, 104, 100], e: [100, 96, 100] },
          { t: 30, s: [100, 96, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [56, 46] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 6 },
        nm: 'Box Body',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.82, 0.62, 0.38, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Box',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [14, 46] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 1 },
        nm: 'Box Tape',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.68, 0.48, 0.26, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Tape',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [60, 10] },
        p: { a: 0, k: [0, -18] },
        r: { a: 0, k: 3 },
        nm: 'Box Lid',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.74, 0.48, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Lid',
      },
    ],
  },
]);

/**
 * 5. Mail Animation (Envelope flapping open and hovering)
 */
export const mailAnimation = baseLottie('mail', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Letter Envelope',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-3], e: [3] },
          { t: 15, s: [3], e: [-3] },
          { t: 30, s: [-3] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 52, 0], e: [50, 46, 0] },
          { t: 15, s: [50, 46, 0], e: [50, 52, 0] },
          { t: 30, s: [50, 52, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [56, 38] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 5 },
        nm: 'Envelope Body',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.24, 0.65, 0.52, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Body',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [32, 22] },
        p: { a: 0, k: [0, -4] },
        r: { a: 0, k: 2 },
        nm: 'Envelope Flap',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.95, 0.82, 0.4, 1] },
        o: { a: 0, k: 100 },
        nm: 'Fill Flap',
      },
    ],
  },
]);

/**
 * 6. Heart Animation (Pulsing heartbeat)
 */
export const heartAnimation = (filled = true) =>
  baseLottie('heart', [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Heart',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100], e: [115, 115, 100] },
            { t: 8, s: [115, 115, 100], e: [95, 95, 100] },
            { t: 16, s: [95, 95, 100], e: [112, 112, 100] },
            { t: 24, s: [112, 112, 100], e: [90, 90, 100] },
            { t: 30, s: [90, 90, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [-12, -8] },
          nm: 'Circle Left',
        },
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [12, -8] },
          nm: 'Circle Right',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [0, 8] },
          r: { a: 0, k: 45 },
          nm: 'Bottom Diamond',
        },
        ...(filled
          ? [
              {
                ty: 'fl',
                c: { a: 0, k: [0.92, 0.22, 0.28, 1] },
                o: { a: 0, k: 100 },
                nm: 'Fill Heart',
              },
            ]
          : [
              {
                ty: 'st',
                c: { a: 0, k: [0.92, 0.22, 0.28, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 6 },
                nm: 'Stroke Heart',
              },
            ]),
      ],
    },
  ]);

/**
 * 7. Shopping Cart Animation (Cart rolling wheels and rocking)
 */
export const cartAnimation = baseLottie('cart', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Cart Basket',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-3], e: [3] },
          { t: 15, s: [3], e: [-3] },
          { t: 30, s: [-3] },
        ],
      },
      p: { a: 0, k: [48, 44, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [46, 32] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 4 },
        nm: 'Basket',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.1, 0.4, 0.28, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 6 },
        nm: 'Basket Stroke',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [10, 20] },
        p: { a: 0, k: [-26, -10] },
        r: { a: 0, k: 2 },
        nm: 'Handle Bar',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.88, 0.72, 0.25, 1] },
        o: { a: 0, k: 100 },
        nm: 'Handle Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: 'Left Wheel',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [360] },
          { t: 30, s: [360] },
        ],
      },
      p: { a: 0, k: [36, 72, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [14, 14] },
        p: { a: 0, k: [0, 0] },
        nm: 'Wheel',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.15, 0.15, 0.15, 1] },
        o: { a: 0, k: 100 },
        nm: 'Wheel Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 3,
    ty: 4,
    nm: 'Right Wheel',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [360] },
          { t: 30, s: [360] },
        ],
      },
      p: { a: 0, k: [60, 72, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [14, 14] },
        p: { a: 0, k: [0, 0] },
        nm: 'Wheel',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.15, 0.15, 0.15, 1] },
        o: { a: 0, k: 100 },
        nm: 'Wheel Fill',
      },
    ],
  },
]);

/**
 * 8. Arrow Navigation Animation (Sliding arrow pointer)
 */
export const arrowAnimation = (dir: 'left' | 'right' | 'down' | 'up' = 'right') => {
  const angle = dir === 'right' ? 0 : dir === 'left' ? 180 : dir === 'down' ? 90 : 270;
  return baseLottie('arrow', [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Arrow Head',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: angle },
        p: {
          a: 1,
          k: [
            { t: 0, s: [46, 50, 0], e: [54, 50, 0] },
            { t: 15, s: [54, 50, 0], e: [46, 50, 0] },
            { t: 30, s: [46, 50, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [34, 8] },
          p: { a: 0, k: [-4, 0] },
          r: { a: 0, k: 3 },
          nm: 'Shaft',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [22, 22] },
          p: { a: 0, k: [10, 0] },
          r: { a: 0, k: 45 },
          nm: 'Head Diamond',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
          o: { a: 0, k: 100 },
          nm: 'Fill Arrow',
        },
      ],
    },
  ]);
};

/**
 * 9. Star Rating Animation (Twinkling pulsing star)
 */
export const starAnimation = (filled = true) =>
  baseLottie('star', [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Star',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-6], e: [6] },
            { t: 15, s: [6], e: [-6] },
            { t: 30, s: [-6] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [92, 92, 100], e: [108, 108, 100] },
            { t: 15, s: [108, 108, 100], e: [92, 92, 100] },
            { t: 30, s: [92, 92, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [34, 34] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 45 },
          nm: 'Center Square',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [46, 20] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Points Horiz',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [20, 46] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Points Vert',
        },
        ...(filled
          ? [
              {
                ty: 'fl',
                c: { a: 0, k: [0.95, 0.78, 0.22, 1] },
                o: { a: 0, k: 100 },
                nm: 'Fill Star',
              },
            ]
          : [
              {
                ty: 'st',
                c: { a: 0, k: [0.8, 0.65, 0.2, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 4 },
                nm: 'Stroke Star',
              },
            ]),
      ],
    },
  ]);

/**
 * 10. Trash / Delete Animation (Bin with lifting lid)
 */
export const trashAnimation = baseLottie('trash', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Lid',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [-18] },
          { t: 15, s: [-18], e: [0] },
          { t: 30, s: [0] },
        ],
      },
      p: { a: 0, k: [50, 32, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [50, 8] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 3 },
        nm: 'Lid Bar',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [16, 6] },
        p: { a: 0, k: [0, -6] },
        r: { a: 0, k: 2 },
        nm: 'Lid Handle',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.85, 0.25, 0.25, 1] },
        o: { a: 0, k: 100 },
        nm: 'Lid Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: 'Can',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 60, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [40, 42] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 4 },
        nm: 'Can Body',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.75, 0.2, 0.2, 1] },
        o: { a: 0, k: 100 },
        nm: 'Can Fill',
      },
    ],
  },
]);

/**
 * 11. Graduation Cap / Education Animation (Cap floating & tassel swaying)
 */
export const gradCapAnimation = baseLottie('gradCap', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Cap Diamond',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-4], e: [4] },
          { t: 15, s: [4], e: [-4] },
          { t: 30, s: [-4] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 44, 0], e: [50, 40, 0] },
          { t: 15, s: [50, 40, 0], e: [50, 44, 0] },
          { t: 30, s: [50, 44, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [48, 48] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 45 },
        nm: 'Top Rhombus',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.12, 0.38, 0.28, 1] },
        o: { a: 0, k: 100 },
        nm: 'Cap Fill',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [32, 16] },
        p: { a: 0, k: [0, 18] },
        nm: 'Cap Base',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.08, 0.28, 0.2, 1] },
        o: { a: 0, k: 100 },
        nm: 'Base Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [4, 20] },
        p: { a: 0, k: [22, 6] },
        r: { a: 0, k: 10 },
        nm: 'Tassel',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.95, 0.78, 0.22, 1] },
        o: { a: 0, k: 100 },
        nm: 'Tassel Fill',
      },
    ],
  },
]);

/**
 * 12. Pencil Animation (Writing pencil motion)
 */
export const pencilAnimation = baseLottie('pencil', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Pencil Body',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-40], e: [-50] },
          { t: 15, s: [-50], e: [-40] },
          { t: 30, s: [-40] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 48, 0], e: [54, 52, 0] },
          { t: 15, s: [54, 52, 0], e: [50, 48, 0] },
          { t: 30, s: [50, 48, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [14, 52] },
        p: { a: 0, k: [0, -6] },
        r: { a: 0, k: 2 },
        nm: 'Shaft',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.72, 0.22, 1] },
        o: { a: 0, k: 100 },
        nm: 'Shaft Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 12] },
        p: { a: 0, k: [0, 24] },
        r: { a: 0, k: 45 },
        nm: 'Tip',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.2, 0.2, 0.2, 1] },
        o: { a: 0, k: 100 },
        nm: 'Tip Fill',
      },
    ],
  },
]);

/**
 * 13. Ruler / Middle School Animation
 */
export const rulerAnimation = baseLottie('ruler', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Ruler Triangle',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-8], e: [8] },
          { t: 15, s: [8], e: [-8] },
          { t: 30, s: [-8] },
        ],
      },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [50, 50] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 45 },
        nm: 'Triangle Shape',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.2, 0.55, 0.75, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 10 },
        nm: 'Ruler Border',
      },
    ],
  },
]);

/**
 * 14. Gift / Packs Animation (Bouncing gift box with ribbon)
 */
export const giftAnimation = baseLottie('gift', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Gift Box',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-4], e: [4] },
          { t: 15, s: [4], e: [-4] },
          { t: 30, s: [-4] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 54, 0], e: [50, 48, 0] },
          { t: 15, s: [50, 48, 0], e: [50, 54, 0] },
          { t: 30, s: [50, 54, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 96, 100], e: [96, 104, 100] },
          { t: 15, s: [96, 104, 100], e: [100, 96, 100] },
          { t: 30, s: [100, 96, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [50, 44] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 5 },
        nm: 'Box Body',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.85, 0.28, 0.35, 1] },
        o: { a: 0, k: 100 },
        nm: 'Body Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 44] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 1 },
        nm: 'Ribbon Vert',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.95, 0.8, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Ribbon Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [56, 10] },
        p: { a: 0, k: [0, -18] },
        r: { a: 0, k: 2 },
        nm: 'Lid',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.95, 0.35, 0.42, 1] },
        o: { a: 0, k: 100 },
        nm: 'Lid Fill',
      },
    ],
  },
]);

/**
 * 15. Newspaper / Articles Animation
 */
export const newspaperAnimation = baseLottie('newspaper', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Newspaper Page',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-3], e: [3] },
          { t: 15, s: [3], e: [-3] },
          { t: 30, s: [-3] },
        ],
      },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [52, 60] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 4 },
        nm: 'Sheet',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.94, 0.96, 1] },
        o: { a: 0, k: 100 },
        nm: 'Sheet Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [38, 10] },
        p: { a: 0, k: [0, -18] },
        r: { a: 0, k: 2 },
        nm: 'Headline',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.2, 0.25, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Headline Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [38, 4] },
        p: { a: 0, k: [0, -4] },
        r: { a: 0, k: 1 },
        nm: 'Line 1',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.4, 0.45, 0.5, 1] },
        o: { a: 0, k: 100 },
        nm: 'Line 1 Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [38, 4] },
        p: { a: 0, k: [0, 6] },
        r: { a: 0, k: 1 },
        nm: 'Line 2',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.4, 0.45, 0.5, 1] },
        o: { a: 0, k: 100 },
        nm: 'Line 2 Fill',
      },
    ],
  },
]);

/**
 * 16. Building / Institution / All Levels Animation
 */
export const buildingAnimation = baseLottie('building', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Temple',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: {
        a: 1,
        k: [
          { t: 0, s: [50, 52, 0], e: [50, 48, 0] },
          { t: 15, s: [50, 48, 0], e: [50, 52, 0] },
          { t: 30, s: [50, 52, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [56, 12] },
        p: { a: 0, k: [0, 22] },
        r: { a: 0, k: 2 },
        nm: 'Base',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.75, 0.62, 0.45, 1] },
        o: { a: 0, k: 100 },
        nm: 'Base Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 30] },
        p: { a: 0, k: [-18, 2] },
        r: { a: 0, k: 1 },
        nm: 'Col 1',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 30] },
        p: { a: 0, k: [0, 2] },
        r: { a: 0, k: 1 },
        nm: 'Col 2',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 30] },
        p: { a: 0, k: [18, 2] },
        r: { a: 0, k: 1 },
        nm: 'Col 3',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Cols Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [40, 40] },
        p: { a: 0, k: [0, -18] },
        r: { a: 0, k: 45 },
        nm: 'Pediment',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.75, 0.62, 0.45, 1] },
        o: { a: 0, k: 100 },
        nm: 'Pediment Fill',
      },
    ],
  },
]);

/**
 * 17. Close / Cross (X) Animation (Pulsing rotating X)
 */
export const closeAnimation = baseLottie('close', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Cross',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [90] },
          { t: 30, s: [90] },
        ],
      },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [90, 90, 100], e: [110, 110, 100] },
          { t: 15, s: [110, 110, 100], e: [90, 90, 100] },
          { t: 30, s: [90, 90, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 54] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 45 },
        nm: 'Arm 1',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [54, 12] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 45 },
        nm: 'Arm 2',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.85, 0.25, 0.25, 1] },
        o: { a: 0, k: 100 },
        nm: 'Cross Fill',
      },
    ],
  },
]);

/**
 * 18. Zoom In / Zoom Out Animation
 */
export const zoomAnimation = (zoomIn = true) =>
  baseLottie('zoom', [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Glass',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [46, 46, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100], e: [108, 108, 100] },
            { t: 15, s: [108, 108, 100], e: [95, 95, 100] },
            { t: 30, s: [95, 95, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [42, 42] },
          p: { a: 0, k: [0, 0] },
          nm: 'Lens Ring',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 8 },
          nm: 'Lens Stroke',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [8, 22] },
          p: { a: 0, k: [22, 22] },
          r: { a: 0, k: -45 },
          nm: 'Handle',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
          o: { a: 0, k: 100 },
          nm: 'Handle Fill',
        },
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [20, 6] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Horiz Sign',
        },
        ...(zoomIn
          ? [
              {
                ty: 'rc',
                d: 1,
                s: { a: 0, k: [6, 20] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 0 },
                nm: 'Vert Sign',
              },
            ]
          : []),
        {
          ty: 'fl',
          c: { a: 0, k: [0.12, 0.38, 0.28, 1] },
          o: { a: 0, k: 100 },
          nm: 'Sign Fill',
        },
      ],
    },
  ]);

/**
 * 19. Check / Success Animation
 */
export const checkAnimation = baseLottie('check', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Check Mark',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [92, 92, 100], e: [108, 108, 100] },
          { t: 15, s: [108, 108, 100], e: [92, 92, 100] },
          { t: 30, s: [92, 92, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [54, 54] },
        p: { a: 0, k: [0, 0] },
        nm: 'Circle Bg',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.18, 0.65, 0.35, 1] },
        o: { a: 0, k: 100 },
        nm: 'Circle Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 18] },
        p: { a: 0, k: [-6, 2] },
        r: { a: 0, k: -45 },
        nm: 'Short Leg',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [8, 30] },
        p: { a: 0, k: [6, -4] },
        r: { a: 0, k: 45 },
        nm: 'Long Leg',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [1, 1, 1, 1] },
        o: { a: 0, k: 100 },
        nm: 'Tick Fill',
      },
    ],
  },
]);

/**
 * 20. Alert / Warning Animation
 */
export const alertAnimation = baseLottie('alert', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Warning Triangle',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 52, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [95, 95, 100], e: [108, 108, 100] },
          { t: 15, s: [108, 108, 100], e: [95, 95, 100] },
          { t: 30, s: [95, 95, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [48, 48] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 45 },
        nm: 'Triangle Shape',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.95, 0.65, 0.15, 1] },
        o: { a: 0, k: 100 },
        nm: 'Triangle Fill',
      },
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [6, 16] },
        p: { a: 0, k: [0, -4] },
        r: { a: 0, k: 0 },
        nm: 'Mark Line',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [6, 6] },
        p: { a: 0, k: [0, 10] },
        nm: 'Mark Dot',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [1, 1, 1, 1] },
        o: { a: 0, k: 100 },
        nm: 'Mark Fill',
      },
    ],
  },
]);

/**
 * 21. Phone Animation
 */
export const phoneAnimation = baseLottie('phone', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Handset',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-10], e: [10] },
          { t: 6, s: [10], e: [-10] },
          { t: 12, s: [-10], e: [10] },
          { t: 18, s: [10], e: [-10] },
          { t: 30, s: [-10] },
        ],
      },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [14, 48] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: -30 },
        nm: 'Body',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [22, 22] },
        p: { a: 0, k: [12, -18] },
        nm: 'Earpiece',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [22, 22] },
        p: { a: 0, k: [-12, 18] },
        nm: 'Mouthpiece',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.15, 0.55, 0.4, 1] },
        o: { a: 0, k: 100 },
        nm: 'Phone Fill',
      },
    ],
  },
]);

/**
 * 22. Eye / Visibility Animation
 */
export const eyeAnimation = baseLottie('eye', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Eye',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 100, 100], e: [100, 20, 100] },
          { t: 15, s: [100, 20, 100], e: [100, 100, 100] },
          { t: 30, s: [100, 100, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [54, 34] },
        p: { a: 0, k: [0, 0] },
        nm: 'Eye Shape',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.15, 0.45, 0.35, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 6 },
        nm: 'Eye Outline',
      },
      {
        ty: 'el',
        d: 1,
        s: { a: 0, k: [18, 18] },
        p: { a: 0, k: [0, 0] },
        nm: 'Pupil',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Pupil Fill',
      },
    ],
  },
]);

/**
 * 23. Chart / Analytics Animation
 */
export const chartAnimation = baseLottie('chart', [
  {
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: 'Bar 1',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [28, 54, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 40, 100], e: [100, 80, 100] },
          { t: 15, s: [100, 80, 100], e: [100, 40, 100] },
          { t: 30, s: [100, 40, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 34] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 2 },
        nm: 'Bar 1',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.25, 0.65, 0.45, 1] },
        o: { a: 0, k: 100 },
        nm: 'Bar 1 Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: 'Bar 2',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 48, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 90, 100], e: [100, 50, 100] },
          { t: 15, s: [100, 50, 100], e: [100, 90, 100] },
          { t: 30, s: [100, 90, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 46] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 2 },
        nm: 'Bar 2',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.92, 0.78, 0.3, 1] },
        o: { a: 0, k: 100 },
        nm: 'Bar 2 Fill',
      },
    ],
  },
  {
    ddd: 0,
    ind: 3,
    ty: 4,
    nm: 'Bar 3',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [72, 42, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [100, 60, 100], e: [100, 100, 100] },
          { t: 15, s: [100, 100, 100], e: [100, 60, 100] },
          { t: 30, s: [100, 60, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [12, 58] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 2 },
        nm: 'Bar 3',
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.15, 0.45, 0.35, 1] },
        o: { a: 0, k: 100 },
        nm: 'Bar 3 Fill',
      },
    ],
  },
]);
