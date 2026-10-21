// Physics and Information Calculation Engine for Evrenin Yapıtaşı
const CONSTANTS = {
  c: 299792458, // Speed of light (m/s)
  G: 6.67430e-11, // Gravitational constant (m^3 kg^-1 s^-2)
  h: 6.62607015e-34, // Planck constant (J*s)
  hbar: 1.054571817e-34, // Reduced Planck constant (J*s)
  kB: 1.380649e-23, // Boltzmann constant (J/K)
  lP: 1.616255e-35, // Planck length (m)
  mP: 2.176434e-8, // Planck mass (kg)
  tP: 5.391247e-44, // Planck time (s)
  solarMass: 1.98847e30, // Mass of Sun (kg)
  eV: 1.602176634e-19, // Electronvolt (J)
};

// Black hole preset catalogs
const BLACK_HOLE_PRESETS = [
  { name: 'Güneş Kütleli (Stellar)', massSun: 1, desc: 'Tipik yıldızsal kütleli kara delik' },
  { name: 'Cygnus X-1', massSun: 21.2, desc: 'İlk keşfedilen yıldızsal kara delik' },
  { name: 'Sagittarius A* (Samanyolu)', massSun: 4.3e6, desc: 'Galaksimizin merkezindeki süper kütleli kara delik' },
  { name: 'M87* (Event Horizon Telescope)', massSun: 6.5e9, desc: 'Görüntüsü çekilen ilk süper kütleli kara delik' },
  { name: 'TON 618 (Ultra Kütleli)', massSun: 6.6e10, desc: 'Bilinen en büyük kuasarlardan biri' }
];

// Cosmic Scales Hierarchy for Seth Lloyd Lab
const COSMIC_SCALES = [
  {
    id: 'planck',
    nameTr: 'Planck Ölçeği',
    nameEn: 'Planck Scale',
    sizeMeters: 1.616e-35,
    massKg: 2.176e-8,
    bits: 1,
    descTr: 'Uzay-zamanın piksellendiği asgari fiziksel uzunluk.',
    descEn: 'Minimum physical length where spacetime pixels emerge.'
  },
  {
    id: 'quark',
    nameTr: 'Üst Kuark',
    nameEn: 'Top Quark',
    sizeMeters: 1.0e-18,
    massKg: 3.08e-25,
    bits: 8,
    descTr: 'Bilinen en ağır temel fermiyon parçacığı.',
    descEn: 'Heaviest known fundamental fermion particle.'
  },
  {
    id: 'proton',
    nameTr: 'Proton',
    nameEn: 'Proton',
    sizeMeters: 8.41e-16,
    massKg: 1.672e-27,
    bits: 32,
    descTr: 'Kuarklardan oluşan atom çekirdeği yapıtaşı.',
    descEn: 'Subatomic hadron constituting atomic nuclei.'
  },
  {
    id: 'atom',
    nameTr: 'Hidrojen Atomu',
    nameEn: 'Hydrogen Atom',
    sizeMeters: 1.06e-10,
    massKg: 1.673e-27,
    bits: 100,
    descTr: 'Evrendeki en yaygın element.',
    descEn: 'Most abundant chemical element in the cosmos.'
  },
  {
    id: 'dna',
    nameTr: 'İnsan DNA Heliksi',
    nameEn: 'Human DNA Helix',
    sizeMeters: 2.0e-9,
    massKg: 1.0e-21,
    bits: 6.4e9, // ~6.4 Giga-bits (3.2 billion base pairs x 2 bits)
    descTr: 'Biyolojik bilginin 3.2 milyar baz çiftlik genetik kodu.',
    descEn: '3.2 billion base pairs of biological digital code.'
  },
  {
    id: 'neuron',
    nameTr: 'İnsan Beyin Nöronu',
    nameEn: 'Human Neuron',
    sizeMeters: 2.0e-5,
    massKg: 1.0e-12,
    bits: 1.0e12,
    descTr: 'Bilişsel bilginin elektrokimyasal işleyicisi.',
    descEn: 'Electrochemical processor of human cognition.'
  },
  {
    id: 'human',
    nameTr: 'İnsan Bedeni & Beyni',
    nameEn: 'Human Body & Brain',
    sizeMeters: 1.75,
    massKg: 70,
    bits: 1.0e28,
    descTr: 'Atomik düzeyde yaklaşık 10^28 bitlik enformasyon düzeni.',
    descEn: 'Roughly 10^28 bits of atomic state arrangement.'
  },
  {
    id: 'earth',
    nameTr: 'Dünya Gezegeni',
    nameEn: 'Planet Earth',
    sizeMeters: 1.274e7,
    massKg: 5.972e24,
    bits: 1.0e51,
    descTr: 'Biyosfer ve jeolojik enformasyon taşıyıcısı.',
    descEn: 'Host of terrestrial biosphere and matter.'
  },
  {
    id: 'sun',
    nameTr: 'Güneş (Yıldız)',
    nameEn: 'Sun (Star)',
    sizeMeters: 1.392e9,
    massKg: 1.989e30,
    bits: 1.0e57,
    descTr: 'Nükleer füzyon ile termodinamik enerji yayan plazma küresi.',
    descEn: 'Thermonuclear fusion plasma star powering the solar system.'
  },
  {
    id: 'milkyway',
    nameTr: 'Samanyolu Galaksisi',
    nameEn: 'Milky Way Galaxy',
    sizeMeters: 9.46e20, // ~100,000 light years
    massKg: 1.5e42,
    bits: 1.0e69,
    descTr: 'Yüz milyarlarca yıldız ve karanlık madde halesi.',
    descEn: 'Barred spiral galaxy spanning 100,000 light-years.'
  },
  {
    id: 'universe',
    nameTr: 'Gözlemlenebilir Evren',
    nameEn: 'Observable Universe',
    sizeMeters: 8.8e26, // ~93 billion light years diameter
    massKg: 1.0e54,
    bits: 1.0e92, // Seth Lloyd limit
    descTr: '13.8 milyar yılda 10^122 kuantum işlemi gerçekleştiren kozmik bilgisayar.',
    descEn: 'Seth Lloyd cosmic quantum computer: 10^122 operations on 10^92 bits.'
  }
];

