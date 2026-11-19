import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Z1758 Chrome Cross Belt',
    price: 145.0,
    category: 'belt',
    imageUrl: '/images/belt-chrome-cross.jpg',
    galleryImages: [
      '/images/belt-chrome-cross.jpg',
      '/images/belt-platinum-diamond.jpg',
      '/images/belt-studded-pyramid.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Heavy-cast gothic cross buckle mounted on a 4mm full-grain bridle leather strap with chrome eyelets.',
    longDescription:
      'Engineered with an oversized sculptural cross buckle cast in high-density chrome-finished alloy and anchored to thick, vegetable-tanned full-grain cowhide. Five reinforced metal eyelets and twin keeper loops distribute tension evenly across the waist without creasing.',
    rating: 4.9,
    material: 'Full-Grain Bridle Leather & Cast Chrome Alloy',
    finish: 'Mirror Silver / Matte Obsidian Hide',
    weightGrams: 540,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Signature Series',
    hardwareSpecs: [
      {
        label: 'Buckle',
        value: '78mm Sculpted Cross',
        detail: 'Hand-polished zinc-alloy and 316L steel pin tongue with beveled gothic arms.',
      },
      {
        label: 'Strap',
        value: '4.0mm Bridle Hide',
        detail: 'Single-piece drum-dyed black leather cut at 38mm width for standard belt loops.',
      },
      {
        label: 'Studs & Crosses',
        value: '6x Relief Medallions',
        detail: 'Flush-riveted miniature chrome cross plates spaced cleanly along the upper shank.',
      },
      {
        label: 'Eyelets & Tip',
        value: '5x Reinforced Grommets',
        detail: 'Heavy crimped stainless rings prevent hole tear under tension.',
      },
    ],
  },
  {
    id: '6',
    name: 'Z1758 Platinum & Diamond Cross Belt',
    price: 12800.0,
    category: 'belt',
    imageUrl: '/images/belt-platinum-diamond.jpg',
    galleryImages: [
      '/images/belt-platinum-diamond.jpg',
      '/images/belt-chrome-cross.jpg',
    ],
    themeColor: '#0F172A',
    description:
      'Solid 950 platinum gothic cross buckle pavé-set with 3.4ct VVS1 diamonds on glazed alligator belly leather.',
    longDescription:
      'Commissioned in strictly limited archival runs, this flagship belt pairs a hand-carved solid 950 platinum cross buckle set with 118 natural VVS1 colorless diamonds against center-cut Mississippiensis alligator belly leather lined in calfskin.',
    rating: 5.0,
    material: '950 Solid Platinum, 3.4ct VVS1 Diamonds & Alligator Hide',
    finish: 'Hand-Lapped Platinum / Glazed Noir Alligator',
    weightGrams: 720,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'reserve',
    edition: 'Archive Reserve · 1 of 5',
    hardwareSpecs: [
      {
        label: 'Platinum Buckle',
        value: '950 Pt · 3.4ct VVS1',
        detail: 'Micro-pavé diamond gothic cross sculpted from 240g solid 950 platinum.',
      },
      {
        label: 'Alligator Strap',
        value: 'Center-Cut Belly Scale',
        detail: 'Hand-stitched saddle linen thread with full calfskin interior backing.',
      },
      {
        label: 'Cross Studs',
        value: '7x Diamond Pt Plates',
        detail: 'Each strap medallion holds 11 flush-set round brilliant diamonds.',
      },
      {
        label: 'Hallmark Tip',
        value: 'Numbered Pt950 Plate',
        detail: 'Engraved serial plaque and solid platinum reinforced eyelet sleeves.',
      },
    ],
  },
  {
    id: '2',
    name: 'Z1758 Pyramid Studded Belt',
    price: 128.0,
    category: 'belt',
    imageUrl: '/images/belt-studded-pyramid.jpg',
    galleryImages: [
      '/images/belt-studded-pyramid.jpg',
      '/images/belt-chrome-cross.jpg',
    ],
    themeColor: '#09090B',
    description:
      'Three-row precision chrome pyramid studs set into heavy black leather with a double-prong roller buckle.',
    longDescription:
      'Built for structured silhouette weight, the Z1758 Pyramid Studded Belt packs three staggered rows of sharp-edged chrome pyramid studs along its entire perimeter. A solid twin-prong roller buckle locks cleanly through dual punch rows for zero slip.',
    rating: 4.8,
    material: 'Heavy Saddle Leather & Stainless Pyramid Studs',
    finish: 'High-Gloss Chrome / Satin Black',
    weightGrams: 610,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Signature Series',
    hardwareSpecs: [
      {
        label: 'Roller Buckle',
        value: 'Dual-Prong Steel',
        detail: 'Removable snap-post frame lets you swap buckles cleanly.',
      },
      {
        label: 'Stud Matrix',
        value: '3-Row Chrome Pyramids',
        detail: '144 hand-set 12mm hollow-back steel pyramids with zero-snag inner backing.',
      },
      {
        label: 'Strap Core',
        value: '4.2mm Saddle Hide',
        detail: 'Wax-sealed beveled edges resist fraying through daily wear.',
      },
      {
        label: 'Locking Tip',
        value: 'Pressed Chrome Tail',
        detail: 'Weighted metal belt end-cap stamped with the Z1758 archive mark.',
      },
    ],
  },
  {
    id: '7',
    name: 'Z1758 18K White Gold VVS Fang Grillz',
    price: 14500.0,
    category: 'grillz',
    imageUrl: '/images/grillz-diamond-gold.jpg',
    galleryImages: [
      '/images/grillz-diamond-gold.jpg',
      '/images/grillz-chrome-fang.jpg',
    ],
    themeColor: '#4C1D95',
    description:
      'Bespoke 18K solid white gold 12-tooth vampire grillz flooded with 5.8ct VVS pavé and baguette diamonds.',
    longDescription:
      'Hand-built from solid 18K rhodium-washed white gold and honeycomb-set with 5.8 carats of matched E-F VVS natural diamonds. Extended canine fangs showcase channel-set vertical baguettes designed for maximum fire under low light.',
    rating: 5.0,
    material: '18K Solid White Gold & 5.8ct VVS Natural Diamonds',
    finish: 'Honeycomb Pavé / Baguette Canines',
    weightGrams: 34,
    sizes: ['6-Tooth Top', '6-Tooth Bottom', '12-Piece Full Set'],
    tier: 'reserve',
    edition: 'Haute Vault · Bespoke',
    hardwareSpecs: [
      {
        label: 'Upper 6-Arch',
        value: '3.2ct Honeycomb Pavé',
        detail: 'Open-back 18K gold framework with seamless inter-tooth solder bridges.',
      },
      {
        label: 'Baguette Fangs',
        value: 'Dual Channel-Cut',
        detail: 'Custom-calibrated straight baguette diamonds along extended canines.',
      },
      {
        label: 'Lower 6-Arch',
        value: '2.6ct Tapered Match',
        detail: 'Articulated lower contour engineered for natural speech and bite.',
      },
      {
        label: 'Vault Kit',
        value: 'Velvet Case & Mold Set',
        detail: 'Includes dual clinical impression trays and signed GIA diamond dossier.',
      },
    ],
  },
  {
    id: '3',
    name: 'Z1758 Chrome Fang Grillz',
    price: 165.0,
    category: 'grillz',
    imageUrl: '/images/grillz-chrome-fang.jpg',
    galleryImages: [
      '/images/grillz-chrome-fang.jpg',
      '/images/grillz-diamond-gold.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Custom-contoured mirror chrome fang dental grillz with diamond-cut canine facets and molding bars.',
    longDescription:
      'Sculpted around aggressive extended canine silhouettes with precision micro-faceted surfaces that catch studio light. Cast from nickel-free, body-safe 316L surgical steel finished in mirror rhodium-chrome plating. Includes two reusable medical-grade silicone molding bars.',
    rating: 4.9,
    material: 'Rhodium-Plated 316L Surgical Steel',
    finish: 'Mirror Chrome / Micro-Cut Facets',
    weightGrams: 18,
    sizes: ['6-Tooth Top', '6-Tooth Bottom', '12-Piece Full Set'],
    tier: 'signature',
    edition: 'Signature Series',
    hardwareSpecs: [
      {
        label: 'Upper Arch',
        value: '6-Tooth Vampire Cut',
        detail: 'Extended canine points with tapered gumline relief.',
      },
      {
        label: 'Lower Arch',
        value: '6-Tooth Open Bridge',
        detail: 'Low-profile lower contour engineered for comfortable jaw closure.',
      },
      {
        label: 'Fitting Kit',
        value: '2x Silicone Mold Bars',
        detail: 'Quick 90-second hot-water impression fit with protective case.',
      },
      {
        label: 'Finish',
        value: 'Anti-Tarnish Seal',
        detail: 'Hypoallergenic, nickel-free mirror polish.',
      },
    ],
  },
  {
    id: '8',
    name: 'Z1758 Platinum Onyx Cathedral Ring',
    price: 4850.0,
    category: 'ring',
    imageUrl: '/images/ring-platinum-onyx.jpg',
    galleryImages: [
      '/images/ring-platinum-onyx.jpg',
      '/images/ring-gothic-signet.jpg',
    ],
    themeColor: '#1E293B',
    description:
      'Solid 950 platinum gothic cathedral signet crowned with hand-cut black onyx and pavé diamond cross inlay.',
    longDescription:
      'Forged in dense 950 platinum with flying-buttress cathedral shoulders flanking a mirror-domed natural black onyx cabochon. A flush-inlaid 0.9ct VVS diamond cross sits centered in the stone above an engraved vault hallmark.',
    rating: 5.0,
    material: '950 Solid Platinum, Natural Black Onyx & 0.9ct Diamonds',
    finish: 'Oxidized Cathedral Relief / Mirror Onyx',
    weightGrams: 48,
    sizes: ['7', '8', '9', '10', '11'],
    tier: 'reserve',
    edition: 'Archive Reserve · 1 of 10',
    hardwareSpecs: [
      {
        label: 'Onyx Crown',
        value: '18mm Cabochon & Cross',
        detail: 'Custom-lapped black chalcedony onyx inlaid with 19 pavé diamonds.',
      },
      {
        label: 'Cathedral Shank',
        value: '48g Solid Platinum',
        detail: 'Deep architectural gothic arches hand-chased along both shoulders.',
      },
      {
        label: 'Inner Gallery',
        value: 'Numbered Pt950 Bore',
        detail: 'Comfort-chamfered interior gallery with individual edition engraving.',
      },
    ],
  },
  {
    id: '4',
    name: 'Z1758 Gothic Cross Signet Ring',
    price: 95.0,
    category: 'ring',
    imageUrl: '/images/ring-gothic-signet.jpg',
    galleryImages: [
      '/images/ring-gothic-signet.jpg',
      '/images/ring-platinum-onyx.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Heavy oxidized sterling-toned gothic signet ring featuring deep-cast floral cross relief.',
    longDescription:
      'An architectural heavy-band ring forged with deep-recessed gothic cross engraving and darkened patina crevices for bold sculptural contrast. Smooth comfort-fit interior shank balances its substantial 26g crown weight.',
    rating: 4.9,
    material: 'Oxidized 925 Sterling Silver / 316L Core',
    finish: 'Brushed Chrome & Darkened Patina',
    weightGrams: 26,
    sizes: ['7', '8', '9', '10', '11'],
    tier: 'signature',
    edition: 'Signature Series',
    hardwareSpecs: [
      {
        label: 'Crown Face',
        value: '17mm Gothic Relief',
        detail: 'Deep CNC-chased cross emblem with darkened oxidized recess.',
      },
      {
        label: 'Shank Profile',
        value: '7mm Tapered Band',
        detail: 'Rounded inner wall for zero finger pinch.',
      },
      {
        label: 'Hallmark',
        value: 'Z1758 Inner Stamp',
        detail: 'Laser-etched archive serial inside the band.',
      },
    ],
  },
  {
    id: '9',
    name: 'Z1758 Imperial Gold & Silver Wallet Chain',
    price: 6400.0,
    category: 'chain',
    imageUrl: '/images/chain-imperial-gold.jpg',
    galleryImages: [
      '/images/chain-imperial-gold.jpg',
      '/images/chain-wallet-hardware.jpg',
    ],
    themeColor: '#7F1D1D',
    description:
      '620-gram articulated 18K white gold & 925 sterling Cuban-cross wallet chain with diamond-set swivel clasps.',
    longDescription:
      'The heaviest chain in the Z1758 vault. Alternating hand-soldered 925 sterling silver curb links and 18K white gold gothic cross bars terminate in dual diamond-paved trigger clasps engineered for zero-flex drape.',
    rating: 5.0,
    material: '18K White Gold, 925 Sterling Silver & 2.1ct Diamonds',
    finish: 'Antiqued Sterling / Pavé Trigger Clasps',
    weightGrams: 620,
    sizes: ['18" Short', '22" Standard', '26" Drop'],
    tier: 'reserve',
    edition: 'Archive Reserve · 1 of 8',
    hardwareSpecs: [
      {
        label: 'Diamond Clasps',
        value: 'Dual 18K Pavé Triggers',
        detail: '360-degree ball-bearing swivel triggers paved in round brilliant diamonds.',
      },
      {
        label: 'Cuban Cross Links',
        value: '16mm Heavy Gauge',
        detail: '620g total mass with black diamond center cross drop charm.',
      },
      {
        label: 'Locking Bail',
        value: 'Threaded Vault Ring',
        detail: 'Precision screw-pin wallet anchor resists accidental unclipping.',
      },
    ],
  },
  {
    id: '5',
    name: 'Z1758 Heavy Hardware Wallet Chain',
    price: 118.0,
    category: 'chain',
    imageUrl: '/images/chain-wallet-hardware.jpg',
    galleryImages: [
      '/images/chain-wallet-hardware.jpg',
      '/images/chain-imperial-gold.jpg',
    ],
    themeColor: '#3F3F46',
    description:
      'Substantial linked chrome cross wallet chain equipped with dual rotating lobster clasps.',
    longDescription:
      'Constructed from alternating sculpted cross links and heavy curb rings that drape cleanly from belt loop to back pocket. Twin 360-degree swivel trigger clasps snap securely onto denim loops, belt D-rings, or leather wallets.',
    rating: 4.8,
    material: 'Solid 316L Stainless Steel Hardware',
    finish: 'Aged Chrome / High-Contrast Polish',
    weightGrams: 285,
    sizes: ['18" Short', '22" Standard', '26" Drop'],
    tier: 'signature',
    edition: 'Signature Series',
    hardwareSpecs: [
      {
        label: 'Primary Clasp',
        value: 'Swivel Lobster Trigger',
        detail: 'Heavy spring-loaded thumb latch clips directly to belt loops.',
      },
      {
        label: 'Link Architecture',
        value: 'Sculpted Cross Links',
        detail: 'Cast cross-bar connectors welded solid to prevent pull separation.',
      },
      {
        label: 'Tail Ring',
        value: 'Quick-Release Split',
        detail: 'Secondary clasp with key-ring adapter for wallets or charms.',
      },
    ],
  },
  {
    id: '10',
    name: 'Z1758 Espresso Fold-Cuff Combat Boots',
    price: 420.0,
    category: 'footwear',
    imageUrl: '/images/catalog/espresso-boots-1.jpg',
    galleryImages: [
      '/images/catalog/espresso-boots-1.jpg',
      '/images/catalog/espresso-boots-2.jpg',
    ],
    themeColor: '#3E2723',
    description:
      'Hand-distressed espresso pull-up leather combat boots with slouch fold-over cuffs, brass ankle strap, and heavy side zips.',
    longDescription:
      'Constructed from oil-tanned full-grain calfskin that reveals warm mahogany undertones across every creased fold. Features a convertible snapped fold-over collar, antique brass D-ring ankle harness, waxed cotton laces, and Goodyear-welted commando rubber lug soles.',
    rating: 4.9,
    material: 'Oil-Tanned Pull-Up Calfskin & Antique Brass Hardware',
    finish: 'Distressed Espresso / Brushed Brass',
    weightGrams: 1640,
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    tier: 'signature',
    edition: 'Archive Footwear · Drop 02',
    hardwareSpecs: [
      {
        label: 'Fold Collar',
        value: 'Convertible Snap Cuff',
        detail: 'Triple-riveted fold-over ankle flap with oxidized brass eyelet tabs.',
      },
      {
        label: 'Ankle Harness',
        value: 'Cast Brass D-Ring',
        detail: 'Wrap-around vegetable-tanned heel strap with roller pin buckle.',
      },
      {
        label: 'Side Entry',
        value: 'Heavy #8 Brass Zip',
        detail: 'Custom-cast keyhole zipper pull runs full height for rapid lacing clearance.',
      },
      {
        label: 'Outsole',
        value: 'Stacked Storm Welt',
        detail: 'Multi-layer stacked leather midsole bonded to deep-lugged vulcanized rubber.',
      },
    ],
  },
  {
    id: '11',
    name: 'Z1758 Cracked Hide Cross Messenger Bag',
    price: 460.0,
    category: 'bag',
    imageUrl: '/images/catalog/cracked-cross-bag-1.jpg',
    galleryImages: [
      '/images/catalog/cracked-cross-bag-1.jpg',
      '/images/catalog/cracked-cross-bag-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Cracked alligator-embossed calfskin messenger bag anchored by an oversized brushed steel gothic cross buckle.',
    longDescription:
      'Cut from fissure-textured matte black leather that softens with structure over years of carry. Dual gusseted front cargo pouches lock down with ribbed leather keeper straps flanking a heavy center brushed-silver hollow cross buckle.',
    rating: 5.0,
    material: 'Cracked-Grain Italian Calfskin & Cast Steel Buckle',
    finish: 'Matte Fissure Black / Brushed Pewter',
    weightGrams: 1120,
    sizes: ['One Size (38cm × 26cm)'],
    tier: 'signature',
    edition: 'Archive Carry · Limited',
    hardwareSpecs: [
      {
        label: 'Cross Buckle',
        value: '72mm Hollow Cast Steel',
        detail: 'Center-post gothic cross clasp with distressed antiqued bevels.',
      },
      {
        label: 'Cargo Pouches',
        value: 'Twin Gusseted Pockets',
        detail: 'Quick-draw ribbed leather straps thread cleanly through reinforced keepers.',
      },
      {
        label: 'Main Body',
        value: 'Cracked-Scale Calfskin',
        detail: 'Wax-treated crackled outer shell with heavy canvas zip-top lining.',
      },
    ],
  },
  {
    id: '12',
    name: 'Z1758 Ash Leather Twin-Buckle Moto Boots',
    price: 395.0,
    category: 'footwear',
    imageUrl: '/images/catalog/ash-moto-boots-1.jpg',
    galleryImages: [
      '/images/catalog/ash-moto-boots-1.jpg',
      '/images/catalog/ash-moto-boots-2.jpg',
    ],
    themeColor: '#52525B',
    description:
      'Washed ash-grey distressed calfskin moto boots wrapped in folded asymmetrical gaiter shafts and twin matte black straps.',
    longDescription:
      'Hand-tumbled in stone pigments to achieve a lived-in mineral grey patina with burnished toe darkening. Dual heavy matte-black harness straps buckle across the draped leather gaiter over hand-tacked Y-stitch anchor points.',
    rating: 4.9,
    material: 'Stone-Tumbled Calfskin & Matte Black Steel Buckles',
    finish: 'Washed Ash Grey / Matte Obsidian Straps',
    weightGrams: 1580,
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    tier: 'signature',
    edition: 'Archive Footwear · Drop 02',
    hardwareSpecs: [
      {
        label: 'Gaiter Shaft',
        value: 'Draped Unlined Suede',
        detail: 'Split-front leather wrap held by waxed hand-stitched Y-tacks.',
      },
      {
        label: 'Twin Buckles',
        value: 'Powder-Coated Steel',
        detail: 'Dual 28mm matte black harness straps cinch the ankle cleanly.',
      },
      {
        label: 'Heel Stack',
        value: '32mm Burnished Heel',
        detail: 'Distressed stacked wood-grain leather heel with stitched rubber sole.',
      },
    ],
  },
  {
    id: '13',
    name: 'Z1758 Nocturne Pleated Satin Lace Pumps',
    price: 310.0,
    category: 'footwear',
    imageUrl: '/images/catalog/satin-pumps-1.jpg',
    galleryImages: [
      '/images/catalog/satin-pumps-1.jpg',
      '/images/catalog/satin-pumps-2.jpg',
    ],
    themeColor: '#09090B',
    description:
      'Architectural radial-pleated black silk satin pumps edged with gathered Chantilly lace ruffles and velvet toe bows.',
    longDescription:
      'Built on a sculpted 95mm stiletto last, each pump wraps radially pleated matte black silk satin into a soft almond toe topped with a hand-tied velvet ribbon bow and double-tiered delicate black floral lace collar.',
    rating: 4.8,
    material: 'Silk Satin, Chantilly Lace & Velvet Trim',
    finish: 'Noir Satin / Matte Velvet',
    weightGrams: 640,
    sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41'],
    tier: 'signature',
    edition: 'Evening Archive',
    hardwareSpecs: [
      {
        label: 'Upper Shell',
        value: 'Radial Pleated Satin',
        detail: 'Structured silk-blend folds contoured cleanly over cushioned leather insoles.',
      },
      {
        label: 'Collar Trim',
        value: 'Chantilly Lace & Velvet',
        detail: 'Scalloped floral lace ruffle bound with tonal plush velvet piping.',
      },
      {
        label: 'Stiletto Heel',
        value: '95mm Lacquered Taper',
        detail: 'High-gloss noir heel column reinforced with steel internal shank.',
      },
    ],
  },
  {
    id: '14',
    name: 'Z1758 Weeping Eye Graphic Mesh Long-Sleeve',
    price: 385.0,
    category: 'top',
    imageUrl: '/images/catalog/mesh-eye-top-1.jpg',
    galleryImages: [
      '/images/catalog/mesh-eye-top-1.jpg',
      '/images/catalog/mesh-eye-top-2.jpg',
      '/images/catalog/mesh-eye-top-3.jpg',
    ],
    themeColor: '#7F1D1D',
    description:
      'Archival 90s-cut sheer cream tulle long-sleeve top printed with crimson weeping-eye surrealist artwork and typography.',
    longDescription:
      'Crafted in featherweight semi-sheer French polyamide mesh with exposed espresso contrast overlock seams. All-over archival typography and bruised burgundy eye motif drape cleanly as a standalone piece or base layer.',
    rating: 4.9,
    material: 'Italian Printed Polyamide Power-Mesh',
    finish: 'Ecru Sheer / Oxblood Distressed Print',
    weightGrams: 180,
    sizes: ['XS', 'S', 'M', 'L'],
    tier: 'reserve',
    edition: 'Collector Archive · Rare',
    hardwareSpecs: [
      {
        label: 'Graphic Print',
        value: 'Sublimated Weeping Eye',
        detail: 'Rich crimson painterly tear-stream eye over vintage newsprint typography.',
      },
      {
        label: 'Construction',
        value: 'Exposed Overlock Seams',
        detail: 'Exterior micro-serged espresso stitching reinforces stretch seams.',
      },
      {
        label: 'Fit Profile',
        value: 'Second-Skin Stretch',
        detail: 'Four-way recovery tulle contours naturally without bagging.',
      },
    ],
  },
  {
    id: '15',
    name: 'Z1758 Asymmetric Zip Dual-Layer Distressed Tee',
    price: 165.0,
    category: 'top',
    imageUrl: '/images/catalog/zip-tee-1.jpg',
    galleryImages: [
      '/images/catalog/zip-tee-1.jpg',
      '/images/catalog/zip-tee-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Double-layered grunge cotton jersey tee with chalk-white distressed graphic shell and diagonal zip-open striped base.',
    longDescription:
      'Engineered as a trompe-l’oeil layered silhouette: an off-white overwashed V-neck outer tee with distressed manifesto graphics zips diagonally open at the hip to reveal a gritty black-and-white striped skull-print inner layer.',
    rating: 4.8,
    material: '100% Combed Ring-Spun Cotton & Metal Zip',
    finish: 'Chalk Distressed / Striped Charcoal Underlay',
    weightGrams: 310,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'signature',
    edition: 'Archive Jersey',
    hardwareSpecs: [
      {
        label: 'Hem Zipper',
        value: 'Diagonal #5 Nickel Zip',
        detail: 'Functional curved hip zipper adjusts drape and exposes striped underlayer.',
      },
      {
        label: 'Double Collar',
        value: 'Twin Layered V-Neck',
        detail: 'Pre-stitched layered neckline frames contrast distressed striping.',
      },
      {
        label: 'Screenprint',
        value: 'Crackled Water-Base Ink',
        detail: 'Aged discharge ink integrates softly into washed cotton fibers.',
      },
    ],
  },
  {
    id: '16',
    name: 'Z1758 Asymmetric-Zip Cropped Utility Jacket',
    price: 290.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/cropped-utility-jacket-1.jpg',
    galleryImages: [
      '/images/catalog/cropped-utility-jacket-1.jpg',
      '/images/catalog/cropped-utility-jacket-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Boxy cropped short-sleeve cotton twill moto jacket with off-center silver zip, twin throat snaps, and rolled cuffs.',
    longDescription:
      'Dense enzyme-washed black cotton poplin cut in a sharp cropped torso profile. Features an off-axis YKK metal front zip secured by dual brushed-nickel snap tabs at the throat, buttoned roll cuffs, and an asymmetric cargo chest pocket.',
    rating: 4.8,
    material: 'Heavy Enzyme-Washed Cotton Twill & YKK Metal Hardware',
    finish: 'Pitch Black / Brushed Silver Snaps',
    weightGrams: 620,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'signature',
    edition: 'Archive Outerwear',
    hardwareSpecs: [
      {
        label: 'Throat Tabs',
        value: 'Dual 16mm Snap Latches',
        detail: 'Overlapping storm collar locks asymmetrically with engraved nickel snaps.',
      },
      {
        label: 'Front Track',
        value: 'Off-Center Metal Zip',
        detail: 'Runs full length from hem snap tab to left collar notch.',
      },
      {
        label: 'Utility Pocket',
        value: 'Rivet-Bound Chest Flap',
        detail: 'Bellowed right chest pocket with angled flap and snap closure.',
      },
    ],
  },
  {
    id: '17',
    name: 'Z1758 Corset-Lace Waxed Leather Flare Jeans',
    price: 540.0,
    category: 'denim',
    imageUrl: '/images/catalog/corset-denim-1.jpg',
    galleryImages: [
      '/images/catalog/corset-denim-1.jpg',
      '/images/catalog/corset-denim-2.jpg',
    ],
    themeColor: '#09090B',
    description:
      'Black waxed 14oz denim flared trousers paneled with full-grain leather thigh corsets and wide triangular leather flare gussets.',
    longDescription:
      'Heavy archival denim layered with sculpted leather armor. Double 10-eyelet leather corset panels lace along both thighs with trailing rawhide cords, expanding downward into multi-piece stitched lambskin leather flare gussets at the hem.',
    rating: 5.0,
    material: '14oz Waxed Black Denim & Full-Grain Lambskin Leather',
    finish: 'Resin-Coated Noir / Matte Black Leather',
    weightGrams: 1180,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'reserve',
    edition: 'Archive Reserve · Atelier',
    hardwareSpecs: [
      {
        label: 'Thigh Corsets',
        value: '20x Gunmetal Eyelets',
        detail: 'Reinforced leather lace-up plates with trailing 90cm leather cords.',
      },
      {
        label: 'Flare Gussets',
        value: 'Multi-Panel Lambskin',
        detail: 'Triangular full-grain leather inserts widen leg opening to 31cm.',
      },
      {
        label: 'Pocket Hardware',
        value: '4x Mini D-Ring Rivets',
        detail: 'Upper coin pocket trimmed with chrome D-rings for wallet chain mounting.',
      },
    ],
  },
  {
    id: '18',
    name: 'Z1758 Oxblood Striped Heritage Polo',
    price: 140.0,
    category: 'top',
    imageUrl: '/images/catalog/oxblood-polo-1.jpg',
    galleryImages: [
      '/images/catalog/oxblood-polo-1.jpg',
      '/images/catalog/oxblood-polo-2.jpg',
    ],
    themeColor: '#581C24',
    description:
      'Deep oxblood heavyweight cotton piqué polo striped in crisp chalk white with reinforced herringbone collar tape.',
    longDescription:
      'Lofty vintage-weight combed cotton piqué knit in deep wine oxblood crossed by clean chalk-white stripes. Features a structured two-button placket with mother-of-pearl buttons, contrast neck tape, and a stepped drop-tail hem.',
    rating: 4.7,
    material: '280gsm Heavyweight Cotton Piqué',
    finish: 'Oxblood Garnet / Chalk White Stripes',
    weightGrams: 340,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'signature',
    edition: 'Core Knitwear',
    hardwareSpecs: [
      {
        label: 'Knit Gauge',
        value: '280gsm Honeycomb Piqué',
        detail: 'Breathable textured knit pre-shrunk for structured collar hold.',
      },
      {
        label: 'Placket',
        value: '2-Button Shell Closure',
        detail: 'Reinforced cotton herringbone taping inside placket and vents.',
      },
    ],
  },
  {
    id: '19',
    name: 'Z1758 Shredded Grommet Western Flare Denim',
    price: 360.0,
    category: 'denim',
    imageUrl: '/images/catalog/grommet-flare-1.jpg',
    galleryImages: [
      '/images/catalog/grommet-flare-1.jpg',
      '/images/catalog/grommet-flare-2.jpg',
    ],
    themeColor: '#334155',
    description:
      'Stone-washed slate flare jeans featuring shredded upper thigh slashes, fringed vertical tears, and 16 steel inner-leg grommets.',
    longDescription:
      'Double-belt-loop Western waistband above raw shredded horizontal thigh distress and asymmetrically frayed cotton weft fringe running down the right shin. Sixteen heavy stamped steel grommets trace both inner flared seams.',
    rating: 4.9,
    material: '13.5oz Washed Slate Denim & Stamped Steel Grommets',
    finish: 'Acid Slate Wash / Raw Weft Fringe',
    weightGrams: 920,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Western Archive',
    hardwareSpecs: [
      {
        label: 'Inner Grommets',
        value: '16x Riveted Eyelets',
        detail: '12mm brushed nickel grommets trace both lower flared inseams.',
      },
      {
        label: 'Distressing',
        value: 'Horizontal Slash & Fringe',
        detail: 'Hand-abraded weft threads reinforced behind key knee stress zones.',
      },
      {
        label: 'Waistband',
        value: 'Double-Tier Western Yoke',
        detail: 'Split belt loops with X-bar stitched tabs above curved pockets.',
      },
    ],
  },
  {
    id: '20',
    name: 'Z1758 Crinkle-Wash Snakeskin Trim Flare Jeans',
    price: 440.0,
    category: 'denim',
    imageUrl: '/images/catalog/crinkle-flare-1.jpg',
    galleryImages: [
      '/images/catalog/crinkle-flare-1.jpg',
      '/images/catalog/crinkle-flare-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Heat-set spiderweb crinkle charcoal flare jeans finished with an integrated snakeskin leather waist strap and rear CM script.',
    longDescription:
      'Resin-baked charcoal denim displaying permanent lightning-crinkle whiskers down sweeping flared legs. A contoured brown python-embossed leather yoke belt wraps into dual side adjuster buckles above thick golden-cord CM pocket embroidery.',
    rating: 5.0,
    material: 'Resin Crinkle Denim, Embossed Snakeskin Trim & Cord Stitch',
    finish: 'Lightning Charcoal / Espresso Snakeskin',
    weightGrams: 980,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'reserve',
    edition: 'Archive Reserve · Collector',
    hardwareSpecs: [
      {
        label: 'Snakeskin Yoke',
        value: 'Dual-Buckle Waist Strap',
        detail: 'Shaped python-textured leather waist belt riveted across the rear rise.',
      },
      {
        label: 'Rear Script',
        value: 'Heavy Bullion CM Stitch',
        detail: 'Raised metallic-gold braided cord emblem stitched across right back pocket.',
      },
      {
        label: 'Wash Finish',
        value: 'Resin-Set 3D Crinkle',
        detail: 'High-contrast silvered crease lines baked permanently into the weave.',
      },
    ],
  },
  {
    id: '21',
    name: 'Z1758 Obsidian Whiskered Bootcut Denim',
    price: 280.0,
    category: 'denim',
    imageUrl: '/images/catalog/whisker-black-denim-1.jpg',
    galleryImages: [
      '/images/catalog/whisker-black-denim-1.jpg',
      '/images/catalog/whisker-black-denim-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Washed black wide-leg bootcut jeans with high-contrast 3D whiskers, thick optic-white double needle stitching, and flap pockets.',
    longDescription:
      'Heavy-gauge sulfur-dyed black denim blasted along the lap and shins for dramatic silver-grey linear whiskering. Contrast optic-white triple topstitching highlights the deep yoke, coin pocket, and buttoned rear horseshoe flap pockets.',
    rating: 4.8,
    material: '14oz Sulfur-Black Denim & Heavy Gauge White Thread',
    finish: 'Smoked Obsidian / Chalk Topstitch',
    weightGrams: 890,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Archive Denim',
    hardwareSpecs: [
      {
        label: 'Contrast Stitch',
        value: 'Triple-Needle Chalk Thread',
        detail: 'Heavyweight industrial white thread traces inseams and curved pocket flaps.',
      },
      {
        label: 'Back Pockets',
        value: 'Buttoned Flap Closure',
        detail: 'Stamped antique silver snap buttons secure twin scalloped rear flaps.',
      },
    ],
  },
  {
    id: '22',
    name: 'Z1758 Multi-Buckle Bondage Harness Jacket',
    price: 620.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/bondage-jacket-1.jpg',
    galleryImages: [
      '/images/catalog/bondage-jacket-1.jpg',
      '/images/catalog/bondage-jacket-2.jpg',
    ],
    themeColor: '#09090B',
    description:
      'Tailored black twill bondage jacket rigged with 16 chrome cinch buckles, draped torso straps, shoulder D-rings, and bell cuffs.',
    longDescription:
      'Constructed in rigid black cotton-gabardine cut cleanly at the torso before flaring sharply at the forearms into bell sleeves. Ten front-and-back torso harness straps, six sleeve cinch straps, and an eyelet-buckled mandarin collar allow full silhouette sculpting.',
    rating: 5.0,
    material: 'Structured Cotton Gabardine & Solid Chrome Buckles',
    finish: 'Jet Noir / Mirror Chrome Hardware',
    weightGrams: 1150,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tier: 'reserve',
    edition: 'Runway Archive · Drop 02',
    hardwareSpecs: [
      {
        label: 'Harness Rig',
        value: '16x Rectangular Buckles',
        detail: 'Adjustable cotton webbing straps encircle ribcage, waist, and bell sleeves.',
      },
      {
        label: 'Collar & Yoke',
        value: 'Eyelet Throat Latch + D-Rings',
        detail: 'Stand collar locks with a steel buckle above twin shoulder D-ring loops.',
      },
      {
        label: 'Sleeve Cut',
        value: 'Flared Bell Cuffs',
        detail: 'Triple strapped forearm cinch expands sharply to structured open cuffs.',
      },
    ],
  },
  {
    id: '23',
    name: 'Z1758 Black Onyx Bar & Cross Chain Bracelet',
    price: 195.0,
    category: 'bracelet',
    imageUrl: '/images/catalog/onyx-bracelet-1.jpg',
    galleryImages: [
      '/images/catalog/onyx-bracelet-1.jpg',
      '/images/catalog/onyx-bracelet-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Layered 316L sterling-tone curb bracelet woven with oxidized black chain, molten claw-set black onyx bar, and gothic cross charm.',
    longDescription:
      'Doubled architectural chain construction intertwining polished heavy silver oval curb links with slender black PVD cable chain. At the wrist center sits an emerald-cut black onyx monolith gripped by sculpted molten silver claws and a suspended tapered cross charm.',
    rating: 4.9,
    material: '316L Stainless Steel, Black PVD Chain & Natural Black Onyx',
    finish: 'Mirror Silver / Polished Jet Onyx',
    weightGrams: 46,
    sizes: ['7.0" Wrist', '7.5" Standard', '8.2" Extended'],
    tier: 'signature',
    edition: 'Signature Hardware',
    hardwareSpecs: [
      {
        label: 'Onyx Center',
        value: 'Claw-Set Jet Cabochon',
        detail: 'Faceted rectangular black onyx anchored by dual sculpted liquid-silver prongs.',
      },
      {
        label: 'Cross Drop',
        value: 'Paved Center Onyx Cross',
        detail: 'Tapered 22mm pendant charm hangs freely from an intertwined black cable drape.',
      },
      {
        label: 'Extender Clasp',
        value: 'Lobster + Engraved Disc',
        detail: '5cm link extender allows snug or loose draped wrist sizing.',
      },
    ],
  },
  {
    id: '24',
    name: 'Z1758 Curved-Seam Ripped Noir Flare Jeans',
    price: 330.0,
    category: 'denim',
    imageUrl: '/images/catalog/ripped-curve-denim-1.jpg',
    galleryImages: [
      '/images/catalog/ripped-curve-denim-1.jpg',
      '/images/catalog/ripped-curve-denim-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Charcoal-whiskered flared denim featuring twisted spiral leg seams, hand-blown knee distressing, and contrast chalk stitching.',
    longDescription:
      'Pattern-cut with spiraling ergonomic front-to-back thigh seams that guide the eye down toward a wide flared hem. Hand-abraded horizontal knee tears and chalk-white curved back pocket embroidery complete the washed noir finish.',
    rating: 4.8,
    material: '13oz Overdyed Charcoal Denim',
    finish: 'Worn Slate Noir / White Seam Stitch',
    weightGrams: 840,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Archive Denim',
    hardwareSpecs: [
      {
        label: 'Seam Cut',
        value: 'Spiral Twisted Darting',
        detail: 'Ergonomic diagonal leg darts prevent knee twisting and widen flare drape.',
      },
      {
        label: 'Distress Zones',
        value: 'Ripped Knee & Thigh Tears',
        detail: 'Staggered horizontal tears preserve structural warp threads.',
      },
    ],
  },
  {
    id: '25',
    name: 'Z1758 Shadow Leopard Belted Flare Jeans',
    price: 490.0,
    category: 'denim',
    imageUrl: '/images/catalog/leopard-denim-1.jpg',
    galleryImages: [
      '/images/catalog/leopard-denim-1.jpg',
      '/images/catalog/leopard-denim-2.jpg',
    ],
    themeColor: '#7F1D1D',
    description:
      'Washed black shadow-leopard flocked flare jeans complete with chain-link belt, crimson 2Bfree buckle, skull charm, and feather tassel.',
    longDescription:
      'Full-hardware collector piece pairing tonal black velvet-flocked leopard spots brushed over stone-washed flares with three-button exposed fly closure. Ships complete with the detachable leather-and-curb-chain belt, enameled red gothic buckle, draped hip chains, crystal skull medallion, and layered feather plume.',
    rating: 5.0,
    material: 'Flocked Leopard Denim, Mixed Alloy Chains & Feather Plume',
    finish: 'Washed Shadow Leopard / Crimson Chrome',
    weightGrams: 1240,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'reserve',
    edition: 'Full-Rig Archive · 1 of 12',
    hardwareSpecs: [
      {
        label: 'Gothic Buckle',
        value: '2Bfree Enameled Oval',
        detail: 'Heavy cast silver buckle inlaid with deep crimson blackletter script.',
      },
      {
        label: 'Draped Chains',
        value: 'Multi-Tier Hip & Skull Rig',
        detail: 'Three-strand blackened curb wallet chain + detachable pavé skull medallion.',
      },
      {
        label: 'Tassel Charm',
        value: 'Layered Feather & Leaf',
        detail: 'Natural plumed feathers bound in crimson cloth ribbons with silver leaf drop.',
      },
    ],
  },
  {
    id: '26',
    name: 'Z1758 Archive Stencil Ribbed Long-Sleeve',
    price: 190.0,
    category: 'top',
    imageUrl: '/images/catalog/stencil-thermal-1.jpg',
    galleryImages: [
      '/images/catalog/stencil-thermal-1.jpg',
      '/images/catalog/stencil-thermal-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Washed charcoal-black ribbed thermal fitted top stamped with military crate stencil codes and a vertical spine center seam.',
    longDescription:
      'Fine 2×2 ribbed Japanese modal-cotton jersey finished with an inside-out vertical front and back center spine seam. Distressed pale-ash military stencil codes ("D 25-00-13 / N072") run asymmetrically down both torso panels.',
    rating: 4.8,
    material: 'Fine 2×2 Japanese Ribbed Cotton-Modal',
    finish: 'Washed Charcoal / Chalk Stencil Print',
    weightGrams: 260,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tier: 'signature',
    edition: 'Archive Knitwear',
    hardwareSpecs: [
      {
        label: 'Spine Seam',
        value: 'Exposed Center Overlock',
        detail: 'Raw center seam bisects front stencil graphic and traces down back spine.',
      },
      {
        label: 'Sleeve Cut',
        value: 'Elongated Thumb-Length',
        detail: 'Extra-long ribbed sleeves stack organically at the wrist.',
      },
    ],
  },
  {
    id: '27',
    name: 'Z1758 Whipstitch Concho Cross Leather Satchel',
    price: 520.0,
    category: 'bag',
    imageUrl: '/images/catalog/whipstitch-bag-1.jpg',
    galleryImages: [
      '/images/catalog/whipstitch-bag-1.jpg',
      '/images/catalog/whipstitch-bag-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Crumpled full-grain saddle leather messenger satchel laced in heavy leather whipstitching with embossed cross and silver conchos.',
    longDescription:
      'Artisanally edge-laced entirely by hand with thick waxed leather cord along the flap, contoured shoulder strap, and gussets. Seven engraved sterling-style star-burst concho studs punctuate the embossed starburst gothic cross medallion.',
    rating: 5.0,
    material: 'Hand-Crumpled Full-Grain Saddle Leather & Silver Conchos',
    finish: 'Aged Charcoal Brown / Oxidized Silver',
    weightGrams: 1290,
    sizes: ['One Size (40cm × 29cm)'],
    tier: 'reserve',
    edition: 'Archive Carry · Artisan',
    hardwareSpecs: [
      {
        label: 'Cross Medallion',
        value: 'Embossed Starburst + 5 Studs',
        detail: 'Raised ostrich-textured leather cross studded with sculpted metal conchos.',
      },
      {
        label: 'Edge Lacing',
        value: 'Hand-Pulled Whipstitch',
        detail: 'Heavy flat leather lacing seals flap perimeter and contoured shoulder pad.',
      },
      {
        label: 'Strap Hardware',
        value: 'Welded 45mm O-Rings',
        detail: 'Oversized solid steel rings articulate the wide contoured crossbody strap.',
      },
    ],
  },
  {
    id: '28',
    name: 'Z1758 Shearling Fur-Collar Lambskin Moto Jacket',
    price: 980.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/lambskin-fur-moto-1.jpg',
    galleryImages: [
      '/images/catalog/lambskin-fur-moto-1.jpg',
      '/images/catalog/lambskin-fur-moto-2.jpg',
    ],
    themeColor: '#09090B',
    description:
      'Sculpted Italian lambskin leather and suede moto blouson framed by a dramatic detachable obsidian long-hair fur collar.',
    longDescription:
      'Fitted architectural silhouette pairing buttery smooth sleeve and lapel hides with velvety matte suede body panels and a knit rib hem. Crowned by a voluminous natural obsidian fur shawl collar that buttons cleanly over asymmetrical brushed zippers and belted cuffs.',
    rating: 5.0,
    material: 'Italian Lambskin Leather, Brushed Suede & Natural Fur Collar',
    finish: 'Obsidian Gloss & Matte Suede / Jet Fur',
    weightGrams: 1480,
    sizes: ['XS', 'S', 'M', 'L'],
    tier: 'reserve',
    edition: 'Atelier Reserve · Italy',
    hardwareSpecs: [
      {
        label: 'Shawl Collar',
        value: 'Detachable Obsidian Fur',
        detail: 'Plush natural black long-hair fur collar spreads generously across shoulders.',
      },
      {
        label: 'Mixed Hide',
        value: 'Lambskin + Suede Panels',
        detail: 'Tonal contrast between smooth grain sleeves and velvety front suede.',
      },
      {
        label: 'Belted Cuffs',
        value: 'Twin Buckled Wrist Tabs',
        detail: 'Heavy rectangular silver pin buckles lock around forearm cuffs.',
      },
    ],
  },
  {
    id: '29',
    name: 'Z1758 Western Engraved Harness Chelsea Boots',
    price: 410.0,
    category: 'footwear',
    imageUrl: '/images/catalog/western-chelsea-1.jpg',
    galleryImages: [
      '/images/catalog/western-chelsea-1.jpg',
      '/images/catalog/western-chelsea-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Pointed-toe black calfskin Western Chelsea boots accented with scrolled silver harness buckles, curb ankle chains, and flame overlays.',
    longDescription:
      'Sharp chisel-pointed Western silhouette cut from polished black leather with tonal stitched flame vamp overlays and elastic Chelsea gussets. Engraved floral silver Western buckle straps link via brass O-rings to draped steel curb chains wrapping the 42mm stacked Cuban heel.',
    rating: 4.9,
    material: 'Full-Grain Box Calfskin & Engraved Alloy Buckles',
    finish: 'Polished Noir / Engraved Antique Silver',
    weightGrams: 1320,
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    tier: 'signature',
    edition: 'Western Hardware',
    hardwareSpecs: [
      {
        label: 'Harness Buckle',
        value: 'Engraved Silver Tip Set',
        detail: 'Scrolled Western buckle, keeper, and metal strap tip mounted over brass ring.',
      },
      {
        label: 'Heel Chain',
        value: 'Under-Arch Steel Curb',
        detail: 'Suspended 6mm steel curb chain wraps cleanly beneath the arch.',
      },
      {
        label: 'Vamp & Toe',
        value: 'Chisel Flame Appliqué',
        detail: 'Raised leather flame cut-outs triple-stitched over pointed toe box.',
      },
    ],
  },
  {
    id: '30',
    name: 'Z1758 Crinkled Calfskin Fur-Hood Bomber',
    price: 1250.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/shellac-bomber-1.jpg',
    galleryImages: [
      '/images/catalog/shellac-bomber-1.jpg',
      '/images/catalog/shellac-bomber-2.jpg',
    ],
    themeColor: '#0F172A',
    description:
      'Japanese vegetable-tanned crinkled black calfskin N-2B flight bomber with full raccoon-fur trimmed hood and Riri zip pockets.',
    longDescription:
      'Heavy-tumbled distressed cowhide flight bomber lined in thick quilted shearling-pile warmth with snug ribbed cuffs and waistband. Features a buttoned storm placket, angled chest and bicep zip utility pockets, forearm zip gussets, and a lush natural taupe-grey fur hood ruff.',
    rating: 5.0,
    material: 'Tumbled Japanese Calfskin, Raccoon Fur Ruff & Riri Zips',
    finish: 'Crinkled Pitch Leather / Silvered Taupe Fur',
    weightGrams: 1920,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'reserve',
    edition: 'Japanese Archive · 1 of 6',
    hardwareSpecs: [
      {
        label: 'Fur Ruff',
        value: 'Detachable Taupe Raccoon Fur',
        detail: 'Deep quilted leather hood framed by dense multi-tone natural fur.',
      },
      {
        label: 'Pocket Rig',
        value: '4x Angled Heavy Zippers',
        detail: 'High-gauge metal Riri zips across chest, welt pockets, and left sleeve.',
      },
      {
        label: 'Storm Front',
        value: 'Horn Buttons & Snaps',
        detail: 'Concealed two-way metal zip shielded by storm flap and ribbed knit cuffs.',
      },
    ],
  },
  {
    id: '31',
    name: 'Z1758 Deconstructed Frayed-Seam Strap Jacket',
    price: 580.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/frayed-strap-jacket-1.jpg',
    galleryImages: [
      '/images/catalog/frayed-strap-jacket-1.jpg',
      '/images/catalog/frayed-strap-jacket-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      'Architectural raw-edged black canvas work jacket sliced with full-length sleeve zip channels and aluminum cobra quick-release buckles.',
    longDescription:
      'Heavyweight enzyme-washed 16oz cotton duck canvas deconstructed with exposed raw-frayed seams along the placket, cuffs, and sleeves. Twin vertical zipper tracks unzip each sleeve full-length while crossed webbing straps lock with tactical aluminum quick-release buckles.',
    rating: 4.9,
    material: '16oz Frayed Cotton Duck & Aluminum Cobra Buckles',
    finish: 'Charred Obsidian / Raw Frayed Edges',
    weightGrams: 1380,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'reserve',
    edition: 'Deconstructed Atelier',
    hardwareSpecs: [
      {
        label: 'Sleeve Zips',
        value: 'Dual Convertible Zip Channels',
        detail: 'Full-arm metal zippers bordered in frayed raw canvas expand sleeve volume.',
      },
      {
        label: 'Cobra Buckles',
        value: 'Quick-Release Aluminum Clasps',
        detail: 'Tactical anodized black and raw silver release buckles anchor sleeve and hem straps.',
      },
    ],
  },
  {
    id: '32',
    name: 'Z1758 Pinstripe Fur-Collar Cross Trench Coat',
    price: 690.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/pinstripe-trench-1.jpg',
    galleryImages: [
      '/images/catalog/pinstripe-trench-1.jpg',
      '/images/catalog/pinstripe-trench-2.jpg',
    ],
    themeColor: '#1E293B',
    description:
      'Shadow-pinstripe black mid-thigh military trench parka featuring leather yoke overlays, buckled throat latch, and removable cross pendant.',
    longDescription:
      'Tailored in crisp charcoal shadow-pinstripe cotton-nylon blend with grained leather shoulder overlays, buttoned epaulets, and an insulating mottled charcoal fur collar. Includes a buckled throat strap, diagonal chest bandolier strap, belted waist, and detachable matte black cross necklace.',
    rating: 4.9,
    material: 'Shadow-Pinstripe Twill, Grained Leather & Matte Alloy',
    finish: 'Noir Pinstripe / Frosted Wolf-Grey Fur',
    weightGrams: 1520,
    sizes: ['S', 'M', 'L', 'XL'],
    tier: 'reserve',
    edition: 'Goth-Military Archive',
    hardwareSpecs: [
      {
        label: 'Throat Collar',
        value: 'Buckled Fur Storm Stand',
        detail: 'Eyelet leather neck strap fastens tightly under mottled charcoal fur trim.',
      },
      {
        label: 'Chest Cross',
        value: 'Removable Matte Ball-Chain Cross',
        detail: '58mm matte-black architectural cross hangs across the diagonal chest strap.',
      },
      {
        label: 'Belted Waist',
        value: 'Integrated Frame Belt & Cuffs',
        detail: 'Matching stitched waist and sleeve buckle belts sculpt the mid-length cut.',
      },
    ],
  },
  {
    id: '33',
    name: 'Z1758 Heritage Faded Indigo Belted Bootcut',
    price: 320.0,
    category: 'denim',
    imageUrl: '/images/catalog/indigo-belted-denim-1.jpg',
    galleryImages: [
      '/images/catalog/indigo-belted-denim-1.jpg',
      '/images/catalog/indigo-belted-denim-2.jpg',
    ],
    themeColor: '#1E3A5F',
    description:
      'Authentic sun-faded 14oz indigo selvedge bootcut jeans worn in with natural thigh honeycombs and a bridle-brown leather belt.',
    longDescription:
      'Loomed from heavyweight Japanese rope-dyed indigo denim and enzyme-washed to replicate years of natural lap whiskering and knee fades. Styled as a crisp 5-pocket low-rise bootcut paired with an included oiled espresso bridle leather belt.',
    rating: 4.8,
    material: '14oz Japanese Indigo Denim & Espresso Bridle Leather Belt',
    finish: 'Vintage Sun-Faded Indigo',
    weightGrams: 910,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Japanese Denim Archive',
    hardwareSpecs: [
      {
        label: 'Included Belt',
        value: '35mm Espresso Bridle Strap',
        detail: 'Oil-treated dark brown cowhide belt with brushed square steel buckle.',
      },
      {
        label: 'Indigo Fade',
        value: 'Natural Vertical Slub',
        detail: 'High-contrast vintage whiskering across upper thighs and knees.',
      },
    ],
  },
  {
    id: '34',
    name: 'Z1758 Heavy-Zip Eyelet Cargo Flare Denim',
    price: 390.0,
    category: 'denim',
    imageUrl: '/images/catalog/cargo-zip-denim-1.jpg',
    galleryImages: [
      '/images/catalog/cargo-zip-denim-1.jpg',
      '/images/catalog/cargo-zip-denim-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Acid-washed black cargo flare jeans rigged with diagonal zipper bellows thigh pockets, dangling grommet straps, and ankle expansion zips.',
    longDescription:
      'Built for extreme utility geometry: dual stacked hip zip pockets and angled bellows cargo thigh compartments are rigged with double-row stainless eyelet hanging straps. Long exposed ankle zippers unzip cleanly to widen the hem over chunky boots.',
    rating: 4.9,
    material: '13.5oz Acid-Washed Black Denim & Heavy #8 Metal Zips',
    finish: 'Washed Charcoal / Bright Nickel Hardware',
    weightGrams: 1080,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Tactical Archive',
    hardwareSpecs: [
      {
        label: 'Cargo Bellows',
        value: 'Slanted #8 Zip Thigh Pouches',
        detail: 'Expandable pleated pockets trimmed in twin 12-grommet hanging straps.',
      },
      {
        label: 'Hem Gussets',
        value: '34cm Ankle Zip Extensions',
        detail: 'Vertical chrome ankle zippers convert straight cut into dramatic flare.',
      },
    ],
  },
  {
    id: '35',
    name: 'Z1758 Knee-High Multi-Buckle Canvas Harness Boots',
    price: 465.0,
    category: 'footwear',
    imageUrl: '/images/catalog/knee-harness-boots-1.jpg',
    galleryImages: [
      '/images/catalog/knee-harness-boots-1.jpg',
      '/images/catalog/knee-harness-boots-2.jpg',
    ],
    themeColor: '#18181B',
    description:
      '14-inch knee-high washed black heavy canvas lace-up boots strapped with five sculpted western buckles and full rear zip entry.',
    longDescription:
      'Towering X-Hi archival canvas sneaker-boot silhouette built on triple-black vulcanized foxing and crosshatched rubber toe caps. Wrapped from ankle to knee in five distressed canvas straps showcasing mismatched sculpted silver filigree, cage, and curved western buckles.',
    rating: 5.0,
    material: '16oz Washed Black Canvas, Vulcanized Rubber & Western Buckles',
    finish: 'Faded Coal Canvas / Engraved Pewter',
    weightGrams: 1750,
    sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'],
    tier: 'reserve',
    edition: 'Archival Footwear · Rare',
    hardwareSpecs: [
      {
        label: '5-Strap Rig',
        value: 'Sculpted Western Filigree',
        detail: 'Upper silver cage buckle + four engraved curved western harness buckles.',
      },
      {
        label: 'Rear Entry',
        value: 'Full-Shaft Back Zipper',
        detail: '35cm rear zip allows instant entry without re-lacing 20 eyelets.',
      },
      {
        label: 'Vulcanized Sole',
        value: 'Blackout Textured Foxing',
        detail: 'Diamond-textured toe bumper and matte black rubberized cup sole.',
      },
    ],
  },
  {
    id: '36',
    name: 'Z1758 Cropped Faux-Fur Hooded Leather Bomber',
    price: 540.0,
    category: 'outerwear',
    imageUrl: '/images/catalog/cropped-fur-bomber-1.jpg',
    galleryImages: [
      '/images/catalog/cropped-fur-bomber-1.jpg',
      '/images/catalog/cropped-fur-bomber-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Oversized-shoulder cropped grain leather flight bomber with dense coyote-toned fur hood lining and snug ribbed knit waist.',
    longDescription:
      'Boxy cropped silhouette cut with voluminous dropped sleeves that gather neatly into thick black ribbed knit cuffs and hem. Opens at the center front zip to reveal continuous plush natural-toned fur lining cascading down the interior storm placket.',
    rating: 4.9,
    material: 'Supple Pebbled Calfskin Leather & Plush Coyote-Tone Fur Trim',
    finish: 'Satin Black Pebbled Grain / Frosted Timber Fur',
    weightGrams: 1340,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tier: 'signature',
    edition: 'Winter Archive',
    hardwareSpecs: [
      {
        label: 'Plush Lining',
        value: 'Continuous Fur Hood & Lapel',
        detail: 'Dense long-pile fur trims hood rim and cascades along full inner closure.',
      },
      {
        label: 'Welt Pockets',
        value: 'Slash Hip Pockets & Knit Trim',
        detail: 'Heavy elastane-cotton ribbing holds sharp cropped waist proportion.',
      },
    ],
  },
  {
    id: '37',
    name: 'Z1758 Heavy 3D-Whisker Indigo Flare Denim',
    price: 450.0,
    category: 'denim',
    imageUrl: '/images/catalog/3d-indigo-denim-1.jpg',
    galleryImages: [
      '/images/catalog/3d-indigo-denim-1.jpg',
      '/images/catalog/3d-indigo-denim-2.jpg',
    ],
    themeColor: '#1E3A8A',
    description:
      'Sculpted Japanese raw indigo flare jeans with bold hand-set 3D lap-and-knee accordion whiskers and raw dark shin stripes.',
    longDescription:
      'Dramatic archival Japanese denim engineered with deeply molded resin-cured horizontal knee honeycombs, dirty oil-tint cream thigh fading, and unbleached raw vertical indigo shadow stripes preserved down the lower leg.',
    rating: 5.0,
    material: '14.5oz Japanese Rope-Dyed Indigo Selvedge',
    finish: '3D Oil-Tint Honeycomb / Raw Vertical Shadow',
    weightGrams: 1020,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'reserve',
    edition: 'Archive Reserve · Japan',
    hardwareSpecs: [
      {
        label: '3D Whiskers',
        value: 'Resin-Molded Accordion Fades',
        detail: 'Deeply baked physical creases across upper lap, inner thigh, and rear knee.',
      },
      {
        label: 'Hem Finish',
        value: 'Stacked Heel-Bite Fraying',
        detail: 'Reinforced wide flare openings styled to drape cleanly over boots.',
      },
    ],
  },
  {
    id: '38',
    name: 'Z1758 Studded Triple-Buckle Wedge High-Tops',
    price: 445.0,
    category: 'footwear',
    imageUrl: '/images/catalog/wedge-studded-sneakers-1.jpg',
    galleryImages: [
      '/images/catalog/wedge-studded-sneakers-1.jpg',
      '/images/catalog/wedge-studded-sneakers-2.jpg',
    ],
    themeColor: '#09090B',
    description:
      'All-black pebbled leather hidden-wedge sneaker-boots armored with four matte-black pyramid-studded harness straps and heel spikes.',
    longDescription:
      'Architectural 85mm hidden internal wedge encapsulated within a seamless matte black vulcanized sole and supple pebbled black leather upper. Wrapped from toe cap to padded collar in matte blackout pyramid-studded straps fastened by heavy blackened buckles and medial zippers.',
    rating: 4.9,
    material: 'Pebbled Black Cowhide, Concealed Wedge & Matte Alloy Studs',
    finish: 'Triple-Black Leather / Stealth Studs',
    weightGrams: 1410,
    sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41'],
    tier: 'signature',
    edition: 'Archive Footwear · Drop 02',
    hardwareSpecs: [
      {
        label: 'Studded Straps',
        value: '96x Matte Pyramid Studs',
        detail: 'Four buckled leather straps wrap forefoot, ankle, and heel collar.',
      },
      {
        label: 'Hidden Lift',
        value: '85mm Encapsulated Wedge',
        detail: 'Stealth heel elevation integrated inside herringbone rubber cupsole.',
      },
      {
        label: 'Side Entry',
        value: 'Full Matte Inside Zip',
        detail: 'Anodized black metal zipper allows rapid slip-on fit.',
      },
    ],
  },
  {
    id: '39',
    name: 'Z1758 Deconstructed D-Ring Cargo Flare Jeans',
    price: 375.0,
    category: 'denim',
    imageUrl: '/images/catalog/dring-cargo-denim-1.jpg',
    galleryImages: [
      '/images/catalog/dring-cargo-denim-1.jpg',
      '/images/catalog/dring-cargo-denim-2.jpg',
    ],
    themeColor: '#27272A',
    description:
      'Acid-washed charcoal cargo flare jeans with front D-ring zip thigh pockets, curved raw-frayed seam arcs, and shin twin pouches.',
    longDescription:
      'Multi-paneled washed charcoal denim traced with sweeping U-shaped frayed raw seams across the upper thighs and stacked frayed knee pleats. Outfitted with twin top zip-flap cargo pockets suspending heavy silver D-rings, diagonal eyelet tapes, and twin snapped calf pockets.',
    rating: 4.9,
    material: '13.5oz Acid-Charcoal Denim & Brushed Chrome Hardware',
    finish: 'Washed Ash Black / Raw Frayed Arc Seams',
    weightGrams: 1040,
    sizes: ['28"', '30"', '32"', '34"', '36"'],
    tier: 'signature',
    edition: 'Utility Denim Archive',
    hardwareSpecs: [
      {
        label: 'D-Ring Pockets',
        value: 'Zip + Snap Thigh Bellows',
        detail: 'Upper flap pockets carry 32mm brushed steel D-rings beneath exposed zips.',
      },
      {
        label: 'Curved Fraying',
        value: 'Arc Seam & Hem Tiers',
        detail: 'Raised raw-edge seam arcs frame diagonal grommet straps and stacked pleats.',
      },
      {
        label: 'Shin Pouches',
        value: 'Twin Calf Cargo Compartments',
        detail: 'Snapped utility pockets positioned at lower left flare for balanced bulk.',
      },
    ],
  },
];