function calculateSchwarzschildRadius(massKg) {
  return (2 * CONSTANTS.G * massKg) / (CONSTANTS.c ** 2);
}

function calculateEventHorizonArea(massKg) {
  const rs = calculateSchwarzschildRadius(massKg);
  return 4 * Math.PI * (rs ** 2);
}

function calculateBlackHoleInfo(massKg) {
  const rs = calculateSchwarzschildRadius(massKg);
  const area = 4 * Math.PI * (rs ** 2);
  const planckArea = CONSTANTS.lP ** 2;
  const planckPixels = area / planckArea;
  const entropyJK = (CONSTANTS.kB * (CONSTANTS.c ** 3) * area) / (4 * CONSTANTS.G * CONSTANTS.hbar);
  const bits = entropyJK / (CONSTANTS.kB * Math.LN2);
  const gigabytes = bits / (8 * 1e9);
  const terabytes = gigabytes / 1000;
  const yottabytes = bits / (8 * 1e24);
  const hawkingTempK = (CONSTANTS.hbar * (CONSTANTS.c ** 3)) / (8 * Math.PI * CONSTANTS.G * massKg * CONSTANTS.kB);
  const evapTimeSec = (5120 * Math.PI * (CONSTANTS.G ** 2) * (massKg ** 3)) / (CONSTANTS.hbar * (CONSTANTS.c ** 4));
  const evapTimeYears = evapTimeSec / (365.25 * 24 * 3600);

  return {
    rs,
    area,
    planckPixels,
    entropyJK,
    bits,
    gigabytes,
    terabytes,
    yottabytes,
    hawkingTempK,
    evapTimeSec,
    evapTimeYears
  };
}

function calculateLandauer(tempK, bits = 1) {
  return CONSTANTS.kB * tempK * Math.LN2 * bits;
}

function calculateBostromSimProb(fp, ni, fi = 1.0) {
  if (fp <= 0 || ni <= 0) return 0;
  const num = fp * ni * fi;
  return num / (num + 1);
}

function evaluateWolfram(rule, left, center, right) {
  const idx = (left << 2) | (center << 1) | right;
  return (rule >> idx) & 1;
}

// Margolus-Levitin Quantum Speed Limit
function calculateQuantumSpeedLimit(energyJoules) {
  // delta_t >= (pi * hbar) / (2 * E)
  // Max ops per second = 2 * E / (pi * hbar)
  const minDeltaT = (Math.PI * CONSTANTS.hbar) / (2 * energyJoules);
  const maxOpsPerSec = (2 * energyJoules) / (Math.PI * CONSTANTS.hbar);
  return { minDeltaT, maxOpsPerSec };
}

// Quantum Entanglement Bell Correlation & CHSH Value
function calculateBellCorrelation(thetaA, thetaB) {
  // For singlet photon polarization pairs: E(thetaA, thetaB) = -cos(2 * (thetaA - thetaB))
  const delta = thetaA - thetaB;
  return -Math.cos(2 * delta);
}

function calculateCHSH(a, aPrime, b, bPrime) {
  const E1 = calculateBellCorrelation(a, b);
  const E2 = calculateBellCorrelation(a, bPrime);
  const E3 = calculateBellCorrelation(aPrime, b);
  const E4 = calculateBellCorrelation(aPrime, bPrime);
  const S = Math.abs(E1 - E2 + E3 + E4);
  return {
    E1, E2, E3, E4,
    S,
    violatesLocalRealism: S > 2.0,
    tsirelsonBound: 2 * Math.SQRT2
  };
}

// Kerr Rotating Black Hole
function calculateKerrBlackHole(massKg, spinRatio = 0.9) {
  const spin = Math.max(0, Math.min(0.9999, spinRatio));
  const rg = (CONSTANTS.G * massKg) / (CONSTANTS.c ** 2);
  const a = spin * rg;
  const disc = Math.max(0, rg ** 2 - a ** 2);
  const rPlus = rg + Math.sqrt(disc);
  const rMinus = rg - Math.sqrt(disc);
  const rErgoEquator = 2 * rg;
  const rErgoPole = rPlus;
  const area = 4 * Math.PI * (rPlus ** 2 + a ** 2);
  const entropyJK = (CONSTANTS.kB * (CONSTANTS.c ** 3) * area) / (4 * CONSTANTS.G * CONSTANTS.hbar);
  const bits = entropyJK / (CONSTANTS.kB * Math.LN2);
  const mIrr = Math.sqrt((rPlus ** 2 + a ** 2) / 4) * (CONSTANTS.c ** 2) / CONSTANTS.G;
  const penroseEnergyJoules = Math.max(0, (massKg - mIrr) * (CONSTANTS.c ** 2));
  const penroseEfficiency = (1 - mIrr / massKg) * 100;

  return {
    massKg,
    spinRatio: spin,
    rPlus,
    rMinus,
    rErgoEquator,
    rErgoPole,
    area,
    entropyJK,
    bits,
    mIrr,
    penroseEnergyJoules,
    penroseEfficiency
  };
}

// Ryu-Takayanagi Holographic Entanglement Entropy (AdS3/CFT2)
function calculateRyuTakayanagi(angleRad, centralCharge = 3.0, adsRadius = 1.0, uvCutoff = 0.01) {
  const theta = Math.max(0.001, Math.min(2 * Math.PI - 0.001, angleRad));
  const eps = Math.max(1e-5, uvCutoff);
  let arg = (2 * adsRadius / eps) * Math.sin(theta / 2);
  if (arg <= 1) arg = 1.0001;
  const entropy = (centralCharge / 3) * Math.log(arg);
  const geodesicLength = 2 * Math.log(arg);
  const bits = entropy / Math.LN2;

  return {
    thetaDeg: (theta * 180) / Math.PI,
    geodesicLength,
    entropy,
    bits,
    centralCharge
  };
}

// Landauer Bitstream Thermodynamic Erasure & Shannon Entropy
function calculateLandauerStream(bitstreamOrCount, tempK = 300) {
  let bitCount = 1;
  let zeros = 0;
  let ones = 1;
  let shannonEntropy = 1.0;

  if (typeof bitstreamOrCount === 'string') {
    const clean = bitstreamOrCount.replace(/[^01]/g, '') || '0';
    bitCount = clean.length;
    ones = 0;
    for (let i = 0; i < clean.length; i++) {
      if (clean[i] === '1') ones++;
    }
    zeros = bitCount - ones;
    const p0 = zeros / bitCount;
    const p1 = ones / bitCount;
    shannonEntropy = 0;
    if (p0 > 0) shannonEntropy -= p0 * Math.log2(p0);
    if (p1 > 0) shannonEntropy -= p1 * Math.log2(p1);
  } else {
    bitCount = Math.max(1, Number(bitstreamOrCount) || 1);
    zeros = Math.floor(bitCount / 2);
    ones = bitCount - zeros;
    shannonEntropy = 1.0;
  }

  const singleBitEnergy = CONSTANTS.kB * tempK * Math.LN2;
  const rawTotalJoules = bitCount * singleBitEnergy;
  const totalJoules = bitCount * singleBitEnergy * shannonEntropy;
  const totalEv = totalJoules / CONSTANTS.eV;
  const rawTotalEv = rawTotalJoules / CONSTANTS.eV;

  return {
    bitCount,
    zeros,
    ones,
    shannonEntropy,
    tempK,
    singleBitEnergy,
    rawTotalJoules,
    rawTotalEv,
    totalJoules,
    totalEv
  };
}

// Quantum Gate transformations on Bloch sphere (theta, phi)
function applyQubitGate(gate, currentTheta, currentPhi) {
  let th = currentTheta;
  let ph = currentPhi;

  switch (gate) {
    case 'H':
      if (Math.abs(th) < 1e-4) {
        th = Math.PI / 2;
        ph = 0;
      } else if (Math.abs(th - Math.PI) < 1e-4) {
        th = Math.PI / 2;
        ph = Math.PI;
      } else if (Math.abs(th - Math.PI / 2) < 1e-4 && Math.abs(ph) < 1e-4) {
        th = 0;
        ph = 0;
      } else if (Math.abs(th - Math.PI / 2) < 1e-4 && Math.abs(ph - Math.PI) < 1e-4) {
        th = Math.PI;
        ph = 0;
      } else {
        th = Math.PI - th;
        ph = ph + Math.PI;
      }
      break;
    case 'X':
      th = Math.PI - th;
      ph = -ph;
      break;
    case 'Y':
      th = Math.PI - th;
      ph = Math.PI - ph;
      break;
    case 'Z':
      ph = ph + Math.PI;
      break;
    case 'S':
      ph = ph + Math.PI / 2;
      break;
    case 'T':
      ph = ph + Math.PI / 4;
      break;
    case 'RESET':
      th = 0;
      ph = 0;
      break;
  }

  th = (th % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  if (th > Math.PI) {
    th = 2 * Math.PI - th;
    ph += Math.PI;
  }
  ph = (ph % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

  return { theta: th, phi: ph };
}

function formatSciNum(num, digits = 2) {
  if (num === 0) return "0";
  if (Math.abs(num) >= 0.01 && Math.abs(num) < 1e5) {
    return num.toLocaleString('tr-TR', { maximumFractionDigits: digits });
  }
  const exp = num.toExponential(digits);
  const [b, e] = exp.split('e');
  return `${b} × 10^${e.replace('+', '')}`;
}

window.PhysicsEngine = {
  CONSTANTS,
  BLACK_HOLE_PRESETS,
  COSMIC_SCALES,
  calculateSchwarzschildRadius,
  calculateEventHorizonArea,
  calculateBlackHoleInfo,
  calculateKerrBlackHole,
  calculateRyuTakayanagi,
  calculateLandauerStream,
  applyQubitGate,
  calculateLandauer,
  calculateBostromSimProb,
  evaluateWolfram,
  calculateQuantumSpeedLimit,
  calculateBellCorrelation,
  calculateCHSH,
  formatSciNum
};
